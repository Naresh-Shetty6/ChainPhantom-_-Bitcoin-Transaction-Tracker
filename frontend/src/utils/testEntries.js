// Test entries for ChainPhantom - Copy and paste these for testing

/**
 * 📍 HOW TO USE:
 * 
 * FOR ADDRESSES (Wallet Monitor, Address Details, Forensic Analysis):
 * - Use values from testEntries.addresses
 * - Navigate to /wallet-monitor to add to monitoring
 * - Or use /address/{address} for direct analysis
 * 
 * FOR TRANSACTIONS (Transaction Details):
 * - Use values from testEntries.transactions  
 * - Navigate to /transaction/{txHash}
 * 
 * QUICK START:
 * import { testEntries, quickCopyAddresses, quickCopyTransactions } from './testEntries';
 */

export const testEntries = {
  // ==================== TESTNET ADDRESSES (For Wallet Monitor & Address Details) ====================
  addresses: {
    // Rule 1: Exceeds monthly average transactions
    exceedsMonthlyAverage: "meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
    
    // Rule 2: High frequency short span (>10 transactions in short time)
    highFrequencyShortSpan: "mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
    
    // Rule 3: Lump sum transaction (very huge amount)
    lumpSumTransaction: "mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
    
    // High-risk address (mixing patterns)
    highRisk: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
    
    // Exchange address (high volume, low risk)
    exchange: "n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y",
    
    // Normal user address (low risk)
    normal: "2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
    
    // P2PKH addresses (legacy)
    p2pkh1: "mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn",
    p2pkh2: "n1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q",
    
    // P2SH addresses (script hash)
    p2sh1: "2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
    p2sh2: "2N1AbCdEfGhIjKlMnOpQrStUvWxYz123456",
    
    // Bech32 addresses (native SegWit)
    bech32: "tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    bech32_2: "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx",
    
    // Additional test addresses
    test1: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
    test2: "n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y",
    test3: "2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
    test4: "mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn",
    test5: "tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  },

  // ==================== TESTNET TRANSACTION HASHES ====================
  transactions: {
    // ChainPhantom Rules - Transaction-based detection
    rule1ExceedsMonthlyAverage: "f1rule1exceedsmonthlyaverage890abcdef1234567890abcdef123456789012",
    rule2HighFrequencyShortSpan: "f2rule2highfrequencyshortspan90abcdef1234567890abcdef123456789012",
    rule3LumpSumTransaction: "f3rule3lumpsumtransaction90abcdef1234567890abcdef1234567890abcdef",
    
    // Single sender, single receiver (no change) - MEDIUM RISK
    singleSenderSingleReceiver: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    
    // Single sender, two receivers (peeling chain) - HIGH RISK
    singleSenderTwoReceivers: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
    
    // Multiple inputs, few outputs (no change) - HIGH RISK
    multipleInputsFewOutputs: "c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
    
    // CoinJoin transaction (multiple inputs/outputs)
    coinJoin: "d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890",
    
    // Consolidation (many small inputs, few outputs)
    consolidation: "e5f6789012345678901234567890abcdef1234567890abcdef1234567890ab",
    
    // Normal transaction
    normal: "f6789012345678901234567890abcdef1234567890abcdef1234567890abcd",
    
    // High-value transaction
    highValue: "6789012345678901234567890abcdef1234567890abcdef1234567890abcdef",
    
    // Recent transaction
    recent: "789012345678901234567890abcdef1234567890abcdef1234567890abcdef12",
    
    // Additional test transactions
    test1: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456", // Single sender, single receiver
    test2: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567", // Single sender, two receivers
    test3: "c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678", // Multiple inputs, few outputs
    test4: "d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890", // CoinJoin
    test5: "e5f6789012345678901234567890abcdef1234567890abcdef1234567890ab"  // Consolidation
  },

  // ==================== TESTNET BLOCK HEIGHTS ====================
  blocks: {
    // Recent blocks
    recent1: "2503456",
    recent2: "2503455",
    recent3: "2503454",
    recent4: "2503453",
    recent5: "2503452",
    
    // Older blocks
    old1: "2500000",
    old2: "2499999",
    old3: "2499998",
    
    // Test block heights
    test1: "2503456",
    test2: "2503455",
    test3: "2503454"
  },

  // ==================== TESTNET BLOCK HASHES ====================
  blockHashes: {
    block1: "0000000000000000000a1b2c3d4e5f6789012345678901234567890abcdef12",
    block2: "0000000000000000000b2c3d4e5f6789012345678901234567890abcdef1234",
    block3: "0000000000000000000c3d4e5f6789012345678901234567890abcdef123456",
    block4: "0000000000000000000d4e5f6789012345678901234567890abcdef12345678",
    block5: "0000000000000000000e5f6789012345678901234567890abcdef1234567890"
  },

  // ==================== QUICK TEST SCENARIOS ====================
  scenarios: {
    // Rule 1: Exceeds monthly average
    exceedsMonthlyAverage: {
      address: "meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
      expectedRisk: "medium",
      expectedPattern: "exceeds_monthly_average",
      description: "Wallet flagged: Number of transactions exceeds monthly average (45 transactions vs 20 average)"
    },
    
    // Rule 2: High frequency short span
    highFrequencyShortSpan: {
      address: "mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
      expectedRisk: "high",
      expectedPattern: "high_frequency_short_span",
      description: "Wallet flagged: More than 10 transactions within a short time span (15 transactions in <24 hours)"
    },
    
    // Rule 3: Lump sum transaction
    lumpSumTransaction: {
      address: "mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
      expectedRisk: "high",
      expectedPattern: "lump_sum_transaction",
      description: "Wallet flagged: Lump sum transaction with very huge amount (100-500 BTC)"
    },
    
    // Test high-risk address analysis
    highRiskAnalysis: {
      address: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
      expectedRisk: "high",
      description: "Address with mixing patterns and high transaction frequency"
    },
    
    // Test exchange detection
    exchangeDetection: {
      address: "n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y",
      expectedType: "exchange",
      description: "Exchange address with high volume and low risk"
    },
    
    // Test normal user
    normalUser: {
      address: "2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
      expectedRisk: "low",
      description: "Normal user address with minimal risk"
    },
    
    // Test single sender, single receiver (no change)
    singleSenderSingleReceiver: {
      hash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      expectedPattern: "all_funds_sent",
      expectedRisk: "medium",
      description: "Single sender address sending all funds to single receiver address with no change"
    },
    
    // Test single sender, two receivers (peeling chain)
    singleSenderTwoReceivers: {
      hash: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
      expectedPattern: "peeling_chain",
      expectedRisk: "high",
      description: "Single sender address split into two receiver addresses (peeling chain pattern)"
    },
    
    // Test multiple inputs, few outputs (no change)
    multipleInputsFewOutputs: {
      hash: "c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
      expectedPattern: "multiple_inputs_consolidation",
      expectedRisk: "high",
      description: "Transaction with many sender addresses but fewer receiver addresses, no change address"
    },
    
    // Test CoinJoin transaction
    coinJoinTx: {
      hash: "d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890",
      expectedPattern: "coinjoin",
      expectedRisk: "critical",
      description: "CoinJoin transaction with multiple inputs and outputs"
    },
    
    // Test consolidation
    consolidationTx: {
      hash: "e5f6789012345678901234567890abcdef1234567890abcdef1234567890ab",
      expectedPattern: "consolidation",
      expectedRisk: "medium",
      description: "Many small inputs consolidated into few outputs"
    }
  }
};

// ==================== QUICK COPY-PASTE STRINGS ====================

export const quickTestEntries = {
  // Copy these directly into search boxes
  
  // Addresses (for address search)
  // Chain Phantom Rules Test Cases
  addressExceedsMonthlyAverage: "meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc", // Rule 1: Exceeds monthly average
  addressHighFrequencyShortSpan: "mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc", // Rule 2: >10 transactions in short span
  addressLumpSumTransaction: "mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc", // Rule 3: Very huge amount
  
  addressHighRisk: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
  addressExchange: "n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y",
  addressNormal: "2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
  addressP2PKH: "mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn",
  addressP2SH: "2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
  addressBech32: "tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  
  // Transactions (for transaction search)
  // ChainPhantom Rules Test Transactions
  txRule1ExceedsMonthlyAverage: "f1rule1exceedsmonthlyaverage890abcdef1234567890abcdef123456789012", // Rule 1: Lump sum (testing on tx page)
  txRule2HighFrequencyShortSpan: "f2rule2highfrequencyshortspan90abcdef1234567890abcdef123456789012", // Rule 2: Lump sum (testing on tx page)
  txRule3LumpSumTransaction: "f3rule3lumpsumtransaction90abcdef1234567890abcdef1234567890abcdef", // Rule 3: Lump sum > 100 BTC
  
  txSingleSenderSingleReceiver: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456", // 1 sender, 1 receiver, no change
  txSingleSenderTwoReceivers: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567", // 1 sender, 2 receivers (peeling chain)
  txMultipleInputsFewOutputs: "c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678", // More senders than receivers, no change
  txCoinJoin: "d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890", // CoinJoin pattern
  txConsolidation: "e5f6789012345678901234567890abcdef1234567890abcdef1234567890ab", // Consolidation
  txNormal: "f6789012345678901234567890abcdef1234567890abcdef1234567890abcd", // Normal transaction
  txHighValue: "6789012345678901234567890abcdef1234567890abcdef1234567890abcdef", // High value
  txRecent: "789012345678901234567890abcdef1234567890abcdef1234567890abcdef12", // Recent
  
  // Blocks (for block search)
  blockRecent: "2503456",
  blockOld: "2500000",
  blockHash: "0000000000000000000a1b2c3d4e5f6789012345678901234567890abcdef12"
};

// ==================== TESTING CHECKLIST ====================

export const testingChecklist = {
  addressTests: [
    {
      test: "High-risk address analysis",
      entry: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
      expected: "High risk score, mixing patterns detected"
    },
    {
      test: "Exchange address detection",
      entry: "n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y",
      expected: "Exchange identified, high volume, low risk"
    },
    {
      test: "Normal user address",
      entry: "2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
      expected: "Low risk, normal transaction patterns"
    },
    {
      test: "P2PKH address format",
      entry: "mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn",
      expected: "Legacy address format recognized"
    },
    {
      test: "Bech32 address format",
      entry: "tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      expected: "Native SegWit address format recognized"
    }
  ],
  
  transactionTests: [
    {
      test: "CoinJoin transaction",
      entry: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      expected: "CoinJoin pattern detected, multiple inputs/outputs"
    },
    {
      test: "Peeling chain transaction",
      entry: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
      expected: "Peeling chain pattern detected"
    },
    {
      test: "Normal transaction",
      entry: "c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
      expected: "Standard transaction, low risk"
    }
  ],
  
  blockTests: [
    {
      test: "Recent block by height",
      entry: "2503456",
      expected: "Block details with recent transactions"
    },
    {
      test: "Block by hash",
      entry: "0000000000000000000a1b2c3d4e5f6789012345678901234567890abcdef12",
      expected: "Block details retrieved"
    }
  ],
  
  featureTests: [
    {
      feature: "Dashboard",
      test: "View dashboard in testnet mode",
      expected: "Mock data displayed for blocks, transactions, mempool"
    },
    {
      feature: "Network Stats",
      test: "View network statistics",
      expected: "Testnet network stats with lower hashrate"
    },
    {
      feature: "Forensic Analysis",
      test: "Analyze high-risk address",
      entry: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
      expected: "Risk patterns detected and displayed"
    },
    {
      feature: "Multi-Chain Analysis",
      test: "Search address across chains",
      entry: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
      expected: "Multi-chain data displayed"
    },
    {
      feature: "Transaction Details",
      test: "View transaction with patterns",
      entry: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      expected: "Transaction details with pattern detection"
    },
    {
      feature: "Wallet Monitor",
      test: "Monitor multiple addresses",
      entries: [
        "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
        "n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y",
        "2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc"
      ],
      expected: "Multiple addresses monitored with alerts"
    }
  ]
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get a random test address
 */
export const getRandomAddress = () => {
  const addresses = Object.values(testEntries.addresses);
  return addresses[Math.floor(Math.random() * addresses.length)];
};

/**
 * Get a random test transaction hash
 */
export const getRandomTransaction = () => {
  const transactions = Object.values(testEntries.transactions);
  return transactions[Math.floor(Math.random() * transactions.length)];
};

/**
 * Get a random test block height
 */
export const getRandomBlock = () => {
  const blocks = Object.values(testEntries.blocks);
  return blocks[Math.floor(Math.random() * blocks.length)];
};

/**
 * Get all addresses as an array
 */
export const getAllAddresses = () => {
  return Object.values(testEntries.addresses);
};

/**
 * Get all transaction hashes as an array
 */
export const getAllTransactions = () => {
  return Object.values(testEntries.transactions);
};

/**
 * Get all block heights as an array
 */
export const getAllBlocks = () => {
  return Object.values(testEntries.blocks);
};

// ==================== QUICK COPY REFERENCES ====================

/**
 * 🔖 QUICK COPY: ADDRESSES FOR WALLET MONITOR
 * Copy these into the Wallet Monitor input field at /wallet-monitor
 */
export const quickCopyAddresses = {
  // Original 3 ChainPhantom Rules
  rule1_exceedsMonthlyAverage: 'meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc',
  rule2_highFrequencyShortSpan: 'mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc',
  rule3_lumpSumTransaction: 'mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc',
  
  // Comprehensive Test Scenarios
  WM01_alertTrigger: 'mwm01AlertTriggerWallet1234567890abcdef',
  WM02_noAlert: 'mwm02NoAlertRulesDisabled1234567890abcdef',
  EM01_emailSuccess: 'mem01SuccessfulSMTPSend1234567890abcdef',
  EM02_emailFailure: 'mem02SMTPFailureHandling1234567890abcdef',
  PD01_fastSuccession: 'mpd01FastSuccessionWallet1234567890abcdef',
  ER01_monthlyAverage: 'mer01MonthlyAverageBreached1234567890abcdef',
  ER02_lumpSum: 'mer02LumpSumDetection1234567890abcdef',
  EX01_exportJSON: 'mex01ExportJSONAnalysis1234567890abcdef',
  RS02_thresholdTest: 'mrs02ThresholdChange1234567890abcdef',
  PR01_persistWallet1: 'mpr01WalletPersist1A1234567890abcdef',
  PR01_persistWallet2: 'mpr01WalletPersist1B1234567890abcdef'
};

/**
 * 🔖 QUICK COPY: TRANSACTIONS FOR TRANSACTION DETAILS
 * Copy these into the URL: /transaction/{hash}
 */
export const quickCopyTransactions = {
  // Original Transaction Patterns
  singleSender: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
  twoReceivers: 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
  multipleInputs: 'c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
  coinJoin: 'd4e5f6789012345678901234567890abcdef1234567890abcdef1234567890',
  consolidation: 'e5f6789012345678901234567890abcdef1234567890abcdef1234567890ab',
  
  // Comprehensive Test Scenarios
  PD01_fastSuccession: 'tpd01fastsuccession1234567890abcdef1234567890abcdef',
  PD02_mixer: 'tpd02mixertumbler1234567890abcdef1234567890abcdef',
  ER02_lumpSum: 'ter02lumpsum1234567890abcdef1234567890abcdef',
  TX01_validTx: 'ttx01validbtctxid1234567890abcdef1234567890abcdef',
  TX02_invalidTx: 'invalid_tx_format',
  MC01_ethereum: '0xtmc01ethtxdetails1234567890abcdef1234567890abcdef',
  RS01_deterministic: 'trs01deterministicscoring1234567890abcdef',
  PF02_childCap: 'tpf02childtxcap1234567890abcdef1234567890abcdef'
};

/**
 * 📋 USAGE EXAMPLES
 */
export const usageExamples = {
  // Example 1: Testing Wallet Monitor
  walletMonitor: {
    page: '/wallet-monitor',
    input: quickCopyAddresses.WM01_alertTrigger,
    expectedResult: 'Risk score: 55, Alert triggered'
  },
  
  // Example 2: Testing Address Details
  addressDetails: {
    page: '/address/' + quickCopyAddresses.rule3_lumpSumTransaction,
    expectedResult: 'Risk score: 70, Pattern: lump_sum_transaction'
  },
  
  // Example 3: Testing Transaction Details
  transactionDetails: {
    page: '/transaction/' + quickCopyTransactions.PD01_fastSuccession,
    expectedResult: 'Pattern: fast_succession, Severity: medium'
  }
};

/**
 * 🎯 GET TEST DATA BY USE CASE
 */
export const getTestDataByUseCase = (useCase) => {
  const useCases = {
    'wallet-monitor': Object.values(quickCopyAddresses),
    'address-details': Object.values(quickCopyAddresses),
    'transaction-details': Object.values(quickCopyTransactions),
    'forensic-analysis': Object.values(quickCopyAddresses),
    'pattern-detection': [...Object.values(quickCopyAddresses), ...Object.values(quickCopyTransactions)]
  };
  
  return useCases[useCase] || [];
};

