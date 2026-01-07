// ChainPhantom Comprehensive Test Scenarios for Testnet
// All test cases implementation for manual QA testing

// ==================== WALLET MONITORING RULES ENGINE ====================

export const walletMonitoringScenarios = {
  // CP-TC-WM-01: Alert triggers when risk ≥ threshold
  'WM-01': {
    id: 'CP-TC-WM-01',
    title: 'Alert triggers when risk ≥ threshold',
    walletAddress: 'mwm01AlertTriggerWallet1234567890abcdef',
    preconditions: {
      monitoringEnabled: true,
      emailConfigured: true,
      threshold: 50
    },
    data: {
      riskScore: 55,
      patterns: ['peeling_chain', 'high_frequency_short_span']
    },
    expected: {
      walletFlagged: true,
      alertCreated: true,
      emailQueued: true,
      alertMessage: 'Risk score (55) exceeds threshold (50)'
    }
  },
  
  // CP-TC-WM-02: No alert when rules disabled
  'WM-02': {
    id: 'CP-TC-WM-02',
    title: 'No alert when rules disabled',
    walletAddress: 'mwm02NoAlertRulesDisabled1234567890abcdef',
    preconditions: {
      monitoringEnabled: false,
      allRulesDisabled: true,
      threshold: 50
    },
    data: {
      riskScore: 80,
      patterns: ['coinjoin', 'mixer']
    },
    expected: {
      walletFlagged: false,
      alertCreated: false,
      emailQueued: false
    }
  }
};

// ==================== EMAIL ALERTS DELIVERY ====================

export const emailAlertScenarios = {
  // CP-TC-EM-01: Successful SMTP send
  'EM-01': {
    id: 'CP-TC-EM-01',
    title: 'Successful SMTP send',
    walletAddress: 'mem01SuccessfulSMTPSend1234567890abcdef',
    preconditions: {
      smtpConfigured: true,
      smtpValid: true
    },
    data: {
      riskScore: 70,
      patterns: ['peeling_chain'],
      recipient: 'test@chainphantom.test'
    },
    expected: {
      emailStatus: 'Sent',
      emailReceived: true,
      contentAccurate: true
    }
  },
  
  // CP-TC-EM-02: SMTP failure handling
  'EM-02': {
    id: 'CP-TC-EM-02',
    title: 'SMTP failure handling',
    walletAddress: 'mem02SMTPFailureHandling1234567890abcdef',
    preconditions: {
      smtpConfigured: true,
      smtpValid: false
    },
    data: {
      riskScore: 75,
      patterns: ['mixer'],
      error: 'Authentication failed'
    },
    expected: {
      emailStatus: 'Failed',
      errorReason: 'SMTP authentication failed',
      appStable: true,
      retryOptionVisible: true
    }
  }
};

// ==================== PATTERN DETECTION ALGORITHMS ====================

export const patternDetectionScenarios = {
  // CP-TC-PD-01: Fast succession detection
  'PD-01': {
    id: 'CP-TC-PD-01',
    title: 'Fast succession detection',
    transactionHash: 'tpd01fastsuccession1234567890abcdef1234567890abcdef',
    walletAddress: 'mpd01FastSuccessionWallet1234567890abcdef',
    data: {
      transactionCount: 15,
      timeWindow: '1 hour',
      transactionInterval: 4 // minutes
    },
    expected: {
      patternDetected: 'fast_succession',
      severity: 'medium',
      scoreContribution: 30
    }
  },
  
  // CP-TC-PD-02: Mixer/tumbler detection
  'PD-02': {
    id: 'CP-TC-PD-02',
    title: 'Mixer/tumbler detection',
    transactionHash: 'tpd02mixertumbler1234567890abcdef1234567890abcdef',
    data: {
      inputCount: 20,
      outputCount: 20,
      fanInFanOut: true,
      similarAmounts: true
    },
    expected: {
      patternDetected: 'mixer',
      severity: 'critical',
      evidenceNotes: 'Many-to-many with similar amounts detected',
      scoreContribution: 50
    }
  }
};

// ==================== ENHANCED WALLET RULES ====================

