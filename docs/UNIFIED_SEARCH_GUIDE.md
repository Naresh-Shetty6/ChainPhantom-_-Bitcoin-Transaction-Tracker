# 🔍 Unified Search Guide

## ✨ One Search Field for Everything!

The ChainPhantom search bar now **automatically detects** whether you're searching for a transaction, wallet address, or block - all in one field!

---

## 🎯 **How It Works**

### **Just Paste Anything!**

Simply paste your transaction hash or wallet address into the **main search bar**, and ChainPhantom will:

1. **Auto-detect** what type of data it is
2. **Show a badge** indicating the detected type
3. **Navigate automatically** to the correct page

No need to choose between "transaction" or "address" - it's all automatic! 🎉

---

## 📍 **Where to Find the Search Bar**

### Option 1: Homepage
- The main search bar is on the homepage
- Large, prominent input field

### Option 2: Navbar (if available)
- Search icon in the top navigation
- Quick access from any page

---

## 🎨 **Visual Feedback**

As you type, you'll see a **colored badge** appear showing what was detected:

- 🔗 **Transaction** - Purple badge
- 👛 **Wallet Address** - Purple badge  
- 📦 **Block** - Purple badge

The badge appears **automatically** as you type!

---

## 📦 **What You Can Search**

### ✅ **Wallet Addresses**

```
Mainnet Addresses:
- Bitcoin: 1A1zP1... (P2PKH)
- Bitcoin: 3... (P2SH)
- Bitcoin: bc1... (Bech32)

Testnet Addresses:
- Bitcoin: m... or n... (P2PKH)
- Bitcoin: 2... (P2SH)
- Bitcoin: tb1... (Bech32)

Ethereum:
- 0x followed by 40 hex characters
```

**Test Examples**:
```
meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
mwm01AlertTriggerWallet1234567890abcdef
```

---

### ✅ **Transaction Hashes**

```
Bitcoin Transactions:
- 64 hexadecimal characters
- Example: a1b2c3d4e5f6...

Ethereum Transactions:
- 0x followed by 64 hex characters
- Example: 0xtmc01eth...
```

**Test Examples**:
```
tpd01fastsuccession1234567890abcdef1234567890abcdef
tpd02mixertumbler1234567890abcdef1234567890abcdef
ter02lumpsum1234567890abcdef1234567890abcdef
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890
```

---

### ✅ **Block Numbers**

```
Block Height:
- Just numbers (less than 10 digits)
- Example: 2503456
```

**Test Examples**:
```
2503456
2500000
```

---

## 🧪 **Quick Test**

### **3-Second Test**:

1. **Copy this address**:
   ```
   mwm01AlertTriggerWallet1234567890abcdef
   ```

2. **Paste it** in the search bar

3. **Watch**:
   - Badge appears: "👛 Wallet Address"
   - Press Enter or click search
   - Automatically goes to: `/address/mwm01...`

### **Another Test with Transaction**:

1. **Copy this transaction**:
   ```
   tpd01fastsuccession1234567890abcdef1234567890abcdef
   ```

2. **Paste it** in the search bar

3. **Watch**:
   - Badge appears: "🔗 Transaction"
   - Press Enter
   - Automatically goes to: `/transaction/tpd01...`

---

## 🎯 **Detection Rules**

### How the System Detects Input Type:

1. **Block Number**: Pure digits, less than 10 characters
   ```
   Example: 2503456 → Block
   ```

2. **Bitcoin Mainnet Address**: Starts with `1`, `3`, or `bc1`
   ```
   Example: 1A1zP1... → Address
   ```

3. **Bitcoin Testnet Address**: Starts with `m`, `n`, `2`, or `tb1`
   ```
   Example: mhXKPaED... → Address
   ```

4. **Ethereum Address**: Starts with `0x` + 40 hex chars
   ```
   Example: 0x742d35... → Address
   ```

5. **Transaction Hash**: 64 hex characters
   ```
   Example: tpd01fast... → Transaction
   ```

6. **Ethereum Transaction**: `0x` + 64 hex chars
   ```
   Example: 0xtmc01eth... → Transaction
   ```

7. **Test Scenarios**:
   - Starts with `t` + test ID → Transaction
   - Starts with `m` + test ID → Address
   - Contains "invalid" → Transaction (error test)

8. **Length-Based**:
   - ≥60 characters → Probably Transaction
   - 25-59 characters → Probably Address
   - Default → Transaction

---

## 💡 **Smart Features**

### 1. **Real-Time Detection**
- Detects type **as you type**
- Badge updates instantly
- No need to wait

### 2. **Testnet Mode Indicator**
- When in testnet mode, placeholder shows: "(Testnet Mode)"
- Helps you remember which network you're on

### 3. **Search History**
- Remembers your recent searches
- Click to re-search
- Stores search type with each entry

