# Chain Phantom Rules - Test Cases

This document describes the three main rules for Chain Phantom and how to test them in testnet mode.

## Rules for Chain Phantom

### Rule 1: Exceeds Monthly Average Transactions
**Flag the Wallet if the number of transactions exceeds more than their monthly Average**

**Test Address:**
```
meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```

**Expected Behavior:**
- Monthly average: 20 transactions
- Current month: 45 transactions
- Risk Level: Medium
- Pattern: "exceeds_monthly_average"
- Description: "Flagged: Wallet has 45 transactions this month, exceeding the monthly average of 20 transactions"

**How to Test:**
1. Switch to Testnet mode
2. Search for address: `meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
3. View forensic analysis or address details
4. Check suspicious pattern detection section

---

### Rule 2: High Frequency Short Span
**Flag the Wallet Address if it does more than 10 transactions within a Short time Span**

**Test Address:**
```
mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```

**Expected Behavior:**
- Transaction count: 15 transactions
- Time span: Within 24 hours (short span)
- Risk Level: High
- Pattern: "high_frequency_short_span"
- Description: "Flagged: Wallet address has 15 transactions within a short time span (exceeds 10 transaction threshold)"

**How to Test:**
1. Switch to Testnet mode
2. Search for address: `mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
3. View transaction history
4. Verify all transactions occurred within a short time period
5. Check suspicious pattern detection section

---

### Rule 3: Lump Sum Transaction
**Flag the Wallet Address if it is A Lump Sum transaction [Very huge Amount]**

**Test Address:**
```
mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```

**Expected Behavior:**
- Transaction amount: 100-500 BTC (very huge)
- Risk Level: High
- Pattern: "lump_sum_transaction"
- Description: "Flagged: Lump sum transaction detected - Very huge amount of [X] BTC in a single transaction"

**How to Test:**
1. Switch to Testnet mode
2. Search for address: `mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
3. View transaction details
4. Check for very large transaction amounts
5. Verify pattern detection flags it as lump sum

**For Transaction Search:**
- Use transaction hash starting with `a1b2...` to get a transaction with very large amount (>100 BTC)
- Pattern detection will automatically flag it as lump sum transaction

---

## Quick Test Checklist

### Rule 1 Test
- [ ] Search address: `meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
- [ ] Verify transaction count exceeds monthly average
- [ ] Check pattern detection shows "exceeds_monthly_average"
- [ ] Verify risk level is Medium

### Rule 2 Test
- [ ] Search address: `mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
- [ ] Verify >10 transactions in short time span
- [ ] Check pattern detection shows "high_frequency_short_span"
- [ ] Verify risk level is High

### Rule 3 Test
- [ ] Search address: `mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
- [ ] Verify very huge transaction amount (>100 BTC)
- [ ] Check pattern detection shows "lump_sum_transaction"
- [ ] Verify risk level is High

---

## Implementation Details

### Address Pattern Recognition
- Addresses starting with `me` or containing `exceeds` → Rule 1
- Addresses starting with `mh` or containing `highfreq` → Rule 2
- Addresses starting with `ml` or containing `lumpsum` → Rule 3

### Pattern Detection
All three rules are automatically detected in:
- Address forensic analysis
- Transaction pattern detection
- Suspicious pattern detection section

### Risk Scoring
- Rule 1 (Exceeds Monthly Average): +55 risk score, Medium severity
- Rule 2 (High Frequency Short Span): +65 risk score, High severity
- Rule 3 (Lump Sum Transaction): +70 risk score, High severity

---

## Notes

- All test addresses use testnet address format (starts with 'm', 'n', or '2')
- Patterns are detected automatically when viewing address or transaction details
- Risk scores are cumulative if multiple patterns are detected
- All flags appear in the "Suspicious Pattern Detection" section

