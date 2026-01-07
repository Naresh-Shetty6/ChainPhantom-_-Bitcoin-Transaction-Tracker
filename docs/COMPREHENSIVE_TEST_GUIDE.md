# ChainPhantom Comprehensive Test Guide

## 📋 Overview

This document provides complete testing instructions for all **24 test scenarios** covering **12 feature categories** in ChainPhantom's testnet environment.

**Total Test Cases**: 24  
**Total Categories**: 12  
**Test Coverage**: Wallet Monitoring, Email Alerts, Pattern Detection, Enhanced Rules, Transaction Fetch, Multi-Chain, Export, Risk Scoring, Persistence, Performance, Security, UI/UX

---

## 🎯 Quick Start

1. **Enable Testnet Mode** - Toggle in navbar
2. **Copy test address/transaction** from sections below
3. **Navigate to appropriate page** (Address Details, Transaction Details, etc.)
4. **Verify expected results**

---

## 1️⃣ Wallet Monitoring Rules Engine (2 tests)

### CP-TC-WM-01: Alert triggers when risk ≥ threshold

**Test Address**:
```
mwm01AlertTriggerWallet1234567890abcdef
```

**Preconditions**:
- Monitoring enabled
- Email configured
- Threshold = 50

**Expected Results**:
- ✅ Risk Score: 55
- ✅ Wallet flagged
- ✅ Alert created
- ✅ Email queued/sent
- ✅ Alert message: "Risk score (55) exceeds threshold (50)"

**How to Test**:
1. Navigate to `/address/mwm01AlertTriggerWallet1234567890abcdef`
2. Verify risk score shows 55
3. Check Wallet Monitor for alerts
4. Verify alert exists for this address

---

### CP-TC-WM-02: No alert when rules disabled

**Test Address**:
```
mwm02NoAlertRulesDisabled1234567890abcdef
```

**Preconditions**:
- All rules toggled OFF
- Threshold = 50

**Expected Results**:
- ✅ Risk Score: 80 (but no alert)
- ✅ No alert created
- ✅ No email sent
- ✅ Patterns not evaluated

**How to Test**:
1. Disable all rules in settings
2. Navigate to address details
3. Verify risk score is high but no alerts trigger

---

## 2️⃣ Email Alerts Delivery (2 tests)

### CP-TC-EM-01: Successful SMTP send

**Test Address**:
```
mem01SuccessfulSMTPSend1234567890abcdef
```

**Preconditions**:
- Valid SMTP credentials configured

**Expected Results**:
- ✅ Email status: "Sent"
- ✅ Recipient receives email
- ✅ Content includes risk score (70) and patterns
- ✅ No errors in console

**How to Test**:
1. Configure SMTP settings
2. Add wallet to monitor
3. Wait for alert cycle
4. Check email delivery status

---

### CP-TC-EM-02: SMTP failure handling

**Test Address**:
```
mem02SMTPFailureHandling1234567890abcdef
```

**Preconditions**:
- Invalid SMTP credentials

**Expected Results**:
- ✅ Email status: "Failed"
- ✅ Error reason displayed: "SMTP authentication failed"
- ✅ App remains stable
- ✅ Retry option visible
- ✅ No crash

**How to Test**:
1. Configure invalid SMTP settings
2. Trigger alert
3. Verify graceful error handling
4. Check retry mechanism

---

## 3️⃣ Pattern Detection Algorithms (2 tests)

### CP-TC-PD-01: Fast succession detection

**Test Transaction**:
```
tpd01fastsuccession1234567890abcdef1234567890abcdef
```

**Test Address**:
```
mpd01FastSuccessionWallet1234567890abcdef
```

**Test Data**:
- 15 transactions within 1 hour
- Transactions every 4 minutes

**Expected Results**:
- ✅ Pattern: "fast_succession"
- ✅ Severity: Medium
- ✅ Score contribution: +30
- ✅ Description mentions 15 transactions in 1 hour

**How to Test**:
1. Navigate to transaction or address
2. Run pattern detector
3. Verify fast succession pattern flagged

---

### CP-TC-PD-02: Mixer/tumbler detection

