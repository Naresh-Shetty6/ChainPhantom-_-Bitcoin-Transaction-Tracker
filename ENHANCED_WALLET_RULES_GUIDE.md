# Enhanced Wallet Rules Guide

## Overview

ChainPhantom now includes three powerful new wallet monitoring rules based on advanced behavioral analysis. These rules complement the existing pattern detection algorithms to provide comprehensive surveillance capabilities for law enforcement agencies.

## New Rules Implementation

### Rule 1: Monthly Average Threshold Detection

**Purpose**: Flag wallets when transaction values significantly exceed their historical monthly average.

**How it works**:
- Calculates the daily average transaction value over the last 30 days
- Triggers alert when a new transaction exceeds the average by a configurable multiplier
- Default threshold: 2x monthly average

**Configuration**:
- **Multiplier**: 1.0 - 10.0x (default: 2.0x)
- **Minimum History**: 7-90 days (default: 30 days)
- **Enable/Disable**: Toggle switch

**Use Cases**:
- Detecting sudden large transactions from normally low-activity wallets
- Identifying potential money laundering through dormant accounts
- Flagging unusual spending patterns

**Example Alert**:
```
MONTHLY_AVERAGE_EXCEEDED (HIGH severity)
Transaction: 15.5 BTC | Monthly Avg: 2.3 BTC/day | Threshold: 4.6 BTC
```

### Rule 2: Fast Succession Transaction Detection

**Purpose**: Flag wallets with unusually high transaction frequency within short time windows.

**How it works**:
- Monitors transaction count within a sliding time window
- Triggers alert when transaction count exceeds threshold
- Default: >10 transactions within 1 hour

**Configuration**:
- **Transaction Count**: 5-50 transactions (default: 10)
- **Time Window**: 0.5-24 hours (default: 1 hour)
- **Enable/Disable**: Toggle switch

**Use Cases**:
- Detecting automated trading or bot activity
- Identifying potential mixing/tumbling operations
- Flagging rapid fund movement patterns

**Example Alert**:
```
FAST_SUCCESSION_TRANSACTIONS (HIGH severity)
15 transactions in 1 hours (threshold: 10)
```

### Rule 3: Lump Sum Transaction Detection

**Purpose**: Flag wallets with single transactions exceeding a large BTC threshold.

**How it works**:
- Monitors individual transaction values
- Triggers critical alert when amount exceeds threshold
- Default threshold: 50 BTC

**Configuration**:
- **Threshold Amount**: 1-1000 BTC (default: 50 BTC)
- **Enable/Disable**: Toggle switch

**Use Cases**:
- Detecting large-scale money transfers
- Identifying potential institutional or exchange movements
- Flagging high-value suspicious transactions

**Example Alert**:
```
LUMP_SUM_TRANSACTION (CRITICAL severity)
Amount: 75.2 BTC (threshold: 50 BTC)
```

## Technical Implementation

### Architecture

```
EnhancedWalletRules.js
├── Rule Evaluation Engine
├── Monthly Average Calculator
├── Fast Succession Monitor
├── Lump Sum Detector
└── Alert Generation System

WalletMonitor.js
├── Enhanced Rules Integration
├── Real-time Monitoring (60s intervals)
├── Email Alert System
└── Settings UI Integration
```

### Data Flow

1. **Wallet Registration**: Store wallet with transaction history tracking
2. **Periodic Monitoring**: Check wallets every 60 seconds
3. **Rule Evaluation**: Apply all three rules to new transactions
4. **Alert Generation**: Create detailed alerts with rule-specific data
5. **Email Notification**: Send enhanced alerts to NCB with full details

### Risk Scoring

Enhanced rules contribute to overall risk scoring:
- **Critical Severity**: +40 points
- **High Severity**: +30 points
- **Medium Severity**: +15 points

## User Interface

### Enhanced Rules Settings Panel

The new settings panel provides:
- **Individual Rule Toggles**: Enable/disable each rule independently
- **Configurable Thresholds**: Adjust sensitivity for each rule
- **Real-time Summary**: Visual overview of active rules
- **Rule Status Indicators**: Color-coded active/inactive states

