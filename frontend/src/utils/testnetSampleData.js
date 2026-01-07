// Sample testnet data examples for testing and reference
// These are realistic examples of what the mock data generator produces

export const sampleTestnetData = {
  // ==================== DASHBOARD SAMPLES ====================
  dashboardStats: {
    latestBlock: {
      height: 2503456,
      hash: "0000000000000000000a1b2c3d4e5f6789012345678901234567890abcdef12",
      time: 1704123456000,
      txCount: 342,
      size: 1245678
    },
    mempool: {
      txCount: 2847,
      size: "3.2 MB",
      fees: {
        hourFee: 8,
        halfHourFee: 12,
        fastestFee: 18
      }
    },
    network: {
      hashrate: "35.7 TH/s",
      difficulty: "4.23 T",
      nextDifficultyChange: "+2.1%",
      nextDifficultyHeight: 2505472,
      blocksUntilChange: 1234
    },
    market: {
      price: "$58,234.56",
      change24h: "+1.23%",
      volume24h: "$2.5B",
      marketCap: "$1.15T"
    }
  },

  // ==================== RECENT BLOCKS SAMPLES ====================
  recentBlocks: [
    {
      height: 2503456,
      hash: "0000000000000000000a1b2c3d4e5f6789012345678901234567890abcdef12",
      time: 1704123456000,
      txCount: 342,
      size: 1245678,
      miner: "Testnet Pool 1"
    },
    {
      height: 2503455,
      hash: "0000000000000000000b2c3d4e5f6789012345678901234567890abcdef1234",
      time: 1704122856000,
      txCount: 298,
      size: 1123456,
      miner: "Solo Miner"
    },
    {
      height: 2503454,
      hash: "0000000000000000000c3d4e5f6789012345678901234567890abcdef123456",
      time: 1704122256000,
      txCount: 415,
      size: 1356789,
      miner: "Testnet Pool 2"
    },
    {
      height: 2503453,
      hash: "0000000000000000000d4e5f6789012345678901234567890abcdef12345678",
      time: 1704121656000,
      txCount: 267,
      size: 987654,
      miner: "Testnet Node"
    }
  ],

  // ==================== RECENT TRANSACTIONS SAMPLES ====================
  recentTransactions: [
    {
      hash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      time: 1704123456000,
      amount: 2.45678901,
      fee: 0.00012345,
      size: 342,
      senders: ["mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT"],
      receivers: [
        { address: "n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y", value: 1.5 },
        { address: "2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc", value: 0.95678901 }
      ]
    },
    {
      hash: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
      time: 1704123396000,
      amount: 0.12345678,
      fee: 0.00005678,
      size: 256,
      senders: ["n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y"],
      receivers: [
        { address: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT", value: 0.12345678 }
      ]
    }
  ],

  // ==================== NETWORK STATS SAMPLES ====================
  networkStats: {
    hashrate: "35.7 TH/s",
    difficulty: "4.23 T",
    unconfirmedTx: "2,847",
    nextHalving: "456 days",
    blockchainSize: "28.45 GB",
    nextDifficultyChange: "+2.1%",
    blocksUntilAdjustment: 1234,
    mempool: {
      txCount: 2847,
      size: "3.2 MB",
      totalFees: "0.045678 BTC",
      minFee: "1.2 sat/vB",
      medianFee: "4.5 sat/vB",
      maxFee: "18.7 sat/vB"
    },
    peers: {
      total: 342,
      inbound: 198,
      outbound: 144,
      ipv4: 287,
      ipv6: 45,
      tor: 10
    }
  },

  // ==================== BLOCKS SAMPLES ====================
  blocks: [
    {
      height: 2503456,
      hash: "0000000000000000000a1b2c3d4e5f6789012345678901234567890abcdef12",
      time: 1704123456,
      n_tx: 342,
      size: 1245678
    },
    {
      height: 2503455,
      hash: "0000000000000000000b2c3d4e5f6789012345678901234567890abcdef1234",
      time: 1704122856,
      n_tx: 298,
      size: 1123456
    },
    {
      height: 2503454,
      hash: "0000000000000000000c3d4e5f6789012345678901234567890abcdef123456",
      time: 1704122256,
      n_tx: 415,
      size: 1356789
    }
  ],

  // ==================== TRANSACTION SAMPLES ====================
  transaction: {
    hash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    txid: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    time: 1704123456,
    size: 542,
    fee: 12345,
    block_height: 2503456,
    confirmations: 12,
    inputs: [
      {
        prev_out: {
          addr: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
          value: 500000000  // 5 BTC in satoshis
        }
      },
      {
        prev_out: {
          addr: "n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y",
          value: 300000000  // 3 BTC in satoshis
        }
      }
    ],
    out: [
      {
        addr: "2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
        value: 700000000  // 7 BTC in satoshis
      },
      {
        addr: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
        value: 98765555  // 0.98765555 BTC (change)
      }
    ],
    vin: [
      {
        addr: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
        value: 500000000
      },
      {
        addr: "n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y",
        value: 300000000
      }
    ],
    vout: [
      {
        scriptPubKey: { addresses: ["2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc"] },
        value: 7.0
      },
      {
        scriptPubKey: { addresses: ["mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT"] },
        value: 0.98765555
      }
    ]
  },

  // ==================== ADDRESS SAMPLES ====================
  address: {
    address: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
    total_received: 15000000000,  // 150 BTC
    total_sent: 12000000000,     // 120 BTC
    balance: 3000000000,          // 30 BTC
    n_tx: 47,
    transactions: [
      {
        hash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
        time: 1704123456,
        value: 5000000000,  // 50 BTC
        type: "received"
      },
      {
        hash: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
        time: 1704122856,
        value: 3000000000,  // 30 BTC
        type: "sent"
      },
      {
        hash: "c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
        time: 1704122256,
        value: 2000000000,  // 20 BTC
        type: "received"
      }
    ]
  },

  // ==================== FORENSIC ANALYSIS SAMPLES ====================
  forensicAnalysis: {
    address: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
    riskScore: 75,
    riskLevel: "high",
    patterns: [
      {
        type: "high_frequency",
        severity: "high",
        count: 8,
        description: "Unusual transaction frequency detected"
      },
      {
        type: "mixing_service",
        severity: "high",
        count: 2,
        description: "Possible mixing service involvement"
      },
      {
        type: "round_amounts",
        severity: "medium",
        count: 5,
        description: "Multiple round amount transactions"
      }
    ],
    timestamp: "2024-01-01T12:00:00.000Z",
    transactionCount: 47,
    totalVolume: 150.5,
    firstSeen: 1701234567,
    lastSeen: 1704123456
  },

  // ==================== MULTI-CHAIN SAMPLES ====================
  multiChainAddress: {
    address: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
    balance: 30.5,
    totalReceived: 150.0,
    totalSent: 119.5,
    transactionCount: 47,
    riskScore: 65,
    riskLevel: "medium",
    transactions: [
      {
        hash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
        time: "2024-01-01T12:00:00.000Z",
        amount: 5.5,
        type: "received",
        confirmations: 12,
        risk: "medium"
      },
      {
        hash: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
        time: "2024-01-01T11:00:00.000Z",
        amount: 3.2,
        type: "sent",
        confirmations: 45,
        risk: "low"
      }
    ]
  },

  multiChainTransaction: {
    hash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    network: "bitcoin",
    time: "2024-01-01T12:00:00.000Z",
    amount: 7.5,
    fee: 0.00012345,
    inputs: 2,
    outputs: 3,
    confirmations: 12,
    riskScore: 45
  },

  // ==================== PATTERN DETECTION SAMPLES ====================
  patternDetection: {
    riskScore: 68,
    patterns: [
      {
        type: "coinjoin",
        severity: "high",
        description: "CoinJoin transaction detected"
      },
      {
        type: "peeling_chain",
        severity: "medium",
        description: "Peeling chain pattern detected"
      },
      {
        type: "round_amounts",
        severity: "medium",
        description: "Round amount transactions"
      }
    ],
    timestamp: "2024-01-01T12:00:00.000Z",
    transactionHash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
  },

  // ==================== WALLET MONITOR SAMPLES ====================
  walletMonitor: [
    {
      address: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
      balance: 30.5,
      lastActivity: 1704123456,
      transactionCount: 47,
      riskScore: 65,
      alerts: [
        {
          type: "new_transaction",
          message: "New transaction detected",
          time: 1704123456
        },
        {
          type: "large_transfer",
          message: "Large transfer detected",
          time: 1704037056
        }
      ]
    },
    {
      address: "n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y",
      balance: 15.2,
      lastActivity: 1704037056,
      transactionCount: 23,
      riskScore: 35,
      alerts: []
    }
  ],

  // ==================== EXCHANGE DETECTION SAMPLES ====================
  exchangeDetection: {
    address: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
    isExchange: true,
    exchangeName: "Testnet Exchange 1",
    confidence: 85,
    evidence: [
      {
        type: "address_pattern",
        description: "Matches known exchange address pattern"
      },
      {
        type: "transaction_volume",
        description: "High transaction volume consistent with exchange"
      }
    ]
  },

  // ==================== TESTNET ADDRESS EXAMPLES ====================
  testnetAddresses: [
    "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",  // P2PKH (starts with 'm' or 'n')
    "n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y",  // P2PKH (starts with 'm' or 'n')
    "2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc", // P2SH (starts with '2')
    "tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", // Bech32 (starts with 'tb1')
    "mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn"  // Another P2PKH
  ],

  // ==================== TESTNET TRANSACTION HASH EXAMPLES ====================
  testnetTransactionHashes: [
    "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
    "c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
    "d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890",
    "e5f6789012345678901234567890abcdef1234567890abcdef1234567890ab"
  ],

  // ==================== COMPLETE SCENARIOS ====================
  scenarios: {
    // Scenario 1: High-risk address with mixing patterns
    highRiskAddress: {
      address: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
      balance: 45.67,
      totalReceived: 500.0,
      totalSent: 454.33,
      transactionCount: 234,
      riskScore: 87,
      riskLevel: "high",
      patterns: [
        { type: "mixing_service", severity: "high", count: 5 },
        { type: "high_frequency", severity: "high", count: 12 },
        { type: "rapid_mixing", severity: "high", count: 3 }
      ],
      transactions: Array.from({ length: 20 }, (_, i) => ({
        hash: `a${i}b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`,
        time: Date.now() - i * 3600000,
        amount: Math.random() * 10,
        type: Math.random() > 0.5 ? "received" : "sent",
        confirmations: Math.floor(Math.random() * 100) + 1
      }))
    },

    // Scenario 2: Exchange address
    exchangeAddress: {
      address: "n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y",
      balance: 1250.89,
      totalReceived: 50000.0,
      totalSent: 48749.11,
      transactionCount: 15234,
      riskScore: 25,
      riskLevel: "low",
      isExchange: true,
      exchangeName: "Testnet Exchange 1",
      patterns: [
        { type: "high_frequency", severity: "low", count: 15234 },
        { type: "round_amounts", severity: "low", count: 234 }
      ]
    },

    // Scenario 3: Normal user address
    normalAddress: {
      address: "2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
      balance: 2.5,
      totalReceived: 15.0,
      totalSent: 12.5,
      transactionCount: 8,
      riskScore: 12,
      riskLevel: "minimal",
      patterns: []
    },

    // Scenario 4: CoinJoin transaction
    coinJoinTransaction: {
      hash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      time: 1704123456,
      size: 1250,
      fee: 50000,
      block_height: 2503456,
      confirmations: 12,
      inputs: Array.from({ length: 10 }, (_, i) => ({
        prev_out: {
          addr: `m${i}zBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT`,
          value: 100000000 + i * 10000000
        }
      })),
      out: Array.from({ length: 10 }, (_, i) => ({
        addr: `n${i}3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y`,
        value: 95000000 + i * 5000000
      })),
      riskScore: 75,
      patterns: [
        { type: "coinjoin", severity: "high", description: "CoinJoin transaction detected" }
      ]
    },

    // Scenario 5: Peeling chain transaction
    peelingChainTransaction: {
      hash: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
      time: 1704122856,
      size: 450,
      fee: 15000,
      block_height: 2503455,
      confirmations: 13,
      inputs: [
        {
          prev_out: {
            addr: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
            value: 1000000000
          }
        }
      ],
      out: [
        {
          addr: "n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y",
          value: 50000000
        },
        {
          addr: "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
          value: 935000000
        }
      ],
      riskScore: 55,
      patterns: [
        { type: "peeling_chain", severity: "medium", description: "Peeling chain pattern detected" }
      ]
    }
  }
};

// Helper function to get a random sample from the scenarios
export const getRandomSample = (scenarioType) => {
  if (sampleTestnetData.scenarios[scenarioType]) {
    return sampleTestnetData.scenarios[scenarioType];
  }
  return null;
};

// Helper function to get all testnet addresses
export const getTestnetAddresses = () => {
  return sampleTestnetData.testnetAddresses;
};

// Helper function to get all testnet transaction hashes
export const getTestnetTransactionHashes = () => {
  return sampleTestnetData.testnetTransactionHashes;
};

