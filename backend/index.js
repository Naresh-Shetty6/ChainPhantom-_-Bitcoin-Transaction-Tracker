const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Ensure node-fetch v2 is installed: npm install node-fetch@2
const nodemailer = require('nodemailer');
const exchangeDetection = require('./services/exchangeDetection');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const TOKEN = process.env.BLOCKCYPHER_TOKEN;

// Logging middleware
const logRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] Error:`, err.message);
  console.error('Stack:', err.stack);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
};

// Rate limiting helper
const rateLimitMap = new Map();
const rateLimit = (req, res, next) => {
  const clientIP = req.ip;
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 100; // Max 100 requests per minute
  
  if (!rateLimitMap.has(clientIP)) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + windowMs });
    return next();
  }
  
  const clientData = rateLimitMap.get(clientIP);
  
  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
    return next();
  }
  
  if (clientData.count >= maxRequests) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  }
  
  clientData.count++;
  next();
};

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(logRequest);
app.use(rateLimit);

// Routes
const exchangeRoutes = require('./routes/exchangeRoutes');
const multiChainRoutes = require('./routes/multiChainRoutes');
app.use('/api/exchange', exchangeRoutes);
app.use('/api/multichain', multiChainRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// 🚀 Blockchain Search Endpoint
app.get('/api/search/:query', async (req, res) => {
  const query = req.params.query;

  try {
    let response, data;

    if (query.length === 64) {
      // If input is likely a transaction hash
      response = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${query}?token=${TOKEN}`);
      data = await response.json();

      if (!data.hash) {
        return res.status(404).json({ error: 'Transaction not found.' });
      }

      return res.json({ transactions: [data] });
    } else {
      // If input is likely a wallet address
      response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${query}/full?token=${TOKEN}`);
      data = await response.json();

      if (!data.txs || data.txs.length === 0) {
        return res.status(404).json({ error: 'No transactions found for this address.' });
      }

      return res.json({ transactions: data.txs });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching blockchain data.' });
  }
});

// 🔍 API Endpoint for Transaction Analysis
app.post('/api/analyze', async (req, res) => {
  const { address } = req.body;
  
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }
  
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?token=${TOKEN}`);
    const data = await response.json();
    
    if (!data.txs || data.txs.length === 0) {
      return res.status(404).json({ error: 'No transactions found for this address.' });
    }
    
    // Analyze transactions for patterns
    const analysis = {
      totalTransactions: data.txs.length,
      totalReceived: data.total_received,
      totalSent: data.total_sent,
      balance: data.balance,
      unusualPatterns: []
    };
    
    return res.json(analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred during transaction analysis.' });
  }
});

// 🕵️ Trace Transaction Chain
app.post('/api/trace', async (req, res) => {
  const { txHash, depth } = req.body;
  const maxDepth = depth || 3; // Default to 3 levels of depth
  
  if (!txHash) {
    return res.status(400).json({ error: 'Transaction hash is required' });
  }
  
  try {
    // Get initial transaction
    const transactionChain = await traceTransactionChain(txHash, maxDepth);
    return res.json({ chain: transactionChain });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while tracing transaction chain.' });
  }
});

