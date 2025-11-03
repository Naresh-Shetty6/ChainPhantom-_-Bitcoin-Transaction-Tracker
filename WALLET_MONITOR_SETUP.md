# Wallet Monitor - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Backend Dependency

```bash
cd backend
npm install nodemailer
```

### Step 2: Configure Email Settings

Create/update `backend/.env`:

```env
# Email Configuration for NCB Alerts
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**For Gmail Users**:
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Generate App Password: https://myaccount.google.com/apppasswords
4. Use the generated password in `SMTP_PASS`

### Step 3: Start Services

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

### Step 4: Access Wallet Monitor

Open browser: `http://localhost:3000/wallet-monitor`

---

## 📝 First Use

### 1. Add a Wallet Address

Example test address:
```
1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

### 2. Configure NCB Email

Click "Alert Settings" and set:
- NCB Email: `ncb@gov.in` (or your email for testing)
- Risk Score Threshold: `50`
- Minimum Amount: `1.0 BTC`

### 3. Start Monitoring

Click the "Start Monitoring" button (turns green when active)

### 4. Wait for Alerts

System checks every 60 seconds. Alerts sent automatically when suspicious transactions detected.

---

## ✅ Features Overview

| Feature | Description |
|---------|-------------|
| **Real-Time Monitoring** | Checks wallets every 60 seconds |
| **Pattern Detection** | 9 advanced algorithms |
| **Email Alerts** | Automatic NCB notifications |
| **Risk Scoring** | 0-100 scale with 5 levels |
| **Configurable Rules** | Customize thresholds and patterns |
| **Dashboard** | Live statistics and alerts |
| **Export** | JSON reports |

---

## 🎯 Alert Rules

### Default Configuration

- **Risk Threshold**: 50/100
- **Min Transaction**: 1.0 BTC
- **High Severity**: ✅ Enabled
- **Medium Severity**: ✅ Enabled
- **Low Severity**: ❌ Disabled

### Pattern Detection

✅ **Enabled by Default**:
- Mixer/Tumbler Detection
- Loop Detection
- Peeling Chain Detection
- Fast Succession Detection

### When Alerts Are Sent

Alert triggers when:
1. Risk Score ≥ 50, OR
2. High severity pattern detected, OR
3. Medium severity pattern detected
4. AND Transaction ≥ 1.0 BTC

---

## 📧 Email Alert Example

**Subject**: `[ChainPhantom Alert] Suspicious Transaction Detected - Risk Score: 60`

**Content**:
- Risk Score: 60/100 (color-coded)
- Wallet Address
- Transaction Hash
- Detected Patterns (badges)
- Direct link to view details
- Action required notice

---

## 🔧 Troubleshooting

### Emails Not Sending?

**Check**:
1. ✅ SMTP credentials in `.env`
2. ✅ Gmail App Password (not main password)
3. ✅ Backend console for errors
4. ✅ Spam/junk folder

**Test Email**:
```javascript
// In backend console
const nodemailer = require('nodemailer');
// Test connection
```

### Monitoring Not Working?

**Check**:
1. ✅ "Start Monitoring" button is green
2. ✅ Wallet status is "active"
3. ✅ Backend is running
4. ✅ Browser console for errors

### Too Many Alerts?

**Adjust Settings**:
1. Increase risk threshold (50 → 70)
2. Disable low severity
3. Increase min transaction amount
4. Disable specific patterns

---

## 📊 Example Use Case

### Scenario: Track Suspect Wallet

```javascript
// 1. Add wallet address
Address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa

// 2. Configure alerts
NCB Email: investigations@ncb.gov.in
Risk Threshold: 30 (sensitive)
Min Amount: 0.1 BTC

// 3. Enable all patterns
✅ All severity levels
✅ All pattern types

// 4. Start monitoring
Click "Start Monitoring"

// 5. Receive alerts
Automatic emails when suspicious activity detected
```

---

## 🎨 Dashboard Features

### Statistics Cards
- 📊 Total Wallets
- ✅ Active Monitoring
- 🔔 Alerts Sent
- ⚠️ Suspicious Transactions

### Wallet Cards
- Status indicator (active/paused)
- Address display
- Transaction count
- Alert count
- Last checked time
- Pause/Resume/Delete actions

### Recent Alerts
- Risk score badge
- Timestamp
- Wallet address
- Transaction link
- Pattern badges
- Email status

---

## 🔐 Security Best Practices

### Production Deployment

1. **Environment Variables**
   ```env
   SMTP_HOST=smtp.yourserver.com
   SMTP_USER=alerts@yourorg.com
   SMTP_PASS=secure-app-password
   ```

2. **Authentication**
   - Add user login
   - Role-based access
   - API key protection

3. **Rate Limiting**
   - Already implemented
   - 100 requests/minute

4. **Encryption**
   - Use HTTPS
   - Secure SMTP (TLS)
   - Encrypt sensitive data

5. **Audit Logs**
   - Log all alerts
   - Track user actions
   - Monitor API usage

---

## 📈 Performance Tips

### Optimize Monitoring

1. **Limit Wallets**: Max 50 for best performance
2. **Adjust Interval**: Increase if needed (60s default)
3. **Pause Inactive**: Pause wallets not currently needed
4. **Clear Alerts**: Remove old alerts periodically

### Resource Usage

- **Memory**: ~10-20 MB per wallet
- **Network**: ~1 KB per check
- **API Calls**: 1 per wallet per minute

---

## 📚 Documentation

- **Full Guide**: `/docs/WALLET_MONITOR_GUIDE.md`
- **Pattern Detector**: `/docs/PATTERN_DETECTOR_GUIDE.md`
- **Export Integration**: `/EXPORT_INTEGRATION_UPDATE.md`

---

## 🆘 Support

**Issues?** Check:
1. Backend console logs
2. Browser console (F12)
3. Network tab (API calls)
4. Email server logs

**Need Help?**
- GitHub Issues
- Documentation files
- Code comments

---

## ✨ Summary

You now have a **real-time wallet monitoring system** that:

✅ Tracks Bitcoin wallet addresses 24/7  
✅ Detects 9 types of suspicious patterns  
✅ Calculates risk scores (0-100)  
✅ Sends automatic email alerts to NCB  
✅ Provides live dashboard with statistics  
✅ Offers configurable rules and thresholds  
✅ Exports comprehensive reports  

**Perfect for**: Law enforcement, compliance officers, forensic analysts, and security teams!

---

**Version**: 1.0  
**Status**: ✅ Ready to Use  
**Setup Time**: ~5 minutes