export const enhancedWalletRulesScenarios = {
  // CP-TC-ER-01: Monthly average threshold breach
  'ER-01': {
    id: 'CP-TC-ER-01',
    title: 'Monthly average threshold breach',
    walletAddress: 'mer01MonthlyAverageBreached1234567890abcdef',
    preconditions: {
      ruleEnabled: true,
      multiplier: 2.0
    },
    data: {
      thirtyDayAverage: 1.0, // BTC
      newTransactionAmount: 2.5, // BTC
      transactionCount: 45,
      monthlyAverage: 20
    },
    expected: {
      ruleTriggered: true,
      severity: 'medium',
      details: 'Transaction amount 2.5 BTC exceeds 30-day average of 1.0 BTC by 2.5x'
    }
  },
  
  // CP-TC-ER-02: Lump sum detection
  'ER-02': {
    id: 'CP-TC-ER-02',
    title: 'Lump sum detection',
    walletAddress: 'mer02LumpSumDetection1234567890abcdef',
    transactionHash: 'ter02lumpsum1234567890abcdef1234567890abcdef',
    preconditions: {
      ruleEnabled: true,
      threshold: 50 // BTC
    },
    data: {
      transactionAmount: 75, // BTC
      previousLargestTx: 5 // BTC
    },
    expected: {
      ruleTriggered: true,
      severity: 'critical',
      details: 'Lump sum transaction of 75 BTC detected (threshold: 50 BTC)'
    }
  }
};

// ==================== TRANSACTION DETAILS FETCH & ERRORS ====================

export const transactionFetchScenarios = {
  // CP-TC-TX-01: Valid BTC transaction ID
  'TX-01': {
    id: 'CP-TC-TX-01',
    title: 'Valid BTC txid renders',
    transactionHash: 'ttx01validbtctxid1234567890abcdef1234567890abcdef',
    expected: {
      inputsVisible: true,
      outputsVisible: true,
      feeVisible: true,
      timeVisible: true,
      linksRendered: true,
      noErrors: true
    }
  },
  
  // CP-TC-TX-02: Invalid transaction ID
  'TX-02': {
    id: 'CP-TC-TX-02',
    title: 'Invalid txid handled',
    transactionHash: 'invalid_tx_format',
    expected: {
      errorMessage: 'Invalid transaction ID format',
      friendlyError: true,
      noCrash: true,
      retryOption: true,
      docsLink: true
    }
  }
};

// ==================== MULTI-CHAIN SUPPORT ====================

export const multiChainScenarios = {
  // CP-TC-MC-01: ETH tx details with Etherscan
  'MC-01': {
    id: 'CP-TC-MC-01',
    title: 'ETH tx details with Etherscan',
    chain: 'ethereum',
    transactionHash: '0xtmc01ethtxdetails1234567890abcdef1234567890abcdef',
    preconditions: {
      etherscanKeyConfigured: true
    },
    expected: {
      gasVisible: true,
      nonceVisible: true,
      correctLabels: true,
      chainIndicator: 'ETH'
    }
  },
  
  // CP-TC-MC-02: Unsupported chain fallback
  'MC-02': {
    id: 'CP-TC-MC-02',
    title: 'Unsupported chain fallback',
    chain: 'unsupported_chain',
    expected: {
      fallbackToBTC: true,
      noticeDisplayed: true,
      noCrash: true,
      message: 'Chain not supported. Falling back to Bitcoin.'
    }
  }
};

// ==================== EXPORT & REPORTING ====================

export const exportReportingScenarios = {
  // CP-TC-EX-01: Export JSON from analysis
  'EX-01': {
    id: 'CP-TC-EX-01',
    title: 'Export JSON from analysis',
    walletAddress: 'mex01ExportJSONAnalysis1234567890abcdef',
    data: {
      riskScore: 65,
      patterns: ['peeling_chain', 'fast_succession'],
      links: ['tx1', 'tx2', 'tx3']
    },
    expected: {
      fileDownloaded: true,
      formatValid: true,
      includesRiskScore: true,
      includesPatterns: true,
      includesLinks: true,
      includesMetadata: true
    }
  },
  
  // CP-TC-EX-02: Export PDF on empty state
  'EX-02': {
    id: 'CP-TC-EX-02',
    title: 'Export PDF on empty state',
    data: {
      analysisEmpty: true
    },
    expected: {
      gracefulMessage: 'Nothing to export. Please run an analysis first.',
      noFileCreated: true,
      noCrash: true
    }
  }
};