**Test Transaction**:
```
tpd02mixertumbler1234567890abcdef1234567890abcdef
```

**Test Data**:
- 20 inputs
- 20 outputs
- Similar amounts
- Many-to-many pattern

**Expected Results**:
- ✅ Pattern: "mixer"
- ✅ Severity: Critical
- ✅ Score contribution: +50
- ✅ Evidence: "Many-to-many with similar amounts detected"

**How to Test**:
1. Navigate to transaction details
2. Check Suspicious Pattern Detection section
3. Verify mixer pattern with critical severity

---

## 4️⃣ Enhanced Wallet Rules (2 tests)

### CP-TC-ER-01: Monthly average threshold breach

**Test Address**:
```
mer01MonthlyAverageBreached1234567890abcdef
```

**Test Data**:
- 30-day average: 1.0 BTC
- New transaction: 2.5 BTC
- Transaction count: 45 (vs 20 average)

**Expected Results**:
- ✅ Rule triggered
- ✅ Severity: Medium
- ✅ Risk Score: 55
- ✅ Details: "Transaction amount 2.5 BTC exceeds 30-day average of 1.0 BTC by 2.5x"

**How to Test**:
1. Navigate to address details
2. Check Forensic Analysis
3. Verify monthly average breach pattern

---

### CP-TC-ER-02: Lump sum detection

**Test Address**:
```
mer02LumpSumDetection1234567890abcdef
```

**Test Transaction**:
```
ter02lumpsum1234567890abcdef1234567890abcdef
```

**Test Data**:
- Transaction amount: 75 BTC
- Threshold: 50 BTC

**Expected Results**:
- ✅ Rule triggered
- ✅ Severity: Critical
- ✅ Risk Score: 70
- ✅ Details: "Lump sum transaction of 75 BTC detected (threshold: 50 BTC)"

**How to Test**:
1. Navigate to address or transaction
2. Verify lump sum pattern detected
3. Check risk score is elevated

---

## 5️⃣ Transaction Details Fetch & Errors (2 tests)

### CP-TC-TX-01: Valid BTC transaction ID

**Test Transaction**:
```
ttx01validbtctxid1234567890abcdef1234567890abcdef
```

**Expected Results**:
- ✅ Inputs visible
- ✅ Outputs visible
- ✅ Fee displayed
- ✅ Timestamp shown
- ✅ Links rendered
- ✅ No errors

**How to Test**:
1. Navigate to `/transaction/ttx01validbtctxid1234567890abcdef1234567890abcdef`
2. Verify all transaction details render
3. Check no console errors

---

### CP-TC-TX-02: Invalid transaction ID

**Test Transaction**:
```
invalid_tx_format
```

**Expected Results**:
- ✅ Friendly error message: "Invalid transaction ID format"
- ✅ No crash
- ✅ Retry option available
- ✅ Link to documentation
- ✅ App remains stable

**How to Test**:
1. Navigate to `/transaction/invalid_tx_format`
2. Verify graceful error handling
3. Check error message is user-friendly

---

## 6️⃣ Multi-Chain Support (2 tests)

### CP-TC-MC-01: ETH tx details with Etherscan

**Test Transaction**:
```
0xtmc01ethtxdetails1234567890abcdef1234567890abcdef
```

**Preconditions**:
- Etherscan API key configured

**Expected Results**:
- ✅ Gas field visible
- ✅ Nonce field visible
- ✅ Correct chain labels (ETH)
- ✅ Ethereum-specific fields shown

**How to Test**:
1. Switch chain to Ethereum
2. Navigate to transaction
3. Verify ETH-specific fields

---

### CP-TC-MC-02: Unsupported chain fallback

**Test Data**:
- Chain: "unsupported_chain"

**Expected Results**:
- ✅ Fallback to Bitcoin
- ✅ Notice displayed: "Chain not supported. Falling back to Bitcoin."
- ✅ No crash
- ✅ App continues functioning

**How to Test**:
1. Force invalid chain selection via URL
2. Verify graceful fallback
3. Check notice is displayed

---

