import React from 'react';
import { FaCog, FaClock, FaCoins, FaChartLine } from 'react-icons/fa';

const EnhancedRulesSettings = ({ enhancedRules, onRulesChange }) => {
  const { alertRules, setAlertRules } = enhancedRules;

  const handleRuleChange = (key, value) => {
    const newRules = { ...alertRules, [key]: value };
    setAlertRules(newRules);
    if (onRulesChange) onRulesChange(newRules);
  };

  return (
    <div className="enhanced-rules-settings">
      <div className="settings-header">
        <FaCog className="settings-icon" />
        <h3>Enhanced Wallet Rules</h3>
      </div>

      {/* Rule 1: Monthly Average */}
      <div className="rule-section">
        <div className="rule-header">
          <FaChartLine className="rule-icon" />
          <h4>Rule 1: Monthly Average Threshold</h4>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={alertRules.enableMonthlyAverageRule}
              onChange={(e) => handleRuleChange('enableMonthlyAverageRule', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <p className="rule-description">
          Flag wallet if transaction value exceeds monthly average by specified multiplier
        </p>
        <div className="rule-controls">
          <div className="control-group">
            <label>Multiplier (x times monthly average):</label>
            <input
              type="number"
              min="1"
              max="10"
              step="0.1"
              value={alertRules.monthlyAverageMultiplier}
              onChange={(e) => handleRuleChange('monthlyAverageMultiplier', parseFloat(e.target.value))}
              disabled={!alertRules.enableMonthlyAverageRule}
            />
          </div>
          <div className="control-group">
            <label>Minimum History Days:</label>
            <input
              type="number"
              min="7"
              max="90"
              value={alertRules.minimumHistoryDays}
              onChange={(e) => handleRuleChange('minimumHistoryDays', parseInt(e.target.value))}
              disabled={!alertRules.enableMonthlyAverageRule}
            />
          </div>
        </div>
      </div>

      {/* Rule 2: Fast Succession */}
      <div className="rule-section">
        <div className="rule-header">
          <FaClock className="rule-icon" />
          <h4>Rule 2: Fast Succession Transactions</h4>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={alertRules.enableFastSuccessionRule}
              onChange={(e) => handleRuleChange('enableFastSuccessionRule', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <p className="rule-description">
          Flag wallet if more than specified number of transactions occur within time window
        </p>
        <div className="rule-controls">
          <div className="control-group">
            <label>Transaction Count Threshold:</label>
            <input
              type="number"
              min="5"
              max="50"
              value={alertRules.fastSuccessionCount}
              onChange={(e) => handleRuleChange('fastSuccessionCount', parseInt(e.target.value))}
              disabled={!alertRules.enableFastSuccessionRule}
            />
          </div>
          <div className="control-group">
            <label>Time Window (hours):</label>
            <input
              type="number"
              min="0.5"
              max="24"
              step="0.5"
              value={alertRules.fastSuccessionTimeWindow / 3600}
              onChange={(e) => handleRuleChange('fastSuccessionTimeWindow', parseFloat(e.target.value) * 3600)}
              disabled={!alertRules.enableFastSuccessionRule}
            />
          </div>
        </div>
      </div>

      {/* Rule 3: Lump Sum */}
      <div className="rule-section">
        <div className="rule-header">
          <FaCoins className="rule-icon" />
          <h4>Rule 3: Lump Sum Transactions</h4>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={alertRules.enableLumpSumRule}
              onChange={(e) => handleRuleChange('enableLumpSumRule', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <p className="rule-description">
          Flag wallet if single transaction exceeds specified BTC amount
        </p>
        <div className="rule-controls">
          <div className="control-group">
            <label>Threshold Amount (BTC):</label>
            <input
              type="number"
              min="1"
              max="1000"
              step="0.1"
              value={alertRules.lumpSumThreshold}
              onChange={(e) => handleRuleChange('lumpSumThreshold', parseFloat(e.target.value))}
              disabled={!alertRules.enableLumpSumRule}
            />
          </div>
        </div>
      </div>

      {/* Rule Summary */}
      <div className="rules-summary">
        <h4>Active Rules Summary</h4>
        <div className="summary-grid">
          <div className={`summary-item ${alertRules.enableMonthlyAverageRule ? 'active' : 'inactive'}`}>
            <span className="rule-name">Monthly Average</span>
            <span className="rule-value">
              {alertRules.enableMonthlyAverageRule ? `${alertRules.monthlyAverageMultiplier}x` : 'Disabled'}
            </span>
          </div>
          <div className={`summary-item ${alertRules.enableFastSuccessionRule ? 'active' : 'inactive'}`}>
            <span className="rule-name">Fast Succession</span>
            <span className="rule-value">
              {alertRules.enableFastSuccessionRule ? 
                `${alertRules.fastSuccessionCount} txs/${alertRules.fastSuccessionTimeWindow/3600}h` : 
                'Disabled'
              }
            </span>
          </div>
          <div className={`summary-item ${alertRules.enableLumpSumRule ? 'active' : 'inactive'}`}>
            <span className="rule-name">Lump Sum</span>
            <span className="rule-value">
              {alertRules.enableLumpSumRule ? `${alertRules.lumpSumThreshold} BTC` : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRulesSettings;
