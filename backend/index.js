const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Ensure node-fetch v2 is installed: npm install node-fetch@2
require('dotenv').config();

const app = express();
const PORT = 5000;
const TOKEN = process.env.BLOCKCYPHER_TOKEN;

app.use(cors());
app.use(express.json());

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
    
    return res.json({
      address,
      transactions: data.txs.length,
      balance: data.final_balance,
      suspicious: suspiciousPatterns
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while detecting suspicious patterns.' });
  }
});

// 🧪 Detect suspicious patterns in transactions
function detectSuspiciousPatterns(transactions, address) {
  const patterns = [];
  
  // Check for multiple small transactions in a short time
  const timestamps = transactions
    .filter(tx => tx.confirmed)
    .map(tx => new Date(tx.confirmed).getTime());
  
  timestamps.sort();
  
  // Check for transactions happening within 10 minutes of each other
  for (let i = 1; i < timestamps.length; i++) {
    const timeDiff = timestamps[i] - timestamps[i-1];
    if (timeDiff < 10 * 60 * 1000) { // 10 minutes in milliseconds
      patterns.push({
        type: 'rapid-succession',
        description: 'Multiple transactions in rapid succession',
        severity: 'medium'
      });
      break;
    }
  }
  
  // Check for transactions with unusual amounts (very precise amounts often indicate automated systems)
  transactions.forEach(tx => {
    tx.outputs.forEach(output => {
      if (output.addresses && output.addresses.includes(address)) {
        const btcValue = output.value / 1e8;
        const decimalStr = btcValue.toString().split('.')[1] || '';
        
        // Check for very precise amounts (many decimal places)
        if (decimalStr.length > 6 && !decimalStr.endsWith('0'.repeat(decimalStr.length - 6))) {
          patterns.push({
            type: 'precise-amount',
            description: 'Unusually precise transaction amount',
            value: btcValue,
            severity: 'low'
          });
        }
      }
    });
  });
  
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
        patterns.push({
          type: 'round-trip',
          description: 'Round-trip transaction detected',
          address: addr,
          severity: 'high'
        });
      }
    }
  }
  
  return patterns;
}

// ✅ Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
