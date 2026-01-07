// Comprehensive testnet mock data for all scenarios
import {
  walletMonitoringScenarios,
  emailAlertScenarios,
  patternDetectionScenarios,
  enhancedWalletRulesScenarios,
  transactionFetchScenarios,
  multiChainScenarios,
  exportReportingScenarios,
  riskScoringScenarios,
  performanceScenarios
} from './testnetScenarios';

/**
 * Generates a random hash
 */
const generateHash = (length = 64) => {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < length; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

/**
 * Detect which test scenario is being used based on address/tx pattern
 */
const detectScenario = (identifier) => {
  if (!identifier) return null;
  
  const id = identifier.toLowerCase();
  
  // Wallet Monitoring scenarios
  if (id.includes('wm01') || id.includes('alerttrigger')) return walletMonitoringScenarios['WM-01'];
  if (id.includes('wm02') || id.includes('noalert')) return walletMonitoringScenarios['WM-02'];
  
  // Email Alert scenarios
  if (id.includes('em01') || id.includes('successfulsmtp')) return emailAlertScenarios['EM-01'];
  if (id.includes('em02') || id.includes('smtpfailure')) return emailAlertScenarios['EM-02'];
  
  // Pattern Detection scenarios
  if (id.includes('pd01') || id.includes('fastsuccession')) return patternDetectionScenarios['PD-01'];
  if (id.includes('pd02') || id.includes('mixer')) return patternDetectionScenarios['PD-02'];
  
  // Enhanced Wallet Rules scenarios
  if (id.includes('er01') || id.includes('monthlyaverage')) return enhancedWalletRulesScenarios['ER-01'];
  if (id.includes('er02') || id.includes('lumpsum')) return enhancedWalletRulesScenarios['ER-02'];
  
  // Transaction Fetch scenarios
  if (id.includes('tx01') || id.includes('validbtctxid')) return transactionFetchScenarios['TX-01'];
  if (id.includes('tx02') || id.includes('invalid')) return transactionFetchScenarios['TX-02'];
  
  // Multi-Chain scenarios
  if (id.includes('mc01') || id.includes('ethtx')) return multiChainScenarios['MC-01'];
  if (id.includes('mc02') || id.includes('unsupported')) return multiChainScenarios['MC-02'];
  
  // Export & Reporting scenarios
  if (id.includes('ex01') || id.includes('exportjson')) return exportReportingScenarios['EX-01'];
  if (id.includes('ex02') || id.includes('emptypdf')) return exportReportingScenarios['EX-02'];
  
  // Risk Scoring scenarios
  if (id.includes('rs01') || id.includes('deterministic')) return riskScoringScenarios['RS-01'];
  if (id.includes('rs02') || id.includes('threshold')) return riskScoringScenarios['RS-02'];
  
  // Performance scenarios
  if (id.includes('pf01') || id.includes('interval')) return performanceScenarios['PF-01'];
  if (id.includes('pf02') || id.includes('childcap')) return performanceScenarios['PF-02'];
  
  return null;
};

/**
 * Generates a testnet address (starts with 'm' or 'n' or '2')
 */
const generateTestnetAddress = () => {
  const prefixes = ['m', 'n', '2'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let address = prefix;
  for (let i = 0; i < 33; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

/**
 * Generates a random timestamp within the last N days
 */
const randomTimestamp = (daysAgo = 7) => {
  const now = Math.floor(Date.now() / 1000);
  const daysInSeconds = daysAgo * 24 * 60 * 60;
  return now - Math.floor(Math.random() * daysInSeconds);
};

// ==================== DASHBOARD MOCK DATA ====================

export const getTestnetDashboardStats = () => {
  const baseHeight = 2500000 + Math.floor(Math.random() * 10000);
  const baseTime = randomTimestamp(1);
  
  return {
    latestBlock: {
      height: baseHeight,
      hash: generateHash(),
      time: baseTime * 1000,
      txCount: Math.floor(Math.random() * 500) + 100,
      size: Math.floor(Math.random() * 1000000) + 500000
    },
    mempool: {
      txCount: Math.floor(Math.random() * 5000) + 500,
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      fees: {
        hourFee: Math.floor(Math.random() * 10) + 5,
        halfHourFee: Math.floor(Math.random() * 15) + 10,
        fastestFee: Math.floor(Math.random() * 20) + 15
      }
    },
    network: {
      hashrate: `${(Math.random() * 50 + 10).toFixed(1)} TH/s`, // Testnet has lower hashrate
      difficulty: `${(Math.random() * 10 + 1).toFixed(2)} T`,
      nextDifficultyChange: `${(Math.random() * 10 - 5).toFixed(1)}%`,
      nextDifficultyHeight: baseHeight + Math.floor(Math.random() * 2016) + 100,
      blocksUntilChange: Math.floor(Math.random() * 2016) + 100
    },
    market: {
      price: `$${(Math.random() * 1000 + 50000).toFixed(2)}`,
      change24h: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 5).toFixed(2)}%`,
      volume24h: `$${(Math.random() * 5 + 1).toFixed(1)}B`,
      marketCap: `$${(Math.random() * 200 + 1000).toFixed(0)}B`
    }
  };
};

export const getTestnetRecentBlocks = (count = 4) => {
  const blocks = [];
  const baseHeight = 2500000 + Math.floor(Math.random() * 10000);
  const miners = ['Testnet Pool 1', 'Testnet Pool 2', 'Solo Miner', 'Testnet Node', 'Unknown'];
  
  for (let i = 0; i < count; i++) {
    blocks.push({
      height: baseHeight - i,
      hash: generateHash(),
      time: (randomTimestamp(1) - i * 600) * 1000, // ~10 min apart
      txCount: Math.floor(Math.random() * 500) + 50,
      size: Math.floor(Math.random() * 1000000) + 300000,
      miner: miners[Math.floor(Math.random() * miners.length)]
    });
  }
  
  return blocks;
};

export const getTestnetRecentTransactions = (count = 4) => {
  const transactions = [];
  
  for (let i = 0; i < count; i++) {
    const senderCount = Math.floor(Math.random() * 3) + 1;
    const receiverCount = Math.floor(Math.random() * 3) + 1;
    const senders = Array.from({ length: senderCount }, () => generateTestnetAddress());
    const receivers = Array.from({ length: receiverCount }, () => ({
      address: generateTestnetAddress(),
      value: Math.random() * 10 + 0.001
    }));
    
    transactions.push({
      hash: generateHash(),
      time: Date.now() - i * 60000, // 1 min apart
      amount: receivers.reduce((sum, r) => sum + r.value, 0),
      fee: Math.random() * 0.001 + 0.0001,
      size: Math.floor(Math.random() * 500) + 200,
      senders,
      receivers
    });
  }
  
  return transactions;
};

// ==================== NETWORK STATS MOCK DATA ====================

export const getTestnetNetworkStats = () => {
  return {
    hashrate: `${(Math.random() * 50 + 10).toFixed(1)} TH/s`,
    difficulty: `${(Math.random() * 10 + 1).toFixed(2)} T`,
    unconfirmedTx: (Math.floor(Math.random() * 5000) + 500).toLocaleString(),
    nextHalving: `${Math.floor(Math.random() * 1000) + 100} days`,
    blockchainSize: `${(Math.random() * 50 + 10).toFixed(2)} GB`,
    nextDifficultyChange: `${(Math.random() * 10 - 5).toFixed(1)}%`,
    blocksUntilAdjustment: Math.floor(Math.random() * 2016) + 100,
    mempool: {
      txCount: Math.floor(Math.random() * 5000) + 500,
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
      totalFees: `${(Math.random() * 0.1 + 0.01).toFixed(5)} BTC`,
      minFee: `${(Math.random() * 2 + 1).toFixed(1)} sat/vB`,
      medianFee: `${(Math.random() * 5 + 3).toFixed(1)} sat/vB`,
      maxFee: `${(Math.random() * 30 + 10).toFixed(1)} sat/vB`
    },
    peers: {
      total: Math.floor(Math.random() * 500) + 100,
      inbound: Math.floor(Math.random() * 300) + 50,
      outbound: Math.floor(Math.random() * 200) + 50,
      ipv4: Math.floor(Math.random() * 400) + 80,
      ipv6: Math.floor(Math.random() * 100) + 20,
      tor: Math.floor(Math.random() * 50) + 10
    }
  };
};

// ==================== BLOCKS MOCK DATA ====================

export const getTestnetBlocks = (count = 10) => {
  const blocks = [];
  const baseHeight = 2500000 + Math.floor(Math.random() * 10000);
  
  for (let i = 0; i < count; i++) {
    blocks.push({
      height: baseHeight - i,
      hash: generateHash(),
      time: randomTimestamp(7) - i * 600, // ~10 min apart
      n_tx: Math.floor(Math.random() * 500) + 50,
      size: Math.floor(Math.random() * 1000000) + 300000
    });
  }
  
  return blocks;
};

// ==================== TRANSACTION MOCK DATA ====================

/**
 * Generate transaction data for specific test scenarios
 */
const generateScenarioTransactionData = (txId, scenario) => {
  let inputCount, outputCount, inputs, outputs, totalInput, fee;
  
  switch (scenario.id) {
    case 'CP-TC-PD-01': // Fast succession
      inputCount = 2;
      outputCount = 2;
      
      inputs = Array.from({ length: inputCount }, () => ({
        prev_out: {
          addr: scenario.walletAddress || generateTestnetAddress(),
          value: Math.floor(Math.random() * 100000000) + 50000000
        }
      }));
      
      totalInput = inputs.reduce((sum, input) => sum + input.prev_out.value, 0);
      fee = 15000;
      
      outputs = [
        {
          addr: generateTestnetAddress(),
          value: Math.floor(totalInput * 0.6)
        },
        {
          addr: inputs[0].prev_out.addr, // Change
          value: totalInput - Math.floor(totalInput * 0.6) - fee
        }
      ];
      break;
      
    case 'CP-TC-PD-02': // Mixer/tumbler
      inputCount = scenario.data.inputCount; // 20
      outputCount = scenario.data.outputCount; // 20
      
      const avgAmount = 100000000; // 1 BTC average
      
      inputs = Array.from({ length: inputCount }, () => ({
        prev_out: {
          addr: generateTestnetAddress(),
          value: avgAmount + Math.floor(Math.random() * 10000000) - 5000000 // ±0.05 BTC variation
        }
      }));
      
      totalInput = inputs.reduce((sum, input) => sum + input.prev_out.value, 0);
      fee = 50000;
      
      const outputAmount = Math.floor((totalInput - fee) / outputCount);
      outputs = Array.from({ length: outputCount }, () => ({
        addr: generateTestnetAddress(),
        value: outputAmount + Math.floor(Math.random() * 1000000) - 500000 // Small variation
      }));
      break;
      
    case 'CP-TC-ER-02': // Lump sum
      inputCount = 1;
      outputCount = 1;
      
      const lumpSum = scenario.data.transactionAmount * 100000000; // 75 BTC
      
      inputs = [{
        prev_out: {
          addr: scenario.walletAddress || generateTestnetAddress(),
          value: lumpSum
        }
      }];
      
      totalInput = lumpSum;
      fee = 20000;
      
      outputs = [{
        addr: generateTestnetAddress(),
        value: totalInput - fee
      }];
      break;
      
    case 'CP-TC-TX-01': // Valid transaction
      inputCount = 2;
      outputCount = 2;
      
      inputs = [
        {
          prev_out: {
            addr: generateTestnetAddress(),
            value: 150000000 // 1.5 BTC
          }
        },
        {
          prev_out: {
            addr: generateTestnetAddress(),
            value: 50000000 // 0.5 BTC
          }
        }
      ];
      
      totalInput = 200000000; // 2 BTC total
      fee = 10000;
      
      outputs = [
        {
          addr: generateTestnetAddress(),
          value: 120000000 // 1.2 BTC
        },
        {
          addr: inputs[0].prev_out.addr, // Change
          value: 69990000 // 0.6999 BTC (change)
        }
      ];
      break;
      
    case 'CP-TC-TX-02': // Invalid transaction
      // Return an error structure
      return {
        error: true,
        message: 'Invalid transaction ID format',
        code: 'INVALID_TX_FORMAT',
        friendlyMessage: 'The transaction ID you entered is not valid. Please check the format and try again.',
        retryOption: true
      };
      
    case 'CP-TC-MC-01': // Ethereum transaction
      inputCount = 1;
      outputCount = 1;
      
      inputs = [{
        prev_out: {
          addr: '0x' + generateHash(40), // ETH address
          value: 2000000000000000000 // 2 ETH in Wei
        }
      }];
      
      totalInput = 2000000000000000000;
      const gasUsed = 21000;
      const gasPrice = 50000000000; // 50 Gwei
      fee = gasUsed * gasPrice;
      
      outputs = [{
        addr: '0x' + generateHash(40),
        value: totalInput - fee
      }];
      
      // Add Ethereum-specific fields
      return {
        hash: txId || '0x' + generateHash(64),
        txid: txId || '0x' + generateHash(64),
        from: inputs[0].prev_out.addr,
        to: outputs[0].addr,
        value: outputs[0].value,
        gas: 21000,
        gasPrice: gasPrice,
        gasUsed: gasUsed,
        nonce: Math.floor(Math.random() * 100),
        blockNumber: 15000000 + Math.floor(Math.random() * 100000),
        blockHash: '0x' + generateHash(64),
        timestamp: randomTimestamp(7),
        confirmations: Math.floor(Math.random() * 100) + 1,
        chainId: 1,
        chain: 'ethereum',
        inputs,
        out: outputs,
        vin: inputs,
        vout: outputs
      };
      
    case 'CP-TC-RS-01': // Deterministic scoring
      // Use fixed values for deterministic results
      inputCount = scenario.data.inputs; // 5
      outputCount = scenario.data.outputs; // 3
      
      inputs = Array.from({ length: inputCount }, (_, i) => ({
        prev_out: {
          addr: generateTestnetAddress(),
          value: 100000000 + (i * 10000000) // Predictable amounts
        }
      }));
      
      totalInput = inputs.reduce((sum, input) => sum + input.prev_out.value, 0);
      fee = 15000; // Fixed fee
      
      const remainingAmount = totalInput - fee;
      outputs = [
        {
          addr: generateTestnetAddress(),
          value: Math.floor(remainingAmount * 0.4)
        },
        {
          addr: generateTestnetAddress(),
          value: Math.floor(remainingAmount * 0.35)
        },
        {
          addr: generateTestnetAddress(),
          value: remainingAmount - Math.floor(remainingAmount * 0.4) - Math.floor(remainingAmount * 0.35)
        }
      ];
      break;
      
    case 'CP-TC-PF-02': // Child transaction cap
      inputCount = 3;
      outputCount = 5;
      
      inputs = Array.from({ length: inputCount }, () => ({
        prev_out: {
          addr: generateTestnetAddress(),
          value: Math.floor(Math.random() * 200000000) + 100000000
        }
      }));
      
      totalInput = inputs.reduce((sum, input) => sum + input.prev_out.value, 0);
      fee = 25000;
      
      const perOutput = Math.floor((totalInput - fee) / outputCount);
      outputs = Array.from({ length: outputCount }, (_, i) => ({
        addr: generateTestnetAddress(),
        value: i === outputCount - 1 ? (totalInput - fee) - (perOutput * (outputCount - 1)) : perOutput
      }));
      break;
      
    default:
      // Default transaction
      inputCount = 2;
      outputCount = 2;
      
      inputs = Array.from({ length: inputCount }, () => ({
        prev_out: {
          addr: generateTestnetAddress(),
          value: Math.floor(Math.random() * 1000000000) + 10000000
        }
      }));
      
      totalInput = inputs.reduce((sum, input) => sum + input.prev_out.value, 0);
      fee = Math.floor(Math.random() * 50000) + 10000;
      
      const halfAmount = Math.floor((totalInput - fee) / 2);
      outputs = [
        {
          addr: generateTestnetAddress(),
          value: halfAmount
        },
        {
          addr: inputs[0].prev_out.addr,
          value: (totalInput - fee) - halfAmount
        }
      ];
  }
  
  const totalOutput = outputs.reduce((sum, output) => sum + output.value, 0);
  
  return {
    hash: txId || generateHash(),
    txid: txId || generateHash(),
    time: randomTimestamp(7),
    size: Math.floor(Math.random() * 1000) + 200,
    fee: fee,
    block_height: Math.random() > 0.3 ? 2500000 + Math.floor(Math.random() * 10000) : null,
    confirmations: Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 1 : 0,
    inputs,
    out: outputs,
    vin: inputs.map(input => ({
      addr: input.prev_out.addr,
      value: input.prev_out.value
    })),
    vout: outputs.map(output => ({
      scriptPubKey: { addresses: [output.addr] },
      value: output.value / 100000000 // Convert to BTC
    })),
    scenario: scenario.id
  };
};

export const getTestnetTransaction = (txId) => {
  // Check if this transaction matches a test scenario
  const scenario = detectScenario(txId);
  
  if (scenario) {
    return generateScenarioTransactionData(txId, scenario);
  }
  
  // Otherwise, determine transaction type based on txId pattern or random
  const txType = determineTransactionType(txId);
  
  let inputCount, outputCount, inputs, outputs, totalInput, totalOutput, fee;
  
  switch(txType) {
    case 'single_sender':
      // Scenario: 1 sender, 1 receiver (simple transaction)
      inputCount = 1;
      outputCount = 1;
      
      const singleInputValue = Math.floor(Math.random() * 5000000000) + 1000000000; // 10-50 BTC
      
      inputs = [{
        prev_out: {
          addr: generateTestnetAddress(),
          value: singleInputValue
        }
      }];
      
      totalInput = singleInputValue;
      fee = Math.floor(Math.random() * 50000) + 10000;
      
      // All to one receiver, no change (suspicious - all funds sent)
      outputs = [{
        addr: generateTestnetAddress(),
        value: totalInput - fee
      }];
      break;
      
    case 'single_sender_two_receivers':
      // Scenario: 1 sender, 2 receivers (peeling chain or split)
      inputCount = 1;
      outputCount = 2;
      
      const inputValueTwoReceivers = Math.floor(Math.random() * 5000000000) + 1000000000; // 10-50 BTC
      
      inputs = [{
        prev_out: {
          addr: generateTestnetAddress(),
          value: inputValueTwoReceivers
        }
      }];
      
      totalInput = inputValueTwoReceivers;
      fee = Math.floor(Math.random() * 50000) + 10000;
      
      // Split between two receivers - one small, one large (peeling chain pattern)
      const smallOutputTwoReceivers = Math.floor(Math.random() * 200000000) + 10000000; // 0.1-2 BTC
      const largeOutputTwoReceivers = totalInput - fee - smallOutputTwoReceivers;
      
      outputs = [
        {
          addr: generateTestnetAddress(), // Recipient 1
          value: smallOutputTwoReceivers
        },
        {
          addr: generateTestnetAddress(), // Recipient 2 (or could be change)
          value: largeOutputTwoReceivers
        }
      ];
      break;
      
    case 'multiple_inputs_few_outputs':
      // Scenario: More senders than receivers, no change
      inputCount = Math.floor(Math.random() * 8) + 5; // 5-12 inputs
      outputCount = Math.floor(Math.random() * 2) + 1; // 1-2 outputs
      
      inputs = Array.from({ length: inputCount }, () => ({
        prev_out: {
          addr: generateTestnetAddress(),
          value: Math.floor(Math.random() * 500000000) + 50000000 // 0.5 to 5 BTC in satoshis
        }
      }));
      
      totalInput = inputs.reduce((sum, input) => sum + input.prev_out.value, 0);
      fee = Math.floor(Math.random() * 50000) + 10000; // 0.0001 to 0.0005 BTC fee
      
      // Distribute all inputs to fewer outputs (no change)
      const outputValue = Math.floor((totalInput - fee) / outputCount);
      outputs = Array.from({ length: outputCount }, (_, i) => {
        // Last output gets remainder to account for rounding
        const value = i === outputCount - 1 
          ? totalInput - fee - (outputValue * (outputCount - 1))
          : outputValue;
        return {
          addr: generateTestnetAddress(),
          value: value
        };
      });
      break;
      
    case 'coinjoin':
      // CoinJoin: Many inputs, many outputs, similar amounts
      inputCount = Math.floor(Math.random() * 10) + 8; // 8-17 inputs
      outputCount = Math.floor(Math.random() * 10) + 8; // 8-17 outputs
      
      const coinjoinAmount = Math.floor(Math.random() * 200000000) + 100000000; // 1-3 BTC
      
      inputs = Array.from({ length: inputCount }, () => ({
        prev_out: {
          addr: generateTestnetAddress(),
          value: coinjoinAmount + Math.floor(Math.random() * 10000000) // Similar amounts
        }
      }));
      
      totalInput = inputs.reduce((sum, input) => sum + input.prev_out.value, 0);
      fee = Math.floor(Math.random() * 100000) + 50000;
      
      outputs = Array.from({ length: outputCount }, () => ({
        addr: generateTestnetAddress(),
        value: Math.floor((totalInput - fee) / outputCount) + Math.floor(Math.random() * 5000000)
      }));
      break;
      
    case 'peeling_chain':
      // Peeling chain: One input, small output + large change
      inputCount = 1;
      outputCount = 2;
      
      const largeInputPeeling = Math.floor(Math.random() * 5000000000) + 1000000000; // 10-50 BTC
      
      inputs = [{
        prev_out: {
          addr: generateTestnetAddress(),
          value: largeInputPeeling
        }
      }];
      
      totalInput = largeInputPeeling;
      fee = Math.floor(Math.random() * 20000) + 10000;
      
      const smallOutputPeeling = Math.floor(Math.random() * 100000000) + 10000000; // 0.1-1 BTC
      const changePeeling = totalInput - smallOutputPeeling - fee;
      
      outputs = [
        {
          addr: generateTestnetAddress(), // Recipient
          value: smallOutputPeeling
        },
        {
          addr: inputs[0].prev_out.addr, // Change back to sender
          value: changePeeling
        }
      ];
      break;
      
    case 'consolidation':
      // Consolidation: Many small inputs, one or two outputs
      inputCount = Math.floor(Math.random() * 15) + 10; // 10-24 inputs
      outputCount = Math.floor(Math.random() * 2) + 1; // 1-2 outputs
      
      inputs = Array.from({ length: inputCount }, () => ({
        prev_out: {
          addr: generateTestnetAddress(),
          value: Math.floor(Math.random() * 100000000) + 1000000 // 0.01-1 BTC (small amounts)
        }
      }));
      
      totalInput = inputs.reduce((sum, input) => sum + input.prev_out.value, 0);
      fee = Math.floor(Math.random() * 30000) + 15000;
      
      if (outputCount === 1) {
        outputs = [{
          addr: generateTestnetAddress(),
          value: totalInput - fee // All to one output, no change
        }];
      } else {
        const mainOutput = Math.floor((totalInput - fee) * 0.9);
        outputs = [
          {
            addr: generateTestnetAddress(),
            value: mainOutput
          },
          {
            addr: generateTestnetAddress(),
            value: totalInput - fee - mainOutput
          }
        ];
      }
      break;
      
    case 'lump_sum':
      // Rule 3: Lump sum transaction (very huge amount > 100 BTC)
      inputCount = 1;
      outputCount = 1;
      
      const hugeLumpSum = Math.floor(Math.random() * 40000000000) + 10000000000; // 100-500 BTC
      
      inputs = [{
        prev_out: {
          addr: generateTestnetAddress(),
          value: hugeLumpSum
        }
      }];
      
      totalInput = hugeLumpSum;
      fee = Math.floor(Math.random() * 20000) + 10000;
      
      outputs = [{
        addr: generateTestnetAddress(),
        value: totalInput - fee
      }];
      break;
      
    default:
      // Normal transaction: Balanced inputs and outputs
      inputCount = Math.floor(Math.random() * 5) + 1;
      outputCount = Math.floor(Math.random() * 5) + 1;
      
      inputs = Array.from({ length: inputCount }, () => ({
        prev_out: {
          addr: generateTestnetAddress(),
          value: Math.floor(Math.random() * 1000000000) + 10000000 // 0.1 to 10 BTC in satoshis
        }
      }));
      
      totalInput = inputs.reduce((sum, input) => sum + input.prev_out.value, 0);
      fee = Math.floor(Math.random() * 50000) + 10000;
      
      const totalOutputValue = totalInput - fee;
      const avgOutput = Math.floor(totalOutputValue / outputCount);
      
      outputs = Array.from({ length: outputCount }, (_, i) => {
        const value = i === outputCount - 1 
          ? totalOutputValue - (avgOutput * (outputCount - 1))
          : avgOutput;
        return {
          addr: generateTestnetAddress(),
          value: value
        };
      });
  }
  
  totalOutput = outputs.reduce((sum, output) => sum + output.value, 0);
  
  return {
    hash: txId || generateHash(),
    txid: txId || generateHash(),
    time: randomTimestamp(7),
    size: Math.floor(Math.random() * 1000) + 200,
    fee: fee,
    block_height: Math.random() > 0.3 ? 2500000 + Math.floor(Math.random() * 10000) : null,
    confirmations: Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 1 : 0,
    inputs,
    out: outputs,
    vin: inputs.map(input => ({
      addr: input.prev_out.addr,
      value: input.prev_out.value
    })),
    vout: outputs.map(output => ({
      scriptPubKey: { addresses: [output.addr] },
      value: output.value / 100000000 // Convert to BTC
    }))
  };
};

// Helper function to determine transaction type based on hash pattern
const determineTransactionType = (txId) => {
  if (!txId) return 'single_sender';
  
  // Check if txId contains specific patterns to determine type
  const hash = txId.toLowerCase();
  
  // Single sender, 1-2 receivers pattern (most common test case)
  if (hash.includes('a1b2') || hash.startsWith('a1')) return 'single_sender';
  
  // Single sender, 2 receivers (peeling chain)
  if (hash.includes('b2c3') || hash.startsWith('b2')) return 'single_sender_two_receivers';
  
  // Multiple inputs, few outputs pattern
  if (hash.includes('c3d4') || hash.startsWith('c3')) return 'multiple_inputs_few_outputs';
  
  // CoinJoin pattern
  if (hash.includes('d4e5') || hash.startsWith('d4')) return 'coinjoin';
  
  // Consolidation pattern
  if (hash.includes('e5f6') || hash.startsWith('e5')) return 'consolidation';
  
  // Rule 1: Exceeds monthly average (generate lump sum transaction)
  if (hash.includes('rule1') || hash.startsWith('f1')) return 'lump_sum';
  
  // Rule 2: High frequency short span (generate lump sum transaction)
  if (hash.includes('rule2') || hash.startsWith('f2')) return 'lump_sum';
  
  // Rule 3: Lump sum transaction
  if (hash.includes('rule3') || hash.startsWith('f3')) return 'lump_sum';
  
  return 'single_sender';
};

// ==================== ADDRESS MOCK DATA ====================

/**
 * Generate address data for specific test scenarios
 */
const generateScenarioAddressData = (address, scenario) => {
  let txCount, transactions, totalReceived, totalSent, riskScore;
  
  switch (scenario.id) {
    case 'CP-TC-WM-01': // Alert triggers when risk ≥ threshold
      txCount = 25;
      riskScore = scenario.data.riskScore;
      transactions = Array.from({ length: txCount }, (_, i) => ({
        hash: generateHash(),
        time: randomTimestamp(7) - i * 3600,
        value: Math.floor(Math.random() * 500000000) + 50000000,
        type: Math.random() > 0.5 ? 'received' : 'sent'
      }));
      break;
      
    case 'CP-TC-WM-02': // No alert when rules disabled
      txCount = 30;
      riskScore = scenario.data.riskScore;
      transactions = Array.from({ length: txCount }, (_, i) => ({
        hash: generateHash(),
        time: randomTimestamp(14) - i * 7200,
        value: Math.floor(Math.random() * 1000000000) + 100000000,
        type: Math.random() > 0.5 ? 'received' : 'sent'
      }));
      break;
      
    case 'CP-TC-EM-01': // Successful SMTP send
      txCount = 15;
      riskScore = scenario.data.riskScore;
      const highRiskTx = {
        hash: generateHash(),
        time: randomTimestamp(1),
        value: 5000000000, // 50 BTC
        type: 'sent'
      };
      transactions = [
        highRiskTx,
        ...Array.from({ length: txCount - 1 }, (_, i) => ({
          hash: generateHash(),
          time: randomTimestamp(7) - i * 3600,
          value: Math.floor(Math.random() * 100000000),
          type: Math.random() > 0.5 ? 'received' : 'sent'
        }))
      ];
      break;
      
    case 'CP-TC-EM-02': // SMTP failure handling
      txCount = 20;
      riskScore = scenario.data.riskScore;
      transactions = Array.from({ length: txCount }, (_, i) => ({
        hash: generateHash(),
        time: randomTimestamp(3) - i * 1800,
        value: Math.floor(Math.random() * 300000000) + 50000000,
        type: 'sent'
      }));
      break;
      
    case 'CP-TC-PD-01': // Fast succession detection
      txCount = scenario.data.transactionCount;
      riskScore = 65;
      const baseTime = randomTimestamp(1);
      transactions = Array.from({ length: txCount }, (_, i) => ({
        hash: generateHash(),
        time: baseTime - (i * scenario.data.transactionInterval * 60), // Every X minutes
        value: Math.floor(Math.random() * 200000000) + 10000000,
        type: Math.random() > 0.5 ? 'received' : 'sent'
      }));
      break;
      
    case 'CP-TC-ER-01': // Monthly average threshold breach
      txCount = scenario.data.transactionCount;
      riskScore = 55;
      const avgValue = scenario.data.thirtyDayAverage * 100000000; // Convert to satoshis
      const highValue = scenario.data.newTransactionAmount * 100000000;
      const breachTx = {
        hash: generateHash(),
        time: randomTimestamp(1),
        value: highValue,
        type: 'received'
      };
      transactions = [
        breachTx,
        ...Array.from({ length: txCount - 1 }, (_, i) => ({
          hash: generateHash(),
          time: randomTimestamp(30) - i * 1440,
          value: avgValue + Math.floor(Math.random() * avgValue * 0.2),
          type: Math.random() > 0.5 ? 'received' : 'sent'
        }))
      ];
      break;
      
    case 'CP-TC-ER-02': // Lump sum detection
      txCount = 8;
      riskScore = 70;
      const lumpSumValue = scenario.data.transactionAmount * 100000000; // 75 BTC
      const lumpSumTx = {
        hash: generateHash(),
        time: randomTimestamp(1),
        value: lumpSumValue,
        type: 'received'
      };
      transactions = [
        lumpSumTx,
        ...Array.from({ length: txCount - 1 }, (_, i) => ({
          hash: generateHash(),
          time: randomTimestamp(30) - i * 86400,
          value: Math.floor(Math.random() * 500000000) + 10000000, // 0.1-5 BTC
          type: Math.random() > 0.5 ? 'received' : 'sent'
        }))
      ];
      break;
      
    case 'CP-TC-EX-01': // Export JSON
      txCount = 12;
      riskScore = scenario.data.riskScore;
      transactions = Array.from({ length: txCount }, (_, i) => ({
        hash: generateHash(),
        time: randomTimestamp(14) - i * 7200,
        value: Math.floor(Math.random() * 1000000000) + 10000000,
        type: Math.random() > 0.5 ? 'received' : 'sent'
      }));
      break;
      
    case 'CP-TC-RS-02': // Threshold change affects alerting
      txCount = 18;
      riskScore = scenario.data.riskScore; // 65
      transactions = Array.from({ length: txCount }, (_, i) => ({
        hash: generateHash(),
        time: randomTimestamp(7) - i * 3600,
        value: Math.floor(Math.random() * 500000000) + 50000000,
        type: Math.random() > 0.5 ? 'received' : 'sent'
      }));
      break;
      
    default:
      // Default case for any unhandled scenarios
      txCount = 10;
      riskScore = 30;
      transactions = Array.from({ length: txCount }, (_, i) => ({
        hash: generateHash(),
        time: randomTimestamp(7) - i * 3600,
        value: Math.floor(Math.random() * 1000000000) + 1000000,
        type: Math.random() > 0.5 ? 'received' : 'sent'
      }));
  }
  
  totalReceived = transactions
    .filter(tx => tx.type === 'received')
    .reduce((sum, tx) => sum + tx.value, 0);
  
  totalSent = transactions
    .filter(tx => tx.type === 'sent')
    .reduce((sum, tx) => sum + tx.value, 0);
  
  return {
    address: address || generateTestnetAddress(),
    total_received: totalReceived,
    total_sent: totalSent,
    balance: totalReceived - totalSent,
    n_tx: txCount,
    transactions,
    riskScore: riskScore || Math.floor(Math.random() * 100),
    scenario: scenario.id
  };
};

export const getTestnetAddress = (address) => {
  // Check if this address matches a test scenario
  const scenario = detectScenario(address);
  
  if (scenario) {
    // Generate data based on the specific test scenario
    return generateScenarioAddressData(address, scenario);
  }
  
  // Otherwise, use the legacy address type detection
  const addressType = determineAddressType(address);
  
  let txCount, transactions, totalReceived, totalSent;
  
  switch(addressType) {
    case 'high_frequency_short_span':
      // Rule 2: More than 10 transactions within a short time span
      txCount = 15; // Exceeds 10 transactions
      const shortSpanStart = randomTimestamp(1); // Within last 24 hours
      transactions = Array.from({ length: txCount }, (_, i) => ({
        hash: generateHash(),
        time: shortSpanStart - (i * 300), // Transactions every 5 minutes
        value: Math.floor(Math.random() * 500000000) + 10000000, // 0.1-5 BTC
        type: Math.random() > 0.5 ? 'received' : 'sent'
      }));
      break;
      
    case 'exceeds_monthly_average':
      // Rule 1: Transactions exceed monthly average
      // Simulate: Average is 20/month, but this month has 45
      txCount = 45;
      const monthStart = randomTimestamp(30);
      transactions = Array.from({ length: txCount }, (_, i) => ({
        hash: generateHash(),
        time: monthStart - (i * 1440), // Spread over the month
        value: Math.floor(Math.random() * 1000000000) + 1000000,
        type: Math.random() > 0.5 ? 'received' : 'sent'
      }));
      break;
      
    case 'lump_sum_transaction':
      // Rule 3: Very huge amount (lump sum transaction)
      txCount = 8; // Few transactions but one is huge
      const lumpSumTx = {
        hash: generateHash(),
        time: randomTimestamp(7),
        value: Math.floor(Math.random() * 50000000000) + 10000000000, // 100-500 BTC - HUGE
        type: 'received'
      };
      transactions = [
        lumpSumTx,
        ...Array.from({ length: txCount - 1 }, (_, i) => ({
          hash: generateHash(),
          time: randomTimestamp(30) - i * 86400,
          value: Math.floor(Math.random() * 1000000000) + 1000000, // Normal amounts
          type: Math.random() > 0.5 ? 'received' : 'sent'
        }))
      ];
      break;
      
    default:
      // Normal address
      txCount = Math.floor(Math.random() * 50) + 5;
      transactions = Array.from({ length: Math.min(txCount, 20) }, (_, i) => ({
        hash: generateHash(),
        time: randomTimestamp(30) - i * 3600,
        value: Math.floor(Math.random() * 1000000000) + 1000000,
        type: Math.random() > 0.5 ? 'received' : 'sent'
      }));
  }
  
  totalReceived = transactions
    .filter(tx => tx.type === 'received')
    .reduce((sum, tx) => sum + tx.value, 0);
  
  totalSent = transactions
    .filter(tx => tx.type === 'sent')
    .reduce((sum, tx) => sum + tx.value, 0);
  
  return {
    address: address || generateTestnetAddress(),
    total_received: totalReceived,
    total_sent: totalSent,
    balance: totalReceived - totalSent,
    n_tx: txCount,
    transactions
  };
};

// Helper function to determine address type based on address pattern
const determineAddressType = (address) => {
  if (!address) return 'normal';
  
  const addr = address.toLowerCase();
  
  // High frequency short span pattern
  if (addr.includes('highfreq') || addr.startsWith('mh') || addr.startsWith('nh')) {
    return 'high_frequency_short_span';
  }
  
  // Exceeds monthly average pattern
  if (addr.includes('exceeds') || addr.startsWith('me') || addr.startsWith('ne')) {
    return 'exceeds_monthly_average';
  }
  
  // Lump sum transaction pattern
  if (addr.includes('lumpsum') || addr.startsWith('ml') || addr.startsWith('nl')) {
    return 'lump_sum_transaction';
  }
  
  return 'normal';
};

// ==================== RECENT TRANSACTIONS MOCK DATA ====================

export const getTestnetRecentTransactionsList = (count = 20) => {
  const transactions = [];
  
  for (let i = 0; i < count; i++) {
    transactions.push({
      hash: generateHash(),
      time: randomTimestamp(7) - i * 300,
      amount: Math.random() * 10 + 0.001,
      fee: Math.random() * 0.001 + 0.0001,
      size: Math.floor(Math.random() * 500) + 200,
      confirmations: Math.floor(Math.random() * 100) + 1,
      block_height: 2500000 + Math.floor(Math.random() * 10000)
    });
  }
  
  return transactions;
};

// ==================== FORENSIC ANALYSIS MOCK DATA ====================

/**
 * Generate forensic analysis data for specific test scenarios
 */
const generateScenarioForensicData = (address, scenario) => {
  let riskScore, patterns, transactionCount, monthlyAverage;
  
  switch (scenario.id) {
    case 'CP-TC-WM-01': // Alert triggers
      riskScore = scenario.data.riskScore;
      transactionCount = 25;
      patterns = scenario.data.patterns.map(type => ({
        type,
        severity: 'high',
        count: 5,
        description: `Pattern "${type}" detected - Risk score ${riskScore} exceeds threshold`
      }));
      break;
      
    case 'CP-TC-WM-02': // No alert (rules disabled)
      riskScore = scenario.data.riskScore;
      transactionCount = 30;
      patterns = []; // No patterns when rules disabled
      break;
      
    case 'CP-TC-EM-01': // Successful email
      riskScore = scenario.data.riskScore;
      transactionCount = 15;
      patterns = scenario.data.patterns.map(type => ({
        type,
        severity: 'high',
        count: 3,
        description: `Email alert triggered for ${type} pattern`
      }));
      break;
      
    case 'CP-TC-EM-02': // Email failure
      riskScore = scenario.data.riskScore;
      transactionCount = 20;
      patterns = scenario.data.patterns.map(type => ({
        type,
        severity: 'high',
        count: 4,
        description: `Email delivery failed for ${type} pattern - ${scenario.data.error}`
      }));
      break;
      
    case 'CP-TC-PD-01': // Fast succession
      riskScore = 65;
      transactionCount = scenario.data.transactionCount;
      patterns = [{
        type: scenario.expected.patternDetected,
        severity: scenario.expected.severity,
        count: transactionCount,
        description: `Fast succession pattern: ${transactionCount} transactions within ${scenario.data.timeWindow}`
      }];
      break;
      
    case 'CP-TC-PD-02': // Mixer/tumbler
      riskScore = 85;
      transactionCount = scenario.data.inputCount;
      patterns = [{
        type: scenario.expected.patternDetected,
        severity: scenario.expected.severity,
        count: 1,
        description: scenario.expected.evidenceNotes
      }];
      break;
      
    case 'CP-TC-ER-01': // Monthly average breach
      riskScore = 55;
      transactionCount = scenario.data.transactionCount;
      monthlyAverage = scenario.data.monthlyAverage;
      patterns = [{
        type: 'exceeds_monthly_average',
        severity: 'medium',
        count: transactionCount,
        description: scenario.expected.details
      }];
      break;
      
    case 'CP-TC-ER-02': // Lump sum
      riskScore = 70;
      transactionCount = 8;
      patterns = [{
        type: 'lump_sum_transaction',
        severity: scenario.expected.severity,
        count: 1,
        description: scenario.expected.details
      }];
      break;
      
    case 'CP-TC-EX-01': // Export JSON
      riskScore = scenario.data.riskScore;
      transactionCount = 12;
      patterns = scenario.data.patterns.map(type => ({
        type,
        severity: 'medium',
        count: 2,
        description: `Pattern "${type}" ready for export`
      }));
      break;
      
    case 'CP-TC-RS-01': // Deterministic scoring
      riskScore = scenario.expected.run1Score;
      transactionCount = scenario.data.inputs + scenario.data.outputs;
      patterns = scenario.data.patterns.map(type => ({
        type,
        severity: 'medium',
        count: 1,
        description: `Deterministic pattern "${type}" detected`
      }));
      break;
      
    case 'CP-TC-RS-02': // Threshold change
      riskScore = scenario.data.riskScore;
      transactionCount = 18;
      patterns = [{
        type: 'threshold_test',
        severity: 'medium',
        count: 1,
        description: `Risk score ${riskScore} - Test with different thresholds`
      }];
      break;
      
    default:
      riskScore = 30;
      transactionCount = 10;
      patterns = [{
        type: 'normal_activity',
        severity: 'low',
        count: 1,
        description: 'Normal activity for test scenario'
      }];
  }
  
  return {
    address: address || generateTestnetAddress(),
    riskScore,
    riskLevel: riskScore >= 70 ? 'critical' : riskScore >= 50 ? 'high' : riskScore >= 30 ? 'medium' : 'low',
    patterns,
    timestamp: new Date().toISOString(),
    transactionCount,
    monthlyAverage: monthlyAverage || 20,
    totalVolume: Math.random() * 100 + 10,
    firstSeen: randomTimestamp(365),
    lastSeen: randomTimestamp(1),
    scenario: scenario.id
  };
};

export const getTestnetForensicAnalysis = (address) => {
  // Check if this address matches a test scenario
  const scenario = detectScenario(address);
  
  if (scenario) {
    return generateScenarioForensicData(address, scenario);
  }
  
  // Otherwise, use the legacy address type detection
  const addressType = determineAddressType(address);
  let riskScore = 0;
  const patterns = [];
  let transactionCount = 0;
  let monthlyAverage = 20; // Default monthly average
  
  switch(addressType) {
    case 'high_frequency_short_span':
      // Rule 2: More than 10 transactions within a short time span
      transactionCount = 15;
      riskScore = 65;
      patterns.push({
        type: 'high_frequency_short_span',
        severity: 'high',
        count: transactionCount,
        description: `Flagged: Wallet address has ${transactionCount} transactions within a short time span (exceeds 10 transaction threshold) - Possible automated trading or suspicious activity`
      });
      break;
      
    case 'exceeds_monthly_average':
      // Rule 1: Transactions exceed monthly average
      transactionCount = 45;
      monthlyAverage = 20;
      riskScore = 55;
      patterns.push({
        type: 'exceeds_monthly_average',
        severity: 'medium',
        count: transactionCount,
        description: `Flagged: Wallet has ${transactionCount} transactions this month, exceeding the monthly average of ${monthlyAverage} transactions - Unusual activity pattern detected`
      });
      break;
      
    case 'lump_sum_transaction':
      // Rule 3: Very huge amount (lump sum transaction)
      transactionCount = 8;
      riskScore = 70;
      const lumpSumAmount = Math.floor(Math.random() * 50000000000) + 10000000000; // 100-500 BTC
      patterns.push({
        type: 'lump_sum_transaction',
        severity: 'high',
        count: 1,
        description: `Flagged: Lump sum transaction detected - Very huge amount of ${(lumpSumAmount / 100000000).toFixed(2)} BTC in a single transaction - Exceeds normal transaction patterns`
      });
      break;
      
    default:
      // Normal address
      transactionCount = Math.floor(Math.random() * 50) + 5;
      riskScore = Math.floor(Math.random() * 30);
      if (riskScore > 20) {
        patterns.push({
          type: 'normal_activity',
          severity: 'low',
          count: transactionCount,
          description: 'Normal transaction activity detected'
        });
      }
  }
  
  return {
    address: address || generateTestnetAddress(),
    riskScore,
    riskLevel: riskScore > 70 ? 'high' : riskScore > 50 ? 'medium' : riskScore > 30 ? 'low' : 'minimal',
    patterns,
    timestamp: new Date().toISOString(),
    transactionCount,
    monthlyAverage,
    totalVolume: Math.random() * 100 + 10,
    firstSeen: randomTimestamp(365),
    lastSeen: randomTimestamp(1)
  };
};

// ==================== MULTI-CHAIN MOCK DATA ====================

export const getTestnetMultiChainData = (network, searchType, query) => {
  if (searchType === 'address') {
    return {
      address: query || generateTestnetAddress(),
      balance: Math.random() * 100,
      totalReceived: Math.random() * 1000,
      totalSent: Math.random() * 900,
      transactionCount: Math.floor(Math.random() * 50) + 5,
      riskScore: Math.floor(Math.random() * 100),
      riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      transactions: Array.from({ length: 15 }, (_, i) => ({
        hash: generateHash(),
        time: new Date(Date.now() - i * 86400000).toISOString(),
        amount: Math.random() * 10,
        type: Math.random() > 0.5 ? 'received' : 'sent',
        confirmations: Math.floor(Math.random() * 1000) + 1,
        risk: Math.random() > 0.8 ? 'high' : Math.random() > 0.6 ? 'medium' : 'low'
      }))
    };
  } else if (searchType === 'transaction') {
    return {
      hash: query || generateHash(),
      network,
      time: new Date().toISOString(),
      amount: Math.random() * 50,
      fee: Math.random() * 0.01,
      inputs: Math.floor(Math.random() * 5) + 1,
      outputs: Math.floor(Math.random() * 10) + 1,
      confirmations: Math.floor(Math.random() * 100) + 1,
      riskScore: Math.floor(Math.random() * 100)
    };
  }
  
  return null;
};

// ==================== PATTERN DETECTION MOCK DATA ====================

export const getTestnetPatternDetection = (transaction) => {
  if (!transaction) {
    return {
      riskScore: 0,
      patterns: [],
      timestamp: new Date().toISOString(),
      transactionHash: generateHash()
    };
  }
  
  const inputCount = transaction.inputs?.length || transaction.vin?.length || 0;
  const outputCount = transaction.out?.length || transaction.vout?.length || 0;
  const totalInput = (transaction.inputs || transaction.vin || []).reduce((sum, input) => {
    const value = input.prev_out?.value || input.value || 0;
    // If value is less than 1, it's likely in BTC, convert to satoshis
    return sum + (value < 1 ? value * 100000000 : value);
  }, 0);
  const totalOutput = (transaction.out || transaction.vout || []).reduce((sum, output) => {
    let value = output.value || 0;
    // If value is less than 1, it's likely in BTC, convert to satoshis
    if (value < 1 && value > 0) {
      value = value * 100000000;
    }
    // If scriptPubKey exists but no value, try to get from scriptPubKey
    if (!value && output.scriptPubKey && output.scriptPubKey.value) {
      value = output.scriptPubKey.value;
      if (value < 1) value = value * 100000000;
    }
    return sum + value;
  }, 0);
  const fee = totalInput - totalOutput;
  
  let riskScore = 0;
  const patterns = [];
  
  // Detect single sender, single receiver, no change (all funds sent) - MEDIUM RISK
  if (inputCount === 1 && outputCount === 1) {
    const outputs = transaction.out || transaction.vout || [];
    const inputs = transaction.inputs || transaction.vin || [];
    let inputValue = inputs[0]?.prev_out?.value || inputs[0]?.value || 0;
    // Convert to satoshis if in BTC
    if (inputValue < 1 && inputValue > 0) inputValue = inputValue * 100000000;
    
    let outputValue = outputs[0]?.value || 0;
    // Convert to satoshis if in BTC
    if (outputValue < 1 && outputValue > 0) outputValue = outputValue * 100000000;
    // Try scriptPubKey if no value
    if (!outputValue && outputs[0]?.scriptPubKey?.value) {
      outputValue = outputs[0].scriptPubKey.value;
      if (outputValue < 1) outputValue = outputValue * 100000000;
    }
    const feeAmount = inputValue - outputValue;
    const feePercentage = (feeAmount / inputValue) * 100;
    
    // If fee is very small compared to transaction, it's suspicious (all funds sent)
    if (feePercentage < 1) {
      riskScore += 30;
      patterns.push({
        type: 'all_funds_sent',
        severity: 'medium',
        description: `Single sender sent all funds to single receiver with no change address - possible final transaction or fund movement`
      });
    }
    
    // If it's a large transaction
    if (inputValue > 10000000000) { // > 100 BTC
      riskScore += 20;
      patterns.push({
        type: 'large_single_transaction',
        severity: 'medium',
        description: `Large single transaction: ${(inputValue / 100000000).toFixed(2)} BTC sent in one transaction`
      });
    }
  }
  
  // Detect single sender, two receivers (peeling chain or split) - MEDIUM/HIGH RISK
  if (inputCount === 1 && outputCount === 2) {
    const outputs = transaction.out || transaction.vout || [];
    let output1 = outputs[0]?.value || 0;
    let output2 = outputs[1]?.value || 0;
    // Convert to satoshis if in BTC
    if (output1 < 1 && output1 > 0) output1 = output1 * 100000000;
    if (output2 < 1 && output2 > 0) output2 = output2 * 100000000;
    // Try scriptPubKey if no value
    if (!output1 && outputs[0]?.scriptPubKey?.value) {
      output1 = outputs[0].scriptPubKey.value;
      if (output1 < 1) output1 = output1 * 100000000;
    }
    if (!output2 && outputs[1]?.scriptPubKey?.value) {
      output2 = outputs[1].scriptPubKey.value;
      if (output2 < 1) output2 = output2 * 100000000;
    }
    const smaller = Math.min(output1, output2);
    const larger = Math.max(output1, output2);
    const ratio = larger > 0 ? smaller / larger : 0;
    
    // Peeling chain: one very small output, one large (change)
    if (ratio < 0.1) {
      riskScore += 45;
      patterns.push({
        type: 'peeling_chain',
        severity: 'high',
        description: `Peeling chain pattern detected: One input split into small output (${(smaller / 100000000).toFixed(4)} BTC) and large output (${(larger / 100000000).toFixed(2)} BTC) - possible mixing or fund obfuscation`
      });
    } else {
      // Normal split transaction
      riskScore += 10;
      patterns.push({
        type: 'fund_split',
        severity: 'low',
        description: `Funds split between two receivers: ${(output1 / 100000000).toFixed(2)} BTC and ${(output2 / 100000000).toFixed(2)} BTC`
      });
    }
  }
  
  // Detect multiple inputs, few outputs (no change) - HIGH RISK
  if (inputCount > outputCount && inputCount >= 5) {
    riskScore += 40;
    patterns.push({
      type: 'multiple_inputs_consolidation',
      severity: 'high',
      description: `Multiple inputs (${inputCount}) consolidated into fewer outputs (${outputCount}) with no change address - possible mixing or consolidation`
    });
  }
  
  // Detect CoinJoin pattern (many inputs, many outputs, similar amounts)
  if (inputCount >= 8 && outputCount >= 8) {
    riskScore += 50;
    patterns.push({
      type: 'coinjoin',
      severity: 'critical',
      description: `CoinJoin transaction detected: ${inputCount} inputs and ${outputCount} outputs with similar amounts`
    });
  }
  
  // Detect peeling chain (one input, small output + large change)
  if (inputCount === 1 && outputCount === 2) {
    const outputs = transaction.out || transaction.vout || [];
    if (outputs.length === 2) {
      const output1 = outputs[0].value || (outputs[0].scriptPubKey ? outputs[0].value * 100000000 : 0);
      const output2 = outputs[1].value || (outputs[1].scriptPubKey ? outputs[1].value * 100000000 : 0);
      const smaller = Math.min(output1, output2);
      const larger = Math.max(output1, output2);
      
      if (smaller < larger * 0.1) { // Small output is less than 10% of larger
        riskScore += 35;
        patterns.push({
          type: 'peeling_chain',
          severity: 'high',
          description: 'Peeling chain pattern: One input split into small output and large change'
        });
      }
    }
  }
  
  // Detect consolidation (many small inputs, few outputs)
  if (inputCount >= 10 && outputCount <= 2) {
    riskScore += 30;
    patterns.push({
      type: 'consolidation',
      severity: 'medium',
      description: `Consolidation pattern: ${inputCount} small inputs consolidated into ${outputCount} output(s)`
    });
  }
  
  // Detect no change address (all inputs go to outputs)
  const hasChangeAddress = (transaction.out || transaction.vout || []).some(output => {
    const outputAddr = output.addr || output.scriptPubKey?.addresses?.[0];
    return (transaction.inputs || transaction.vin || []).some(input => {
      const inputAddr = input.prev_out?.addr || input.addr;
      return inputAddr === outputAddr;
    });
  });
  
  if (!hasChangeAddress && inputCount > 1 && outputCount < inputCount) {
    riskScore += 25;
    patterns.push({
      type: 'no_change_address',
      severity: 'medium',
      description: `No change address detected: ${inputCount} inputs sent to ${outputCount} outputs with no change returned`
    });
  }
  
  // Detect round amounts
  const hasRoundAmounts = (transaction.out || transaction.vout || []).some(output => {
    const value = output.value || (output.scriptPubKey ? output.value * 100000000 : 0);
    return value % 1000000000 === 0; // Exactly 1 BTC or multiple
  });
  
  if (hasRoundAmounts) {
    riskScore += 15;
    patterns.push({
      type: 'round_amounts',
      severity: 'low',
      description: 'Round amount transactions detected'
    });
  }
  
  // Detect high frequency (if we had transaction history)
  if (inputCount > 5) {
    riskScore += 10;
  }
  
  // Rule 3: Detect lump sum transaction (very huge amount)
  if (totalInput > 10000000000) { // > 100 BTC
    riskScore += 35;
    patterns.push({
      type: 'lump_sum_transaction',
      severity: 'high',
      description: `Lump sum transaction detected: ${(totalInput / 100000000).toFixed(2)} BTC - Very huge amount that exceeds normal transaction patterns`
    });
  }
  
  // Cap risk score at 100
  riskScore = Math.min(riskScore, 100);
  
  // Determine severity level
  let severityLevel = 'minimal';
  if (riskScore >= 70) severityLevel = 'critical';
  else if (riskScore >= 50) severityLevel = 'high';
  else if (riskScore >= 30) severityLevel = 'medium';
  else if (riskScore >= 10) severityLevel = 'low';
  
  return {
    riskScore,
    patterns,
    severityLevel,
    timestamp: new Date().toISOString(),
    transactionHash: transaction.hash || transaction.txid || generateHash(),
    inputCount,
    outputCount,
    hasChangeAddress
  };
};

// ==================== WALLET MONITOR MOCK DATA ====================

export const getTestnetWalletMonitorData = (addresses) => {
  return addresses.map(address => {
    const addressType = determineAddressType(address);
    let balance, transactionCount, riskScore, alerts;
    
    switch(addressType) {
      case 'high_frequency_short_span':
        // Rule 2: More than 10 transactions within a short time span
        balance = Math.random() * 50 + 10;
        transactionCount = 15;
        riskScore = 65;
        alerts = [
          { 
            type: 'high_frequency', 
            severity: 'high',
            message: '🚨 FLAGGED: Wallet has 15 transactions within a short time span (exceeds 10 transaction threshold)', 
            time: randomTimestamp(1),
            details: 'Possible automated trading or suspicious activity detected'
          },
          { 
            type: 'burst_activity', 
            severity: 'high',
            message: 'Burst activity detected - 15 transactions in less than 24 hours', 
            time: randomTimestamp(1) 
          }
        ];
        break;
        
      case 'exceeds_monthly_average':
        // Rule 1: Transactions exceed monthly average
        balance = Math.random() * 80 + 20;
        transactionCount = 45;
        riskScore = 55;
        const monthlyAverage = 20;
        alerts = [
          { 
            type: 'exceeds_average', 
            severity: 'medium',
            message: `⚠️ FLAGGED: Wallet has ${transactionCount} transactions this month, exceeding monthly average of ${monthlyAverage} transactions`, 
            time: randomTimestamp(2),
            details: 'Unusual activity pattern detected - significantly higher than normal'
          },
          { 
            type: 'unusual_pattern', 
            severity: 'medium',
            message: `Transaction frequency up ${Math.floor((transactionCount / monthlyAverage - 1) * 100)}% from average`, 
            time: randomTimestamp(3) 
          }
        ];
        break;
        
      case 'lump_sum_transaction':
        // Rule 3: Very huge amount (lump sum transaction)
        const lumpSumAmount = (Math.random() * 400 + 100); // 100-500 BTC
        balance = lumpSumAmount;
        transactionCount = 8;
        riskScore = 70;
        alerts = [
          { 
            type: 'lump_sum', 
            severity: 'high',
            message: `🚨 FLAGGED: Lump sum transaction detected - ${lumpSumAmount.toFixed(2)} BTC`, 
            time: randomTimestamp(1),
            details: 'Very huge amount that exceeds normal transaction patterns'
          },
          { 
            type: 'large_transfer', 
            severity: 'high',
            message: `Single transaction value of ${lumpSumAmount.toFixed(2)} BTC detected - Requires investigation`, 
            time: randomTimestamp(1) 
          }
        ];
        break;
        
      default:
        // Normal wallet
        balance = Math.random() * 10 + 1;
        transactionCount = Math.floor(Math.random() * 25) + 5;
        riskScore = Math.floor(Math.random() * 30);
        alerts = Math.random() > 0.8 ? [
          { 
            type: 'new_transaction', 
            severity: 'info',
            message: 'New transaction detected', 
            time: randomTimestamp(1) 
          }
        ] : [];
    }
    
    return {
      address,
      balance,
      lastActivity: randomTimestamp(7),
      transactionCount,
      riskScore,
      alerts,
      monthlyAverage: addressType === 'exceeds_monthly_average' ? 20 : transactionCount,
      activityStatus: addressType === 'high_frequency_short_span' ? 'burst' : 
                      addressType === 'exceeds_monthly_average' ? 'elevated' :
                      addressType === 'lump_sum_transaction' ? 'high_value' : 'normal'
    };
  });
};

// ==================== EXCHANGE DETECTION MOCK DATA ====================

export const getTestnetExchangeDetection = (address) => {
  const exchanges = ['Testnet Exchange 1', 'Testnet Exchange 2', 'Testnet DEX'];
  const isExchange = Math.random() > 0.5;
  
  return {
    address: address || generateTestnetAddress(),
    isExchange,
    exchangeName: isExchange ? exchanges[Math.floor(Math.random() * exchanges.length)] : null,
    confidence: isExchange ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30),
    evidence: isExchange ? [
      { type: 'address_pattern', description: 'Matches known exchange address pattern' },
      { type: 'transaction_volume', description: 'High transaction volume consistent with exchange' }
    ] : []
  };
};

