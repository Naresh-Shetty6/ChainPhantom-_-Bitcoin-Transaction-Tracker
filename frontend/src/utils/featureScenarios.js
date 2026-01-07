// ============================================================================
// FEATURE-SPECIFIC TEST SCENARIOS
// For: Wallet Monitor, Forensic Analyzer, Multi-Chain Analysis, Pattern Detection
// ============================================================================

// ============================================================================
// 1. WALLET MONITOR SCENARIOS (5 scenarios - MAIN FOCUS)
// ============================================================================

export const walletMonitorFeatureScenarios = {
  // Scenario WM-F1: Dormant Wallet Suddenly Active
  'WM-F1': {
    id: 'WM-F1',
    name: 'Dormant Wallet Suddenly Active',
    category: 'wallet_monitor',
    description: 'Wallet inactive for 6 months, suddenly active with large transfers',
    testAddress: 'twmf01dormantactive123456789abcdef123456789abcdef123456789abcdef',
    expectedResults: {
      riskScore: 88,
      riskLevel: 'Critical',
      alertsCount: 3,
      alerts: [
        {
          type: 'dormant_awakening',
          severity: 'high',
          message: 'Dormant wallet (inactive for 180 days) suddenly active'
        },
        {
          type: 'exceeds_monthly_average',
          severity: 'high',
          message: 'Transaction count exceeds monthly average by 16x'
        },
        {
          type: 'high_frequency',
          severity: 'medium',
          message: 'More than 10 transactions in short time span'
        }
      ],
      patterns: ['Dormant Awakening', 'High Frequency', 'Large Transfers']
    },
    mockData: {
      address: 'twmf01dormantactive123456789abcdef123456789abcdef123456789abcdef',
      balance: 125.5,
      transactionCount: 8,
      monthlyAverage: 0.5,
      currentMonthTx: 8,
      lastActive: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      recentActivity: new Date().toISOString(),
      dormantPeriod: '180 days',
      suddenActivity: '8 transactions in 24 hours',
      volumeIncrease: '16x normal activity'
    }
  },

  // Scenario WM-F2: Structuring/Smurfing Pattern
  'WM-F2': {
    id: 'WM-F2',
    name: 'Structuring/Smurfing Pattern',
    category: 'wallet_monitor',
    description: 'Many small deposits followed by large withdrawal (structuring)',
    testAddress: 'twmf02structuring123456789abcdef123456789abcdef123456789abcdef12',
    expectedResults: {
      riskScore: 92,
      riskLevel: 'Critical',
      alertsCount: 3,
      alerts: [
        {
          type: 'structuring_detected',
          severity: 'critical',
          message: 'Potential structuring/smurfing pattern detected'
        },
        {
          type: 'exceeds_monthly_average',
          severity: 'medium',
          message: 'Transaction count 3.75x monthly average'
        },
        {
          type: 'layering_pattern',
          severity: 'high',
          message: 'Layering pattern detected'
        }
      ],
      patterns: ['Structuring', 'Smurfing', 'Layering', 'Integration']
    },
    mockData: {
      address: 'twmf02structuring123456789abcdef123456789abcdef123456789abcdef12',
      balance: 2.5,
      transactionCount: 156,
      monthlyAverage: 12,
      currentMonthTx: 45,
      transactionPattern: {
        deposits: 32,
        avgDepositAmount: 2.8,
        depositPeriod: '14 days',
        withdrawals: 1,
        withdrawalAmount: 98,
        pattern: 'Many small deposits → Single large withdrawal'
      },
      suspiciousIndicators: [
        'Deposits kept under $10,000 equivalent',
        'Systematic deposit timing (every 6-8 hours)',
        'Single withdrawal after accumulation period',
        'Classic structuring pattern'
      ]
    }
  },

  // Scenario WM-F3: Exchange-Like Activity
  'WM-F3': {
    id: 'WM-F3',
    name: 'Exchange-Like High Volume Trading',
    category: 'wallet_monitor',
    description: 'Very high transaction volume, multiple counterparties',
    testAddress: 'twmf03exchange123456789abcdef123456789abcdef123456789abcdef12345',
    expectedResults: {
      riskScore: 45,
      riskLevel: 'Medium',
      alertsCount: 3,
      alerts: [
        {
          type: 'exchange_pattern',
          severity: 'medium',
          message: 'Exchange-like trading pattern detected'
        },
        {
          type: 'exceeds_monthly_average',
          severity: 'low',
          message: 'Transaction count 2.2x monthly average'
        },
        {
          type: 'high_value_flow',
          severity: 'medium',
          message: 'High value transaction flow detected'
        }
      ],
      patterns: ['Exchange Behavior', 'High Volume', 'Multiple Counterparties']
    },
    mockData: {
      address: 'twmf03exchange123456789abcdef123456789abcdef123456789abcdef12345',
      balance: 1250.75,
      transactionCount: 2458,
      monthlyAverage: 185,
      currentMonthTx: 412,
      counterparties: 78,
      avgTxPerDay: 13.7,
      volumeFlow: {
        monthly: {
          inflow: 3450,
          outflow: 3380,
          net: 70
        }
      },
      behavior: 'Consistent with legitimate exchange hot wallet'
    }
  },

  // Scenario WM-F4: Mixer/Tumbler User
  'WM-F4': {
    id: 'WM-F4',
    name: 'Mixer/Tumbler Integration',
    category: 'wallet_monitor',
    description: 'Frequent interaction with known mixing services',
    testAddress: 'twmf04mixeruser123456789abcdef123456789abcdef123456789abcdef1234',
    expectedResults: {
      riskScore: 95,
      riskLevel: 'Critical',
      alertsCount: 4,
      alerts: [
        {
          type: 'mixer_interaction',
          severity: 'critical',
          message: 'Multiple interactions with known mixing services'
        },
        {
          type: 'privacy_coins',
          severity: 'high',
          message: 'Exchange to privacy coins detected'
        },
        {
          type: 'exceeds_monthly_average',
          severity: 'medium',
          message: 'Transaction count 3x monthly average'
        },
        {
          type: 'obfuscation_attempt',
          severity: 'critical',
          message: 'Deliberate obfuscation pattern detected'
        }
      ],
      patterns: ['Mixer Usage', 'Privacy Seeking', 'Obfuscation', 'Money Laundering Risk']
    },
    mockData: {
      address: 'twmf04mixeruser123456789abcdef123456789abcdef123456789abcdef1234',
      balance: 15.8,
      transactionCount: 89,
      monthlyAverage: 6,
      currentMonthTx: 18,
      mixerServices: ['ChipMixer', 'CoinJoin.io', 'Wasabi Wallet'],
      privacyCoins: {
        conversions: [
          { from: 'BTC', to: 'XMR', amount: 12, service: 'InstantExchange' }
        ]
      },
      privacyScore: 98,
      obfuscationTechniques: [
        'Multiple mixer services',
        'Privacy coin conversion',
        'Long transaction chains',
        'Time delays between hops'
      ]
    }
  },

  // Scenario WM-F5: Exchange Activity
  'WM-F5': {
    id: 'WM-F5',
    name: 'Exchange-Like High Volume',
    category: 'wallet_monitor',
    description: 'Very high transaction volume, multiple counterparties',
    testAddress: 'twmf05exchange123456789abcdef123456789abcdef123456789abcdef12345',
    expectedResults: {
      riskScore: 45,
      riskLevel: 'Medium',
      alertsCount: 3,
      alerts: [
        {
          type: 'exchange_pattern',
          severity: 'medium',
          message: 'Exchange-like trading pattern detected'
        }
      ],
      patterns: ['Exchange Behavior', 'High Volume']
    },
    mockData: {
      address: 'twmf05exchange123456789abcdef123456789abcdef123456789abcdef12345',
      balance: 1250.75,
      transactionCount: 2458,
      counterparties: 78
    }
  },

  // Scenario WM-F6: Terrorist Financing
  'WM-F6': {
    id: 'WM-F6',
    name: 'Terrorist Financing Link',
    category: 'wallet_monitor',
    description: 'Address linked to terrorist organizations',
    testAddress: 'twmf06terrorfinance123456789abcdef123456789abcdef123456789abcdef',
    expectedResults: {
      riskScore: 99,
      riskLevel: 'Critical',
      patterns: ['Terrorist Financing', 'FATF Red Flag', 'National Security']
    }
  },

  // Scenario WM-F7: ATM Cash-Out
  'WM-F7': {
    id: 'WM-F7',
    name: 'ATM Cash-Out Pattern',
    category: 'wallet_monitor',
    description: 'Coordinated ATM withdrawals across multiple locations',
    testAddress: 'twmf07atmcashout123456789abcdef123456789abcdef123456789abcdef123',
    expectedResults: {
      riskScore: 85,
      riskLevel: 'High',
      patterns: ['ATM Cashout', 'Money Mule Network', 'Card Fraud']
    }
  },

  // Scenario WM-F8: Fake ICO
  'WM-F8': {
    id: 'WM-F8',
    name: 'Fake ICO Wallet',
    category: 'wallet_monitor',
    description: 'ICO scam - collected funds never distributed',
    testAddress: 'twmf08fakeico123456789abcdef123456789abcdef123456789abcdef123456',
    expectedResults: {
      riskScore: 93,
      riskLevel: 'Critical',
      patterns: ['Exit Scam', 'Fraud', 'Investment Scam']
    }
  },

  // Scenario WM-F9: Gambling Platform
  'WM-F9': {
    id: 'WM-F9',
    name: 'Unlicensed Gambling',
    category: 'wallet_monitor',
    description: 'Unlicensed gambling platform',
    testAddress: 'twmf09gambling123456789abcdef123456789abcdef123456789abcdef12345',
    expectedResults: {
      riskScore: 55,
      riskLevel: 'Medium',
      patterns: ['Unlicensed Gambling', 'Regulatory Risk']
    }
  },

  // Scenario WM-F10: Normal User
  'WM-F10': {
    id: 'WM-F10',
    name: 'Normal User (Baseline)',
    category: 'wallet_monitor',
    description: 'Regular user with normal transaction patterns',
    testAddress: 'twmf10normal123456789abcdef123456789abcdef123456789abcdef1234567',
    expectedResults: {
      riskScore: 12,
      riskLevel: 'Low',
      alertsCount: 0,
      patterns: ['Normal Activity']
    }
  },

  // Scenario WM-01: Sanctioned Entity (moved from WM-F5)
  'WM-01': {
    id: 'WM-01',
    name: 'Sanctions/Blacklist Match',
    category: 'wallet_monitor',
    description: 'Address linked to sanctioned entity or blacklist',
    testAddress: 'twmf01sanctioned123456789abcdef123456789abcdef123456789abcdef123',
    expectedResults: {
      riskScore: 100,
      riskLevel: 'Critical - SANCTIONS',
      alertsCount: 4,
      alerts: [
        {
          type: 'sanctions_match',
          severity: 'critical',
          message: 'OFAC SANCTIONS MATCH - Immediate Action Required'
        },
        {
          type: 'blacklist_match',
          severity: 'critical',
          message: 'Multiple blacklist matches'
        },
        {
          type: 'ransomware_link',
          severity: 'critical',
          message: 'Linked to ransomware campaign'
        },
        {
          type: 'international_alert',
          severity: 'critical',
          message: 'Interpol Red Notice'
        }
      ],
      patterns: ['Sanctioned Entity', 'Criminal Activity', 'National Security Threat']
    },
    mockData: {
      address: 'twmf05sanctioned123456789abcdef123456789abcdef123456789abcdef123',
      balance: 542.3,
      transactionCount: 234,
      monthlyAverage: 18,
      currentMonthTx: 24,
      sanctionsLists: ['OFAC SDN', 'UN Security Council', 'EU Sanctions List'],
      linkedEntities: ['Lazarus Group', 'North Korean State Actors'],
      criminalActivity: ['WannaCry Ransomware', 'State-Sponsored Hacking'],
      legalStatus: 'PROHIBITED - DO NOT TRANSACT',
      immediateAction: 'Report to NCB and freeze all related accounts',
      internationalAlerts: ['Interpol Red Notice', 'FBI Most Wanted Cyber']
    }
  }
};

