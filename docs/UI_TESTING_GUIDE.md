# 🎨 ChainPhantom UI Testing Guide

## 📍 Where to Find Everything

### 🔍 **Where to Enter Wallet Addresses**

#### Option 1: Wallet Monitor Page (Recommended)
**URL**: `http://localhost:3000/wallet-monitor`

**Steps**:
1. Click "Wallet Monitor" in the navigation menu
2. Look for **"Add Wallet to Monitor"** section at the top
3. You'll see an input field with placeholder text:
   ```
   "Enter Bitcoin wallet address (e.g., 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa)"
   ```
4. Paste any test address and click "+ Add Wallet"

#### Option 2: Address Details (Direct URL)
**URL**: `http://localhost:3000/address/{ADDRESS}`

**Example**:
```
http://localhost:3000/address/mwm01AlertTriggerWallet1234567890abcdef
```

#### Option 3: Forensic Analysis
**URL**: `http://localhost:3000/forensics`

Then enter the address in the analysis input field.

---

### 🔗 **Where to Enter Transaction Hashes**

#### Option 1: Transaction Details (Direct URL)
**URL**: `http://localhost:3000/transaction/{TX_HASH}`

**Example**:
```
http://localhost:3000/transaction/tpd01fastsuccession1234567890abcdef1234567890abcdef
```

#### Option 2: Search Bar
If your app has a search feature, paste the transaction hash there.

---

## 🧪 Complete Test Data Reference

### 📦 **For Wallet Monitor Testing**

Copy these addresses into the Wallet Monitor input field:

```javascript
// Rule 1: Exceeds Monthly Average (Risk: 55)
meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc

// Rule 2: High Frequency Short Span (Risk: 65)
mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc

// Rule 3: Lump Sum Transaction (Risk: 70)
mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc

// Wallet Monitoring - Alert Trigger (WM-01)
mwm01AlertTriggerWallet1234567890abcdef

// Wallet Monitoring - No Alert (WM-02)
mwm02NoAlertRulesDisabled1234567890abcdef

// Email Alert - Successful (EM-01)
mem01SuccessfulSMTPSend1234567890abcdef

// Email Alert - Failure (EM-02)
mem02SMTPFailureHandling1234567890abcdef

// Pattern Detection - Fast Succession (PD-01)
mpd01FastSuccessionWallet1234567890abcdef

// Enhanced Rules - Monthly Average (ER-01)
mer01MonthlyAverageBreached1234567890abcdef

// Enhanced Rules - Lump Sum (ER-02)
mer02LumpSumDetection1234567890abcdef

// Export Test (EX-01)
mex01ExportJSONAnalysis1234567890abcdef

// Risk Scoring - Threshold Test (RS-02)
mrs02ThresholdChange1234567890abcdef

// Persistence Test - Wallet 1 (PR-01)
mpr01WalletPersist1A1234567890abcdef

// Persistence Test - Wallet 2 (PR-01)
mpr01WalletPersist1B1234567890abcdef
```

---

### 🔗 **For Transaction Testing**

Copy these transaction hashes into Transaction Details:

```javascript
// Pattern Detection - Fast Succession (PD-01)
tpd01fastsuccession1234567890abcdef1234567890abcdef

// Pattern Detection - Mixer (PD-02)
tpd02mixertumbler1234567890abcdef1234567890abcdef

// Enhanced Rules - Lump Sum (ER-02)
ter02lumpsum1234567890abcdef1234567890abcdef

// Transaction Fetch - Valid (TX-01)
ttx01validbtctxid1234567890abcdef1234567890abcdef

// Transaction Fetch - Invalid (TX-02)
invalid_tx_format

// Multi-Chain - Ethereum (MC-01)
0xtmc01ethtxdetails1234567890abcdef1234567890abcdef

// Risk Scoring - Deterministic (RS-01)
trs01deterministicscoring1234567890abcdef

// Performance - Child Cap (PF-02)
tpf02childtxcap1234567890abcdef1234567890abcdef

// Original Rules - Single Sender (Rule Pattern)
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456

// Original Rules - Two Receivers (Rule Pattern)
b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567

// Original Rules - Multiple Inputs (Rule Pattern)
c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678

// Original Rules - CoinJoin (Rule Pattern)
d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890

// Original Rules - Consolidation (Rule Pattern)
e5f6789012345678901234567890abcdef1234567890abcdef1234567890ab
```

---

## 🎯 **Step-by-Step Testing Guide**

### Test Scenario 1: Wallet Monitor with Alert Trigger

**Steps**:
1. Enable Testnet mode (toggle in navbar)
2. Navigate to **`/wallet-monitor`**
3. In the "Add Wallet to Monitor" section, paste:
   ```
   mwm01AlertTriggerWallet1234567890abcdef
   ```
4. Click "+ Add Wallet"
5. Click "▶ Start Monitoring"
6. **Expected Result**:
   - Wallet added to monitoring list
   - Risk score shows 55
   - Alert triggered (risk ≥ threshold of 50)
   - Alert appears in "Recent Alerts" section

---

### Test Scenario 2: Transaction Pattern Detection

**Steps**:
1. Enable Testnet mode
2. Navigate to **`/transaction/tpd01fastsuccession1234567890abcdef1234567890abcdef`**
3. **Expected Result**:
   - Transaction details load
   - "Suspicious Pattern Detection" section shows patterns
   - "Fast Succession" pattern detected
   - Severity: Medium
   - Risk score: 65

