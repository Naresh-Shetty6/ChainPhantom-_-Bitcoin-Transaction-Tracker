const express = require('express');
const router = express.Router();
const exchangeDetection = require('../services/exchangeDetection');

// 🏦 Exchange identification endpoint
router.post('/identify-address', (req, res) => {
  const { address } = req.body;
  
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }
  
  const identification = exchangeDetection.identifyAddress(address);
  
  if (identification) {
    res.json({
      address,
      identified: true,
      ...identification,
      timestamp: new Date().toISOString()
    });
  } else {
    res.json({
      address,
      identified: false,
      message: 'Address not found in known service database'
    });
  }
});

// 🔍 Bulk address identification
router.post('/identify-bulk', (req, res) => {
  const { addresses } = req.body;
  
  if (!addresses || !Array.isArray(addresses)) {
    return res.status(400).json({ error: 'Addresses array is required' });
  }
  
  const results = addresses.map(address => {
    const identification = exchangeDetection.identifyAddress(address);
    return {
      address,
      identified: !!identification,
      ...(identification || {})
    };
  });
  
  res.json({
    results,
    totalAddresses: addresses.length,
    identifiedCount: results.filter(r => r.identified).length,
    timestamp: new Date().toISOString()
  });
});

// 📊 Get exchange statistics
router.get('/stats', (req, res) => {
  const stats = {
    totalExchanges: Object.keys(require('../data/exchanges.json').exchanges).length,
    totalMixers: Object.keys(require('../data/exchanges.json').mixers).length,
    totalDarknetServices: Object.keys(require('../data/exchanges.json').darknet).length,
    totalGamblingServices: Object.keys(require('../data/exchanges.json').gambling).length,
    lastUpdated: new Date().toISOString()
  };
  
  res.json(stats);
});

// 🚨 LEA Action Generator
router.post('/generate-lea-actions', (req, res) => {
  const { transactions, address } = req.body;
  
  if (!transactions) {
    return res.status(400).json({ error: 'Transactions data is required' });
  }
  
  const analysis = exchangeDetection.analyzeTransactionFlow(transactions);
  
  res.json({
    address: address || 'Unknown',
    riskScore: analysis.riskScore,
    riskLevel: exchangeDetection.getRiskLevel(analysis.riskScore),
    leaActions: analysis.leaActions,
    serviceConnections: {
      exchanges: analysis.exchanges,
      mixers: analysis.mixers,
      darknet: analysis.darknet,
      gambling: analysis.gambling
    },
    generatedAt: new Date().toISOString()
  });
});

module.exports = router;