// ============================================================================
// 2. FORENSIC ANALYZER SCENARIOS (5 scenarios)
// ============================================================================

export const forensicAnalyzerScenarios = {
  // Scenario FA-1: Exchange Deposit Trail
  'FA-1': {
    id: 'FA-1',
    name: 'Exchange Deposit Trail Analysis',
    category: 'forensic_analyzer',
    description: 'Trace funds from mining pool to exchange deposit',
    testAddress: 'tfaf01exchange123456789abcdef123456789abcdef123456789abcdef1234',
    expectedResults: {
      riskScore: 35,
      riskLevel: 'Low-Medium',
      patterns: ['Exchange Deposit', 'Clean Source', 'KYC Verified']
    },
    mockData: {
      address: 'tfaf01exchange123456789abcdef123456789abcdef123456789abcdef1234',
      forensicDetails: {
        sourceType: 'Mining Pool (F2Pool)',
        hops: 3,
        path: 'Mining Pool → Personal Wallet → Intermediate → Exchange',
        finalDestination: 'Binance Hot Wallet',
        kycStatus: 'Verified',
        suspicionLevel: 'Low',
        confidence: '95%'
      },
      timeline: [
        { time: '2024-01-01 10:00', event: 'Mined coins received', amount: 6.25 },
        { time: '2024-01-01 14:30', event: 'Transferred to personal wallet', amount: 6.25 },
        { time: '2024-01-02 09:15', event: 'Consolidated with other funds', amount: 12.5 },
        { time: '2024-01-02 16:45', event: 'Deposited to Binance', amount: 12.48 }
      ]
    }
  },

  // Scenario FA-2: Dark Web Marketplace
  'FA-2': {
    id: 'FA-2',
    name: 'Dark Web Marketplace Link',
    category: 'forensic_analyzer',
    description: 'Address linked to dark web marketplace transactions',
    testAddress: 'tfaf02darkweb123456789abcdef123456789abcdef123456789abcdef12345',
    expectedResults: {
      riskScore: 94,
      riskLevel: 'Critical',
      patterns: ['Dark Web', 'Illicit Marketplace', 'Criminal Activity']
    },
    mockData: {
      address: 'tfaf02darkweb123456789abcdef123456789abcdef123456789abcdef12345',
      forensicDetails: {
        marketplace: 'AlphaBay (Seized 2017)',
        role: 'Vendor Wallet',
        estimatedVolume: '1,250 BTC',
        operatingPeriod: 'Dec 2014 - Jul 2017',
        lawEnforcement: 'FBI Investigation #2017-DW-45632',
        status: 'Seized',
        products: 'Illegal drugs, counterfeit documents',
        vendors: 'Multiple vendors linked',
        buyers: '450+ unique buyers identified'
      },
      relatedCases: [
        'Operation Bayonet (2017)',
        'International Dark Web Takedown',
        'Vendor arrest - 15 countries'
      ]
    }
  },

  // Scenario FA-3: Ransomware Payment Trail
  'FA-3': {
    id: 'FA-3',
    name: 'Ransomware Payment Trail',
    category: 'forensic_analyzer',
    description: 'Ransomware victim payment trail analysis',
    testAddress: 'tfaf03ransomware123456789abcdef123456789abcdef123456789abcdef123',
    expectedResults: {
      riskScore: 97,
      riskLevel: 'Critical',
      patterns: ['Ransomware', 'Extortion', 'Criminal Infrastructure']
    },
    mockData: {
      address: 'tfaf03ransomware123456789abcdef123456789abcdef123456789abcdef123',
      forensicDetails: {
        campaign: 'REvil Ransomware',
        victims: 47,
        totalExtorted: '425 BTC ($18M USD at time)',
        operatingPeriod: 'Jan 2021 - Jul 2021',
        status: 'Active Investigation - FBI Cyber Division',
        infrastructure: 'Distributed C&C servers',
        paymentMethod: 'Bitcoin only',
        averageRansom: '9 BTC per victim',
        recoveryRate: '12% of funds recovered'
      },
      victimProfiles: [
        'Healthcare organizations (18)',
        'Manufacturing companies (12)',
        'Law firms (8)',
        'Other businesses (9)'
      ]
    }
  },

  // Scenario FA-4: Money Laundering Network
  'FA-4': {
    id: 'FA-4',
    name: 'Complex Money Laundering Network',
    category: 'forensic_analyzer',
    description: 'International money laundering ring with complex structure',
    testAddress: 'tfaf04laundering123456789abcdef123456789abcdef123456789abcdef12',
    expectedResults: {
      riskScore: 91,
      riskLevel: 'Critical',
      patterns: ['Layering', 'Integration', 'Complex Network', 'Shell Companies']
    },
    mockData: {
      address: 'tfaf04laundering123456789abcdef123456789abcdef123456789abcdef12',
      forensicDetails: {
        network: 'International Money Laundering Ring "Operation Clean Money"',
        entities: 156,
        countries: 23,
        volume: '8,450 BTC ($340M USD)',
        method: 'Trade-Based Laundering via Shell Companies',
        investigation: 'Interpol Multi-Country Operation',
        arrests: 34,
        freezedAccounts: 89,
        recoveredFunds: '2,100 BTC'
      },
      structure: {
        layers: 7,
        shellCompanies: 45,
        exchangeAccounts: 67,
        mixerServices: 12,
        offshoreAccounts: 23
      },
      timeline: '2019-2023 (4 years active)'
    }
  },

  // Scenario FA-5: Clean Institutional Wallet
  'FA-5': {
    id: 'FA-5',
    name: 'Institutional Wallet (Clean)',
    category: 'forensic_analyzer',
    description: 'Legitimate institutional holdings - MicroStrategy example',
    testAddress: 'tfaf05institutional123456789abcdef123456789abcdef123456789abcde',
    expectedResults: {
      riskScore: 5,
      riskLevel: 'Very Low',
      patterns: ['Institutional', 'Regulated', 'Compliant', 'Public Company']
    },
    mockData: {
      address: 'tfaf05institutional123456789abcdef123456789abcdef123456789abcde',
      forensicDetails: {
        entity: 'MicroStrategy Corporate Treasury',
        registration: 'SEC Registered (NASDAQ: MSTR)',
        compliance: 'Full AML/KYC Compliance',
        auditor: 'PricewaterhouseCoopers (PwC)',
        public: true,
        disclosures: 'Quarterly SEC filings',
        holdingsPeriod: '2020-Present',
        purpose: 'Corporate Treasury Asset',
        transparency: 'Fully transparent'
      },
      holdingsInfo: {
        approxHoldings: '152,800 BTC',
        avgPurchasePrice: '$29,668 per BTC',
        totalInvestment: '$4.53 Billion',
        strategy: 'Long-term hold'
      }
    }
  }
};

