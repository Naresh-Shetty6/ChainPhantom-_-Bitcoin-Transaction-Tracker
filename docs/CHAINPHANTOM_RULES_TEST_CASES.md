# ChainPhantom Rules Test Cases

## Overview
This document describes the three main rules implemented in ChainPhantom for detecting suspicious wallet activity in the testnet environment.

---

## Rule 1: Exceeds Monthly Average Transactions

### Description
Flag the wallet if the number of transactions exceeds the monthly average.

### Detection Logic
- **Threshold**: Wallet has significantly more transactions this month compared to its monthly average
- **Example**: Wallet averages 20 transactions/month but has 45 transactions this month
- **Risk Level**: Medium (55/100)

### Test Address
```
meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```

### Expected Behavior
- ⚠️ **Alert**: "FLAGGED: Wallet has 45 transactions this month, exceeding monthly average of 20 transactions"
- **Pattern**: `exceeds_monthly_average`
- **Severity**: Medium
- **Details**: Unusual activity pattern detected - significantly higher than normal

### Testing Steps
1. Switch to Testnet mode (toggle in navbar)
2. Navigate to Address Details or Forensic Analysis
3. Enter test address: `meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
4. Verify the following is displayed:
   - Risk score: ~55
   - Pattern detected: "exceeds_monthly_average"
   - Alert message showing transaction count exceeds average
   - Monthly transaction count: 45
   - Monthly average: 20

---

## Rule 2: High Frequency Short Span

### Description
Flag the wallet address if it does more than 10 transactions within a short time span.

### Detection Logic
- **Threshold**: More than 10 transactions within 24 hours
- **Example**: Wallet has 15 transactions within the last day
- **Risk Level**: High (65/100)

### Test Address
```
mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```

### Expected Behavior
- 🚨 **Alert**: "FLAGGED: Wallet has 15 transactions within a short time span (exceeds 10 transaction threshold)"
- **Pattern**: `high_frequency_short_span`
- **Severity**: High
- **Details**: Possible automated trading or suspicious activity detected

### Testing Steps
1. Switch to Testnet mode
2. Navigate to Address Details or Forensic Analysis
3. Enter test address: `mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
4. Verify the following is displayed:
   - Risk score: ~65
   - Pattern detected: "high_frequency_short_span"
   - Alert showing burst activity
   - Transaction count: 15
   - Time span: Less than 24 hours
   - Transactions occurring every ~5 minutes

---

## Rule 3: Lump Sum Transaction

### Description
Flag the wallet address if it is a lump sum transaction (very huge amount).

### Detection Logic
- **Threshold**: Transaction value exceeds 100 BTC
- **Example**: Single transaction of 250 BTC
- **Risk Level**: High (70/100)

### Test Address
```
mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```

### Expected Behavior
- 🚨 **Alert**: "FLAGGED: Lump sum transaction detected - 250 BTC"
- **Pattern**: `lump_sum_transaction`
- **Severity**: High
- **Details**: Very huge amount that exceeds normal transaction patterns

### Testing Steps
1. Switch to Testnet mode
2. Navigate to Address Details or Forensic Analysis
3. Enter test address: `mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
4. Verify the following is displayed:
   - Risk score: ~70
   - Pattern detected: "lump_sum_transaction"
   - Alert showing large transfer amount
   - Transaction with value > 100 BTC
   - Warning about unusual transaction size

---

## Combined Test Scenarios

### Quick Test Table

| Rule | Test Address | Expected Risk | Key Indicator |
|------|--------------|---------------|---------------|
| Rule 1: Exceeds Monthly Avg | `meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc` | Medium (55) | 45 tx vs 20 avg |
| Rule 2: High Frequency | `mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc` | High (65) | 15 tx in < 24h |
| Rule 3: Lump Sum | `mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc` | High (70) | > 100 BTC |

---

## Wallet Monitor Integration

All three rules are integrated into the Wallet Monitor feature. When monitoring these addresses:

### Expected Alerts

#### Rule 1 - Exceeds Monthly Average
```
Type: exceeds_average
Severity: medium
Message: ⚠️ FLAGGED: Wallet has 45 transactions this month, 
         exceeding monthly average of 20 transactions
Details: Unusual activity pattern detected - significantly higher than normal
```

#### Rule 2 - High Frequency Short Span
```
Type: high_frequency
Severity: high
Message: 🚨 FLAGGED: Wallet has 15 transactions within a short time span 
         (exceeds 10 transaction threshold)
