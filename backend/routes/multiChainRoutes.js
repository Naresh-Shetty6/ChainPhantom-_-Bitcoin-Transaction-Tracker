const express = require('express');
const router = express.Router();
const etherscanService = require('../services/etherscanService');
const exchangeDetection = require('../services/exchangeDetection');

// 🔗 Multi-chain address lookup
router.get('/address/:network/:address', async (req, res) => {
  const { network, address } = req.params;
  
  try {
    let result;
    
    switch (network.toLowerCase()) {
      case 'ethereum':
      case 'eth':
        const accountInfo = await etherscanService.getAccountInfo(address);
        const transactions = await etherscanService.getTransactions(address, 1, 20);
        const tokenTransfers = await etherscanService.getTokenTransfers(address, null, 1, 10);
        const suspiciousPatterns = etherscanService.detectSuspiciousPatterns(transactions, address);
        const exchangeAnalysis = exchangeDetection.analyzeTransactionFlow(transactions);
        
        result = {
          network: 'ethereum',
          address,
          balance: accountInfo.balance,
          balanceFormatted: accountInfo.balanceEth + ' ETH',
          transactionCount: accountInfo.transactionCount,
          transactions,
          tokenTransfers,
          suspiciousPatterns,
          exchangeAnalysis,
          overallRiskLevel: exchangeDetection.getRiskLevel(
            suspiciousPatterns.riskScore + exchangeAnalysis.riskScore
          )
        };
        break;
        
      case 'bitcoin':
      case 'btc':
        // Bitcoin analysis would be handled by existing BlockCypher integration
        return res.status(400).json({ 
          error: 'Bitcoin analysis should use the existing /api/analyze endpoint' 
        });
        
      default:
        return res.status(400).json({ 
          error: `Unsupported network: ${network}. Supported networks: ethereum, bitcoin` 
        });
    }
    
    res.json(result);
  } catch (error) {
    console.error(`Multi-chain analysis error for ${network}:${address}:`, error);
    res.status(500).json({ 
      error: `Failed to analyze ${network} address: ${error.message}` 
    });
  }
});

// 🔍 Multi-chain transaction lookup
router.get('/transaction/:network/:txHash', async (req, res) => {
  const { network, txHash } = req.params;
  
  try {
    let result;
    
    switch (network.toLowerCase()) {
      case 'ethereum':
      case 'eth':
        result = await etherscanService.getTransactionByHash(txHash);
        break;
        
      case 'bitcoin':
      case 'btc':
        return res.status(400).json({ 
          error: 'Bitcoin transaction lookup should use the existing /api/search endpoint' 
        });
        
      default:
        return res.status(400).json({ 
          error: `Unsupported network: ${network}. Supported networks: ethereum, bitcoin` 
        });
    }
    
    res.json(result);
  } catch (error) {
    console.error(`Multi-chain transaction lookup error for ${network}:${txHash}:`, error);
    res.status(500).json({ 
      error: `Failed to lookup ${network} transaction: ${error.message}` 
    });
  }
});

// 📊 Multi-chain portfolio analysis
router.post('/portfolio', async (req, res) => {
  const { addresses } = req.body;
  
  if (!addresses || !Array.isArray(addresses)) {
    return res.status(400).json({ error: 'Addresses array is required' });
  }
  
  try {
    const portfolio = {
      totalAddresses: addresses.length,
      networks: {},
      totalValue: 0,
      riskAssessment: {
        overallRiskScore: 0,
        highRiskAddresses: [],
        suspiciousPatterns: []
      },
      analysisTimestamp: new Date().toISOString()
    };
    
    for (const addressInfo of addresses) {
      const { address, network } = addressInfo;
      
      try {
        let analysis;
        
        switch (network.toLowerCase()) {
          case 'ethereum':
          case 'eth':
            const accountInfo = await etherscanService.getAccountInfo(address);
            const transactions = await etherscanService.getTransactions(address, 1, 10);
            const suspiciousPatterns = etherscanService.detectSuspiciousPatterns(transactions, address);
            
            analysis = {
              address,
              network: 'ethereum',
              balance: accountInfo.balanceEth + ' ETH',
              transactionCount: accountInfo.transactionCount,
              riskScore: suspiciousPatterns.riskScore,
              riskLevel: suspiciousPatterns.riskLevel
            };
            
            if (!portfolio.networks.ethereum) {
              portfolio.networks.ethereum = {
                addresses: [],
                totalBalance: 0,
                totalTransactions: 0
              };
            }
            
            portfolio.networks.ethereum.addresses.push(analysis);
            portfolio.networks.ethereum.totalBalance += parseFloat(accountInfo.balanceEth);
            portfolio.networks.ethereum.totalTransactions += accountInfo.transactionCount;
            
            break;
            
          default:
            analysis = {
              address,
              network,
              error: `Unsupported network: ${network}`
            };
        }
        
        // Risk assessment
        if (analysis.riskScore) {
          portfolio.riskAssessment.overallRiskScore += analysis.riskScore;
          
          if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') {
            portfolio.riskAssessment.highRiskAddresses.push({
              address: analysis.address,
              network: analysis.network,
              riskLevel: analysis.riskLevel,
              riskScore: analysis.riskScore
            });
          }
        }
        
      } catch (error) {
        console.error(`Portfolio analysis error for ${address}:`, error);
        // Continue with other addresses even if one fails
      }
    }
    
    // Calculate average risk score
    portfolio.riskAssessment.overallRiskScore = Math.round(
      portfolio.riskAssessment.overallRiskScore / addresses.length
    );
    
    // Determine overall portfolio risk level
    portfolio.riskAssessment.overallRiskLevel = exchangeDetection.getRiskLevel(
      portfolio.riskAssessment.overallRiskScore
    );
    
    res.json(portfolio);
  } catch (error) {
    console.error('Portfolio analysis error:', error);
    res.status(500).json({ 
      error: `Failed to analyze portfolio: ${error.message}` 
    });
  }
});

// 🌐 Supported networks info
router.get('/networks', (req, res) => {
  res.json({
    supportedNetworks: [
      {
        name: 'Bitcoin',
        symbol: 'BTC',
        network: 'bitcoin',
        explorer: 'BlockCypher',
        features: ['transactions', 'addresses', 'suspicious_patterns', 'exchange_detection']
      },
      {
        name: 'Ethereum',
        symbol: 'ETH',
        network: 'ethereum',
        explorer: 'Etherscan',
        features: ['transactions', 'addresses', 'tokens', 'contracts', 'suspicious_patterns']
      }
    ],
    plannedNetworks: [
      {
        name: 'Tron',
        symbol: 'TRX',
        network: 'tron',
        status: 'planned'
      },
      {
        name: 'Binance Smart Chain',
        symbol: 'BNB',
        network: 'bsc',
        status: 'planned'
      }
    ]
  });
});

module.exports = router;
