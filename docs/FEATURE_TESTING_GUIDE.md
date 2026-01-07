# 🎯 COMPLETE FEATURE TESTING GUIDE

## **All 4 Features: Wallet Monitor, Forensic Analyzer, Multi-Chain, Pattern Detection**

---

## 📋 **TABLE OF CONTENTS**

1. [Overview](#overview)
2. [Wallet Monitor (5 Scenarios)](#1-wallet-monitor-5-scenarios---main-focus)
3. [Forensic Analyzer (5 Scenarios)](#2-forensic-analyzer-5-scenarios)
4. [Multi-Chain Analysis (5 Scenarios)](#3-multi-chain-analysis-5-scenarios)
5. [Pattern Detection (5 Scenarios)](#4-pattern-detection-5-scenarios)
6. [Quick Reference Table](#quick-reference-table)
7. [Testing Checklist](#testing-checklist)

---

## 🌟 **OVERVIEW**

This guide covers **20 comprehensive test scenarios** across all 4 major features:

| Feature | Scenarios | Focus Level |
|---------|-----------|-------------|
| **Wallet Monitor** | 5 | ⭐⭐⭐⭐⭐ (MAIN FOCUS) |
| **Forensic Analyzer** | 5 | ⭐⭐⭐⭐ |
| **Multi-Chain Analysis** | 5 | ⭐⭐⭐⭐ |
| **Pattern Detection** | 5 | ⭐⭐⭐⭐ |
| **TOTAL** | **20** | **Complete Coverage** |

---

## 1. **WALLET MONITOR** (5 Scenarios - MAIN FOCUS) 👛

### **How to Access:**
```
1. Enable Testnet Mode (top-right toggle)
2. Click "Wallet Monitor" in sidebar
3. Add the test address
4. Click "Start Monitoring"
5. View alerts and risk analysis
```

---

### **Scenario WM-F1: Dormant Wallet Suddenly Active** 🔴

#### **Description:**
Wallet inactive for 6 months suddenly becomes active with large transfers

#### **Test Address:**
```
twmf01dormantactive123456789abcdef123456789abcdef123456789abcdef
```

#### **Expected Results:**

```
═══════════════════════════════════════════════
WALLET MONITORING ALERT
═══════════════════════════════════════════════

Address: twmf01dormant...
Balance: 125.5 BTC
Risk Score: 🔴 88% (CRITICAL)

───────────────────────────────────────────────
ALERTS (3):
───────────────────────────────────────────────

⚠️  Alert #1: DORMANT AWAKENING (High Severity)
    Wallet inactive for 180 days suddenly active
    8 transactions in last 24 hours
    
⚠️  Alert #2: EXCEEDS MONTHLY AVERAGE (High)
    Transaction count 16x monthly average
    Monthly avg: 0.5 → Current: 8 transactions
    
⚠️  Alert #3: HIGH FREQUENCY (Medium)
    More than 10 transactions in short time
    
───────────────────────────────────────────────
PATTERNS DETECTED:
───────────────────────────────────────────────
• Dormant Awakening
• High Frequency Activity
• Large Transfers
═══════════════════════════════════════════════
```

#### **Key Observations:**
- ✅ Risk score: 88% (Critical)
- ✅ 3 separate alerts
- ✅ Dormant period: 180 days (6 months)
- ✅ Sudden activity: 8 transactions
- ✅ Volume increase: 16x normal

#### **Real-World Significance:**
This pattern often indicates:
- Compromised wallet
- Money laundering activation
- Stolen funds being moved
- Criminal wallet reactivation

---

### **Scenario WM-F2: Structuring/Smurfing Pattern** 🔴

#### **Description:**
Many small deposits followed by single large withdrawal (classic structuring)

#### **Test Address:**
```
twmf02structuring123456789abcdef123456789abcdef123456789abcdef12
```

#### **Expected Results:**

```
═══════════════════════════════════════════════
WALLET MONITORING ALERT
═══════════════════════════════════════════════

Address: twmf02structuring...
Balance: 2.5 BTC
Risk Score: 🔴 92% (CRITICAL)

───────────────────────────────────────────────
ALERTS (3):
───────────────────────────────────────────────

🚨 Alert #1: STRUCTURING DETECTED (Critical)
    Potential structuring/smurfing pattern
    32 deposits under $10,000 equivalent
    Single large withdrawal: 98 BTC
    Pattern: Classic money laundering indicator
    
⚠️  Alert #2: EXCEEDS MONTHLY AVERAGE (Medium)
    Transaction count 3.75x monthly average
    
⚠️  Alert #3: LAYERING PATTERN (High)
    Funds moving through multiple addresses
    
───────────────────────────────────────────────
TRANSACTION PATTERN:
───────────────────────────────────────────────
Deposits:      32 transactions
Avg Deposit:   2.8 BTC (under threshold)
Period:        14 days
Withdrawals:   1 transaction
Withdrawal:    98 BTC (consolidated)

Pattern: Many small → Single large
═══════════════════════════════════════════════
```

#### **Key Observations:**
- ✅ Risk score: 92% (Critical)
- ✅ 32 small deposits
- ✅ 1 large withdrawal (98 BTC)
- ✅ Deposits kept under reporting threshold
- ✅ Classic structuring pattern

#### **Real-World Significance:**
"Structuring" or "smurfing" is a money laundering technique:
- Avoid reporting thresholds
- Break large amounts into small deposits
- Consolidate and withdraw clean
- **Illegal in most jurisdictions**

---

### **Scenario WM-F3: Exchange-Like Activity** 🟡

#### **Description:**
Very high transaction volume with multiple counterparties

#### **Test Address:**
```
twmf03exchange123456789abcdef123456789abcdef123456789abcdef12345
```

#### **Expected Results:**

```
═══════════════════════════════════════════════
WALLET MONITORING ALERT
═══════════════════════════════════════════════

Address: twmf03exchange...
Balance: 1,250.75 BTC
Risk Score: 🟡 45% (MEDIUM)

───────────────────────────────────────────────
ALERTS (3):
───────────────────────────────────────────────

⚠️  Alert #1: EXCHANGE PATTERN (Medium)
    Exchange-like trading pattern detected
    High volume: 412 tx/month
    Multiple counterparties: 78 unique addresses
    
⚠️  Alert #2: EXCEEDS MONTHLY AVERAGE (Low)
    Transaction count 2.2x monthly average
    
⚠️  Alert #3: HIGH VALUE FLOW (Medium)
    Monthly flow: 3,450 BTC in, 3,380 BTC out
    
───────────────────────────────────────────────
STATISTICS:
───────────────────────────────────────────────
Total Transactions: 2,458
Monthly Average:    185
Current Month:      412
Counterparties:     78 unique addresses
Avg/Day:           13.7 transactions

Behavior: Consistent with legitimate exchange
═══════════════════════════════════════════════
```

#### **Key Observations:**
- ✅ Risk score: 45% (Medium)
- ✅ Very high volume (2,458 total tx)
- ✅ 78 different counterparties
- ✅ 13.7 transactions per day average
- ✅ Pattern: Likely legitimate exchange

---

### **Scenario WM-F4: Mixer/Tumbler User** 🔴

#### **Description:**
Frequent interaction with known mixing services - high money laundering risk

#### **Test Address:**
```
twmf04mixeruser123456789abcdef123456789abcdef123456789abcdef1234
```

#### **Expected Results:**

```
═══════════════════════════════════════════════
WALLET MONITORING ALERT
═══════════════════════════════════════════════

Address: twmf04mixeruser...
Balance: 15.8 BTC
Risk Score: 🔴 95% (CRITICAL)

───────────────────────────────────────────────
ALERTS (4):
───────────────────────────────────────────────

🚨 Alert #1: MIXER INTERACTION (Critical)
    Multiple interactions with mixing services:
    • ChipMixer
    • CoinJoin.io
    • Wasabi Wallet
    
🚨 Alert #2: PRIVACY COINS (High)
    Exchange to privacy coins detected
    12 BTC converted to Monero
    
⚠️  Alert #3: EXCEEDS MONTHLY AVERAGE (Medium)
    Transaction count 3x monthly average
    
🚨 Alert #4: OBFUSCATION ATTEMPT (Critical)
    Deliberate obfuscation pattern detected
    Privacy Score: 98%
    
───────────────────────────────────────────────
OBFUSCATION TECHNIQUES:
───────────────────────────────────────────────
✓ Multiple mixer services
✓ Privacy coin conversion (XMR)
✓ Long transaction chains
✓ Time delays between hops

RISK ASSESSMENT: VERY HIGH
═══════════════════════════════════════════════
```

#### **Key Observations:**
- ✅ Risk score: 95% (Critical)
- ✅ 3 different mixing services used
- ✅ Privacy coin conversion (Monero)
- ✅ Privacy score: 98%
- ✅ **Clear money laundering indicators**

---

### **Scenario WM-F5: Sanctioned Entity** ⚫

#### **Description:**
Address linked to sanctioned entity or international blacklist

#### **Test Address:**
```
twmf05sanctioned123456789abcdef123456789abcdef123456789abcdef123
```

#### **Expected Results:**

```
═══════════════════════════════════════════════
🚨 CRITICAL SANCTIONS ALERT 🚨
═══════════════════════════════════════════════

Address: twmf05sanctioned...
Balance: 542.3 BTC
Risk Score: ⚫ 100% (SANCTIONS - PROHIBITED)

───────────────────────────────────────────────
ALERTS (4):
───────────────────────────────────────────────

🚨 Alert #1: OFAC SANCTIONS MATCH (Critical)
    ⚠️  IMMEDIATE ACTION REQUIRED ⚠️
    Address linked to sanctioned entity:
    Lazarus Group (North Korean State Actors)
    Listed: OFAC SDN List
    
🚨 Alert #2: MULTIPLE BLACKLIST MATCHES (Critical)
    Matched in:
    • OFAC SDN
    • UN Security Council Sanctions
    • FBI Most Wanted Cyber Criminals
    
🚨 Alert #3: RANSOMWARE LINK (Critical)
    Connected to WannaCry ransomware (2017)
    
🚨 Alert #4: INTERNATIONAL ALERT (Critical)
    Interpol Red Notice
    
───────────────────────────────────────────────
LEGAL STATUS: PROHIBITED
───────────────────────────────────────────────
⛔ DO NOT TRANSACT WITH THIS ADDRESS
⛔ Report to NCB immediately
⛔ Freeze all related accounts
⛔ International law enforcement action required

SANCTIONS LISTS:
• OFAC SDN (U.S. Treasury)
• UN Security Council
• EU Sanctions List

LINKED ENTITIES:
• Lazarus Group
• North Korean State Actors

CRIMINAL ACTIVITY:
• WannaCry Ransomware Campaign
• State-Sponsored Hacking
• National Security Threat
═══════════════════════════════════════════════
```

#### **Key Observations:**
- ✅ Risk score: 100% (Maximum - SANCTIONS)
- ✅ 4 critical alerts
- ✅ Multiple sanctions lists
- ✅ Interpol Red Notice
- ✅ **Transaction PROHIBITED by law**

---

## 2. **FORENSIC ANALYZER** (5 Scenarios) 🔍

### **How to Access:**
```
1. Enable Testnet Mode
2. Click "Forensic Analyzer" in sidebar
3. Enter test address
4. Click "Analyze"
5. View forensic report
```

---

### **Scenario FA-1: Exchange Deposit Trail** 🟢

#### **Test Address:**
```
tfaf01exchange123456789abcdef123456789abcdef123456789abcdef1234
```

#### **Expected Results:**
- Risk Score: 35% (Low-Medium)
- Source: Mining Pool (F2Pool)
- Hops: 3
- Destination: Binance Exchange
- KYC Status: Verified
- Assessment: **Clean funds, legitimate path**

---

### **Scenario FA-2: Dark Web Marketplace** 🔴

#### **Test Address:**
```
tfaf02darkweb123456789abcdef123456789abcdef123456789abcdef12345
```

#### **Expected Results:**
- Risk Score: 94% (Critical)
- Linked to: AlphaBay marketplace (seized 2017)
- Role: Vendor Wallet
- Volume: 1,250 BTC
- Status: FBI Investigation
- Assessment: **Criminal activity, seized wallet**

---

### **Scenario FA-3: Ransomware Payment** 🔴

#### **Test Address:**
```
tfaf03ransomware123456789abcdef123456789abcdef123456789abcdef123
```

#### **Expected Results:**
- Risk Score: 97% (Critical)
- Campaign: REvil Ransomware
- Victims: 47
- Extorted: 425 BTC ($18M)
- Status: Active FBI investigation
- Assessment: **Ransomware extortion wallet**

---

### **Scenario FA-4: Money Laundering Network** 🔴

#### **Test Address:**
```
tfaf04laundering123456789abcdef123456789abcdef123456789abcdef12
```

#### **Expected Results:**
- Risk Score: 91% (Critical)
- Network: International laundering ring
- Entities: 156
- Countries: 23
- Volume: 8,450 BTC
- Status: Interpol operation
- Assessment: **Complex criminal network**

---

### **Scenario FA-5: Institutional Wallet** 🟢

#### **Test Address:**
```
tfaf05institutional123456789abcdef123456789abcdef123456789abcde
```

#### **Expected Results:**
- Risk Score: 5% (Very Low)
- Entity: MicroStrategy Corporate Treasury
- Registration: SEC Registered (NASDAQ: MSTR)
- Compliance: Full AML/KYC
- Auditor: PwC
- Assessment: **Legitimate institutional holdings**

---

## 3. **MULTI-CHAIN ANALYSIS** (5 Scenarios) 🌐

### **How to Access:**
```
1. Enable Testnet Mode
2. Click "Multi-Chain Analysis" in sidebar
3. Enter test address/transaction
4. Select network (Bitcoin/Ethereum)
5. Click "Analyze"
```

---

### **Scenario MC-1: Cross-Chain Bridge User** 🟡

#### **Test BTC Address:**
```
tmcf01bridge123456789abcdef123456789abcdef123456789abcdef12345
```

#### **Expected Results:**
- Risk Score: 42% (Medium)
- Chains: Bitcoin, Ethereum, BSC, Polygon
- Bridges: wBTC, RenBTC, Multichain
- Total Bridged: 45.8 BTC
- Assessment: **Legitimate DeFi user**

---

### **Scenario MC-2: Cross-Chain Laundering** 🔴

#### **Test BTC Address:**
```
tmcf02laundering123456789abcdef123456789abcdef123456789abcdef1
```

#### **Expected Results:**
- Risk Score: 96% (Critical)
- Chains: BTC, ETH, XMR, BSC, TRON
- Path: BTC → Mixer → ETH → Privacy Coin → BSC
- Complexity: 15 hops across 5 chains
- Assessment: **Money laundering via cross-chain**

---

### **Scenario MC-3: DeFi Yield Farmer** 🟢

#### **Test ETH Address:**
```
0xdef1234567890abcdef1234567890abcdef12345
```

#### **Expected Results:**
- Risk Score: 15% (Low)
- Chains: Ethereum, Polygon, Avalanche, Arbitrum
- Protocols: Uniswap, Aave, Curve, Compound
- Portfolio: $450,000
- Assessment: **Legitimate DeFi investor**

---

### **Scenario MC-4: NFT Wash Trading** 🔴

#### **Test ETH Address:**
```
0x4567890abcdef1234567890abcdef1234567890a
```

#### **Expected Results:**
- Risk Score: 78% (High)
- Activity: NFT wash trading
- Pattern: Same NFTs between related addresses
- Price Manipulation: 12 ETH → 450 ETH (inflated)
- Assessment: **Market manipulation, tax evasion**

---

### **Scenario MC-5: ICO Exit Scam** 🔴

#### **Test ETH Address:**
```
0x7890abcdef1234567890abcdef1234567890abcd
```

#### **Expected Results:**
- Risk Score: 99% (Critical)
- Project: FakeCoin ICO
- Raised: 12,000 ETH ($22M)
- Distributed: NO (rug pull)
- Victims: 2,400 investors
- Assessment: **Exit scam, fraud**

---

## 4. **PATTERN DETECTION** (5 Scenarios) 🎯

### **How to Access:**
```
Pattern detection runs automatically when viewing transaction details
1. Enable Testnet Mode
2. Search for test transaction ID
3. View "Suspicious Pattern Detection" section
```

---

### **Scenario PD-F1: Circular Trading** 🔴

#### **Test TX Hash:**
```
tpdf01circular123456789abcdef123456789abcdef123456789abcdef12345
```

#### **Expected Results:**
- Risk Score: 82% (High)
- Pattern: A → B → C → D → A (circle)
- Hops: 4
- Purpose: Fake volume creation
- Assessment: **Market manipulation**

---

### **Scenario PD-F2: Rapid Fire** 🔴

#### **Test TX Hash:**
```
tpdf02rapidfire123456789abcdef123456789abcdef123456789abcdef123
```

#### **Expected Results:**
- Risk Score: 76% (High)
- Count: 52 transactions
- Timeframe: 8 minutes
- Frequency: 6.5 tx/minute
- Assessment: **Bot activity detected**

---

### **Scenario PD-F3: Dusting Attack** 🟡

#### **Test TX Hash:**
```
tpdf03dusting123456789abcdef123456789abcdef123456789abcdef12345
```

#### **Expected Results:**
- Risk Score: 65% (Medium-High)
- Outputs: 1,000+ addresses
- Amount: 0.00001 BTC (dust)
- Purpose: De-anonymization
- Assessment: **Privacy attack**

---

### **Scenario PD-F4: Time Anomaly** 🟡

#### **Test TX Hash:**
```
tpdf04timeanomaly123456789abcdef123456789abcdef123456789abcdef1
```

#### **Expected Results:**
- Risk Score: 58% (Medium)
- Pattern: All TX at exactly 3:00 AM UTC
- Precision: Within 5 seconds
- Purpose: Automated system
- Assessment: **Suspicious automation**

---

### **Scenario PD-F5: Sybil Attack** 🔴

#### **Test TX Hash:**
```
tpdf05sybil123456789abcdef123456789abcdef123456789abcdef1234567
```

#### **Expected Results:**
- Risk Score: 87% (High)
- Addresses: 47 controlled by same entity
- Coordination: Perfect timing
- Purpose: Voting/airdrop manipulation
- Assessment: **Sybil attack pattern**

---

## 📊 **QUICK REFERENCE TABLE**

### **All 20 Test Scenarios**

| Feature | Scenario | Test String | Risk | Type |
|---------|----------|-------------|------|------|
| **Wallet Monitor** | Dormant Active | `twmf01dormant...` | 88% | 🔴 Critical |
| | Structuring | `twmf02structuring...` | 92% | 🔴 Critical |
| | Exchange Activity | `twmf03exchange...` | 45% | 🟡 Medium |
| | Mixer User | `twmf04mixeruser...` | 95% | 🔴 Critical |
| | Sanctioned | `twmf05sanctioned...` | 100% | ⚫ Prohibited |
| **Forensic Analyzer** | Exchange Trail | `tfaf01exchange...` | 35% | 🟢 Low-Med |
| | Dark Web | `tfaf02darkweb...` | 94% | 🔴 Critical |
| | Ransomware | `tfaf03ransomware...` | 97% | 🔴 Critical |
| | Laundering | `tfaf04laundering...` | 91% | 🔴 Critical |
| | Institutional | `tfaf05institutional...` | 5% | 🟢 Very Low |
| **Multi-Chain** | Bridge User | `tmcf01bridge...` | 42% | 🟡 Medium |
| | Cross-Laundering | `tmcf02laundering...` | 96% | 🔴 Critical |
| | DeFi Farmer | `0xdef123...` | 15% | 🟢 Low |
| | NFT Wash | `0x456789...` | 78% | 🔴 High |
| | ICO Scam | `0x7890ab...` | 99% | 🔴 Critical |
| **Pattern Detection** | Circular | `tpdf01circular...` | 82% | 🔴 High |
| | Rapid Fire | `tpdf02rapidfire...` | 76% | 🔴 High |
| | Dusting | `tpdf03dusting...` | 65% | 🟡 Med-High |
| | Time Anomaly | `tpdf04timeanomaly...` | 58% | 🟡 Medium |
| | Sybil Attack | `tpdf05sybil...` | 87% | 🔴 High |

---

## ✅ **TESTING CHECKLIST**

### **Wallet Monitor (5 tests):**
- [ ] WM-F1: Dormant wallet alert triggered ✅
- [ ] WM-F2: Structuring pattern detected ✅
- [ ] WM-F3: Exchange activity recognized ✅
- [ ] WM-F4: Mixer usage flagged ✅
- [ ] WM-F5: Sanctions match shows prohibition ✅

### **Forensic Analyzer (5 tests):**
- [ ] FA-1: Clean exchange trail (low risk) ✅
- [ ] FA-2: Dark web link detected ✅
- [ ] FA-3: Ransomware connection found ✅
- [ ] FA-4: Laundering network identified ✅
- [ ] FA-5: Institutional wallet verified ✅

### **Multi-Chain Analysis (5 tests):**
- [ ] MC-1: Bridge usage tracked ✅
- [ ] MC-2: Cross-chain laundering detected ✅
- [ ] MC-3: DeFi activity recognized ✅
- [ ] MC-4: NFT wash trading found ✅
- [ ] MC-5: ICO scam identified ✅

### **Pattern Detection (5 tests):**
- [ ] PD-F1: Circular trading detected ✅
- [ ] PD-F2: Rapid fire pattern found ✅
- [ ] PD-F3: Dusting attack recognized ✅
- [ ] PD-F4: Time anomaly identified ✅
- [ ] PD-F5: Sybil attack detected ✅

---

## 🎯 **5-MINUTE QUICK TEST**

Want to test everything quickly? Do these 5:

```
1. Wallet Monitor - Sanctioned:
   twmf05sanctioned123456789abcdef123456789abcdef123456789abcdef123
   → Expect: 100% risk, 4 alerts, PROHIBITED status

2. Wallet Monitor - Structuring:
   twmf02structuring123456789abcdef123456789abcdef123456789abcdef12
   → Expect: 92% risk, structuring detected

3. Forensic - Ransomware:
   tfaf03ransomware123456789abcdef123456789abcdef123456789abcdef123
   → Expect: 97% risk, REvil campaign linked

4. Multi-Chain - Laundering:
   tmcf02laundering123456789abcdef123456789abcdef123456789abcdef1
   → Expect: 96% risk, 5 chains, 15 hops

5. Pattern - Sybil:
   tpdf05sybil123456789abcdef123456789abcdef123456789abcdef1234567
   → Expect: 87% risk, 47 addresses controlled
```

**If all 5 work: ✅ PERFECT!**

---

## 📚 **DOCUMENTATION FILES**

- **This Guide**: `docs/FEATURE_TESTING_GUIDE.md`
- **Quick Copy-Paste**: `docs/FEATURE_TEST_STRINGS.txt` (coming next)
- **Scenarios Code**: `frontend/src/utils/featureScenarios.js`

---

**Total Test Cases**: 20  
**Main Focus**: Wallet Monitor (5 scenarios)  
**Status**: ✅ **All Ready for Testing!**

**Last Updated**: January 7, 2026

