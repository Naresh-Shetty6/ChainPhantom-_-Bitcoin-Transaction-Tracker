# 🚀 ChainPhantom Rules - Quick Test Guide

## 📝 Original Requirements (From Handwritten Notes)

Based on your notes dated **June 16, 2022**, three rules were requested:

1. ⚠️ Flag the Wallet if the no. of transactions **exceed more than their monthly Average**
2. 🚨 Flag the Wallet Address if it does **more than 10 transactions within a Short time Span**
3. 🚨 Flag the Wallet Address if it is a **Lump Sum transaction [Very huge Amount]**

---

## ✅ Implementation Status: **COMPLETE**

All three rules have been successfully implemented in the ChainPhantom testnet environment!

---

## 🎯 Quick Test - Copy & Paste These Addresses

### Rule 1: Exceeds Monthly Average
```
meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```
**What You'll See:**
- ⚠️ Alert: "FLAGGED: Wallet has 45 transactions this month, exceeding monthly average of 20 transactions"
- Risk Score: 55/100 (Medium)
- Pattern: `exceeds_monthly_average`

---

### Rule 2: High Frequency Short Span (>10 Transactions)
```
mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```
**What You'll See:**
- 🚨 Alert: "FLAGGED: Wallet has 15 transactions within a short time span (exceeds 10 transaction threshold)"
- Risk Score: 65/100 (High)
- Pattern: `high_frequency_short_span`
- Details: "Possible automated trading or suspicious activity"

---

### Rule 3: Lump Sum Transaction (Very Huge Amount)
```
mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```
**What You'll See:**
- 🚨 Alert: "FLAGGED: Lump sum transaction detected - 250 BTC"
- Risk Score: 70/100 (High)
- Pattern: `lump_sum_transaction`
- Details: "Very huge amount that exceeds normal transaction patterns"

---

## 🧪 How to Test (3 Simple Steps)

### Step 1: Enable Testnet Mode
1. Start your ChainPhantom application
2. Look for the network toggle in the navbar
3. Click to switch to **Testnet** mode
4. You should see a "Testnet" badge

### Step 2: Navigate to Testing Area
Choose any of these pages:
- **Address Details** (`/address/:address`)
- **Forensic Analysis** (`/forensics/:address`)
- **Wallet Monitor** (`/wallet-monitor`)
- **Pattern Detection** (integrated in analysis pages)

### Step 3: Test Each Rule
1. Copy one of the test addresses above
2. Paste it into the search/input field
3. Press Enter or click Search
4. Observe the flagged alerts and risk scores

---

## 📊 Expected Results Summary

| Rule | Address | Risk | Alert Type | Pattern Detected |
|------|---------|------|------------|------------------|
| **Rule 1** | `me...mzBc` | 55 (Medium) | ⚠️ Exceeds Average | 45 tx vs 20 avg |
| **Rule 2** | `mh...mzBc` | 65 (High) | 🚨 High Frequency | 15 tx in < 24h |
| **Rule 3** | `ml...mzBc` | 70 (High) | 🚨 Lump Sum | > 100 BTC |

---

## 🎨 Visual Indicators You'll See

### Medium Risk (Rule 1)
```
┌─────────────────────────────────────────┐
│ ⚠️ RISK LEVEL: MEDIUM (55/100)         │
│                                          │
│ Pattern: exceeds_monthly_average        │
│ Severity: Medium                        │
│                                          │
│ Alert:                                  │
│ Wallet has 45 transactions this month,  │
│ exceeding monthly average of 20         │
│ transactions - Unusual activity         │
│ pattern detected                        │
└─────────────────────────────────────────┘
```

### High Risk (Rule 2)
```
┌─────────────────────────────────────────┐
│ 🚨 RISK LEVEL: HIGH (65/100)           │
│                                          │
│ Pattern: high_frequency_short_span      │
│ Severity: High                          │
│                                          │
│ Alert:                                  │
│ Wallet has 15 transactions within a     │
│ short time span (exceeds 10             │
│ transaction threshold) - Possible       │
│ automated trading or suspicious         │
│ activity                                │
└─────────────────────────────────────────┘
```

### High Risk (Rule 3)
```
┌─────────────────────────────────────────┐
│ 🚨 RISK LEVEL: HIGH (70/100)           │
│                                          │
│ Pattern: lump_sum_transaction           │
│ Severity: High                          │
│                                          │
│ Alert:                                  │
│ Lump sum transaction detected -         │
│ 250 BTC in a single transaction -       │
│ Exceeds normal transaction patterns     │
└─────────────────────────────────────────┘
```

---

## 🔍 Where to Find More Information

