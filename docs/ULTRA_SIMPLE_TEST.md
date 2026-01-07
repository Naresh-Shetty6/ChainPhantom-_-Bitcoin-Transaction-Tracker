# 🚀 ULTRA SIMPLE TEST GUIDE

## ⚡ **3 Steps to Test Everything**

---

## 📋 **STEP 1: Enable Testnet**

Click the toggle at top-right:
- Look for "Network Mode" toggle
- Click to enable "🔧 Testnet Mode"
- Should show orange/yellow indicator

---

## 📋 **STEP 2: Copy & Search These**

Just copy each line below and paste into the search bar:

### **Test Transaction (Critical Risk)**
```
tpd01lumpsumtransaction1234567890abcdef1234567890abcdef123456789012
```
**Expect:** 🔴 Red, 92% risk, "LUMP SUM" alert

---

### **Test Transaction (High Risk - Mixer)**
```
tpd02mixertumbler1234567890abcdef1234567890abcdef1234567890abcdef
```
**Expect:** 🔴 Red, 78% risk, "CoinJoin" pattern, many inputs/outputs

---

### **Test Transaction (High Risk - Peeling)**
```
tpd03peelingchain1234567890abcdef1234567890abcdef1234567890abcdef
```
**Expect:** 🔴 Red, 68% risk, "Peeling Chain" pattern

---

### **Test Transaction (Normal)**
```
txnormal1234567890abcdef1234567890abcdef1234567890abcdef12345678
```
**Expect:** 🟢 Green, 15% risk, "Normal Transaction"

---

### **Test Wallet (All 3 Rules Triggered)**
```
tad01rulestrigger1234567890abcdef1234567890abcdef1234567890abcdef12
```
**Expect:** 🔴 Red, 92% risk, **3 alerts** shown

---

### **Test Wallet (Rule 1: Monthly Average)**
```
tad02monthlyaverage1234567890abcdef1234567890abcdef1234567890abcdef
```
**Expect:** 🟡 Yellow, 42% risk, 1 alert "Exceeds monthly average"

---

### **Test Wallet (Rule 2: High Frequency)**
```
tad03shortspanfrequency1234567890abcdef1234567890abcdef123456789012
```
**Expect:** 🟡 Yellow, 45% risk, 1 alert "High frequency"

---

### **Test Wallet (Rule 3: Lump Sum)**
```
tlumpsum1234567890abcdef1234567890abcdef1234567890abcdef12345678901
```
**Expect:** 🔴 Red, 72% risk, 1 alert "Lump sum transaction"

---

### **Test Wallet (Normal)**
```
tnormal1234567890abcdef1234567890abcdef1234567890abcdef123456789
```
**Expect:** 🟢 Green, 8% risk, no alerts

---

## 📋 **STEP 3: Verify Results**

For each test, check:
- ✅ **Color matches** (Green, Yellow, Orange, or Red)
- ✅ **Risk score matches** (approximate percentage)
- ✅ **Pattern/Alert shown** (as expected)
- ✅ **No flickering** (loads smoothly once)

---

## 🎯 **The 3 Wallet Monitoring Rules**

### **Rule 1: Exceeds Monthly Average**
**What:** Current month transactions > monthly average  
**Test:** `tad02monthlyaverage...`  
**Look for:** Alert showing "20 transactions vs 8 average"

### **Rule 2: High Frequency (Short Time)**
**What:** More than 10 transactions in 24 hours  
**Test:** `tad03shortspanfrequency...`  
**Look for:** Alert showing "12+ transactions in short time"

### **Rule 3: Lump Sum Transaction**
**What:** Single transaction > 500 BTC (very huge)  
**Test:** `tlumpsum...` or `tpd01lumpsum...`  
**Look for:** Alert showing "800 BTC lump sum detected"

### **All 3 Combined:**
**Test:** `tad01rulestrigger...`  
**Look for:** 3 separate alerts displayed!

---

## ✅ **Quick Checklist**

Copy this and check off as you test:

```
[ ] Testnet mode enabled (toggle shows orange)
[ ] Lump sum TX → Critical risk (92%)
[ ] Mixer TX → High risk (78%)
[ ] Peeling TX → High risk (68%)
[ ] Normal TX → Low risk (15%)
[ ] All rules wallet → 3 alerts shown
[ ] Monthly avg wallet → 1 alert shown
[ ] High freq wallet → 1 alert shown
[ ] Lump sum wallet → 1 alert shown
[ ] Normal wallet → 0 alerts shown
[ ] No flickering on any page
[ ] Patterns displayed clearly
[ ] Colors match risk levels
```

**If all checked: Perfect! ✅**

---

## 🆘 **Troubleshooting**

### **Problem: "Transaction not found"**
**Fix:**
1. Make sure testnet mode is **ENABLED** (orange toggle)
2. Copy the EXACT string (including all letters/numbers)
3. Hard refresh browser (Ctrl+Shift+R)

### **Problem: Page keeps flickering**
**Fix:**
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Should be fixed with recent updates

### **Problem: No patterns showing**
**Fix:**
1. Scroll down to "Suspicious Pattern Detection" section
2. Wait 2-3 seconds for analysis
3. Check testnet is enabled

---

## 📊 **Expected Results Summary**

| Test | Risk Color | Risk % | Alerts |
|------|-----------|--------|--------|
| Normal TX | 🟢 Green | ~15% | 0 |
| Mixer TX | 🔴 Red | ~78% | 0 |
| Peeling TX | 🔴 Red | ~68% | 0 |
| Lump Sum TX | ⚫ Critical | ~92% | 0 |
| Normal Wallet | 🟢 Green | ~8% | 0 |
| Rule 1 Wallet | 🟡 Yellow | ~42% | 1 |
| Rule 2 Wallet | 🟡 Yellow | ~45% | 1 |
| Rule 3 Wallet | 🔴 Red | ~72% | 1 |
| All Rules Wallet | ⚫ Critical | ~92% | **3** |

---

## 🎉 **That's It!**

Just those 9 tests cover everything:
- ✅ Transaction pattern detection
- ✅ Risk scoring
- ✅ All 3 wallet monitoring rules
- ✅ Alert system
- ✅ Normal cases

**Copy, paste, check. Done! 🚀**

---

**Estimated Time**: 5 minutes for all tests  
**Difficulty**: Copy & Paste level  
**Status**: ✅ **Super Easy!**