// 🧮 Function to trace transaction chain
async function traceTransactionChain(txHash, maxDepth, currentDepth = 0, visitedTxs = new Set()) {
  // Prevent infinite loops and respect max depth
  if (currentDepth >= maxDepth || visitedTxs.has(txHash)) {
    return { hash: txHash, children: [], visited: visitedTxs.has(txHash) };
  }
  
  visitedTxs.add(txHash);
  
  try {
    // Fetch transaction details
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${txHash}?token=${TOKEN}`);
    const tx = await response.json();
    
    if (!tx.hash) {
      return { hash: txHash, error: 'Transaction not found', children: [] };
    }
    
    // Find output addresses (excluding change addresses)
    const outputAddresses = tx.outputs.map(output => ({
      address: output.addresses?.[0] || 'Unknown',
      value: output.value
    }));
    
    // Trace forward: Find transactions that use these outputs as inputs
    const childTransactions = [];
    
    // For each output, check if it's spent and find the spending transaction
    for (const output of outputAddresses) {
      if (output.address !== 'Unknown') {
        try {
          // Get address transactions
          const addrResponse = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${output.address}?token=${TOKEN}`);
          const addrData = await addrResponse.json();
          
          // Get first transaction after our current one (if exists)
          if (addrData.txrefs && addrData.txrefs.length > 0) {
            // Filter transactions newer than current one
            const currentTxBlock = tx.block_height || Infinity;
            const newerTxs = addrData.txrefs.filter(txref => 
              txref.block_height > currentTxBlock || 
              (currentTxBlock === Infinity && !txref.block_height) // both unconfirmed
            );
            
            if (newerTxs.length > 0) {
              // Sort by block height (descending) and get the earliest one after our tx
              newerTxs.sort((a, b) => (a.block_height || Infinity) - (b.block_height || Infinity));
              
              // For each potential child transaction
              for (const childTx of newerTxs.slice(0, 2)) { // Limit to first 2 to avoid too many requests
                if (!visitedTxs.has(childTx.tx_hash)) {
                  // Recursively trace the child transaction
                  const childChain = await traceTransactionChain(
                    childTx.tx_hash, 
                    maxDepth, 
                    currentDepth + 1, 
                    new Set([...visitedTxs])
                  );
                  
                  childTransactions.push({
                    hash: childTx.tx_hash,
                    value: output.value,
                    address: output.address,
                    ...childChain
                  });
                }
              }
            }
          }
        } catch (err) {
          console.error(`Error tracing address ${output.address}:`, err.message);
        }
      }
    }
    
    return {
      hash: txHash,
      block: tx.block_height,
      time: tx.confirmed,
      total: tx.total,
      fees: tx.fees,
      inputs: tx.inputs.map(input => ({
        address: input.addresses?.[0] || 'Unknown',
        value: input.output_value
      })),
      outputs: outputAddresses,
      children: childTransactions
    };
  } catch (err) {
    console.error(`Error tracing transaction ${txHash}:`, err.message);
    return { hash: txHash, error: err.message, children: [] };
  }
}