## 7️⃣ Export & Reporting (2 tests)

### CP-TC-EX-01: Export JSON from analysis

**Test Address**:
```
mex01ExportJSONAnalysis1234567890abcdef
```

**Test Data**:
- Risk Score: 65
- Patterns: peeling_chain, fast_succession
- Multiple transaction links

**Expected Results**:
- ✅ File downloaded
- ✅ JSON format valid
- ✅ Includes risk score
- ✅ Includes patterns
- ✅ Includes links
- ✅ Includes metadata

**How to Test**:
1. Run forensic analysis on address
2. Click "Export JSON"
3. Verify file contents

---

### CP-TC-EX-02: Export PDF on empty state

**Test Data**:
- No analysis performed

**Expected Results**:
- ✅ Graceful message: "Nothing to export. Please run an analysis first."
- ✅ No file created
- ✅ No crash
- ✅ User guidance provided

**How to Test**:
1. Navigate to forensic analysis
2. Click "Export PDF" without running analysis
3. Verify graceful message

---

## 8️⃣ Risk Scoring & Thresholds (2 tests)

### CP-TC-RS-01: Deterministic scoring

**Test Transaction**:
```
trs01deterministicscoring1234567890abcdef
```

**Test Data**:
- 5 inputs, 3 outputs
- Amount: 10.5 BTC
- Pattern: consolidation

**Expected Results**:
- ✅ Run 1 score: 45
- ✅ Run 2 score: 45
- ✅ Scores identical
- ✅ Severity consistent

**How to Test**:
1. Analyze transaction twice
2. Compare risk scores
3. Verify identical results

---

### CP-TC-RS-02: Threshold change affects alerting

**Test Address**:
```
mrs02ThresholdChange1234567890abcdef
```

**Test Data**:
- Risk Score: 65

**Test Scenarios**:
1. Threshold = 70: No alert (65 < 70)
2. Threshold = 60: Alert triggered (65 > 60)

**How to Test**:
1. Set threshold to 70, verify no alert
2. Change threshold to 60, verify alert triggers

---

## 9️⃣ Persistence (LocalStorage) (2 tests)

### CP-TC-PR-01: Wallets persist after refresh

**Test Wallets**:
```
mpr01WalletPersist1A1234567890abcdef
mpr01WalletPersist1B1234567890abcdef
```

**Expected Results**:
- ✅ Wallets retained after refresh
- ✅ Settings retained
- ✅ Monitoring resumes automatically

**How to Test**:
1. Add both wallets to monitor
2. Refresh page
3. Verify wallets still monitored

---

### CP-TC-PR-02: Clear storage resets state

**Expected Results**:
- ✅ All wallets cleared
- ✅ Settings reset to defaults
- ✅ Clean initial state
- ✅ No data leaks

**How to Test**:
1. Add wallets and configure settings
2. Use "Clear Data" option
3. Verify complete reset

---

## 🔟 Performance & Reliability (2 tests)

### CP-TC-PF-01: 60s interval stability

**Test Parameters**:
- Interval: 60 seconds
- Observation: 5 cycles
- Max drift: ±5 seconds

**Expected Results**:
- ✅ Average interval: ~60s
- ✅ Drift < 5s
- ✅ UI remains responsive
- ✅ No memory leaks

**How to Test**:
1. Enable wallet monitoring
2. Observe 5 update cycles
3. Measure interval accuracy

---

### CP-TC-PF-02: Child transaction cap respected

**Test Transaction**:
```
tpf02childtxcap1234567890abcdef1234567890abcdef
```

**Test Data**:
- Graph depth: 10 levels
- Children per level: 20

**Expected Results**:
- ✅ Depth capped at 3
- ✅ Children capped at 10
- ✅ No freeze
- ✅ Execution time < 2s
- ✅ Memory stable

**How to Test**:
1. Analyze transaction with large graph
2. Verify caps enforced
3. Monitor performance metrics

---

## 1️⃣1️⃣ Security & Configuration (2 tests)

### CP-TC-SC-01: Missing API key warning

**Preconditions**:
- BlockCypher API key not configured

