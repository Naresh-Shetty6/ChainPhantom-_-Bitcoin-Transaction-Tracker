// Mock data generator for ChainPhantom

/**
 * Generates a mock transaction chain for visualization
 * @param {string} baseTxId - The base transaction ID to build the chain from
 * @param {number} depth - The depth of the chain (1-3)
 * @returns {Array} Array of transaction objects with connections
 */
export const generateMockTransactionChain = (baseTxId, depth = 1) => {
  // Helper to generate random tx hash
  const generateTxHash = () => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  // Helper to generate random address
  const generateAddress = () => {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let address = depth > 1 ? 'bc1' : '1';
    for (let i = 0; i < 30; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  };

  // Helper to generate random amount
  const generateAmount = (min = 0.01, max = 2) => {
    return (Math.random() * (max - min) + min).toFixed(8);
  };

  // Base transaction (current one)
  const baseTransaction = {
    id: baseTxId,
    hash: baseTxId,
    time: Date.now() - 3600000,
    inputs: [
      {
        prev_out: {
          addr: generateAddress(),
          value: generateAmount(1, 5) * 100000000
        }
      }
    ],
    out: [
      {
        addr: generateAddress(),
        value: generateAmount(0.5, 3) * 100000000
      },
      {
        addr: generateAddress(),
        value: generateAmount(0.1, 1) * 100000000
      }
    ],
    fee: 25000,
    type: 'main'
  };

  const transactions = [baseTransaction];

  // For depth 1, just return the base transaction
  if (depth === 1) {
    return transactions;
  }

  // Add input transactions (where money came from)
  const numInputTxs = Math.min(depth, 3);
  for (let i = 0; i < numInputTxs; i++) {
    const inputTx = {
      id: generateTxHash(),
      hash: generateTxHash(),
      time: baseTransaction.time - (Math.random() * 86400000),
      inputs: [
        {
          prev_out: {
            addr: generateAddress(),
            value: generateAmount(2, 8) * 100000000
          }
        }
      ],
      out: [
        {
          addr: baseTransaction.inputs[0].prev_out.addr,
          value: baseTransaction.inputs[0].prev_out.value
        }
      ],
      fee: 18000 + Math.floor(Math.random() * 10000),
      type: 'source'
    };
    transactions.push(inputTx);
  }

  // For depth 2 or 3, add output transactions (where money went)
  if (depth >= 2) {
    // Add output transactions
    baseTransaction.out.forEach((output, index) => {
      if (output.addr) {
        const outputTx = {
          id: generateTxHash(),
          hash: generateTxHash(),
          time: baseTransaction.time + (Math.random() * 3600000),
          inputs: [
            {
              prev_out: {
                addr: output.addr,
                value: output.value
              }
            }
          ],
          out: [
            {
              addr: generateAddress(),
              value: output.value * 0.7
            },
            {
              addr: generateAddress(),
              value: output.value * 0.25
            }
          ],
          fee: 15000 + Math.floor(Math.random() * 5000),
          type: 'destination'
        };
        transactions.push(outputTx);
      }
    });
  }

  // For depth 3, add even more layers
  if (depth >= 3) {
    // Find transactions that are destinations (spending from the base tx)
    const destinationTxs = transactions.filter(tx => tx.type === 'destination');
    
    destinationTxs.forEach(destTx => {
      // For each output of destination transactions, create further transactions
      destTx.out.forEach((output, index) => {
        if (output.addr && Math.random() > 0.3) { // 70% chance to add a child tx
          const childTx = {
            id: generateTxHash(),
            hash: generateTxHash(),
            time: destTx.time + (Math.random() * 7200000),
            inputs: [
              {
                prev_out: {
                  addr: output.addr,
                  value: output.value
                }
              }
            ],
            out: [
              {
                addr: generateAddress(),
                value: output.value * 0.5
              },
              {
                addr: generateAddress(),
                value: output.value * 0.45
              }
            ],
            fee: 12000 + Math.floor(Math.random() * 8000),
            type: 'child' 
          };
          transactions.push(childTx);
        }
      });
    });
  }

  return transactions;
};

/**
 * Processes transaction data to create a visualization-ready data structure
 * @param {Array} transactions - Array of transaction objects 
 * @param {string} mainTxId - The main transaction ID to focus on
 * @returns {Object} Processed data for visualization
 */
export const processTransactionChainData = (transactions, mainTxId) => {
  if (!transactions || transactions.length === 0) {
    return { nodes: [], links: [] };
  }

  // Find the main transaction (for future use)
  // const mainTx = transactions.find(tx => tx.hash === mainTxId) || transactions[0];
  
  // Create a map of transactions by ID for quick lookup (for future use)
  // const txMap = transactions.reduce((map, tx) => {
  //   map[tx.hash] = tx;
  //   return map;
  // }, {});

  // Collect all addresses involved
  const addresses = new Set();
  transactions.forEach(tx => {
    // Add input addresses
    if (tx.inputs) {
      tx.inputs.forEach(input => {
        if (input.prev_out && input.prev_out.addr) {
          addresses.add(input.prev_out.addr);
        }
      });
    }
    
    // Add output addresses
    if (tx.out) {
      tx.out.forEach(output => {
        if (output.addr) {
          addresses.add(output.addr);
        }
      });
    }
  });

  // Create nodes for transactions and addresses
  const nodes = [];
  
  // Add transaction nodes
  transactions.forEach(tx => {
    nodes.push({
      id: tx.hash,
      type: 'transaction',
      isMain: tx.hash === mainTxId,
      data: tx
    });
  });
  
  // Add address nodes
  addresses.forEach(addr => {
    nodes.push({
      id: addr,
      type: 'address',
      data: { address: addr }
    });
  });

  // Create links between nodes
  const links = [];
  
  // For each transaction, create links to/from addresses
  transactions.forEach(tx => {
    // Links from input addresses to this transaction
    if (tx.inputs) {
      tx.inputs.forEach(input => {
        if (input.prev_out && input.prev_out.addr) {
          links.push({
            source: input.prev_out.addr,
            target: tx.hash,
            value: input.prev_out.value / 100000000, // Convert satoshis to BTC
            type: 'input'
          });
        }
      });
    }
    
    // Links from this transaction to output addresses
    if (tx.out) {
      tx.out.forEach(output => {
        if (output.addr) {
          links.push({
            source: tx.hash,
            target: output.addr,
            value: output.value / 100000000, // Convert satoshis to BTC
            type: 'output'
          });
        }
      });
    }
  });

  return { nodes, links };
};

/**
 * Formats a bitcoin value from satoshis to BTC with appropriate precision
 * @param {number} satoshis - Bitcoin amount in satoshis
 * @returns {string} Formatted BTC amount
 */
export const formatBTC = (satoshis) => {
  const btc = satoshis / 100000000;
  return btc.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8
  }) + ' BTC';
};

/**
 * Format a timestamp into a relative time string
 * @param {number} timestamp - Unix timestamp in milliseconds or seconds
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (timestamp) => {
  // Convert to milliseconds if in seconds
  const timeMs = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
  const now = Date.now();
  const diff = now - timeMs;
  
  // Convert diff to appropriate unit
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  }
}; 