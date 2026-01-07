# 🧪 ChainPhantom Testing Instructions

## ⚠️ Important: Where to Test Each Rule

The three ChainPhantom rules are **ADDRESS-BASED** detections, not transaction-based. This means:

### ✅ **CORRECT**: Test on Address Pages
- **Address Details** page (`/address/:address`)
- **Forensic Analysis** page (`/forensics`)
- **Wallet Monitor** page (`/wallet-monitor`)

### ❌ **INCORRECT**: Transaction Details Page
- Do NOT use the Transaction Details page to test these rules
- Transaction Details page analyzes TRANSACTION patterns (CoinJoin, peeling chain, etc.)
- The three wallet rules require ADDRESS transaction history

---

## 📍 How to Navigate to the Correct Pages

### Method 1: Direct URL
1. Enable Testnet mode (toggle in navbar)
2. Go to address bar
3. Type: `http://localhost:3000/address/meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
4. Or: `http://localhost:3000/forensics`

### Method 2: Use Search Feature
1. Enable Testnet mode
2. Find the search input (usually in navbar or on homepage)
3. Paste one of the test addresses below
4. Click "Address Details" or "Forensic Analysis"

---

## 🎯 Test Addresses for the Three Rules

Copy and paste these addresses into the **Address Details** or **Forensic Analysis** pages:

### Rule 1: Exceeds Monthly Average
```
meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```
**Expected Result:**
- Risk Score: ~55 (Medium)
- Pattern: `exceeds_monthly_average`
- Alert: ⚠️ "Wallet has 45 transactions this month, exceeding monthly average of 20 transactions"

---

### Rule 2: High Frequency Short Span
```
mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```
**Expected Result:**
- Risk Score: ~65 (High)
- Pattern: `high_frequency_short_span`
- Alert: 🚨 "Wallet has 15 transactions within a short time span (exceeds 10 transaction threshold)"

---

### Rule 3: Lump Sum Transaction
```
mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```
**Expected Result:**
- Risk Score: ~70 (High)
- Pattern: `lump_sum_transaction`
- Alert: 🚨 "Lump sum transaction detected - 250 BTC"

---

## 🧪 Transaction Hashes (Optional - For Transaction Page Testing)

If you want to test lump sum detection on the **Transaction Details** page, use these:

```
f3rule3lumpsumtransaction90abcdef1234567890abcdef1234567890abcdef
```

This will show a transaction with > 100 BTC (lump sum pattern).

**Note**: Rules 1 and 2 cannot be tested on the Transaction Details page because they require address transaction history.

---

## 📊 Step-by-Step Testing Guide

### Testing Rule 1: Exceeds Monthly Average

1. **Enable Testnet Mode**
   - Look for network toggle in navbar
   - Click to switch to Testnet
   - Verify "Testnet" badge appears

2. **Navigate to Address Details**
   - Go to: `/address/meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
   - OR use Forensic Analysis page and search for the address

3. **Verify the Results**
   - [ ] Page loads without errors
   - [ ] Risk score shows ~55
   - [ ] "exceeds_monthly_average" pattern is detected
   - [ ] Alert message displays: "45 transactions vs 20 average"
   - [ ] Severity level is Medium (⚠️)

4. **Check Additional Details**
   - [ ] Transaction count shows 45
   - [ ] Monthly average shows 20
   - [ ] Percentage increase is calculated
   - [ ] Timeline shows transaction distribution

---

### Testing Rule 2: High Frequency Short Span

1. **Enable Testnet Mode**
   - Ensure Testnet toggle is ON

2. **Navigate to Address Details**
   - Go to: `/address/mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
   - OR use Forensic Analysis page

3. **Verify the Results**
   - [ ] Risk score shows ~65
   - [ ] "high_frequency_short_span" pattern detected
   - [ ] Alert shows "15 transactions in short time span"
   - [ ] Severity level is High (🚨)

4. **Check Additional Details**
   - [ ] Transaction count shows 15
   - [ ] Time span is < 24 hours
   - [ ] Transactions show burst activity (every ~5 minutes)
   - [ ] Warning about automated trading appears

---

### Testing Rule 3: Lump Sum Transaction

1. **Enable Testnet Mode**

2. **Navigate to Address Details**
   - Go to: `/address/mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`

3. **Verify the Results**
   - [ ] Risk score shows ~70
   - [ ] "lump_sum_transaction" pattern detected
   - [ ] Alert shows amount > 100 BTC
   - [ ] Severity level is High (🚨)

