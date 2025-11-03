# Pattern Detector - Feature Overview

## 🎯 Quick Start Guide

### What is the Pattern Detector?
The Pattern Detector is ChainPhantom's advanced forensic analysis tool that automatically identifies suspicious transaction patterns and calculates risk scores for Bitcoin transactions.

---

## 🔍 Detection Capabilities

### 🔴 High Severity Patterns

#### 1. Loop Detection
**What it detects:** Circular transaction patterns where funds return to original addresses
```
Example: Address A → Address B → Address A
```
**Why it matters:** Often indicates money laundering or obfuscation attempts

#### 2. Mixer/Tumbler Detection  
**What it detects:** Transactions with characteristics of mixing services
- Multiple inputs (>3) and outputs (>3)
- Similar output values (standard denominations)
- 50%+ outputs with identical amounts

**Why it matters:** Mixing services are commonly used to hide fund origins

#### 3. Layering Detection
**What it detects:** Complex multi-stage transaction structures
```
Split: A → B, C, D
Merge: B, C, D → E
```
**Why it matters:** Classic money laundering technique

---

### 🟠 Medium Severity Patterns

#### 4. Peeling Chain Detection
**What it detects:** Repeated pattern of small withdrawals from large amounts
```
Transaction 1: 10 BTC → 0.5 BTC + 9.5 BTC change
Transaction 2: 9.5 BTC → 0.5 BTC + 9.0 BTC change
Transaction 3: 9.0 BTC → 0.5 BTC + 8.5 BTC change
```
**Why it matters:** Systematic fund obfuscation technique

#### 5. Fast Succession Detection
**What it detects:** Transactions occurring within 10 minutes of each other
**Why it matters:** Indicates automated systems or urgent fund movement

#### 6. Round Number Detection
**What it detects:** Transactions with round BTC values (0.1, 0.5, 1.0, etc.)
**Why it matters:** Potential structuring to avoid detection thresholds

#### 7. High Fee Detection
**What it detects:** Unusually high transaction fees
- >150 sat/byte: HIGH severity
- >100 sat/byte: MEDIUM severity

**Why it matters:** May indicate urgency or priority transactions

---

### 🔵 Low Severity Patterns

#### 8. Time Anomaly Detection
**What it detects:** Transactions during unusual hours (midnight - 5 AM)
**Why it matters:** May indicate automated systems

#### 9. Dust Collection Detection
**What it detects:** Consolidation of many small inputs (5+ inputs < 0.0001 BTC)
**Why it matters:** Could be privacy concern or legitimate wallet cleanup

---

## 📊 Risk Scoring System

### How Risk Scores are Calculated

Each detected pattern contributes to the overall risk score:
- **High Severity Pattern**: +30 points
- **Medium Severity Pattern**: +15 points  
- **Low Severity Pattern**: +5 points

**Total Score Range**: 0-100

### Risk Levels

| Score | Level | Color | Icon | Action Required |
|-------|-------|-------|------|-----------------|
| 70-100 | 🔴 Critical | Red | 🔴 | Immediate investigation |
| 50-69 | 🟠 High | Orange | 🟠 | Priority review |
| 30-49 | 🟡 Medium | Yellow | 🟡 | Standard review |
| 10-29 | 🔵 Low | Blue | 🔵 | Monitor |
| 0-9 | 🟢 Minimal | Green | 🟢 | Clean transaction |

### Example Calculations

**Example 1: Mixer + Loop**
- Mixer Detection: +30 (High)
- Loop Detection: +30 (High)
- **Total: 60 points** → 🟠 High Risk

**Example 2: Round Numbers + Time Anomaly**
- Round Numbers: +15 (Medium)
- Time Anomaly: +5 (Low)
- **Total: 20 points** → 🔵 Low Risk

**Example 3: Peeling Chain + Fast Succession + High Fee**
- Peeling Chain: +15 (Medium)
- Fast Succession: +15 (Medium)
- High Fee: +30 (High)
- **Total: 60 points** → 🟠 High Risk

---

## 🎨 User Interface Features

### 1. Risk Dashboard
```
┌─────────────────────────────────────────┐
│  ┌───────┐                              │
│  │  45   │  🟡 Medium Risk              │
│  │ Risk  │                              │
│  │ Score │  Patterns Detected: 3        │
│  └───────┘  High Severity: 0            │
│             Analysis Depth: 3 levels    │
└─────────────────────────────────────────┘
```