// 📊 Get Transaction Stats and Detect Suspicious Patterns
app.post('/api/detect-suspicious', async (req, res) => {
  const { address } = req.body;
  
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }
  
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?token=${TOKEN}`);
    const data = await response.json();
    
    if (!data.txs || data.txs.length === 0) {
      return res.status(404).json({ error: 'No transactions found for this address.' });
    }
    
    // Analyze for suspicious patterns
    const suspiciousPatterns = detectSuspiciousPatterns(data.txs, address);
    
    // Add exchange detection analysis
    const exchangeAnalysis = exchangeDetection.analyzeTransactionFlow(data.txs);
    
    return res.json({
      address,
      transactions: data.txs.length,
      balance: data.final_balance,
      suspicious: suspiciousPatterns,
      exchangeAnalysis: exchangeAnalysis,
      overallRiskLevel: exchangeDetection.getRiskLevel(
        suspiciousPatterns.riskScore + exchangeAnalysis.riskScore
      )
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while detecting suspicious patterns.' });
  }
});

// 🧪 Enhanced suspicious pattern detection with risk scoring
function detectSuspiciousPatterns(transactions, address) {
  const patterns = [];
  let riskScore = 0;
  
  // Check for multiple small transactions in a short time
  const timestamps = transactions
    .filter(tx => tx.confirmed)
    .map(tx => new Date(tx.confirmed).getTime());
  
  timestamps.sort();
  
  // Rapid succession transactions (higher risk)
  let rapidCount = 0;
  for (let i = 1; i < timestamps.length; i++) {
    const timeDiff = timestamps[i] - timestamps[i-1];
    if (timeDiff < 10 * 60 * 1000) { // 10 minutes in milliseconds
      rapidCount++;
    }
  }
  
  if (rapidCount > 0) {
    const severity = rapidCount > 5 ? 'high' : rapidCount > 2 ? 'medium' : 'low';
    riskScore += rapidCount * 10;
    patterns.push({
      type: 'rapid-succession',
      description: `${rapidCount} rapid transactions detected`,
      severity: severity,
      riskScore: rapidCount * 10,
      count: rapidCount
    });
  }
  
  // Large value transactions (suspicious threshold)
  const largeTransactions = transactions.filter(tx => {
    const totalValue = tx.total || 0;
    return totalValue > 1000000000; // > 10 BTC in satoshis
  });
  
  if (largeTransactions.length > 0) {
    riskScore += largeTransactions.length * 25;
    patterns.push({
      type: 'large-value',
      description: `${largeTransactions.length} large value transactions (>10 BTC)`,
      severity: 'high',
      riskScore: largeTransactions.length * 25,
      count: largeTransactions.length
    });
  }
  
  // High frequency micro-transactions (structuring)
  const microTransactions = transactions.filter(tx => {
    const totalValue = tx.total || 0;
    return totalValue < 100000; // < 0.001 BTC
  });
  
  if (microTransactions.length > 20) {
    riskScore += 30;
    patterns.push({
      type: 'micro-structuring',
      description: `${microTransactions.length} micro-transactions detected (possible structuring)`,
      severity: 'high',
      riskScore: 30,
      count: microTransactions.length
    });
  }
  
  // Check for transactions with unusual amounts (very precise amounts often indicate automated systems)
  let preciseAmountCount = 0;
  transactions.forEach(tx => {
    tx.outputs.forEach(output => {
      if (output.addresses && output.addresses.includes(address)) {
        const btcValue = output.value / 1e8;
        const decimalStr = btcValue.toString().split('.')[1] || '';
        
        // Check for very precise amounts (many decimal places)
        if (decimalStr.length > 6 && !decimalStr.endsWith('0'.repeat(decimalStr.length - 6))) {
          preciseAmountCount++;
        }
      }
    });
  });
  
  if (preciseAmountCount > 0) {
    riskScore += preciseAmountCount * 5;
    patterns.push({
      type: 'precise-amount',
      description: `${preciseAmountCount} unusually precise transaction amounts (automated systems)`,
      severity: preciseAmountCount > 5 ? 'medium' : 'low',
      riskScore: preciseAmountCount * 5,
      count: preciseAmountCount
    });
  }
  
  // Check for round-trip transactions (money leaving and returning to same address)
  const addressesInvolved = new Set();
  
  transactions.forEach(tx => {
    // Get all addresses involved
    tx.inputs.forEach(input => {
      if (input.addresses) {
        input.addresses.forEach(addr => addressesInvolved.add(addr));
      }
    });
    
    tx.outputs.forEach(output => {
      if (output.addresses) {
        output.addresses.forEach(addr => addressesInvolved.add(addr));
      }
    });
  });
  
  // If the same address appears multiple times, check for round-trip transactions
  const addressList = Array.from(addressesInvolved);
  for (const addr of addressList) {
    if (addr === address) continue;
    
    let moneyToAddr = 0;
    let moneyFromAddr = 0;
    
    transactions.forEach(tx => {
      tx.inputs.forEach(input => {
        if (input.addresses && input.addresses.includes(addr)) {
          moneyFromAddr += input.output_value || 0;
        }
      });
      
      tx.outputs.forEach(output => {
        if (output.addresses && output.addresses.includes(addr)) {
          moneyToAddr += output.value || 0;
        }
      });
    });
    
    // If money went both to and from this address in similar amounts
    if (moneyToAddr > 0 && moneyFromAddr > 0) {
      const ratio = Math.min(moneyToAddr, moneyFromAddr) / Math.max(moneyToAddr, moneyFromAddr);
      
      if (ratio > 0.8) { // If at least 80% of the money went back
        riskScore += 50;
        patterns.push({
          type: 'round-trip',
          description: 'Round-trip transaction detected (money laundering indicator)',
          address: addr,
          severity: 'high',
          riskScore: 50
        });
      }
    }
  }
  
  // Calculate overall risk level
  let riskLevel = 'low';
  if (riskScore > 100) riskLevel = 'critical';
  else if (riskScore > 50) riskLevel = 'high';
  else if (riskScore > 20) riskLevel = 'medium';
  
  return {
    patterns,
    riskScore,
    riskLevel,
    totalTransactions: transactions.length,
    analysisTimestamp: new Date().toISOString()
  };
}

// 📧 Email Alert Endpoint for Wallet Monitoring
app.post('/api/send-alert', async (req, res) => {
  try {
    const { to, alert, subject, body } = req.body;

    // Configure email transporter
    // For production, use actual SMTP credentials from .env
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'chainphantom@example.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    });

    // Email options
    const mailOptions = {
      from: `"ChainPhantom Alert System" <${process.env.SMTP_USER || 'chainphantom@example.com'}>`,
      to: to,
      subject: subject,
      text: body,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a2637 0%, #243247 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f5f5f5; padding: 20px; }
            .alert-box { background: white; border-left: 4px solid #f39c12; padding: 15px; margin: 15px 0; border-radius: 4px; }
            .risk-score { font-size: 24px; font-weight: bold; color: ${alert.riskScore >= 70 ? '#e74c3c' : alert.riskScore >= 50 ? '#f39c12' : '#f1c40f'}; }
            .pattern { display: inline-block; padding: 5px 10px; margin: 5px; background: #e8e8e8; border-radius: 12px; font-size: 12px; }
            .pattern.high { background: #ffebee; color: #c62828; }
            .pattern.medium { background: #fff3e0; color: #e65100; }
            .pattern.low { background: #e3f2fd; color: #1565c0; }
            .footer { background: #2c3e50; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #3498db; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .wallet-address { font-family: 'Courier New', monospace; background: #ecf0f1; padding: 10px; border-radius: 4px; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 ChainPhantom Alert</h1>
              <p>Suspicious Transaction Detected</p>
            </div>
            
            <div class="content">
              <div class="alert-box">
                <h2>Alert Details</h2>
                <p><strong>Alert ID:</strong> ${alert.id}</p>
                <p><strong>Timestamp:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
                <p><strong>Risk Score:</strong> <span class="risk-score">${alert.riskScore}/100</span></p>
              </div>

              <div class="alert-box">
                <h2>Wallet Information</h2>
                <p><strong>Monitored Address:</strong></p>
                <div class="wallet-address">${alert.walletAddress}</div>
                <p style="margin-top: 10px;"><strong>Transaction Hash:</strong></p>
                <div class="wallet-address">${alert.transactionHash}</div>
              </div>

              <div class="alert-box">
                <h2>Detected Patterns</h2>
                ${alert.patterns.map(p => `
                  <span class="pattern ${p.severity}">${p.type.replace(/_/g, ' ').toUpperCase()} (${p.severity.toUpperCase()})</span>
                `).join('')}
              </div>

              <div style="text-align: center; margin: 20px 0;">
                <a href="http://localhost:3000/tx/${alert.transactionHash}" class="button">
                  View Full Transaction Details
                </a>
              </div>

              <div class="alert-box" style="background: #fff3cd; border-left-color: #ffc107;">
                <h3>⚠️ Action Required</h3>
                <p>This transaction has been flagged for suspicious activity. Please investigate immediately and take appropriate action according to NCB protocols.</p>
              </div>
            </div>

            <div class="footer">
              <p>This is an automated alert from ChainPhantom Wallet Monitoring System</p>
              <p>© ${new Date().getFullYear()} ChainPhantom - Blockchain Analysis Platform</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log(`[${new Date().toISOString()}] Alert email sent: ${info.messageId}`);
    
    res.json({
      success: true,
      messageId: info.messageId,
      alert: alert
    });

  } catch (error) {
    console.error('Error sending alert email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send alert email',
      details: error.message
    });
  }
});

// 💼 Real-Time Wallet Address Endpoint
app.get('/api/address/:address', async (req, res) => {
  const address = req.params.address;
  
  console.log(`\n🔍 Wallet Address Request: ${address}`);
  
  try {
    // Fetch address data from blockchain.info API
    const apiUrl = `https://blockchain.info/rawaddr/${address}?limit=50`;
    console.log(`📡 Calling API: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    console.log(`✅ API Response Status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Blockchain API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Calculate totals from transactions
    let totalReceived = 0;
    let totalSent = 0;
    
    // Process transactions to calculate received and sent
    if (data.txs && Array.isArray(data.txs)) {
      data.txs.forEach(tx => {
        // Calculate received (outputs to this address)
        tx.out.forEach(output => {
          if (output.addr === address) {
            totalReceived += output.value || 0;
          }
        });
        
        // Calculate sent (inputs from this address)
        tx.inputs.forEach(input => {
          if (input.prev_out && input.prev_out.addr === address) {
            totalSent += input.prev_out.value || 0;
          }
        });
      });
    }
    
    // Current balance
    const balance = data.final_balance || 0;
    
    // Format response
    const walletData = {
      address: address,
      balance: balance,
      total_received: data.total_received || totalReceived,
      total_sent: data.total_sent || totalSent,
      n_tx: data.n_tx || 0,
      transactions: data.txs ? data.txs.map(tx => ({
        hash: tx.hash,
        time: tx.time,
        result: tx.result || 0,
        balance: tx.balance || 0,
        size: tx.size,
        fee: tx.fee
      })) : []
    };
    
    console.log(`💰 Balance: ${(balance / 100000000).toFixed(8)} BTC`);
    console.log(`📥 Total Received: ${(walletData.total_received / 100000000).toFixed(8)} BTC`);
    console.log(`📤 Total Sent: ${(walletData.total_sent / 100000000).toFixed(8)} BTC`);
    console.log(`📊 Transactions: ${walletData.n_tx}\n`);
    
    res.json(walletData);
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching wallet data:`, error.message);
    
    // Return empty data structure on error
    res.status(500).json({
      address: address,
      balance: 0,
      total_received: 0,
      total_sent: 0,
      n_tx: 0,
      transactions: [],
      error: error.message
    });
  }
});

// Apply error handling middleware (must be last)
app.use(errorHandler);

// ✅ Server Start
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] ChainPhantom server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`BlockCypher Token: ${TOKEN ? 'Configured' : 'Missing - Please set BLOCKCYPHER_TOKEN in .env'}`);
});
