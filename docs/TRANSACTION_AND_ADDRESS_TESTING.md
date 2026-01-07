# 🎯 Transaction & Address Testing Guide

## ✅ What Was Added

### 1. **Transaction Hash Test Cases** ✅
All 24 test scenarios now work with BOTH addresses AND transaction hashes!

### 2. **Wallet Input UI Location** ✅
Clear documentation showing exactly where to enter wallet addresses in the UI.

---

## 📍 **Where to Enter Data**

### 🔷 **For ADDRESSES** (Wallet Monitoring & Analysis):

#### Option 1: Wallet Monitor Page ⭐ **RECOMMENDED**
```
URL: http://localhost:3000/wallet-monitor
```

**Steps**:
1. Navigate to Wallet Monitor page
2. Look for section titled **"Add Wallet to Monitor"**
3. You'll see an input field with blue "+ Add Wallet" button
4. Paste any test address and click the button

**The input field is at line 435-442 in `WalletMonitor.js`** - it's definitely there!

#### Option 2: Direct URL
```
URL: http://localhost:3000/address/{ADDRESS}
```

**Example**:
```
http://localhost:3000/address/mwm01AlertTriggerWallet1234567890abcdef
```

---

### 🔷 **For TRANSACTIONS** (Pattern Detection):

#### Direct URL (Only Way)
```
URL: http://localhost:3000/transaction/{TX_HASH}
```

**Example**:
```
http://localhost:3000/transaction/tpd01fastsuccession1234567890abcdef1234567890abcdef
```

---

## 📦 **Quick Copy-Paste Reference**

### 🟢 **ADDRESSES** (For Wallet Monitor Input)

```javascript
// ORIGINAL 3 RULES
meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc          // Rule 1: Exceeds Monthly Average
mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc          // Rule 2: High Frequency Short Span  
mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc          // Rule 3: Lump Sum Transaction

// COMPREHENSIVE TEST SCENARIOS
mwm01AlertTriggerWallet1234567890abcdef       // WM-01: Alert Trigger (Risk: 55)
mwm02NoAlertRulesDisabled1234567890abcdef     // WM-02: No Alert (Risk: 80)
mem01SuccessfulSMTPSend1234567890abcdef       // EM-01: Email Success (Risk: 70)
mem02SMTPFailureHandling1234567890abcdef      // EM-02: Email Failure (Risk: 75)
mpd01FastSuccessionWallet1234567890abcdef     // PD-01: Fast Succession (Risk: 65)
mer01MonthlyAverageBreached1234567890abcdef   // ER-01: Monthly Average (Risk: 55)
mer02LumpSumDetection1234567890abcdef         // ER-02: Lump Sum (Risk: 70)
mex01ExportJSONAnalysis1234567890abcdef       // EX-01: Export Test (Risk: 65)
mrs02ThresholdChange1234567890abcdef          // RS-02: Threshold Test (Risk: 65)
mpr01WalletPersist1A1234567890abcdef          // PR-01: Persist Wallet 1
mpr01WalletPersist1B1234567890abcdef          // PR-01: Persist Wallet 2
```

### 🔵 **TRANSACTIONS** (For Transaction Details URL)

```javascript
// ORIGINAL TRANSACTION PATTERNS
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456    // Single Sender
b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567    // Two Receivers
c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678    // Multiple Inputs
d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890    // CoinJoin
e5f6789012345678901234567890abcdef1234567890abcdef1234567890ab    // Consolidation

// COMPREHENSIVE TEST SCENARIOS
tpd01fastsuccession1234567890abcdef1234567890abcdef               // PD-01: Fast Succession
tpd02mixertumbler1234567890abcdef1234567890abcdef                 // PD-02: Mixer (20x20)
ter02lumpsum1234567890abcdef1234567890abcdef                      // ER-02: Lump Sum (75 BTC)
ttx01validbtctxid1234567890abcdef1234567890abcdef                 // TX-01: Valid Transaction
invalid_tx_format                                                  // TX-02: Invalid (Error Test)
0xtmc01ethtxdetails1234567890abcdef1234567890abcdef               // MC-01: Ethereum
trs01deterministicscoring1234567890abcdef                          // RS-01: Deterministic
tpf02childtxcap1234567890abcdef1234567890abcdef                   // PF-02: Child Cap
```

---

## 🎯 **5-Minute Complete Test**

### Test 1: Wallet Monitor (2 min)
```bash
# 1. Navigate to Wallet Monitor
http://localhost:3000/wallet-monitor

# 2. Paste this address in the input field:
mwm01AlertTriggerWallet1234567890abcdef

# 3. Click "+ Add Wallet"
# 4. Click "▶ Start Monitoring"
# 5. Expected: Risk=55, Alert triggered ✅
```

### Test 2: Transaction Details (2 min)
```bash
# 1. Navigate to Transaction Details
http://localhost:3000/transaction/tpd01fastsuccession1234567890abcdef1234567890abcdef

# 2. Expected: 
#    - Pattern: fast_succession
#    - Severity: medium
#    - Risk: 65 ✅
```

### Test 3: Address Details (1 min)
```bash
# 1. Navigate to Address Details
http://localhost:3000/address/mer02LumpSumDetection1234567890abcdef

# 2. Expected:
#    - Risk: 70
#    - Pattern: lump_sum_transaction
#    - Amount: 75 BTC ✅
```

---

## 📊 **What Each Test Does**