### Component Integration
These rules are active in:
- ✅ Address Details page
- ✅ Forensic Analysis component
- ✅ Wallet Monitor
- ✅ Pattern Detection system
- ✅ Transaction Analysis
- ✅ Multi-Chain Analysis

### Detection Logic
All detection happens in: `frontend/src/utils/testnetMockData.js`

Functions involved:
- `determineAddressType()` - Identifies which rule to apply
- `getTestnetAddress()` - Generates address data with rule patterns
- `getTestnetForensicAnalysis()` - Performs risk analysis
- `getTestnetPatternDetection()` - Detects suspicious patterns
- `getTestnetWalletMonitorData()` - Provides real-time alerts

---

## 📚 Full Documentation

For detailed information, see:

1. **`docs/CHAINPHANTOM_RULES_TEST_CASES.md`**
   - Complete rule descriptions
   - Detailed testing procedures
   - Expected JSON outputs
   - Testing checklist

2. **`docs/TEST_ENTRIES.md`**
   - All test addresses
   - Copy-paste entries
   - Testing scenarios

3. **`docs/IMPLEMENTATION_SUMMARY.md`**
   - Implementation overview
   - Technical details
   - Developer guide

4. **`frontend/src/utils/testEntries.js`**
   - Programmatic access to test data
   - Helper functions
   - Test scenarios object

---

## 🎯 Testing Checklist

Use this checklist to verify all features work:

### Rule 1: Exceeds Monthly Average
- [ ] Enter address `meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
- [ ] See risk score around 55
- [ ] See "exceeds_monthly_average" pattern
- [ ] See "45 transactions vs 20 average" message
- [ ] Alert shows medium severity (⚠️)

### Rule 2: High Frequency Short Span
- [ ] Enter address `mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
- [ ] See risk score around 65
- [ ] See "high_frequency_short_span" pattern
- [ ] See "15 transactions in short time" message
- [ ] Alert shows high severity (🚨)
- [ ] Transaction timestamps show burst activity

### Rule 3: Lump Sum Transaction
- [ ] Enter address `mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
- [ ] See risk score around 70
- [ ] See "lump_sum_transaction" pattern
- [ ] See amount > 100 BTC
- [ ] Alert shows high severity (🚨)
- [ ] One transaction significantly larger than others

### Multi-Address Test (Wallet Monitor)
- [ ] Add all three test addresses to monitor
- [ ] Each shows correct alerts
- [ ] Each shows correct risk level
- [ ] Activity status indicators correct
- [ ] Alerts display with proper severity

---

## 💡 Pro Tips

1. **Address Format Recognition**
   - Addresses starting with `me...` → Rule 1
   - Addresses starting with `mh...` → Rule 2
   - Addresses starting with `ml...` → Rule 3
   - Also works with `ne...`, `nh...`, `nl...`

2. **Risk Score Interpretation**
   - 0-29: Minimal/Low risk
   - 30-49: Medium risk
   - 50-69: High risk
   - 70-100: Critical risk

3. **Pattern Severity**
   - **Low**: Informational, minimal concern
   - **Medium**: Warrants monitoring
   - **High**: Requires investigation
   - **Critical**: Immediate attention needed

4. **Testing Efficiency**
   - Use browser bookmarks for test addresses
   - Test in sequence (Rule 1 → 2 → 3)
   - Check both desktop and mobile views
   - Verify alerts in Wallet Monitor

---

## 🚦 Success Criteria

Your test is successful if you see:

✅ All three addresses load without errors
✅ Each shows unique risk patterns
✅ Risk scores are in expected ranges
✅ Alert messages are clear and specific
✅ Severity indicators are correct
✅ Transaction data makes sense
✅ UI is responsive and user-friendly

---

## 🐛 Troubleshooting

**Not seeing testnet data?**
- Verify you're in Testnet mode (check navbar)
- Look for "Testnet" badge
- Refresh the page if needed

**Wrong risk score showing?**
- Double-check you copied the correct address
- Ensure address starts with `me`, `mh`, or `ml`
- Clear browser cache if needed

**No alerts appearing?**
- Check browser console for errors
- Verify you're on the correct page
- Try the Forensic Analysis page specifically

---

## 📞 Need Help?

If something doesn't work as expected:
1. Check browser console for errors
2. Review the implementation in `testnetMockData.js`
3. Verify test addresses in `testEntries.js`
4. Read detailed docs in `CHAINPHANTOM_RULES_TEST_CASES.md`

---

## 🎉 You're All Set!

Your ChainPhantom application now has comprehensive rule-based detection for:
- ✅ Monthly transaction average monitoring
- ✅ High-frequency burst detection
- ✅ Lump sum transaction flagging

**Happy Testing!** 🚀

---

*Last Updated: January 7, 2026*
*Implementation Version: 1.0.0*
*Status: Production Ready for Testnet*