### 2. Filter Controls
```
Filter by Severity:
[All (3)] [High (0)] [Medium (2)] [Low (1)]
         ↑ Active filter highlighted
```

### 3. Pattern List
```
┌─────────────────────────────────────────┐
│ 🟠 Peeling Chain                        │
│    Potential peeling chain pattern     │
│    Severity: MEDIUM                     │
├─────────────────────────────────────────┤
│ 🟠 Round Numbers                        │
│    2 outputs with round BTC values     │
│    Severity: MEDIUM                     │
├─────────────────────────────────────────┤
│ 🔵 Time Anomaly                         │
│    Transaction at 2:30 AM              │
│    Severity: LOW                        │
└─────────────────────────────────────────┘
```

### 4. Control Buttons
- **Expand** 🔍: Full-screen analysis view
- **Export** 💾: Download JSON report

---

## 📥 Export Format

### JSON Export Structure
```json
{
  "transaction": "abc123def456...",
  "timestamp": "2025-10-16T14:30:00.000Z",
  "riskScore": 45,
  "patterns": [
    {
      "type": "peeling_chain",
      "severity": "medium",
      "description": "Potential peeling chain pattern detected"
    },
    {
      "type": "round_number",
      "severity": "medium",
      "description": "2 outputs with round BTC values"
    },
    {
      "type": "time_anomaly",
      "severity": "low",
      "description": "Transaction occurred during unusual hours (2:30 AM)"
    }
  ]
}
```

---

## 🔧 Technical Specifications

### Analysis Parameters
- **Maximum Depth**: 3 transaction levels
- **Child Transaction Limit**: 3 per level
- **API Source**: blockchain.info
- **Analysis Time**: 5-10 seconds (Level 3)

### Performance
- **Memory Usage**: 10-20 MB (complex chains)
- **API Calls**: 9-27 calls (Level 3)
- **Accuracy**: High (based on established forensic patterns)

---

## 💡 Use Case Examples

### Law Enforcement
```
Scenario: Investigating stolen Bitcoin
1. Enter suspect transaction hash
2. Pattern Detector identifies mixer usage (High Risk)
3. Export report for case documentation
4. Follow transaction chain to identify recipients
```

### Exchange Compliance
```
Scenario: Screening incoming deposits
1. Automated scan of all deposits
2. Flag transactions with Risk Score > 50
3. Manual review of flagged transactions
4. Block or report suspicious activity
```

### Forensic Analysis
```
Scenario: Tracing ransomware payments
1. Start with ransom payment transaction
2. Identify peeling chain pattern
3. Track through multiple hops
4. Locate final destination addresses
```

---

## ⚠️ Important Notes

### False Positives
Not all detected patterns indicate malicious activity:
- **Round Numbers**: Could be legitimate payments
- **Time Anomalies**: May be automated systems
- **Dust Collection**: Often legitimate wallet cleanup

### Best Practices
1. ✅ Always review HIGH severity patterns first
2. ✅ Consider context and additional evidence
3. ✅ Export reports for documentation
4. ✅ Cross-reference with other tools
5. ✅ Don't rely solely on automated detection

### Limitations
- Analysis limited to 3 transaction levels
- Depends on blockchain.info API availability
- Cannot detect all obfuscation techniques
- Requires manual interpretation of results

---

## 🚀 Getting Started

### Step 1: Navigate to Transaction
```
Search for a transaction hash in ChainPhantom
```

### Step 2: View Pattern Analysis
```
Scroll to "Suspicious Pattern Detection" section
```

### Step 3: Review Results
```
- Check Risk Score
- Review detected patterns
- Filter by severity if needed
```

### Step 4: Take Action
```
- Export report if needed
- Investigate high-risk patterns
- Document findings
```

---

## 📚 Additional Resources

- **Full Documentation**: See `PATTERN_DETECTOR_GUIDE.md`
- **Technical Details**: See `PATTERN_DETECTOR_ENHANCEMENTS.md`
- **Source Code**: `frontend/src/components/TransactionPatternDetector.js`

---

**Last Updated**: October 2025  
**Version**: 2.0  
**Status**: Production Ready ✅