### Address Tests (Generate Wallet History)
- **meXKPa...**: 45 transactions this month (exceeds 20 avg)
- **mhXKPa...**: 15 transactions in 1 hour (fast succession)
- **mlXKPa...**: One 100+ BTC transaction (lump sum)
- **mwm01...**: Risk score 55 (triggers alert)
- **mem01...**: Risk score 70 (email test)
- **mpd01...**: Multiple fast succession transactions
- **mer01...**: 2.5 BTC vs 1.0 BTC average
- **mer02...**: 75 BTC single transaction

### Transaction Tests (Generate Transaction Data)
- **tpd01...**: 2 inputs, 2 outputs (fast succession pattern)
- **tpd02...**: 20 inputs, 20 outputs (mixer pattern)
- **ter02...**: 1 input, 1 output, 75 BTC (lump sum)
- **ttx01...**: Valid 2-input, 2-output transaction
- **invalid_tx_format**: Returns error (expected)
- **0xtmc01...**: Ethereum transaction with gas/nonce
- **trs01...**: Fixed values for deterministic scoring
- **tpf02...**: 3 inputs, 5 outputs (child cap test)

---

## 🔧 **How It Works**

### Scenario Detection System
```javascript
// In testnetMockData.js

// 1. Detect scenario from address/transaction pattern
const scenario = detectScenario(identifier);

// 2. If scenario found, generate specific data
if (scenario) {
  return generateScenarioAddressData(address, scenario);
  // OR
  return generateScenarioTransactionData(txId, scenario);
}

// 3. Otherwise, use default logic
```

### Supported Patterns
- `wm01`, `wm02` → Wallet Monitoring scenarios
- `em01`, `em02` → Email Alert scenarios
- `pd01`, `pd02` → Pattern Detection scenarios
- `er01`, `er02` → Enhanced Rules scenarios
- `tx01`, `tx02` → Transaction Fetch scenarios
- `mc01`, `mc02` → Multi-Chain scenarios
- `rs01`, `rs02` → Risk Scoring scenarios
- `pf01`, `pf02` → Performance scenarios

---

## 💡 **Pro Tips**

### 1. Use Import in Code
```javascript
import { quickCopyAddresses, quickCopyTransactions } from './utils/testEntries';

// Get address for wallet monitor
const testAddress = quickCopyAddresses.WM01_alertTrigger;

// Get transaction for analysis
const testTx = quickCopyTransactions.PD01_fastSuccession;
```

### 2. Bookmark Test URLs
```
Wallet Monitor: http://localhost:3000/wallet-monitor
Test Address: http://localhost:3000/address/mwm01AlertTriggerWallet1234567890abcdef
Test Transaction: http://localhost:3000/transaction/tpd01fastsuccession1234567890abcdef1234567890abcdef
```

### 3. Test in Sequence
1. **Start**: Wallet Monitor (easiest to see)
2. **Then**: Address Details (shows wallet history)
3. **Finally**: Transaction Details (shows transaction patterns)

### 4. Use Helper Functions
```javascript
import { getTestDataByUseCase } from './utils/testEntries';

// Get all addresses for wallet monitoring
const walletAddresses = getTestDataByUseCase('wallet-monitor');

// Get all transactions for pattern testing
const transactions = getTestDataByUseCase('transaction-details');
```

---

## 📸 **Visual Guide**

### Wallet Monitor Page Layout:
```
┌──────────────────────────────────────────┐
│ 🎮 ChainPhantom - Wallet Monitor        │
├──────────────────────────────────────────┤
│                                          │
│ ➕ Add Wallet to Monitor                │
│ ┌──────────────────────────────────┐   │
│ │ Enter Bitcoin wallet address...  │   │ ← INPUT HERE!
│ └──────────────────────────────────┘   │
│ [+ Add Wallet]                          │
│                                          │
│ ⚙️ Monitoring Settings                  │
│ [▶ Start Monitoring] [⏸ Pause]          │
│                                          │
│ 👁️ Monitored Wallets (2)                │
│ ┌────────────────────────────────────┐ │
│ │ mwm01...abcdef                     │ │
│ │ Risk: 55 | Active | 🔴 Alert      │ │
│ └────────────────────────────────────┘ │
│                                          │
│ 🔔 Recent Alerts                        │
│ • Alert triggered for mwm01...          │
└──────────────────────────────────────────┘
```

---

## ✅ **Verification Checklist**

- [ ] Testnet mode enabled
- [ ] Can see Wallet Monitor page (`/wallet-monitor`)
- [ ] Can see "Add Wallet to Monitor" section
- [ ] Can see input field with placeholder text
- [ ] Can add test address successfully
- [ ] Risk score displays correctly
- [ ] Can navigate to transaction details
- [ ] Transaction patterns detected
- [ ] No console errors

---

## 🎊 **Success!**

You now have:
- ✅ **Transaction hash test cases** for all 24 scenarios
- ✅ **Clear UI guidance** for wallet input location
- ✅ **Quick copy-paste references** for both addresses and transactions
- ✅ **Helper functions** for programmatic access
- ✅ **Complete documentation** with examples

---

## 📚 **Related Documentation**

- **`UI_TESTING_GUIDE.md`** - Detailed UI navigation
- **`COMPREHENSIVE_TEST_GUIDE.md`** - All 24 test scenarios
- **`QUICK_TEST_REFERENCE.md`** - Quick reference card
- **`testEntries.js`** - Programmatic access to test data
- **`testnetScenarios.js`** - Scenario definitions

---

**Last Updated**: January 7, 2026  
**Status**: ✅ Complete - Addresses AND Transactions Ready!