Details: Possible automated trading or suspicious activity detected
```

#### Rule 3 - Lump Sum Transaction
```
Type: lump_sum
Severity: high
Message: 🚨 FLAGGED: Lump sum transaction detected - 250 BTC
Details: Very huge amount that exceeds normal transaction patterns
```

---

## Pattern Detection Integration

All three rules are integrated into the Pattern Detection system:

### Suspicious Patterns Section

When analyzing transactions or addresses, the system will display:

1. **Pattern Type**: The specific rule violated (e.g., `exceeds_monthly_average`)
2. **Severity**: Risk level (low, medium, high, critical)
3. **Description**: Detailed explanation of the detected pattern
4. **Risk Score**: Numerical score (0-100)

---

## Forensic Analysis Integration

The forensic analysis component displays comprehensive information:

### Risk Analysis Dashboard
- Overall risk score
- List of detected patterns
- Individual pattern descriptions
- Severity indicators
- Timeline of suspicious activity

### Expected Output for Each Rule

#### Rule 1: Exceeds Monthly Average
```json
{
  "riskScore": 55,
  "patterns": [
    {
      "type": "exceeds_monthly_average",
      "severity": "medium",
      "count": 45,
      "description": "Flagged: Wallet has 45 transactions this month, exceeding 
                      the monthly average of 20 transactions - Unusual activity 
                      pattern detected"
    }
  ]
}
```

#### Rule 2: High Frequency Short Span
```json
{
  "riskScore": 65,
  "patterns": [
    {
      "type": "high_frequency_short_span",
      "severity": "high",
      "count": 15,
      "description": "Flagged: Wallet address has 15 transactions within a short 
                      time span (exceeds 10 transaction threshold) - Possible 
                      automated trading or suspicious activity"
    }
  ]
}
```

#### Rule 3: Lump Sum Transaction
```json
{
  "riskScore": 70,
  "patterns": [
    {
      "type": "lump_sum_transaction",
      "severity": "high",
      "count": 1,
      "description": "Flagged: Lump sum transaction detected - Very huge amount 
                      of 250 BTC in a single transaction - Exceeds normal 
                      transaction patterns"
    }
  ]
}
```

---

## Testing Checklist

- [ ] **Rule 1**: Test address `meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
  - [ ] Risk score shows ~55
  - [ ] Pattern "exceeds_monthly_average" detected
  - [ ] Alert message displays correctly
  - [ ] Monthly average comparison shown (45 vs 20)

- [ ] **Rule 2**: Test address `mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
  - [ ] Risk score shows ~65
  - [ ] Pattern "high_frequency_short_span" detected
  - [ ] Alert message displays correctly
  - [ ] Transaction count > 10 in short time span

- [ ] **Rule 3**: Test address `mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
  - [ ] Risk score shows ~70
  - [ ] Pattern "lump_sum_transaction" detected
  - [ ] Alert message displays correctly
  - [ ] Large BTC amount shown (> 100 BTC)

- [ ] **Wallet Monitor**: Add all three addresses
  - [ ] Each shows appropriate alerts
  - [ ] Severity levels correct
  - [ ] Real-time monitoring displays status

- [ ] **Forensic Analysis**: Analyze each address
  - [ ] Full pattern detection report
  - [ ] Risk breakdown by pattern
  - [ ] Detailed explanations

---

## Additional Features

### Multi-Component Support

These rules are implemented across multiple components:

1. **Address Details** - Shows flagged status
2. **Forensic Analysis** - Full pattern analysis
3. **Wallet Monitor** - Real-time alerts
4. **Pattern Detection** - Suspicious pattern identification
5. **Transaction Details** - Transaction-level analysis
6. **Multi-Chain Analysis** - Cross-chain pattern detection

### Address Format Support

The system recognizes addresses starting with:
- `me...` - Exceeds monthly average (Rule 1)
- `mh...` - High frequency short span (Rule 2)
- `ml...` - Lump sum transaction (Rule 3)
- `ne...` - Alternative format for Rule 1
- `nh...` - Alternative format for Rule 2
- `nl...` - Alternative format for Rule 3

---

## Notes

- All test data is generated dynamically in testnet mode
- Mainnet mode uses real blockchain API data
- Risk scores may vary slightly due to random factors
- Patterns are detected using multiple heuristics
- Severity levels are automatically assigned based on risk thresholds

---

## Contact & Support

For questions or issues with test cases, refer to:
- `frontend/src/utils/testnetMockData.js` - Mock data implementation
- `frontend/src/utils/testEntries.js` - Test address definitions
- `docs/TEST_ENTRIES.md` - Additional test documentation

