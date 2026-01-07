// Comprehensive Test Entries for All ChainPhantom Test Scenarios
// Import scenarios for reference
import { getAllTestWallets, getAllTestTransactions } from './testnetScenarios';

export const comprehensiveTestEntries = {
  // ==================== WALLET MONITORING RULES ENGINE ====================
  walletMonitoring: {
    'WM-01': {
      address: 'mwm01AlertTriggerWallet1234567890abcdef',
      description: 'Alert triggers when risk ≥ threshold (risk=55, threshold=50)',
      expectedRisk: 55,
      expectedAlert: true
    },
    'WM-02': {
      address: 'mwm02NoAlertRulesDisabled1234567890abcdef',
      description: 'No alert when rules disabled (risk=80 but rules OFF)',
      expectedRisk: 80,
      expectedAlert: false
    }
  },

  // ==================== EMAIL ALERTS DELIVERY ====================
  emailAlerts: {
    'EM-01': {
      address: 'mem01SuccessfulSMTPSend1234567890abcdef',
      description: 'Successful SMTP send (risk=70)',
      expectedRisk: 70,
      expectedEmailStatus: 'Sent'
    },
    'EM-02': {
      address: 'mem02SMTPFailureHandling1234567890abcdef',
      description: 'SMTP failure handling (risk=75, invalid credentials)',
      expectedRisk: 75,
      expectedEmailStatus: 'Failed'
    }
  },

  // ==================== PATTERN DETECTION ALGORITHMS ====================
  patternDetection: {
    'PD-01': {
      transaction: 'tpd01fastsuccession1234567890abcdef1234567890abcdef',
      address: 'mpd01FastSuccessionWallet1234567890abcdef',
      description: 'Fast succession: 15 tx within 1 hour',
      expectedPattern: 'fast_succession',
      expectedSeverity: 'medium'
    },
    'PD-02': {
      transaction: 'tpd02mixertumbler1234567890abcdef1234567890abcdef',
      description: 'Mixer/tumbler: 20 inputs, 20 outputs',
      expectedPattern: 'mixer',
      expectedSeverity: 'critical'
    }
  },

  // ==================== ENHANCED WALLET RULES ====================
  enhancedWalletRules: {
    'ER-01': {
      address: 'mer01MonthlyAverageBreached1234567890abcdef',
      description: 'Monthly average breach: 2.5 BTC vs 1.0 BTC avg',
      expectedRisk: 55,
      expectedPattern: 'exceeds_monthly_average'
    },
    'ER-02': {
      address: 'mer02LumpSumDetection1234567890abcdef',
      transaction: 'ter02lumpsum1234567890abcdef1234567890abcdef',
      description: 'Lump sum: 75 BTC (threshold: 50 BTC)',
      expectedRisk: 70,
      expectedPattern: 'lump_sum_transaction'
    }
  },

  // ==================== TRANSACTION DETAILS FETCH & ERRORS ====================
  transactionFetch: {
    'TX-01': {
      transaction: 'ttx01validbtctxid1234567890abcdef1234567890abcdef',
      description: 'Valid BTC transaction renders correctly',
      expectedError: false
    },
    'TX-02': {
      transaction: 'invalid_tx_format',
      description: 'Invalid txid handled gracefully',
      expectedError: true,
      expectedMessage: 'Invalid transaction ID format'
    }
  },

  // ==================== MULTI-CHAIN SUPPORT ====================
  multiChain: {
    'MC-01': {
      transaction: '0xtmc01ethtxdetails1234567890abcdef1234567890abcdef',
      chain: 'ethereum',
      description: 'ETH transaction with gas and nonce',
      expectedFields: ['gas', 'nonce']
    },
    'MC-02': {
      chain: 'unsupported_chain',
      description: 'Unsupported chain falls back to BTC',
      expectedFallback: 'bitcoin',
      expectedNotice: true
    }
  },

  // ==================== EXPORT & REPORTING ====================
  exportReporting: {
    'EX-01': {
      address: 'mex01ExportJSONAnalysis1234567890abcdef',
      description: 'Export JSON with risk score and patterns',
      expectedRisk: 65,
      expectedExportFormat: 'JSON'
    },
    'EX-02': {
      description: 'Export PDF on empty state shows graceful message',
      expectedMessage: 'Nothing to export',
      expectedFileCreated: false
    }
  },

  // ==================== RISK SCORING & THRESHOLDS ====================
  riskScoring: {
    'RS-01': {
      transaction: 'trs01deterministicscoring1234567890abcdef',
      description: 'Deterministic scoring: same input = same score',
      expectedScore: 45,
      runTwice: true
    },
    'RS-02': {
      address: 'mrs02ThresholdChange1234567890abcdef',
      description: 'Threshold change affects alerting (score=65)',
      riskScore: 65,
      thresholds: [
        { value: 70, expectedAlert: false },
        { value: 60, expectedAlert: true }
      ]
    }
  },

  // ==================== PERSISTENCE (LOCALSTORAGE) ====================
  persistence: {
    'PR-01': {
      wallets: [
        'mpr01WalletPersist1A1234567890abcdef',
        'mpr01WalletPersist1B1234567890abcdef'
      ],
      description: 'Wallets persist after page refresh',
      expectedPersist: true
    },
    'PR-02': {
      description: 'Clear storage resets state completely',
      expectedClear: true
    }
  },

  // ==================== PERFORMANCE & RELIABILITY ====================
  performance: {
    'PF-01': {
      description: '60s interval stability (±5s drift)',
      expectedInterval: 60,
      maxDrift: 5,
      cycles: 5
    },
    'PF-02': {
      transaction: 'tpf02childtxcap1234567890abcdef1234567890abcdef',
      description: 'Child transaction cap respected (depth=3, children=10)',
      expectedDepthCap: 3,
      expectedChildCap: 10
    }
  },

  // ==================== SECURITY & CONFIGURATION ====================
  security: {
    'SC-01': {
      description: 'Missing API key shows non-blocking warning',
      expectedWarning: true,
      expectedBlocking: false
    },
    'SC-02': {
      description: 'No secrets exposed in bundle/DOM/network',
      checkLocations: ['bundle', 'DOM', 'network', 'console']
    }
  },

  // ==================== UI/UX & ACCESSIBILITY ====================
  uiUX: {
    'UX-01': {
      viewport: { width: 375, height: 667 },
      description: 'Mobile responsive layout (375x667)',
      expectedNoOverflow: true
    },
    'UX-02': {
      description: 'Risk gauge meets WCAG AA contrast (>4.5:1)',
      expectedContrast: 4.5,
      expectedWCAG: 'AA'
    }
  }
};