// ==================== RISK SCORING & THRESHOLDS ====================

export const riskScoringScenarios = {
  // CP-TC-RS-01: Deterministic scoring
  'RS-01': {
    id: 'CP-TC-RS-01',
    title: 'Deterministic scoring',
    transactionHash: 'trs01deterministicscoring1234567890abcdef',
    data: {
      inputs: 5,
      outputs: 3,
      amount: 10.5,
      patterns: ['consolidation']
    },
    expected: {
      run1Score: 45,
      run2Score: 45,
      scoresIdentical: true,
      severityConsistent: true
    }
  },
  
  // CP-TC-RS-02: Threshold change affects alerting
  'RS-02': {
    id: 'CP-TC-RS-02',
    title: 'Threshold change affects alerting',
    walletAddress: 'mrs02ThresholdChange1234567890abcdef',
    data: {
      riskScore: 65
    },
    scenarios: [
      {
        threshold: 70,
        expected: {
          alertTriggered: false,
          reason: 'Score (65) below threshold (70)'
        }
      },
      {
        threshold: 60,
        expected: {
          alertTriggered: true,
          reason: 'Score (65) exceeds threshold (60)'
        }
      }
    ]
  }
};

// ==================== PERSISTENCE (LOCALSTORAGE) ====================

export const persistenceScenarios = {
  // CP-TC-PR-01: Wallets persist after refresh
  'PR-01': {
    id: 'CP-TC-PR-01',
    title: 'Wallets persist after refresh',
    data: {
      wallets: [
        'mpr01WalletPersist1A1234567890abcdef',
        'mpr01WalletPersist1B1234567890abcdef'
      ],
      settings: {
        threshold: 55,
        emailEnabled: true
      }
    },
    expected: {
      walletsRetained: true,
      settingsRetained: true,
      monitoringResumes: true
    }
  },
  
  // CP-TC-PR-02: Clear storage resets state
  'PR-02': {
    id: 'CP-TC-PR-02',
    title: 'Clear storage resets state',
    expected: {
      walletsCleared: true,
      settingsReset: true,
      cleanInitialState: true,
      noDataLeaks: true
    }
  }
};

// ==================== PERFORMANCE & RELIABILITY ====================

export const performanceScenarios = {
  // CP-TC-PF-01: 60s interval stability
  'PF-01': {
    id: 'CP-TC-PF-01',
    title: '60s interval stability',
    preconditions: {
      monitoringRunning: true,
      intervalSet: 60000 // ms
    },
    expected: {
      avgInterval: 60, // seconds
      maxDrift: 5, // seconds
      uiResponsive: true,
      cycles: 5
    }
  },
  
  // CP-TC-PF-02: Child tx cap respected
  'PF-02': {
    id: 'CP-TC-PF-02',
    title: 'Child tx cap respected',
    transactionHash: 'tpf02childtxcap1234567890abcdef1234567890abcdef',
    data: {
      graphDepth: 10,
      childrenPerLevel: 20
    },
    expected: {
      depthCap: 3,
      childCap: 10,
      noFreeze: true,
      memoryStable: true,
      executionTime: '<2s'
    }
  }
};

// ==================== SECURITY & CONFIGURATION ====================

export const securityScenarios = {
  // CP-TC-SC-01: Missing API key warning
  'SC-01': {
    id: 'CP-TC-SC-01',
    title: 'Missing API key warning',
    preconditions: {
      blockCypherKeyMissing: true
    },
    expected: {
      warningDisplayed: true,
      nonBlocking: true,
      limitedFallback: true,
      noSecretsInConsole: true,
      message: 'API key not configured. Using limited testnet data.'
    }
  },
  
  // CP-TC-SC-02: No secrets exposed in bundle
  'SC-02': {
    id: 'CP-TC-SC-02',
    title: 'No secrets exposed in bundle',
    expected: {
      noAPIKeysInJS: true,
      noAPIKeysInDOM: true,
      noAPIKeysInRequests: true,
      envVariablesSecure: true
    }
  }
};