// ============================================================================
// 3. MULTI-CHAIN ANALYSIS SCENARIOS (5 scenarios)
// ============================================================================

export const multiChainAnalysisScenarios = {
  // Scenario MC-1: Cross-Chain Bridge User
  'MC-1': {
    id: 'MC-1',
    name: 'Cross-Chain Bridge Activity',
    category: 'multi_chain',
    description: 'Active user of cross-chain bridges (legitimate DeFi user)',
    testBTCAddress: 'tmcf01bridge123456789abcdef123456789abcdef123456789abcdef12345',
    testETHAddress: '0x1234567890abcdef1234567890abcdef12345678',
    expectedResults: {
      riskScore: 42,
      riskLevel: 'Medium',
      patterns: ['Bridge Usage', 'Multi-Chain', 'DeFi Activity']
    },
    mockData: {
      btcAddress: 'tmcf01bridge123456789abcdef123456789abcdef123456789abcdef12345',
      ethAddress: '0x1234567890abcdef1234567890abcdef12345678',
      chains: ['Bitcoin', 'Ethereum', 'BSC', 'Polygon'],
      bridgeUsage: {
        bridges: ['wBTC', 'RenBTC', 'Multichain Router'],
        totalBridged: '45.8 BTC',
        frequency: 'High (2-3 times/week)',
        avgBridgeAmount: '2.1 BTC',
        purpose: 'DeFi yield farming'
      },
      defiProtocols: ['Uniswap', 'Curve', 'Aave'],
      behavior: 'Consistent with legitimate DeFi user'
    }
  },

  // Scenario MC-2: Cross-Chain Money Laundering
  'MC-2': {
    id: 'MC-2',
    name: 'Cross-Chain Laundering Pattern',
    category: 'multi_chain',
    description: 'Using multiple chains to obfuscate fund origin',
    testBTCAddress: 'tmcf02laundering123456789abcdef123456789abcdef123456789abcdef1',
    testETHAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    expectedResults: {
      riskScore: 96,
      riskLevel: 'Critical',
      patterns: ['Cross-Chain Laundering', 'Privacy Seeking', 'Obfuscation']
    },
    mockData: {
      btcAddress: 'tmcf02laundering123456789abcdef123456789abcdef123456789abcdef1',
      ethAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      chains: ['Bitcoin', 'Ethereum', 'Monero', 'BSC', 'Tron'],
      launderingPath: [
        '1. BTC received (150 BTC)',
        '2. Mixed via Wasabi Wallet',
        '3. Bridged to Ethereum (wBTC)',
        '4. Swapped to privacy coins (XMR)',
        '5. Converted to BSC',
        '6. Laundered via DeFi protocols',
        '7. Extracted via multiple addresses'
      ],
      techniques: [
        'Mixer usage',
        'Cross-chain bridges',
        'Privacy coin conversion',
        'DeFi protocol layering',
        'Multiple exit addresses'
      ],
      complexity: 'Very High - 15 hops across 5 chains'
    }
  },

  // Scenario MC-3: DeFi Yield Farmer
  'MC-3': {
    id: 'MC-3',
    name: 'DeFi Yield Farmer (Legitimate)',
    category: 'multi_chain',
    description: 'Legitimate DeFi activities across multiple chains',
    testETHAddress: '0xdef1234567890abcdef1234567890abcdef12345',
    expectedResults: {
      riskScore: 15,
      riskLevel: 'Low',
      patterns: ['DeFi Activity', 'Yield Farming', 'Legitimate Use']
    },
    mockData: {
      ethAddress: '0xdef1234567890abcdef1234567890abcdef12345',
      chains: ['Ethereum', 'Polygon', 'Avalanche', 'Arbitrum', 'Optimism'],
      defiProtocols: {
        lending: ['Aave', 'Compound'],
        dex: ['Uniswap V3', 'Curve', 'Balancer'],
        farming: ['Convex', 'Yearn Finance'],
        derivatives: ['GMX', 'dYdX']
      },
      portfolioValue: '$450,000',
      yieldStrategy: 'Low-risk stablecoin farming',
      avgAPY: '8.5%',
      behavior: 'Consistent with experienced DeFi investor'
    }
  },

  // Scenario MC-4: NFT Wash Trading
  'MC-4': {
    id: 'MC-4',
    name: 'NFT Wash Trading Pattern',
    category: 'multi_chain',
    description: 'Suspicious NFT trading to inflate prices',
    testETHAddress: '0x4567890abcdef1234567890abcdef1234567890a',
    expectedResults: {
      riskScore: 78,
      riskLevel: 'High',
      patterns: ['Wash Trading', 'Price Manipulation', 'Tax Evasion']
    },
    mockData: {
      ethAddress: '0x4567890abcdef1234567890abcdef1234567890a',
      chains: ['Ethereum'],
      nftActivity: {
        collections: 5,
        suspiciousPattern: 'Same NFTs traded between related addresses',
        addresses: [
          '0x4567890abcdef...',
          '0x789abcdef0123...',
          '0xabcdef012345...'
        ],
        priceManipulation: {
          initialPrice: '12 ETH',
          inflatedPrice: '450 ETH',
          actualValue: '~15 ETH',
          trades: 47,
          uniqueBuyers: 3
        },
        purpose: 'Price inflation and tax loss harvesting'
      },
      evidence: [
        'Same buyer/seller patterns',
        'Immediate resales',
        'Artificial price escalation',
        'Related wallet addresses'
      ]
    }
  },

  // Scenario MC-5: ICO Exit Scam
  'MC-5': {
    id: 'MC-5',
    name: 'ICO Exit Scam Distribution',
    category: 'multi_chain',
    description: 'Token sale exit scam - funds never distributed',
    testETHAddress: '0x7890abcdef1234567890abcdef1234567890abcd',
    expectedResults: {
      riskScore: 99,
      riskLevel: 'Critical',
      patterns: ['Exit Scam', 'Fraud', 'Theft']
    },
    mockData: {
      ethAddress: '0x7890abcdef1234567890abcdef1234567890abcd',
      chains: ['Ethereum', 'BSC'],
      scamDetails: {
        project: 'FakeCoin ICO',
        raised: '12,000 ETH ($22M USD at time)',
        rugPull: true,
        distributed: false,
        status: 'Exit Scam - Team Disappeared',
        investors: 2400,
        promises: 'Revolutionary blockchain solution',
        reality: 'No product, fake team, stolen funds',
        dateScam: '2023-03-15'
      },
      fundFlow: [
        '12,000 ETH raised',
        'Moved to multiple wallets',
        'Converted to BTC via mixers',
        'Exit through exchanges',
        'Team disappeared'
      ],
      victims: '2,400 investors lost average $9,166 each'
    }
  }
};

