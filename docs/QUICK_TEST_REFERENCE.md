# 🎯 Quick Test Reference Card

## Copy & Paste These for Instant Testing

### 🔴 Critical Priority Tests

```
# Security - Missing API Key Warning (SC-01)
# Just disable API key in config and try fetching data

# Security - No Secrets Exposed (SC-02)
# Build and inspect: npm run build

# Pattern Detection - Fast Succession (PD-01)
ADDRESS: mpd01FastSuccessionWallet1234567890abcdef
TX: tpd01fastsuccession1234567890abcdef1234567890abcdef

# Pattern Detection - Mixer (PD-02)
TX: tpd02mixertumbler1234567890abcdef1234567890abcdef
```

### 🟠 High Priority Tests

```
# Wallet Monitoring - Alert Triggers (WM-01)
ADDRESS: mwm01AlertTriggerWallet1234567890abcdef
Expected: Risk=55, Alert=Yes

# Wallet Monitoring - No Alert (WM-02)
ADDRESS: mwm02NoAlertRulesDisabled1234567890abcdef
Expected: Risk=80, Alert=No (rules OFF)

# Email - Success (EM-01)
ADDRESS: mem01SuccessfulSMTPSend1234567890abcdef
Expected: Email sent successfully

# Email - Failure (EM-02)
ADDRESS: mem02SMTPFailureHandling1234567890abcdef
Expected: Email failed gracefully

# Enhanced Rules - Monthly Average (ER-01)
ADDRESS: mer01MonthlyAverageBreached1234567890abcdef
Expected: Risk=55, Pattern=exceeds_monthly_average

# Enhanced Rules - Lump Sum (ER-02)
ADDRESS: mer02LumpSumDetection1234567890abcdef
TX: ter02lumpsum1234567890abcdef1234567890abcdef
Expected: Risk=70, 75 BTC transaction

# Risk Scoring - Deterministic (RS-01)
TX: trs01deterministicscoring1234567890abcdef
Expected: Same score on multiple runs

# Risk Scoring - Threshold (RS-02)
ADDRESS: mrs02ThresholdChange1234567890abcdef
Expected: Alert changes with threshold

# Performance - Interval (PF-01)
# Enable wallet monitoring and observe 5 cycles (~60s each)

# Performance - Child Cap (PF-02)
TX: tpf02childtxcap1234567890abcdef1234567890abcdef
Expected: Depth capped at 3, no freeze
```

### 🟡 Medium Priority Tests

```
# Transaction Fetch - Valid (TX-01)
TX: ttx01validbtctxid1234567890abcdef1234567890abcdef
Expected: All fields render correctly

# Transaction Fetch - Invalid (TX-02)
TX: invalid_tx_format
Expected: Graceful error message

# Multi-Chain - Ethereum (MC-01)
TX: 0xtmc01ethtxdetails1234567890abcdef1234567890abcdef
Chain: ETH
Expected: Gas and nonce fields visible

# Multi-Chain - Unsupported (MC-02)
# Try selecting unsupported chain
Expected: Fallback to BTC with notice

# Persistence - Persist (PR-01)
ADDRESS1: mpr01WalletPersist1A1234567890abcdef
ADDRESS2: mpr01WalletPersist1B1234567890abcdef
Expected: Survive page refresh

# Persistence - Clear (PR-02)
# Add wallets, then clear storage
Expected: Clean state after clear

# UI/UX - Mobile (UX-01)
# Set viewport to 375x667
Expected: No overflow, usable controls

# UI/UX - Contrast (UX-02)
# Check risk gauge with accessibility tools
Expected: WCAG AA compliant (>4.5:1)
```

### 🟢 Low Priority Tests

```
# Export - JSON (EX-01)
ADDRESS: mex01ExportJSONAnalysis1234567890abcdef
Expected: JSON file with complete data

# Export - PDF Empty (EX-02)
# Try exporting PDF without analysis
Expected: "Nothing to export" message
```

---

## 🎯 3-Minute Smoke Test

Test these 5 addresses to verify basic functionality:

```bash
# 1. Wallet Monitoring Alert
/address/mwm01AlertTriggerWallet1234567890abcdef

# 2. Fast Succession Pattern
/address/mpd01FastSuccessionWallet1234567890abcdef

# 3. Lump Sum Detection
/address/mer02LumpSumDetection1234567890abcdef

# 4. Valid Transaction
/transaction/ttx01validbtctxid1234567890abcdef1234567890abcdef

# 5. Export Test
/address/mex01ExportJSONAnalysis1234567890abcdef
```

---

## 🚦 Expected Risk Scores

| Test | Address/TX | Risk |
|------|-----------|------|
| WM-01 | mwm01... | 55 |
| WM-02 | mwm02... | 80 |
| EM-01 | mem01... | 70 |
| EM-02 | mem02... | 75 |
| PD-01 | mpd01... | 65 |
| PD-02 | tpd02... | 85 |
| ER-01 | mer01... | 55 |
| ER-02 | mer02... | 70 |
| EX-01 | mex01... | 65 |
| RS-01 | trs01... | 45 |
| RS-02 | mrs02... | 65 |

---

## ⚡ Fastest Test Route

1. **Enable Testnet** (toggle in navbar)
2. **Paste this URL**:
   ```
   http://localhost:3000/address/mwm01AlertTriggerWallet1234567890abcdef
   ```
3. **Check**: Risk score = 55, Alert present
4. **Done!** ✅

---

## 📱 Mobile Test Quick Check

```
1. Open DevTools (F12)
2. Set Device: iPhone SE (375x667)
3. Navigate to any address
4. Verify: No horizontal scroll
5. Verify: All controls tappable
```

---

## 🎨 Accessibility Quick Check

```
1. Open any address with risk score
2. Right-click risk gauge
3. Inspect → Accessibility
4. Verify: Contrast ratio > 4.5:1
5. Verify: Labels present
```

---

## 💡 Pro Tips

- **Bookmark test URLs** for quick access
- **Use browser profiles** for different test scenarios
- **Clear cache** between tests if needed
- **Check console** for detailed error messages
- **Take screenshots** of issues for reporting

---

**For Full Testing Guide**: See `COMPREHENSIVE_TEST_GUIDE.md`  
**For CSV Export**: See `TEST_CASES.csv`  
**For Implementation Details**: See `FINAL_IMPLEMENTATION_SUMMARY.md`