**Expected Results**:
- ✅ Warning displayed: "API key not configured. Using limited testnet data."
- ✅ Non-blocking (app continues)
- ✅ Limited fallback data available
- ✅ No secrets in console logs

**How to Test**:
1. Remove API key from config
2. Attempt data fetch
3. Verify graceful degradation

---

### CP-TC-SC-02: No secrets exposed in bundle

**Check Locations**:
- JavaScript bundle
- DOM elements
- Network requests
- Console logs

**Expected Results**:
- ✅ No API keys in JS
- ✅ No API keys in DOM
- ✅ No API keys in requests (beyond intended public endpoints)
- ✅ Environment variables secure

**How to Test**:
1. Build production bundle
2. Inspect bundle contents
3. Monitor network traffic
4. Check browser DevTools

---

## 1️⃣2️⃣ UI/UX & Accessibility (2 tests)

### CP-TC-UX-01: Mobile responsive layout

**Viewport**: 375x667px (iPhone SE)

**Expected Results**:
- ✅ Charts wrap correctly
- ✅ Cards stack properly
- ✅ No horizontal overflow
- ✅ Controls usable
- ✅ Text readable

**How to Test**:
1. Open DevTools
2. Set viewport to 375x667
3. Navigate through all pages
4. Verify responsive behavior

---

### CP-TC-UX-02: Risk gauge contrast/labels

**WCAG Standard**: AA (4.5:1 contrast ratio)

**Expected Results**:
- ✅ Contrast > 4.5:1
- ✅ Labels present and readable
- ✅ Color + text convey meaning
- ✅ Accessible to colorblind users
- ✅ Screen reader compatible

**How to Test**:
1. Use browser accessibility tools
2. Check color contrast ratios
3. Test with screen reader
4. Simulate colorblindness

---

## 📊 Test Summary

| Category | Test Count | Priority |
|----------|------------|----------|
| Wallet Monitoring | 2 | High |
| Email Alerts | 2 | High |
| Pattern Detection | 2 | Critical |
| Enhanced Rules | 2 | High |
| Transaction Fetch | 2 | Medium |
| Multi-Chain | 2 | Medium |
| Export/Reporting | 2 | Low |
| Risk Scoring | 2 | High |
| Persistence | 2 | Medium |
| Performance | 2 | High |
| Security | 2 | Critical |
| UI/UX | 2 | Medium |
| **Total** | **24** | - |

---

## 🚀 Quick Reference - All Test Entries

```javascript
// Wallet Monitoring
mwm01AlertTriggerWallet1234567890abcdef
mwm02NoAlertRulesDisabled1234567890abcdef

// Email Alerts
mem01SuccessfulSMTPSend1234567890abcdef
mem02SMTPFailureHandling1234567890abcdef

// Pattern Detection
mpd01FastSuccessionWallet1234567890abcdef
tpd01fastsuccession1234567890abcdef1234567890abcdef
tpd02mixertumbler1234567890abcdef1234567890abcdef

// Enhanced Rules
mer01MonthlyAverageBreached1234567890abcdef
mer02LumpSumDetection1234567890abcdef
ter02lumpsum1234567890abcdef1234567890abcdef

// Transaction Fetch
ttx01validbtctxid1234567890abcdef1234567890abcdef
invalid_tx_format

// Multi-Chain
0xtmc01ethtxdetails1234567890abcdef1234567890abcdef

// Export
mex01ExportJSONAnalysis1234567890abcdef

// Risk Scoring
trs01deterministicscoring1234567890abcdef
mrs02ThresholdChange1234567890abcdef

// Persistence
mpr01WalletPersist1A1234567890abcdef
mpr01WalletPersist1B1234567890abcdef

// Performance
tpf02childtxcap1234567890abcdef1234567890abcdef
```

---

## 📞 Support

For issues or questions:
1. Check `testnetScenarios.js` for scenario definitions
2. Review `testnetMockData.js` for implementation
3. See `comprehensiveTestEntries.js` for test data

---

**Last Updated**: January 7, 2026  
**Version**: 1.0.0  
**Status**: Ready for Testing ✅