// ==================== UI/UX & ACCESSIBILITY ====================

export const uiUXScenarios = {
  // CP-TC-UX-01: Mobile responsive (375x667)
  'UX-01': {
    id: 'CP-TC-UX-01',
    title: 'Mobile responsive layout',
    viewport: {
      width: 375,
      height: 667
    },
    expected: {
      chartsWrap: true,
      cardsWrap: true,
      noOverflow: true,
      controlsUsable: true,
      readableText: true
    }
  },
  
  // CP-TC-UX-02: Risk gauge contrast/labels
  'UX-02': {
    id: 'CP-TC-UX-02',
    title: 'Risk gauge contrast/labels',
    expected: {
      wcagAAPass: true,
      colorContrast: '>4.5:1',
      labelsPresent: true,
      colorAndTextConvey: true,
      accessibleToColorBlind: true
    }
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get all test scenarios
 */
export const getAllScenarios = () => {
  return {
    walletMonitoring: walletMonitoringScenarios,
    emailAlerts: emailAlertScenarios,
    patternDetection: patternDetectionScenarios,
    enhancedWalletRules: enhancedWalletRulesScenarios,
    transactionFetch: transactionFetchScenarios,
    multiChain: multiChainScenarios,
    exportReporting: exportReportingScenarios,
    riskScoring: riskScoringScenarios,
    persistence: persistenceScenarios,
    performance: performanceScenarios,
    security: securityScenarios,
    uiUX: uiUXScenarios
  };
};

/**
 * Get scenario by ID
 */
export const getScenarioById = (scenarioId) => {
  const allScenarios = getAllScenarios();
  
  for (const category of Object.values(allScenarios)) {
    for (const scenario of Object.values(category)) {
      if (scenario.id === scenarioId) {
        return scenario;
      }
    }
  }
  
  return null;
};

/**
 * Get all wallet addresses for testing
 */
export const getAllTestWallets = () => {
  return [
    ...Object.values(walletMonitoringScenarios).map(s => s.walletAddress).filter(Boolean),
    ...Object.values(emailAlertScenarios).map(s => s.walletAddress).filter(Boolean),
    ...Object.values(patternDetectionScenarios).map(s => s.walletAddress).filter(Boolean),
    ...Object.values(enhancedWalletRulesScenarios).map(s => s.walletAddress).filter(Boolean),
    ...Object.values(exportReportingScenarios).map(s => s.walletAddress).filter(Boolean),
    ...Object.values(riskScoringScenarios).map(s => s.walletAddress).filter(Boolean),
    ...Object.values(persistenceScenarios).flatMap(s => s.data?.wallets || [])
  ];
};

/**
 * Get all transaction hashes for testing
 */
export const getAllTestTransactions = () => {
  return [
    ...Object.values(patternDetectionScenarios).map(s => s.transactionHash).filter(Boolean),
    ...Object.values(enhancedWalletRulesScenarios).map(s => s.transactionHash).filter(Boolean),
    ...Object.values(transactionFetchScenarios).map(s => s.transactionHash).filter(Boolean),
    ...Object.values(multiChainScenarios).map(s => s.transactionHash).filter(Boolean),
    ...Object.values(riskScoringScenarios).map(s => s.transactionHash).filter(Boolean),
    ...Object.values(performanceScenarios).map(s => s.transactionHash).filter(Boolean)
  ];
};

export default {
  walletMonitoringScenarios,
  emailAlertScenarios,
  patternDetectionScenarios,
  enhancedWalletRulesScenarios,
  transactionFetchScenarios,
  multiChainScenarios,
  exportReportingScenarios,
  riskScoringScenarios,
  persistenceScenarios,
  performanceScenarios,
  securityScenarios,
  uiUXScenarios,
  getAllScenarios,
  getScenarioById,
  getAllTestWallets,
  getAllTestTransactions
};

