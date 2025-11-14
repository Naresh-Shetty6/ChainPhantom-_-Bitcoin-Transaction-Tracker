import React, { useState, useEffect, useCallback } from 'react';
import './WalletMonitor.css';
import EnhancedWalletRules from './EnhancedWalletRules';
import EnhancedRulesSettings from './EnhancedRulesSettings';
import { 
  FaWallet, FaPlus, FaTrash, FaBell, FaEnvelope, 
  FaCheckCircle, FaExclamationTriangle, FaClock,
  FaPlay, FaPause, FaCog, FaEye, FaDownload
} from 'react-icons/fa';

const WalletMonitor = () => {
  const [wallets, setWallets] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [ncbEmail, setNcbEmail] = useState('ncb@gov.in');
  
  // Initialize enhanced wallet rules
  const enhancedRules = EnhancedWalletRules();
  const [alertRules, setAlertRules] = useState({
    riskScoreThreshold: 50,
    enableHighSeverity: true,
    enableMediumSeverity: true,
    enableLowSeverity: false,
    minTransactionAmount: 1.0, // BTC
    alertOnMixer: true,
    alertOnLoop: true,
    alertOnPeeling: true,
    alertOnFastSuccession: true
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [monitoringStats, setMonitoringStats] = useState({
    totalWallets: 0,
    activeMonitoring: 0,
    alertsSent: 0,
    suspiciousTransactions: 0
  });

  // Load saved wallets from localStorage
  useEffect(() => {
    const savedWallets = localStorage.getItem('monitoredWallets');
    const savedEmail = localStorage.getItem('ncbEmail');
    const savedRules = localStorage.getItem('alertRules');
    
    if (savedWallets) {
      setWallets(JSON.parse(savedWallets));
    }
    if (savedEmail) {
      setNcbEmail(savedEmail);
    }
    if (savedRules) {
      setAlertRules(JSON.parse(savedRules));
    }
  }, []);

  // Save wallets to localStorage
  useEffect(() => {
    localStorage.setItem('monitoredWallets', JSON.stringify(wallets));
    setMonitoringStats(prev => ({
      ...prev,
      totalWallets: wallets.length,
      activeMonitoring: wallets.filter(w => w.status === 'active').length
    }));
  }, [wallets]);

  // Save settings
  useEffect(() => {
    localStorage.setItem('ncbEmail', ncbEmail);
    localStorage.setItem('alertRules', JSON.stringify(alertRules));
  }, [ncbEmail, alertRules]);

  // Add new wallet address
  const addWallet = () => {
    if (!newAddress.trim()) {
      alert('Please enter a valid wallet address');
      return;
    }

    // Check if wallet already exists
    if (wallets.some(w => w.address === newAddress.trim())) {
      alert('This wallet is already being monitored');
      return;
    }

    const newWallet = {
      id: Date.now(),
      address: newAddress.trim(),
      addedAt: new Date().toISOString(),
      status: 'active',
      lastChecked: null,
      transactionCount: 0,
      alertCount: 0,
      lastAlert: null,
      transactionHistory: [], // Store transaction history for rule evaluation
      monthlyStats: {
        averageDaily: 0,
        lastCalculated: null
      }
    };

    setWallets([...wallets, newWallet]);
    setNewAddress('');
  };

  // Remove wallet
  const removeWallet = (id) => {
    if (window.confirm('Are you sure you want to stop monitoring this wallet?')) {
      setWallets(wallets.filter(w => w.id !== id));
    }
  };

  // Toggle wallet monitoring
  const toggleWalletStatus = (id) => {
    setWallets(wallets.map(w => 
      w.id === id 
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
        : w
    ));
  };

  // Check transactions for a wallet
  const checkWalletTransactions = useCallback(async (wallet) => {
    try {
      const response = await fetch(`https://blockchain.info/rawaddr/${wallet.address}?limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallet data');
      }

      const data = await response.json();
      const transactions = data.txs || [];

      // Update wallet with transaction history and stats
      setWallets(prev => prev.map(w => 
        w.id === wallet.id 
          ? { 
              ...w, 
              lastChecked: new Date().toISOString(), 
              transactionCount: data.n_tx,
              transactionHistory: transactions,
              monthlyStats: {
                averageDaily: enhancedRules.calculateMonthlyAverage(transactions),
                lastCalculated: new Date().toISOString()
              }
            }
          : w
      ));

      // Analyze each transaction
      for (const tx of transactions) {
        await analyzeTransaction(tx, wallet);
      }

    } catch (error) {
      console.error(`Error checking wallet ${wallet.address}:`, error);
    }
  }, []);

  // Analyze transaction for suspicious patterns
  const analyzeTransaction = async (tx, wallet) => {
    const patterns = [];
    let riskScore = 0;

    // *** NEW ENHANCED RULES EVALUATION ***
    const triggeredRules = enhancedRules.evaluateWalletRules(wallet, tx);
    
    // Process triggered rules
    triggeredRules.forEach(rule => {
      patterns.push({
        type: rule.rule,
        severity: rule.severity,
        details: rule.details
      });
      
      // Add risk score based on rule severity
      if (rule.severity === 'critical') riskScore += 40;
      else if (rule.severity === 'high') riskScore += 30;
      else if (rule.severity === 'medium') riskScore += 15;
    });

    // Check for mixer patterns
    if (alertRules.alertOnMixer && tx.inputs?.length > 3 && tx.out?.length > 3) {
      const valueGroups = {};
      tx.out.forEach(output => {
        const roundedValue = Math.round(output.value / 1000000) * 1000000;
        valueGroups[roundedValue] = (valueGroups[roundedValue] || 0) + 1;
      });

      const hasSimilarOutputs = Object.values(valueGroups).some(count => count >= 3);
      if (hasSimilarOutputs) {
        patterns.push({ type: 'mixer', severity: 'high' });
        riskScore += 30;
      }
    }

    // Check for large transactions
    const totalValue = tx.out?.reduce((sum, output) => sum + output.value, 0) || 0;
    const btcValue = totalValue / 100000000;
    
    if (btcValue >= alertRules.minTransactionAmount) {
      patterns.push({ type: 'large_transaction', severity: 'medium', value: btcValue });
      riskScore += 15;
    }

    // Check for fast succession (if we have previous transactions)
    // This would require storing previous transaction times

    // Check for round numbers
    const hasRoundNumbers = tx.out?.some(output => {
      const value = output.value;
      return value % 10000000 === 0 || value % 50000000 === 0 || value % 100000000 === 0;
    });

    if (hasRoundNumbers) {
      patterns.push({ type: 'round_numbers', severity: 'medium' });
      riskScore += 15;
    }

    // Check if alert should be sent
    const shouldAlert = 
      riskScore >= alertRules.riskScoreThreshold ||
      (alertRules.enableHighSeverity && patterns.some(p => p.severity === 'high')) ||
      (alertRules.enableMediumSeverity && patterns.some(p => p.severity === 'medium'));

    if (shouldAlert && patterns.length > 0) {
      sendAlert(wallet, tx, patterns, riskScore);
    }
  };

  // Send alert email
  const sendAlert = (wallet, transaction, patterns, riskScore) => {
    const alert = {
      id: Date.now(),
      walletAddress: wallet.address,
      transactionHash: transaction.hash,
      timestamp: new Date().toISOString(),
      riskScore,
      patterns,
      emailSent: false
    };

    // Add to recent alerts
    setRecentAlerts(prev => [alert, ...prev].slice(0, 50));

    // Update wallet alert count
    setWallets(prev => prev.map(w => 
      w.id === wallet.id 
        ? { ...w, alertCount: w.alertCount + 1, lastAlert: alert.timestamp }
        : w
    ));

    // Update stats
    setMonitoringStats(prev => ({
      ...prev,
      alertsSent: prev.alertsSent + 1,
      suspiciousTransactions: prev.suspiciousTransactions + 1
    }));

    // Send email to backend
    sendEmailToNCB(alert);
  };

  // Send email via backend API
  const sendEmailToNCB = async (alert) => {
    try {
      const response = await fetch('http://localhost:5000/api/send-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: ncbEmail,
          alert: alert,
          subject: `[ChainPhantom Alert] Suspicious Transaction Detected - Risk Score: ${alert.riskScore}`,
          body: generateEmailBody(alert)
        })
      });

      if (response.ok) {
        // Mark alert as sent
        setRecentAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, emailSent: true } : a
        ));
      }
    } catch (error) {
      console.error('Error sending email alert:', error);
    }
  };

  // Generate email body
  const generateEmailBody = (alert) => {
    return `
CHAINPHANTOM SUSPICIOUS TRANSACTION ALERT
==========================================

ALERT DETAILS:
- Alert ID: ${alert.id}
- Timestamp: ${new Date(alert.timestamp).toLocaleString()}
- Risk Score: ${alert.riskScore}/100

WALLET INFORMATION:
- Monitored Address: ${alert.walletAddress}
- Transaction Hash: ${alert.transactionHash}

DETECTED PATTERNS:
${alert.patterns.map(p => {
  let description = `- ${p.type.toUpperCase()} (${p.severity.toUpperCase()} severity)`;
  if (p.details) {
    if (p.type === 'monthly_average_exceeded') {
      description += `\n  Transaction: ${p.details.transactionValue} BTC | Monthly Avg: ${p.details.monthlyAverage.toFixed(2)} BTC/day | Threshold: ${p.details.threshold.toFixed(2)} BTC`;
    } else if (p.type === 'fast_succession_transactions') {
      description += `\n  ${p.details.transactionCount} transactions in ${p.details.timeWindowHours} hours (threshold: ${p.details.threshold})`;
    } else if (p.type === 'lump_sum_transaction') {
      description += `\n  Amount: ${p.details.transactionValue} BTC (threshold: ${p.details.threshold} BTC)`;
    }
  }
  return description;
}).join('\n')}

ACTION REQUIRED:
Please investigate this transaction immediately.

View full details: http://localhost:3000/tx/${alert.transactionHash}

---
This is an automated alert from ChainPhantom Wallet Monitoring System.
    `.trim();
  };

  // Start/Stop monitoring
  const toggleMonitoring = () => {
    setMonitoringActive(!monitoringActive);
  };

  // Monitor all active wallets
  useEffect(() => {
    if (!monitoringActive) return;

    const interval = setInterval(() => {
      const activeWallets = wallets.filter(w => w.status === 'active');
      
      activeWallets.forEach(wallet => {
        checkWalletTransactions(wallet);
      });
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [monitoringActive, wallets, checkWalletTransactions]);

  // Export monitoring report
  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      statistics: monitoringStats,
      monitoredWallets: wallets,
      recentAlerts: recentAlerts,
      alertRules: alertRules
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wallet-monitoring-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="wallet-monitor-container">
      {/* Header */}
      <div className="monitor-header">
        <div className="header-left">
          <FaWallet className="header-icon" />
          <div>
            <h2>Real-Time Wallet Monitoring</h2>
            <p>Track wallet addresses and receive alerts for suspicious transactions</p>
          </div>
        </div>
        <div className="header-right">
          <button 
            className={`monitoring-toggle ${monitoringActive ? 'active' : ''}`}
            onClick={toggleMonitoring}
          >
            {monitoringActive ? <FaPause /> : <FaPlay />}
            {monitoringActive ? 'Monitoring Active' : 'Start Monitoring'}
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="stats-dashboard">
        <div className="stat-card">
          <div className="stat-icon wallet-icon">
            <FaWallet />
          </div>
          <div className="stat-content">
            <div className="stat-value">{monitoringStats.totalWallets}</div>
            <div className="stat-label">Total Wallets</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{monitoringStats.activeMonitoring}</div>
            <div className="stat-label">Active Monitoring</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon alert-icon">
            <FaBell />
          </div>
          <div className="stat-content">
            <div className="stat-value">{monitoringStats.alertsSent}</div>
            <div className="stat-label">Alerts Sent</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon suspicious-icon">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <div className="stat-value">{monitoringStats.suspiciousTransactions}</div>
            <div className="stat-label">Suspicious Transactions</div>
          </div>
        </div>
      </div>

      {/* Add Wallet Section */}
      <div className="add-wallet-section">
        <h3><FaPlus /> Add Wallet to Monitor</h3>
        <div className="add-wallet-form">
          <input
            type="text"
            placeholder="Enter Bitcoin wallet address (e.g., 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa)"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addWallet()}
            className="wallet-input"
          />
          <button onClick={addWallet} className="add-btn">
            <FaPlus /> Add Wallet
          </button>
        </div>
      </div>

      {/* Settings Section */}
      <div className="settings-section">
        <div className="settings-header" onClick={() => setShowSettings(!showSettings)}>
          <h3><FaCog /> Alert Settings</h3>
          <span className="toggle-icon">{showSettings ? '▼' : '▶'}</span>
        </div>
        
        {showSettings && (
          <div className="settings-content">
            <div className="settings-grid">
              <div className="setting-group">
                <label>
                  <FaEnvelope /> NCB Email Address
                </label>
                <input
                  type="email"
                  value={ncbEmail}
                  onChange={(e) => setNcbEmail(e.target.value)}
                  placeholder="ncb@gov.in"
                  className="setting-input"
                />
              </div>

              <div className="setting-group">
                <label>Risk Score Threshold</label>
                <input
                  type="number"
                  value={alertRules.riskScoreThreshold}
                  onChange={(e) => setAlertRules({...alertRules, riskScoreThreshold: parseInt(e.target.value)})}
                  min="0"
                  max="100"
                  className="setting-input"
                />
                <small>Alert when risk score ≥ {alertRules.riskScoreThreshold}</small>
              </div>

              <div className="setting-group">
                <label>Minimum Transaction Amount (BTC)</label>
                <input
                  type="number"
                  value={alertRules.minTransactionAmount}
                  onChange={(e) => setAlertRules({...alertRules, minTransactionAmount: parseFloat(e.target.value)})}
                  step="0.1"
                  min="0"
                  className="setting-input"
                />
              </div>
            </div>

            <div className="alert-rules">
              <h4>Alert on Severity Levels:</h4>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={alertRules.enableHighSeverity}
                  onChange={(e) => setAlertRules({...alertRules, enableHighSeverity: e.target.checked})}
                />
                <span className="severity-high">High Severity Patterns</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={alertRules.enableMediumSeverity}
                  onChange={(e) => setAlertRules({...alertRules, enableMediumSeverity: e.target.checked})}
                />
                <span className="severity-medium">Medium Severity Patterns</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={alertRules.enableLowSeverity}
                  onChange={(e) => setAlertRules({...alertRules, enableLowSeverity: e.target.checked})}
                />
                <span className="severity-low">Low Severity Patterns</span>
              </label>
            </div>

            <div className="alert-rules">
              <h4>Alert on Specific Patterns:</h4>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={alertRules.alertOnMixer}
                  onChange={(e) => setAlertRules({...alertRules, alertOnMixer: e.target.checked})}
                />
                Mixer/Tumbler Detection
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={alertRules.alertOnLoop}
                  onChange={(e) => setAlertRules({...alertRules, alertOnLoop: e.target.checked})}
                />
                Loop Detection
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={alertRules.alertOnPeeling}
                  onChange={(e) => setAlertRules({...alertRules, alertOnPeeling: e.target.checked})}
                />
                Peeling Chain Detection
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={alertRules.alertOnFastSuccession}
                  onChange={(e) => setAlertRules({...alertRules, alertOnFastSuccession: e.target.checked})}
                />
                Fast Succession Detection
              </label>
            </div>
            
            {/* Enhanced Wallet Rules Settings */}
            <EnhancedRulesSettings 
              enhancedRules={enhancedRules}
              onRulesChange={(newRules) => {
                // Handle rules change if needed
                console.log('Enhanced rules updated:', newRules);
              }}
            />
          </div>
        )}
      </div>

      {/* Monitored Wallets List */}
      <div className="wallets-list-section">
        <div className="section-header">
          <h3><FaEye /> Monitored Wallets ({wallets.length})</h3>
          <button onClick={exportReport} className="export-btn">
            <FaDownload /> Export Report
          </button>
        </div>

        {wallets.length === 0 ? (
          <div className="empty-state">
            <FaWallet className="empty-icon" />
            <p>No wallets being monitored</p>
            <small>Add a wallet address above to start monitoring</small>
          </div>
        ) : (
          <div className="wallets-grid">
            {wallets.map(wallet => (
              <div key={wallet.id} className={`wallet-card ${wallet.status}`}>
                <div className="wallet-card-header">
                  <div className="wallet-status">
                    {wallet.status === 'active' ? (
                      <FaCheckCircle className="status-icon active" />
                    ) : (
                      <FaPause className="status-icon paused" />
                    )}
                    <span className="status-text">{wallet.status}</span>
                  </div>
                  <div className="wallet-actions">
                    <button 
                      onClick={() => toggleWalletStatus(wallet.id)}
                      className="action-btn"
                      title={wallet.status === 'active' ? 'Pause' : 'Resume'}
                    >
                      {wallet.status === 'active' ? <FaPause /> : <FaPlay />}
                    </button>
                    <button 
                      onClick={() => removeWallet(wallet.id)}
                      className="action-btn delete"
                      title="Remove"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="wallet-address">
                  <strong>Address:</strong>
                  <code>{wallet.address}</code>
                </div>

                <div className="wallet-stats">
                  <div className="wallet-stat">
                    <span className="stat-label">Added:</span>
                    <span className="stat-value">{new Date(wallet.addedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="wallet-stat">
                    <span className="stat-label">Transactions:</span>
                    <span className="stat-value">{wallet.transactionCount}</span>
                  </div>
                  <div className="wallet-stat">
                    <span className="stat-label">Alerts:</span>
                    <span className="stat-value alert-count">{wallet.alertCount}</span>
                  </div>
                </div>

                {wallet.lastChecked && (
                  <div className="wallet-last-checked">
                    <FaClock /> Last checked: {new Date(wallet.lastChecked).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Alerts */}
      <div className="alerts-section">
        <h3><FaBell /> Recent Alerts ({recentAlerts.length})</h3>
        
        {recentAlerts.length === 0 ? (
          <div className="empty-state">
            <FaBell className="empty-icon" />
            <p>No alerts yet</p>
            <small>Alerts will appear here when suspicious transactions are detected</small>
          </div>
        ) : (
          <div className="alerts-list">
            {recentAlerts.slice(0, 10).map(alert => (
              <div key={alert.id} className="alert-item">
                <div className="alert-header">
                  <div className="alert-risk">
                    <span className={`risk-badge risk-${alert.riskScore >= 70 ? 'critical' : alert.riskScore >= 50 ? 'high' : 'medium'}`}>
                      Risk: {alert.riskScore}
                    </span>
                  </div>
                  <div className="alert-time">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="alert-details">
                  <div className="alert-wallet">
                    <strong>Wallet:</strong> {alert.walletAddress.substring(0, 20)}...
                  </div>
                  <div className="alert-tx">
                    <strong>Transaction:</strong> 
                    <a href={`/tx/${alert.transactionHash}`} target="_blank" rel="noopener noreferrer">
                      {alert.transactionHash.substring(0, 16)}...
                    </a>
                  </div>
                </div>

                <div className="alert-patterns">
                  {alert.patterns.map((pattern, idx) => (
                    <span key={idx} className={`pattern-badge severity-${pattern.severity}`}>
                      {pattern.type.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>

                <div className="alert-email-status">
                  {alert.emailSent ? (
                    <span className="email-sent">
                      <FaCheckCircle /> Email sent to NCB
                    </span>
                  ) : (
                    <span className="email-pending">
                      <FaClock /> Sending email...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletMonitor;