4. **Check Additional Details**
   - [ ] At least one transaction > 100 BTC
   - [ ] Amount is clearly displayed (e.g., "250 BTC")
   - [ ] Warning about huge amount appears

---

## 🎨 Visual Indicators to Look For

### On Address Details Page
- **Risk Meter**: Circular or bar chart showing risk score
- **Alert Badges**: Colored badges with severity levels
- **Pattern List**: List of detected patterns with descriptions
- **Transaction History**: Timeline of transactions with flagged items highlighted

### On Forensic Analysis Page
- **Risk Analysis Dashboard**: Overview of all detected patterns
- **Detailed Reports**: Breakdown by pattern type
- **Severity Indicators**: Color-coded warnings
- **Recommendations**: Suggested actions based on detected patterns

### On Wallet Monitor Page
- **Real-time Alerts**: Pop-up or list of active alerts
- **Address Cards**: Each monitored address with its status
- **Activity Status**: Indicators like "burst", "elevated", "high_value"
- **Alert History**: Timeline of past alerts

---

## 🐛 Troubleshooting

### Issue: "No patterns detected" or Risk Score is 0

**Solution 1**: Check if you're on the correct page
- ✅ Use: Address Details, Forensic Analysis, or Wallet Monitor
- ❌ Don't use: Transaction Details (unless testing Rule 3 with transaction hash)

**Solution 2**: Verify Testnet mode is enabled
- Look for "Testnet" badge in navbar
- If not visible, click the network toggle

**Solution 3**: Double-check the address
- Ensure you copied the FULL address
- Verify it starts with `me`, `mh`, or `ml`
- No extra spaces or characters

### Issue: Page shows mainnet data or real blockchain data

**Solution**: You're not in Testnet mode
- Click the network toggle in the navbar
- Refresh the page after switching
- Clear browser cache if needed

### Issue: Risk score is different than expected

**Reason**: Risk scores have some randomization for realistic testing
- Expected range for Rule 1: 50-60
- Expected range for Rule 2: 60-70
- Expected range for Rule 3: 65-75

This is normal and intentional.

---

## 📋 Complete Testing Checklist

### Pre-Testing Setup
- [ ] Application is running (`npm start` in frontend folder)
- [ ] Browser is open to `http://localhost:3000`
- [ ] Testnet mode is enabled (toggle in navbar)
- [ ] Browser console is open (F12) to check for errors

### Rule 1: Exceeds Monthly Average
- [ ] Navigate to Address Details page
- [ ] Enter: `meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
- [ ] Risk score ~55 displayed
- [ ] Pattern "exceeds_monthly_average" detected
- [ ] Alert message shows 45 vs 20 transactions
- [ ] No console errors

### Rule 2: High Frequency Short Span
- [ ] Navigate to Address Details page
- [ ] Enter: `mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
- [ ] Risk score ~65 displayed
- [ ] Pattern "high_frequency_short_span" detected
- [ ] Alert shows 15 transactions in short span
- [ ] No console errors

### Rule 3: Lump Sum Transaction
- [ ] Navigate to Address Details page
- [ ] Enter: `mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
- [ ] Risk score ~70 displayed
- [ ] Pattern "lump_sum_transaction" detected
- [ ] Alert shows amount > 100 BTC
- [ ] No console errors

### Integration Testing
- [ ] Test Wallet Monitor with all three addresses
- [ ] Test Forensic Analysis with each address
- [ ] Verify alerts display correctly
- [ ] Check that severity colors are correct
- [ ] Confirm all data is from testnet (not real blockchain)

---

## 💡 Quick Tips

1. **Bookmark Test URLs**
   ```
   http://localhost:3000/address/meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
   http://localhost:3000/address/mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
   http://localhost:3000/address/mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
   ```

2. **Test in Sequence**
   - Start with Rule 1 (lowest risk)
   - Then Rule 2 (medium-high risk)
   - Finally Rule 3 (highest risk)
   - This helps you see the progression of risk indicators

3. **Compare with Normal Address**
   - After testing the flagged addresses, try a normal one:
   ```
   2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
   ```
   - This shows what "normal" looks like for comparison

4. **Take Screenshots**
   - Capture each rule's results for documentation
   - Useful for bug reports or feature demonstrations

---

## 📞 Support

If you encounter issues:
1. Check browser console for JavaScript errors
2. Verify testnet mode is enabled
3. Confirm you're on the correct page type (Address vs Transaction)
4. Review `testnetMockData.js` for implementation details
5. Check `testEntries.js` for test data definitions

---

**Last Updated**: January 7, 2026
**Status**: Ready for Testing ✅