### Alert Display

Enhanced alerts show:
- **Rule-specific Details**: Threshold comparisons and calculations
- **Severity Indicators**: Color-coded risk levels
- **Historical Context**: Monthly averages and trend data
- **Action Recommendations**: Suggested investigation steps

## Email Alert Enhancements

### Enhanced Email Format

```
CHAINPHANTOM SUSPICIOUS TRANSACTION ALERT
==========================================

ALERT DETAILS:
- Alert ID: 1699123456789
- Timestamp: 11/4/2023, 2:30:45 PM
- Risk Score: 85/100

WALLET INFORMATION:
- Monitored Address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
- Transaction Hash: abc123...def456

DETECTED PATTERNS:
- MONTHLY_AVERAGE_EXCEEDED (HIGH severity)
  Transaction: 15.5 BTC | Monthly Avg: 2.30 BTC/day | Threshold: 4.60 BTC
- LUMP_SUM_TRANSACTION (CRITICAL severity)
  Amount: 15.5 BTC (threshold: 10.0 BTC)

ACTION REQUIRED:
Please investigate this transaction immediately.
```

## Configuration Best Practices

### For High-Security Environments (NCB)
- **Monthly Average Multiplier**: 1.5x (more sensitive)
- **Fast Succession**: 5 transactions in 30 minutes
- **Lump Sum Threshold**: 10 BTC

### For General Monitoring
- **Monthly Average Multiplier**: 3.0x (less false positives)
- **Fast Succession**: 15 transactions in 2 hours
- **Lump Sum Threshold**: 100 BTC

### For Exchange Monitoring
- **Monthly Average Multiplier**: 5.0x (account for volatility)
- **Fast Succession**: 50 transactions in 1 hour
- **Lump Sum Threshold**: 500 BTC

## Integration with Existing Features

### Pattern Detection Synergy
Enhanced rules work alongside existing algorithms:
- **Mixer Detection**: Combined with fast succession for better accuracy
- **Loop Detection**: Enhanced by monthly average analysis
- **Peeling Chains**: Complemented by lump sum detection

### Export and Reporting
Enhanced rule data is included in:
- **PDF Reports**: Rule-specific sections with detailed analysis
- **JSON Exports**: Complete rule evaluation data
- **CSV Exports**: Summary statistics and thresholds

## Troubleshooting

### Common Issues

**Rule Not Triggering**:
- Check if rule is enabled in settings
- Verify threshold configurations
- Ensure wallet has sufficient transaction history

**False Positives**:
- Adjust multiplier/threshold values
- Consider wallet usage patterns
- Review time window settings

**Missing Alerts**:
- Verify email configuration
- Check monitoring status (active/paused)
- Review backend API connectivity

### Performance Considerations

- **Memory Usage**: Enhanced rules store additional transaction history
- **API Calls**: Increased blockchain.info requests for historical data
- **Processing Time**: Rule evaluation adds ~50ms per wallet check

## Future Enhancements

### Planned Features
1. **Machine Learning Integration**: Adaptive thresholds based on wallet behavior
2. **Cross-Wallet Analysis**: Detect patterns across multiple monitored wallets
3. **Time-based Rules**: Different thresholds for different times of day
4. **Geo-location Correlation**: Combine with IP/location data when available

### Advanced Rules (Under Development)
- **Velocity Analysis**: Rate of change in transaction patterns
- **Network Analysis**: Connections between flagged wallets
- **Seasonal Adjustments**: Account for market cycles and events

## Support and Maintenance

### Regular Updates
- **Rule Calibration**: Monthly review of threshold effectiveness
- **Performance Monitoring**: Track rule accuracy and false positive rates
- **Feature Requests**: Collect feedback from NCB and other agencies

### Contact Information
For technical support or feature requests regarding enhanced wallet rules:
- **Development Team**: ChainPhantom Core Team
- **Documentation**: This guide and inline code comments
- **Issue Tracking**: GitHub repository issues section

---

*This guide covers the enhanced wallet rules implementation in ChainPhantom v2.0. For general usage instructions, see the main WALLET_MONITOR_GUIDE.md file.*