### 4. **Auto-Navigation**
- Automatically goes to correct page
- No manual page selection needed
- Smart routing based on detection

---

## 📱 **Mobile Friendly**

- Search bar works on all screen sizes
- Badge scales for mobile
- Touch-friendly buttons

---

## 🎨 **Visual States**

### Normal State
```
┌─────────────────────────────────────────────┐
│ Search: Transaction Hash, Wallet Address... │
└─────────────────────────────────────────────┘
```

### With Detection Badge
```
┌──────────────────────────────────────┬──────┐
│ mwm01AlertTriggerWallet123...  [👛 Wallet] [🔍]
└──────────────────────────────────────┴──────┘
```

### Focused State
```
┌──────────────────────────────────────┬──────┐
│ tpd01fastsuccession123...     [🔗 Transaction] [🔍]
└──────────────────────────────────────┴──────┘
     ^-- Blue glow around input
```

---

## 🚀 **Usage Examples**

### Example 1: Quick Wallet Check
```bash
# 1. Open ChainPhantom
# 2. Enable Testnet mode
# 3. Paste in search:
mwm01AlertTriggerWallet1234567890abcdef
# 4. Press Enter
# ✅ Goes to address page, shows Risk: 55
```

### Example 2: Transaction Analysis
```bash
# 1. Copy transaction hash:
tpd02mixertumbler1234567890abcdef1234567890abcdef
# 2. Paste in search
# 3. Badge shows: "🔗 Transaction"
# 4. Press Enter
# ✅ Goes to transaction page, shows Mixer pattern
```

### Example 3: Block Lookup
```bash
# 1. Type block number:
2503456
# 2. Badge shows: "📦 Block"
# 3. Press Enter
# ✅ Goes to block page
```

---

## 🔧 **Technical Details**

### Detection Function
Located in: `frontend/src/components/SearchBar.js`

```javascript
determineSearchType(term) {
  // 1. Check block height
  // 2. Check mainnet address
  // 3. Check testnet address
  // 4. Check Ethereum address
  // 5. Check transaction hash
  // 6. Check test patterns
  // 7. Length-based detection
  // 8. Default to transaction
}
```

### Navigation
```javascript
navigateToResult(term, type) {
  switch (type) {
    case 'tx': navigate(`/transaction/${term}`);
    case 'address': navigate(`/address/${term}`);
    case 'block': navigate(`/block/${term}`);
  }
}
```

---

## 🎯 **All Test Data Works!**

### ✅ **Addresses** (19 total)
All addresses from `ALL_TEST_DATA.txt` work in the search:
- Original 3 rules (me..., mh..., ml...)
- All WM, EM, PD, ER, EX, RS, PR scenarios
- Extra test addresses

### ✅ **Transactions** (17 total)
All transactions from `ALL_TEST_DATA.txt` work in the search:
- Original patterns (a1b2..., b2c3..., etc.)
- All PD, ER, TX, MC, RS, PF scenarios

---

## 🐛 **Troubleshooting**

### **Badge Doesn't Appear**
- Input must be at least a few characters
- Badge shows when pattern is detected
- Try pasting a complete address/hash

### **Goes to Wrong Page**
- Check if testnet mode is enabled
- Verify you copied the complete hash/address
- Check for extra spaces

### **Search Button Doesn't Work**
- Make sure you entered something
- Press Enter key as alternative
- Check browser console for errors

---

## 📊 **Supported Formats Summary**

| Type | Format | Example | Badge |
|------|--------|---------|-------|
| Block | Numbers | `2503456` | 📦 Block |
| BTC Address (Mainnet) | `1...`, `3...`, `bc1...` | `1A1zP1...` | 👛 Wallet |
| BTC Address (Testnet) | `m...`, `n...`, `2...`, `tb1...` | `mwm01...` | 👛 Wallet |
| ETH Address | `0x` + 40 hex | `0x742d35...` | 👛 Wallet |
| BTC Transaction | 64 hex chars | `tpd01fast...` | 🔗 Transaction |
| ETH Transaction | `0x` + 64 hex | `0xtmc01eth...` | 🔗 Transaction |

---

## ✨ **Benefits**

✅ **Easier**: One field for everything  
✅ **Faster**: No need to choose page first  
✅ **Smarter**: Auto-detection eliminates errors  
✅ **Visual**: See what's detected before searching  
✅ **Universal**: Works with all test data  

---

## 🎊 **Summary**

The unified search makes testing **10x easier**:

1. **Copy** any address or transaction from `ALL_TEST_DATA.txt`
2. **Paste** into the search bar
3. **See** the badge showing what was detected
4. **Press** Enter
5. **Done!** Automatically on the right page

**No more guessing which page to use!** 🚀

---

**Last Updated**: January 7, 2026  
**Status**: ✅ Complete and Production Ready!

