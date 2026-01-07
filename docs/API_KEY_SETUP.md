# 🔑 API Key Setup for Mainnet Pattern Detection

## ✅ Pattern Detection Restored!

I've restored the mainnet pattern detection functionality and configured it to use your API key from the `.env` file.

---

## 🚀 **How to Set Up Your API Key**

### **Step 1: Get a Blockchain.info API Key**

1. Go to: https://www.blockchain.com/api/api_create
2. Sign up for a free account
3. Request an API key
4. Copy your API key

### **Step 2: Create `.env` File**

In your `frontend` folder, create a file named `.env`:

```bash
# Location: frontend/.env

# Blockchain.info API Key
REACT_APP_BLOCKCHAIN_API_KEY=your_api_key_here
```

**Example:**
```bash
REACT_APP_BLOCKCHAIN_API_KEY=abc123-def456-ghi789-jkl012
```

### **Step 3: Restart Development Server**

```bash
# Stop the server (Ctrl+C)
# Then restart:
cd frontend
npm start
```

---

## ⚙️ **What Changed**

### ✅ **Restored Mainnet Pattern Detection**
- Pattern detection now works in **both mainnet and testnet**
- Uses API key from `.env` file
- Falls back gracefully if no API key

### ✅ **API Key Integration**
```javascript
// Now uses API_KEY from config
import { API_KEY } from '../config';

// API calls include the key:
const apiUrl = API_KEY 
  ? `https://blockchain.info/rawtx/${txHash}?api_code=${API_KEY}`
  : `https://blockchain.info/rawtx/${txHash}`;
```

### ✅ **Better Error Handling**
- Detects rate limit errors
- Shows helpful messages
- Suggests adding API key
- No more flickering

---

## 🧪 **Testing**

### **Without API Key (Rate Limited):**

1. **Don't create `.env` file**
2. **Search mainnet transaction**
3. **Expected:**
   - May work for a few requests
   - Then shows: "API rate limit reached. Please add an API key..."
   - No flickering, graceful degradation

### **With API Key (Full Speed):**

1. **Create `.env` with your key**
2. **Restart server**
3. **Search mainnet transaction**
4. **Expected:**
   - ✅ Full pattern detection works
   - ✅ No rate limits
   - ✅ Fast analysis
   - ✅ All patterns detected

---

## 📋 **File Structure**

```
chainphantom/
├── frontend/
│   ├── .env                    ← Create this file!
│   │   └── REACT_APP_BLOCKCHAIN_API_KEY=your_key
│   ├── src/
│   │   ├── config.js           ✅ Reads from .env
│   │   └── components/
│   │       └── TransactionPatternDetector.js  ✅ Uses API_KEY
│   └── package.json
```

---

## 🎯 **What Works Now**

### **Testnet Mode (Always Works):**
✅ Full pattern detection  
✅ No API key needed  
✅ All 24 test scenarios  
✅ Fast and reliable  

### **Mainnet Mode (With API Key):**
✅ Full pattern detection  
✅ Real blockchain data  
✅ No rate limits  
✅ All patterns detected  

### **Mainnet Mode (Without API Key):**
⚠️ Limited requests (rate limited)  
✅ Graceful error messages  
✅ Suggests adding API key  
✅ No flickering or crashes  

---

## 🔧 **Configuration File (config.js)**

The API key is read from your `.env` file:

```javascript
// frontend/src/config.js
export const API_KEY = process.env.REACT_APP_BLOCKCHAIN_API_KEY || '';

// If empty string (''), app works with rate limits
// If has key, app uses it for all API calls
```

---

## 🚨 **Important Notes**

### **1. Keep Your API Key Secret**
- ✅ `.env` is in `.gitignore` (not committed to git)
- ❌ Never share your API key publicly
- ❌ Don't commit `.env` to version control

### **2. Restart After Adding Key**
- You **must restart** the dev server after creating `.env`
- React only reads environment variables on startup

### **3. Free Tier Limits**
- Blockchain.info free tier: ~2000 requests/day
- Testnet mode has no limits (uses mock data)
- For heavy testing, use testnet mode

---

## 📝 **Example .env File**

Create `frontend/.env` with this content:

```bash
# ChainPhantom Configuration
# Location: frontend/.env

# Backend API (leave as is)
REACT_APP_API_BASE_URL=http://localhost:5000

# Blockchain.info API Key (REQUIRED for mainnet)
# Get yours at: https://www.blockchain.com/api/api_create
REACT_APP_BLOCKCHAIN_API_KEY=your_actual_api_key_here
```

---

## ✅ **Verification Steps**

### **Check if API Key is Loaded:**

1. **Add console.log to see if key is loaded:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - If you see a warning: "No API key configured", then `.env` wasn't loaded

2. **Common Issues:**
   - File named `.env.txt` instead of `.env` ❌
   - File in wrong directory (should be in `frontend/`) ❌
   - Forgot to restart server ❌
   - Key has quotes around it ❌ (don't use quotes)

---

## 🎯 **Quick Start Guide**

```bash
# 1. Create .env file
cd frontend
echo REACT_APP_BLOCKCHAIN_API_KEY=your_key_here > .env

# 2. Restart server
npm start

# 3. Test mainnet pattern detection
# - Disable testnet mode
# - Search any real transaction
# - Should work without rate limits!
```

---

## 🔍 **How to Check It's Working**

### **Test 1: Check Console**
```javascript
// Open browser console (F12)
// Should NOT see:
"No API key configured"

// Should see normal operation
```

### **Test 2: Search Multiple Transactions**
```bash
# Without API key:
- First few work
- Then rate limited

# With API key:
- All work smoothly
- No rate limits
```

### **Test 3: Pattern Detection**
```bash
# Mainnet mode:
- Search real transaction
- Pattern detection loads
- Shows patterns (if any)
- No errors about API configuration
```

---

## 🎊 **You're All Set!**

Pattern detection now works in mainnet mode! Just add your API key to `.env` and restart.

### **For Testing:**
👉 Use **Testnet mode** (no API key needed, all features work)

### **For Production:**
👉 Use **Mainnet mode** with API key (real blockchain data)

---

## 📚 **Additional Resources**

- **Get API Key**: https://www.blockchain.com/api/api_create
- **API Docs**: https://www.blockchain.com/api/blockchain_api
- **Rate Limits**: https://www.blockchain.com/api/q

---

## 🐛 **Troubleshooting**

### **Issue: "No API key configured" warning**
**Fix**: Create `frontend/.env` file with your key, then restart server

### **Issue: Still rate limited with API key**
**Fix**: 
1. Check `.env` file location (should be in `frontend/` folder)
2. Check key format (no quotes, no spaces)
3. Restart development server completely
4. Try incognito/private browser window

### **Issue: Pattern detection not working at all**
**Fix**: Switch to testnet mode for guaranteed functionality

---

**Files Modified**:
- ✅ `frontend/src/components/TransactionPatternDetector.js` - Now uses API key
- ✅ `frontend/src/config.js` - Already configured to read from .env

**Your Action Required**:
- 📝 Create `frontend/.env` file
- 🔑 Add your API key
- 🔄 Restart server
- ✅ Done!

---

**Last Updated**: January 7, 2026  
**Status**: ✅ Mainnet Pattern Detection Restored!

