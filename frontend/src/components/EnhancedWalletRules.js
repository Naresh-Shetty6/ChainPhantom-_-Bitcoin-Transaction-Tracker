import React, { useState, useEffect } from 'react';
import './WalletMonitor.css';

const EnhancedWalletRules = () => {
  const [walletStats, setWalletStats] = useState({});
  const [alertRules, setAlertRules] = useState({
    // Rule 1: Monthly average threshold
    monthlyAverageMultiplier: 2.0, // Flag if exceeds 2x monthly average
    enableMonthlyAverageRule: true,
    
    // Rule 2: Fast succession transactions
    fastSuccessionCount: 10, // Number of transactions
    fastSuccessionTimeWindow: 3600, // Time window in seconds (1 hour)
    enableFastSuccessionRule: true,
    
    // Rule 3: Lump sum transactions
    lumpSumThreshold: 50.0, // BTC amount threshold
    enableLumpSumRule: true,
    
    // Additional settings
    minimumHistoryDays: 30, // Minimum days of history for monthly average
    alertSeverity: 'high'
  });

  // Calculate monthly average for a wallet
  const calculateMonthlyAverage = (transactions) => {
    if (!transactions || transactions.length === 0) return 0;
    
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    // Filter transactions from last 30 days
    const recentTxs = transactions.filter(tx => 
      tx.time * 1000 >= thirtyDaysAgo
    );
    
    if (recentTxs.length === 0) return 0;
    
    // Calculate total value and average
    const totalValue = recentTxs.reduce((sum, tx) => {
      const txValue = tx.out?.reduce((outSum, output) => 
        outSum + (output.value || 0), 0) || 0;
      return sum + txValue;
    }, 0);
    
    return totalValue / 100000000 / 30; // Convert to BTC per day
  };

  // Check Rule 1: Monthly Average Exceeded
  const checkMonthlyAverageRule = (wallet, newTransaction) => {
    const monthlyAverage = calculateMonthlyAverage(wallet.transactionHistory);
    const newTxValue = newTransaction.out?.reduce((sum, output) => 
      sum + (output.value || 0), 0) || 0;
    const newTxBTC = newTxValue / 100000000;
    
    const threshold = monthlyAverage * alertRules.monthlyAverageMultiplier;
    
    if (alertRules.enableMonthlyAverageRule && newTxBTC > threshold) {
      return {
        triggered: true,
        rule: 'monthly_average_exceeded',
        severity: 'high',
        details: {
          transactionValue: newTxBTC,
          monthlyAverage: monthlyAverage,
          threshold: threshold,
          multiplier: alertRules.monthlyAverageMultiplier
        }
      };
    }
    
    return { triggered: false };
  };

  // Check Rule 2: Fast Succession Transactions
  const checkFastSuccessionRule = (wallet, newTransaction) => {
    if (!alertRules.enableFastSuccessionRule) return { triggered: false };
    
    const now = Date.now();
    const timeWindow = alertRules.fastSuccessionTimeWindow * 1000;
    const windowStart = now - timeWindow;
    
    // Count recent transactions within time window
    const recentTxs = wallet.transactionHistory?.filter(tx => 
      tx.time * 1000 >= windowStart
    ) || [];
    
    // Include the new transaction
    const totalRecentTxs = recentTxs.length + 1;
    
    if (totalRecentTxs > alertRules.fastSuccessionCount) {
      return {
        triggered: true,
        rule: 'fast_succession_transactions',
        severity: 'high',
        details: {
          transactionCount: totalRecentTxs,
          timeWindow: alertRules.fastSuccessionTimeWindow,
          threshold: alertRules.fastSuccessionCount,
          timeWindowHours: alertRules.fastSuccessionTimeWindow / 3600
        }
      };
    }
    
    return { triggered: false };
  };

  // Check Rule 3: Lump Sum Transaction
  const checkLumpSumRule = (wallet, newTransaction) => {
    if (!alertRules.enableLumpSumRule) return { triggered: false };
    
    const totalValue = newTransaction.out?.reduce((sum, output) => 
      sum + (output.value || 0), 0) || 0;
    const btcValue = totalValue / 100000000;
    
    if (btcValue >= alertRules.lumpSumThreshold) {
      return {
        triggered: true,
        rule: 'lump_sum_transaction',
        severity: 'critical',
        details: {
          transactionValue: btcValue,
          threshold: alertRules.lumpSumThreshold,
          isLumpSum: true
        }
      };
    }
    
    return { triggered: false };
  };

  // Main rule evaluation function
  const evaluateWalletRules = (wallet, newTransaction) => {
    const triggeredRules = [];
    
    // Check all three rules
    const rule1 = checkMonthlyAverageRule(wallet, newTransaction);
    const rule2 = checkFastSuccessionRule(wallet, newTransaction);
    const rule3 = checkLumpSumRule(wallet, newTransaction);
    
    if (rule1.triggered) triggeredRules.push(rule1);
    if (rule2.triggered) triggeredRules.push(rule2);
    if (rule3.triggered) triggeredRules.push(rule3);
    
    return triggeredRules;
  };

  // Generate alert for triggered rules
  const generateRuleAlert = (wallet, transaction, triggeredRules) => {
    const alert = {
      id: Date.now(),
      walletAddress: wallet.address,
      transactionHash: transaction.hash,
      timestamp: new Date().toISOString(),
      triggeredRules: triggeredRules,
      severity: triggeredRules.some(r => r.severity === 'critical') ? 'critical' : 'high',
      ruleCount: triggeredRules.length
    };
    
    return alert;
  };

  return {
    alertRules,
    setAlertRules,
    evaluateWalletRules,
    generateRuleAlert,
    calculateMonthlyAverage
  };
};

export default EnhancedWalletRules;