---

### Test Scenario 3: Address Forensic Analysis

**Steps**:
1. Enable Testnet mode
2. Navigate to **`/address/mer02LumpSumDetection1234567890abcdef`**
3. **Expected Result**:
   - Address details load
   - Risk score: 70
   - Pattern: "lump_sum_transaction"
   - Alert: "Lump sum transaction detected - 75 BTC"

---

## 🗺️ **Page Navigation Map**

```
ChainPhantom Application
│
├─ Dashboard (/dashboard)
│  └─ Overview statistics
│
├─ Address Details (/address/:address)
│  ├─ Transaction history
│  ├─ Risk analysis
│  └─ Pattern detection
│
├─ Transaction Details (/transaction/:txHash)
│  ├─ Inputs/Outputs
│  ├─ Suspicious patterns
│  └─ Transaction graph
│
├─ Wallet Monitor (/wallet-monitor) ⭐ WALLET INPUT HERE
│  ├─ Add Wallet input field
│  ├─ Monitored wallets list
│  ├─ Start/Stop monitoring
│  ├─ Alert rules configuration
│  └─ Recent alerts
│
├─ Forensic Analysis (/forensics)
│  ├─ Address analysis input
│  ├─ Risk assessment
│  └─ Pattern detection results
│
├─ Multi-Chain Analysis (/multi-chain)
│  └─ Cross-chain address lookup
│
└─ Network Stats (/network)
   └─ Blockchain statistics
```

---

## 💡 **Pro Tips**

### Quick Testing Workflow:

1. **Bookmark these URLs**:
   ```
   http://localhost:3000/wallet-monitor
   http://localhost:3000/address/mwm01AlertTriggerWallet1234567890abcdef
   http://localhost:3000/transaction/tpd01fastsuccession1234567890abcdef1234567890abcdef
   ```

2. **Use Browser Snippets**:
   Create browser snippets with test addresses for quick paste

3. **Test in Order**:
   - Start with Wallet Monitor (easiest to see results)
   - Then test Address Details
   - Finally test Transaction Details

4. **Monitor Console**:
   - Keep DevTools open (F12)
   - Watch Console for any errors
   - Check Network tab for API calls

---

## 🔍 **Where to See Test Results**

### In Wallet Monitor:
- **Risk Score**: Displayed on each wallet card
- **Alerts**: "Recent Alerts" section below monitored wallets
- **Patterns**: Click "👁 View Details" on any wallet

### In Address Details:
- **Risk Score**: Top section, large circular meter
- **Patterns**: "Suspicious Patterns" section
- **Transaction History**: Scrollable list with timestamps

### In Transaction Details:
- **Risk Score**: "Suspicious Pattern Detection" section
- **Patterns**: List of detected patterns with severity
- **Transaction Graph**: Visual representation of inputs/outputs

---

## 🎨 **Visual Indicators**

### Risk Score Colors:
- 🟢 **Green (0-29)**: Minimal risk
- 🔵 **Blue (30-49)**: Low risk
- 🟡 **Yellow (50-69)**: Medium risk
- 🟠 **Orange (70-89)**: High risk
- 🔴 **Red (90-100)**: Critical risk

### Alert Severity:
- 🔴 **Critical**: Immediate attention required
- 🟠 **High**: Requires investigation
- 🟡 **Medium**: Monitor closely
- 🔵 **Low**: Informational

---

## 🐛 **Troubleshooting**

### "Can't find wallet input field"
- **Solution**: Navigate to `/wallet-monitor` page
- Look for "Add Wallet to Monitor" heading
- Input field is directly below with blue "+ Add Wallet" button

### "Test address doesn't work"
- **Solution**: Ensure Testnet mode is ON (check navbar)
- Verify you copied the complete address (no spaces)
- Try refreshing the page

### "Transaction doesn't load"
- **Solution**: Check URL format: `/transaction/{hash}`
- For invalid tx test, you SHOULD see an error (that's expected)
- Verify hash is complete

### "No patterns detected"
- **Solution**: You might be on wrong page
- Addresses test on Address Details/Forensic Analysis
- Transactions test on Transaction Details

---

## 📱 **Mobile Testing**

1. Open DevTools (F12)
2. Click device icon (Ctrl+Shift+M)
3. Select "iPhone SE" or custom 375x667
4. Navigate through pages
5. Verify:
   - No horizontal scroll
   - All buttons tappable
   - Text readable
   - Charts/graphs responsive

---

## ✅ **Quick Verification Checklist**

- [ ] Testnet mode is enabled
- [ ] Can see wallet input on /wallet-monitor
- [ ] Can add test address to monitoring
- [ ] Risk scores display correctly
- [ ] Alerts appear when expected
- [ ] Transaction details load
- [ ] Patterns are detected
- [ ] No console errors

---

## 📞 **Need Help?**

If you still can't find the wallet input:

1. Take a screenshot of your Wallet Monitor page
2. Check that you're on: `http://localhost:3000/wallet-monitor`
3. Verify the navbar shows "Wallet Monitor" as active
4. Look for the section titled "Add Wallet to Monitor"
5. The input field should have placeholder text

The input field is **definitely there** - it's in the code at line 435-442 of `WalletMonitor.js`!

---

**Last Updated**: January 7, 2026  
**Status**: Complete ✅