// ==================== QUICK COPY-PASTE ENTRIES ====================

export const quickCopyPasteEntries = {
  // Wallet Monitoring
  alertTrigger: 'mwm01AlertTriggerWallet1234567890abcdef',
  noAlert: 'mwm02NoAlertRulesDisabled1234567890abcdef',
  
  // Email Alerts
  emailSuccess: 'mem01SuccessfulSMTPSend1234567890abcdef',
  emailFailure: 'mem02SMTPFailureHandling1234567890abcdef',
  
  // Pattern Detection
  fastSuccessionAddr: 'mpd01FastSuccessionWallet1234567890abcdef',
  fastSuccessionTx: 'tpd01fastsuccession1234567890abcdef1234567890abcdef',
  mixerTx: 'tpd02mixertumbler1234567890abcdef1234567890abcdef',
  
  // Enhanced Wallet Rules
  monthlyAverageBreach: 'mer01MonthlyAverageBreached1234567890abcdef',
  lumpSumAddr: 'mer02LumpSumDetection1234567890abcdef',
  lumpSumTx: 'ter02lumpsum1234567890abcdef1234567890abcdef',
  
  // Transaction Fetch
  validTx: 'ttx01validbtctxid1234567890abcdef1234567890abcdef',
  invalidTx: 'invalid_tx_format',
  
  // Multi-Chain
  ethTx: '0xtmc01ethtxdetails1234567890abcdef1234567890abcdef',
  
  // Export & Reporting
  exportJsonAddr: 'mex01ExportJSONAnalysis1234567890abcdef',
  
  // Risk Scoring
  deterministicTx: 'trs01deterministicscoring1234567890abcdef',
  thresholdTestAddr: 'mrs02ThresholdChange1234567890abcdef',
  
  // Persistence
  persistWallet1: 'mpr01WalletPersist1A1234567890abcdef',
  persistWallet2: 'mpr01WalletPersist1B1234567890abcdef',
  
  // Performance
  childCapTx: 'tpf02childtxcap1234567890abcdef1234567890abcdef'
};

