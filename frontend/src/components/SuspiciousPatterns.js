import React, { useState, useEffect, useCallback } from 'react';
import './SuspiciousPatterns.css';
import { API_KEY } from '../config';
import { useNetwork } from '../contexts/NetworkContext';
import { getTestnetForensicAnalysis } from '../utils/testnetMockData';

const SuspiciousPatterns = ({ address }) => {
  const { isTestnet } = useNetwork();
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addressData, setAddressData] = useState(null);
  const [riskScore, setRiskScore] = useState(0);

  const detectSuspiciousPatterns = useCallback(async () => {
    setLoading(true);
    setError('');
    setPatterns([]);

    // Use testnet mock data if in testnet mode
    if (isTestnet) {
      try {
        const forensicAnalysis = getTestnetForensicAnalysis(address);
        setPatterns(forensicAnalysis.patterns || []);
        setRiskScore(forensicAnalysis.riskScore || 0);
        setLoading(false);
        return;
      } catch (err) {
        console.error('Error with testnet forensic analysis:', err);
        setError('Failed to analyze address patterns');
        setLoading(false);
        return;
      }
    }

    try {
      // Fetch actual address data from blockchain.info
      const response = await fetch(`https://blockchain.info/rawaddr/${address}?limit=50&api_key=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch address data');
      }

      const data = await response.json();
      setAddressData(data);

      // Now analyze the transaction data for suspicious patterns
      const suspiciousPatterns = [];

      // 1. Check for large transaction volume
      if (data.n_tx > 100) {
        suspiciousPatterns.push({
          type: 'High Transaction Volume',
          description: 'This address has an unusually high number of transactions.',
          severity: 'low',
          address: address,
          value: data.n_tx
        });
      }

      // 2. Check for round-number transactions (possible money laundering)
      const txs = data.txs || [];
      const roundNumberTxs = txs.filter(tx => {
        return tx.out.some(output => {
          const btcValue = output.value / 1e8;
          return btcValue === Math.round(btcValue * 10) / 10 && btcValue > 1; // Round to 0.1 BTC
        });
      });

      if (roundNumberTxs.length > 3) {
        suspiciousPatterns.push({
          type: 'Round-Number Transactions',
          description: 'Multiple transactions with round number values, potentially indicating structured payments.',
          severity: 'medium',
          address: address,
          value: roundNumberTxs.length
        });
      }

      // 3. Check for peeling chain pattern (small outputs with large remainder)
      const peelingChainTxs = txs.filter(tx => {
        if (tx.out.length !== 2) return false;
        
        const values = tx.out.map(o => o.value).sort((a, b) => a - b);
        return values[1] > values[0] * 10; // One output is at least 10x larger than the other
      });

      if (peelingChainTxs.length > 2) {
        suspiciousPatterns.push({
          type: 'Peeling Chain',
          description: 'Multiple small transactions used to obfuscate the flow of funds.',
          severity: 'medium',
          address: address,
          value: peelingChainTxs.length
        });
      }

      // 4. Check for large value transaction
      const largeTransactions = txs.filter(tx => {
        const totalOutput = tx.out.reduce((sum, output) => sum + output.value, 0);
        return totalOutput > 10 * 1e8; // More than 10 BTC
      });

      if (largeTransactions.length > 0) {
        suspiciousPatterns.push({
          type: 'Large Value Transaction',
          description: 'Transactions with unusually large BTC value detected.',
          severity: largeTransactions.length > 3 ? 'high' : 'medium',
          address: address,
          value: largeTransactions.length
        });
      }

      // 5. Check if address is involved in transactions with known mixer addresses
      // This would require a database of known mixer addresses, using a placeholder check
      const isMixerInvolved = false; // Placeholder, would check against a real database

      if (isMixerInvolved) {
        suspiciousPatterns.push({
          type: 'Mixer Service Usage',
          description: 'Transactions connected to known cryptocurrency mixer services.',
          severity: 'high',
          address: address
        });
      }

      setPatterns(suspiciousPatterns);
    } catch (err) {
      console.error('API error:', err.message);
      setError(`Could not analyze address: ${err.message}. Please try again later.`);
      setPatterns([]);
    } finally {
      setLoading(false);
    }
  }, [address, isTestnet]);

  useEffect(() => {
    if (address) {
      detectSuspiciousPatterns();
    }
  }, [address, detectSuspiciousPatterns]);

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      case 'low':
        return 'severity-low';
      default:
        return '';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟠';
      case 'low':
        return '🟡';
      default:
        return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="suspicious-container">
        <div className="suspicious-loading">
          <div className="loading-spinner"></div>
          <p>Analyzing address patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="suspicious-container">
      <div className="suspicious-header">
        <h5>Suspicious Pattern Detection</h5>
        <button
          className="btn btn-accent btn-sm"
          onClick={detectSuspiciousPatterns}
        >
          Scan Again
        </button>
      </div>

      {error && (
        <div className="alert alert-warning mb-3">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {addressData && (
        <div className="address-stats mb-3">
          <div className="row text-center">
            <div className="col-md-4">
              <div className="stat-item">
                <div className="stat-value">{addressData.n_tx}</div>
                <div className="stat-label">Transactions</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-item">
                <div className="stat-value">{(addressData.total_received / 1e8).toFixed(4)} BTC</div>
                <div className="stat-label">Total Received</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-item">
                <div className="stat-value">{(addressData.final_balance / 1e8).toFixed(4)} BTC</div>
                <div className="stat-label">Final Balance</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {riskScore > 0 && (
        <div className="risk-score-display mb-3">
          <div className="risk-score-value" style={{ 
            color: riskScore >= 70 ? '#e74c3c' : riskScore >= 50 ? '#f39c12' : '#3498db',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            Risk Score: {riskScore}/100
          </div>
        </div>
      )}

      {patterns.length === 0 ? (
        <div className="suspicious-none">
          <p>No suspicious patterns detected</p>
          <div className="success-icon">✅</div>
        </div>
      ) : (
        <div className="suspicious-list">
          {patterns.map((pattern, index) => (
            <div
              key={index}
              className={`suspicious-item ${getSeverityClass(pattern.severity)}`}
            >
              <div className="suspicious-icon">
                {getSeverityIcon(pattern.severity)}
              </div>
              <div className="suspicious-details">
                <div className="suspicious-type">{pattern.type.replace(/_/g, ' ').toUpperCase()}</div>
                <div className="suspicious-description">{pattern.description}</div>
                {pattern.count && (
                  <div className="suspicious-value">
                    <strong>Count:</strong> {pattern.count}
                  </div>
                )}
                {pattern.value && (
                  <div className="suspicious-value">
                    <strong>Count:</strong> {pattern.value}
                  </div>
                )}
              </div>
              <div className="suspicious-severity">
                {pattern.severity.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuspiciousPatterns; 