// ============================================================================
// 4. PATTERN DETECTION SCENARIOS (5 enhanced scenarios)
// ============================================================================

export const patternDetectionFeatureScenarios = {
  // Scenario PD-F1: Circular Trading Pattern
  'PD-F1': {
    id: 'PD-F1',
    name: 'Circular Trading Pattern',
    category: 'pattern_detection',
    description: 'Funds moving in circle to create fake volume',
    testTxHash: 'tpdf01circular123456789abcdef123456789abcdef123456789abcdef12345',
    expectedResults: {
      riskScore: 82,
      riskLevel: 'High',
      patterns: ['Circular Trading', 'Fake Volume', 'Market Manipulation']
    },
    mockData: {
      txHash: 'tpdf01circular123456789abcdef123456789abcdef123456789abcdef12345',
      pattern: 'A → B → C → D → A (completing circle)',
      hops: 4,
      totalAmount: '50 BTC',
      purpose: 'Creating artificial trading volume',
      detection: 'Same funds returned to origin after 4 hops',
      timeframe: '2 hours',
      indicators: [
        'Circular path detected',
        'Equal amounts minus fees',
        'Rapid sequential transfers',
        'Returns to source address'
      ]
    }
  },

  // Scenario PD-F2: Rapid Fire Transactions
  'PD-F2': {
    id: 'PD-F2',
    name: 'Rapid Fire Transaction Pattern',
    category: 'pattern_detection',
    description: '50+ transactions within 10 minutes - bot activity',
    testTxHash: 'tpdf02rapidfire123456789abcdef123456789abcdef123456789abcdef123',
    expectedResults: {
      riskScore: 76,
      riskLevel: 'High',
      patterns: ['High Frequency', 'Bot Activity', 'Automated Trading']
    },
    mockData: {
      txHash: 'tpdf02rapidfire123456789abcdef123456789abcdef123456789abcdef123',
      transactionCount: 52,
      timeframe: '8 minutes',
      frequency: '6.5 tx/minute',
      pattern: 'Rapid sequential transactions',
      likelyBot: true,
      purpose: 'Arbitrage or market making bot',
      indicators: [
        'Extremely high frequency',
        'Consistent timing (77 seconds between tx)',
        'Automated execution pattern',
        'No human-possible speed'
      ]
    }
  },

  // Scenario PD-F3: Dusting Attack
  'PD-F3': {
    id: 'PD-F3',
    name: 'Dusting Attack Pattern',
    category: 'pattern_detection',
    description: 'Tiny amounts sent to many addresses for de-anonymization',
    testTxHash: 'tpdf03dusting123456789abcdef123456789abcdef123456789abcdef12345',
    expectedResults: {
      riskScore: 65,
      riskLevel: 'Medium-High',
      patterns: ['Dusting', 'Privacy Attack', 'De-anonymization Attempt']
    },
    mockData: {
      txHash: 'tpdf03dusting123456789abcdef123456789abcdef123456789abcdef12345',
      outputsCount: 1000,
      dustAmount: '0.00001 BTC (546 satoshis)',
      targets: '1000+ addresses',
      purpose: 'De-anonymization attack',
      technique: 'Send dust to many addresses, track spending patterns',
      impact: 'Can compromise privacy if dust is spent',
      recommendation: 'Do not spend dusted outputs',
      attackType: 'Blockchain analytics / surveillance'
    }
  },

  // Scenario PD-F4: Time-Based Anomaly
  'PD-F4': {
    id: 'PD-F4',
    name: 'Time-Based Anomaly Pattern',
    category: 'pattern_detection',
    description: 'All transactions at suspicious exact times',
    testTxHash: 'tpdf04timeanomaly123456789abcdef123456789abcdef123456789abcdef1',
    expectedResults: {
      riskScore: 58,
      riskLevel: 'Medium',
      patterns: ['Time Anomaly', 'Automated System', 'Scheduled Activity']
    },
    mockData: {
      txHash: 'tpdf04timeanomaly123456789abcdef123456789abcdef123456789abcdef1',
      pattern: 'All transactions at exactly 3:00 AM UTC',
      occurrences: 47,
      precision: 'Within 5 seconds of 03:00:00 UTC',
      suspicion: 'Automated scheduled system',
      possibleReasons: [
        'Automated payout system',
        'Scheduled maintenance',
        'Bot-controlled wallet',
        'Criminal automation'
      ],
      recommendation: 'Investigate automation purpose'
    }
  },

  // Scenario PD-F5: Sybil Attack Pattern
  'PD-F5': {
    id: 'PD-F5',
    name: 'Sybil Attack Pattern',
    category: 'pattern_detection',
    description: 'Multiple fake identities controlled by same entity',
    testTxHash: 'tpdf05sybil123456789abcdef123456789abcdef123456789abcdef1234567',
    expectedResults: {
      riskScore: 87,
      riskLevel: 'High',
      patterns: ['Sybil Attack', 'Multiple Identities', 'Coordinated Activity']
    },
    mockData: {
      txHash: 'tpdf05sybil123456789abcdef123456789abcdef123456789abcdef1234567',
      addresses: 47,
      controlledBy: 'Single entity (proven through blockchain analysis)',
      coordination: 'Perfectly timed coordinated actions',
      purpose: [
        'Voting manipulation',
        'Airdrop farming',
        'Network spam',
        'Reputation manipulation'
      ],
      evidence: [
        'Funded from same source',
        'Coordinated transaction timing',
        'Similar transaction patterns',
        'Same behavioral fingerprint'
      ],
      impact: 'Can manipulate governance, rewards, or reputation systems'
    }
  }
};