// ==================== TEST CATEGORIES ====================

export const testCategories = {
  walletMonitoring: {
    name: 'Wallet Monitoring Rules Engine',
    testCount: 2,
    tests: ['WM-01', 'WM-02']
  },
  emailAlerts: {
    name: 'Email Alerts Delivery',
    testCount: 2,
    tests: ['EM-01', 'EM-02']
  },
  patternDetection: {
    name: 'Pattern Detection Algorithms',
    testCount: 2,
    tests: ['PD-01', 'PD-02']
  },
  enhancedWalletRules: {
    name: 'Enhanced Wallet Rules',
    testCount: 2,
    tests: ['ER-01', 'ER-02']
  },
  transactionFetch: {
    name: 'Transaction Details Fetch & Errors',
    testCount: 2,
    tests: ['TX-01', 'TX-02']
  },
  multiChain: {
    name: 'Multi-Chain Support',
    testCount: 2,
    tests: ['MC-01', 'MC-02']
  },
  exportReporting: {
    name: 'Export & Reporting',
    testCount: 2,
    tests: ['EX-01', 'EX-02']
  },
  riskScoring: {
    name: 'Risk Scoring & Thresholds',
    testCount: 2,
    tests: ['RS-01', 'RS-02']
  },
  persistence: {
    name: 'Persistence (LocalStorage)',
    testCount: 2,
    tests: ['PR-01', 'PR-02']
  },
  performance: {
    name: 'Performance & Reliability',
    testCount: 2,
    tests: ['PF-01', 'PF-02']
  },
  security: {
    name: 'Security & Configuration',
    testCount: 2,
    tests: ['SC-01', 'SC-02']
  },
  uiUX: {
    name: 'UI/UX & Accessibility',
    testCount: 2,
    tests: ['UX-01', 'UX-02']
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get all test addresses
 */
export const getAllTestAddresses = () => {
  return [
    ...Object.values(comprehensiveTestEntries.walletMonitoring).map(t => t.address),
    ...Object.values(comprehensiveTestEntries.emailAlerts).map(t => t.address),
    ...Object.values(comprehensiveTestEntries.patternDetection).map(t => t.address).filter(Boolean),
    ...Object.values(comprehensiveTestEntries.enhancedWalletRules).map(t => t.address).filter(Boolean),
    ...Object.values(comprehensiveTestEntries.exportReporting).map(t => t.address).filter(Boolean),
    ...Object.values(comprehensiveTestEntries.riskScoring).map(t => t.address).filter(Boolean),
    ...comprehensiveTestEntries.persistence['PR-01'].wallets
  ].filter(Boolean);
};

/**
 * Get all test transactions
 */
export const getAllTestTransactionHashes = () => {
  return [
    ...Object.values(comprehensiveTestEntries.patternDetection).map(t => t.transaction),
    ...Object.values(comprehensiveTestEntries.enhancedWalletRules).map(t => t.transaction).filter(Boolean),
    ...Object.values(comprehensiveTestEntries.transactionFetch).map(t => t.transaction),
    ...Object.values(comprehensiveTestEntries.multiChain).map(t => t.transaction).filter(Boolean),
    ...Object.values(comprehensiveTestEntries.riskScoring).map(t => t.transaction).filter(Boolean),
    ...Object.values(comprehensiveTestEntries.performance).map(t => t.transaction).filter(Boolean)
  ].filter(Boolean);
};

/**
 * Get test by ID
 */
export const getTestById = (testId) => {
  for (const category of Object.values(comprehensiveTestEntries)) {
    if (category[testId]) {
      return category[testId];
    }
  }
  return null;
};

/**
 * Get all tests in a category
 */
export const getTestsByCategory = (categoryName) => {
  return comprehensiveTestEntries[categoryName] || {};
};

/**
 * Generate test summary
 */
export const generateTestSummary = () => {
  const categories = Object.keys(testCategories);
  const totalTests = categories.reduce((sum, cat) => sum + testCategories[cat].testCount, 0);
  
  return {
    totalCategories: categories.length,
    totalTests,
    categories: testCategories
  };
};

export default {
  comprehensiveTestEntries,
  quickCopyPasteEntries,
  testCategories,
  getAllTestAddresses,
  getAllTestTransactionHashes,
  getTestById,
  getTestsByCategory,
  generateTestSummary
};