// ============================================================================
// QUICK ACCESS TEST STRINGS
// ============================================================================

export const featureTestStrings = {
  walletMonitor: {
    'Dormant Active': 'twmf01dormantactive123456789abcdef123456789abcdef123456789abcdef',
    'Structuring': 'twmf02structuring123456789abcdef123456789abcdef123456789abcdef12',
    'Exchange Activity': 'twmf03exchange123456789abcdef123456789abcdef123456789abcdef12345',
    'Mixer User': 'twmf04mixeruser123456789abcdef123456789abcdef123456789abcdef1234',
    'Sanctioned': 'twmf05sanctioned123456789abcdef123456789abcdef123456789abcdef123'
  },
  forensicAnalyzer: {
    'Exchange Trail': 'tfaf01exchange123456789abcdef123456789abcdef123456789abcdef1234',
    'Dark Web': 'tfaf02darkweb123456789abcdef123456789abcdef123456789abcdef12345',
    'Ransomware': 'tfaf03ransomware123456789abcdef123456789abcdef123456789abcdef123',
    'Laundering': 'tfaf04laundering123456789abcdef123456789abcdef123456789abcdef12',
    'Institutional': 'tfaf05institutional123456789abcdef123456789abcdef123456789abcde'
  },
  multiChain: {
    'Bridge User': 'tmcf01bridge123456789abcdef123456789abcdef123456789abcdef12345',
    'Cross-Chain Laundering': 'tmcf02laundering123456789abcdef123456789abcdef123456789abcdef1',
    'DeFi Farmer': '0xdef1234567890abcdef1234567890abcdef12345',
    'NFT Wash': '0x4567890abcdef1234567890abcdef1234567890a',
    'ICO Scam': '0x7890abcdef1234567890abcdef1234567890abcd'
  },
  patternDetection: {
    'Circular': 'tpdf01circular123456789abcdef123456789abcdef123456789abcdef12345',
    'Rapid Fire': 'tpdf02rapidfire123456789abcdef123456789abcdef123456789abcdef123',
    'Dusting': 'tpdf03dusting123456789abcdef123456789abcdef123456789abcdef12345',
    'Time Anomaly': 'tpdf04timeanomaly123456789abcdef123456789abcdef123456789abcdef1',
    'Sybil Attack': 'tpdf05sybil123456789abcdef123456789abcdef123456789abcdef1234567'
  }
};

// Export all scenario collections
export default {
  walletMonitorFeatureScenarios,
  forensicAnalyzerScenarios,
  multiChainAnalysisScenarios,
  patternDetectionFeatureScenarios,
  featureTestStrings
};

