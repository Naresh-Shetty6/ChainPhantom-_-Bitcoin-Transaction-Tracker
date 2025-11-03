# Wallet Monitor - Real-Time Suspicious Transaction Alert System

## 🎯 Overview

The **Wallet Monitor** is a real-time surveillance system that continuously tracks Bitcoin wallet addresses and automatically sends email alerts to NCB (Narcotics Control Bureau) when suspicious transactions are detected.

---

## 🚀 Key Features

### 1. **Real-Time Monitoring**
- Continuous 24/7 wallet surveillance
- Checks every 60 seconds for new transactions
- Automatic pattern detection on all transactions
- No manual intervention required

### 2. **Intelligent Alert System**
- Configurable risk score thresholds
- Pattern-based detection (9 algorithms)
- Severity-level filtering
- Automatic email notifications to NCB

### 3. **Customizable Rules**
- Set minimum transaction amounts
- Enable/disable specific pattern types
- Configure severity levels
- Adjust risk score thresholds

### 4. **Professional Email Alerts**
- HTML-formatted emails with branding
- Color-coded risk levels
- Direct links to transaction details
- Complete pattern analysis

### 5. **Comprehensive Dashboard**
- Live statistics
- Wallet management
- Alert history
- Export capabilities

---

## 📊 Dashboard Components

### Statistics Panel
- **Total Wallets**: Number of wallets being monitored
- **Active Monitoring**: Wallets currently active
- **Alerts Sent**: Total email alerts sent
- **Suspicious Transactions**: Total flagged transactions

### Wallet Management
- Add new wallet addresses
- Pause/Resume monitoring per wallet
- Remove wallets from monitoring
- View wallet statistics

### Alert Settings
- NCB email configuration
- Risk score threshold (0-100)
- Minimum transaction amount
- Severity level toggles
- Pattern-specific alerts

### Recent Alerts
- Last 10 alerts displayed
- Risk score and patterns
- Email delivery status
- Direct transaction links

---

## 🔧 Setup Instructions

### 1. Backend Configuration

Add to `.env` file:
```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# For Gmail, generate an App Password:
# 1. Go to Google Account Settings
# 2. Security → 2-Step Verification
# 3. App passwords → Generate
```

### 2. Install Dependencies

```bash
cd backend
npm install nodemailer
```

### 3. Start the System

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm start
```

### 4. Access Wallet Monitor

Navigate to: `http://localhost:3000/wallet-monitor`

---

## 📝 How to Use

### Adding a Wallet

1. Navigate to Wallet Monitor page
2. Enter Bitcoin wallet address in the input field
3. Click "Add Wallet" button
4. Wallet is immediately added to monitoring list

**Example Address**:
```
1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

### Configuring Alerts

1. Click on "Alert Settings" to expand
2. Set NCB email address
3. Configure risk score threshold (default: 50)
4. Set minimum transaction amount (default: 1.0 BTC)
5. Enable/disable severity levels:
   - ✅ High Severity (recommended)
   - ✅ Medium Severity (recommended)
   - ⬜ Low Severity (optional)
6. Enable specific pattern detection:
   - ✅ Mixer/Tumbler Detection
   - ✅ Loop Detection
   - ✅ Peeling Chain Detection
   - ✅ Fast Succession Detection

### Starting Monitoring

1. Click "Start Monitoring" button in header
2. Button turns green when active
3. System checks all active wallets every 60 seconds
4. Alerts sent automatically when patterns detected

### Managing Wallets

**Pause a Wallet**:
- Click pause icon on wallet card
- Monitoring stops for that wallet
- Can resume anytime

**Remove a Wallet**:
- Click trash icon on wallet card
- Confirm deletion
- Wallet removed from monitoring

---

## 🔍 Detection Rules

### Pattern Detection

The system uses 9 advanced algorithms:

1. **Mixer/Tumbler Detection** (High)
   - Multiple inputs (>3) and outputs (>3)
   - Similar output values
   - Standard denominations

2. **Loop Detection** (High)
   - Circular transaction patterns
   - Funds returning to original address

3. **Peeling Chain** (Medium)
   - Systematic small withdrawals
   - Large change outputs

4. **Large Transactions** (Medium)
   - Exceeds minimum amount threshold
   - Configurable limit

5. **Round Numbers** (Medium)
   - 0.1, 0.5, 1.0 BTC increments
   - Potential structuring

6. **Fast Succession** (Medium)
   - Transactions <10 minutes apart
   - Automated systems

7. **Time Anomalies** (Low)
   - Midnight to 5 AM transactions
   - Unusual hours

8. **High Fees** (High/Medium)
   - >150 sat/byte: HIGH
   - >100 sat/byte: MEDIUM

9. **Dust Collection** (Low)
   - 5+ tiny inputs
   - Privacy concerns

### Alert Triggers

An alert is sent when:
- Risk score ≥ threshold (default: 50)
- OR High severity pattern detected (if enabled)
- OR Medium severity pattern detected (if enabled)
- OR Low severity pattern detected (if enabled)
- AND Transaction amount ≥ minimum (default: 1.0 BTC)

---

## 📧 Email Alert Format

### Subject Line
```
[ChainPhantom Alert] Suspicious Transaction Detected - Risk Score: 60
```

### Email Content

**Header Section**:
- ChainPhantom branding
- "Suspicious Transaction Detected" title

**Alert Details**:
- Alert ID
- Timestamp
- Risk Score (color-coded)

**Wallet Information**:
- Monitored wallet address
- Transaction hash

**Detected Patterns**:
- Pattern type badges
- Severity levels (color-coded)

**Action Button**:
- "View Full Transaction Details"
- Direct link to ChainPhantom

**Action Required Section**:
- Investigation instructions
- NCB protocol reminder

**Footer**:
- Automated alert notice
- Copyright information

### Color Coding

- 🔴 **Critical Risk** (70-100): Red
- 🟠 **High Risk** (50-69): Orange
- 🟡 **Medium Risk** (30-49): Yellow
- 🔵 **Low Risk** (10-29): Blue
- 🟢 **Minimal Risk** (0-9): Green

---

## 💾 Data Storage

### LocalStorage

The system stores:
- Monitored wallet addresses
- NCB email address
- Alert rules configuration
- Wallet statistics

**Location**: Browser localStorage
**Persistence**: Survives page refresh
**Privacy**: Local only, not sent to server

### Export Report

Generate JSON report containing:
- All monitored wallets
- Recent alerts
- Statistics
- Configuration

**Usage**:
1. Click "Export Report" button
2. JSON file downloads automatically
3. Contains complete monitoring data

---

## 🔒 Security Considerations

### Email Security

1. **Use App Passwords**: Never use main email password
2. **Dedicated Email**: Create separate email for alerts
3. **Secure SMTP**: Use TLS/SSL encryption
4. **Environment Variables**: Store credentials in .env file

### Monitoring Security

1. **Rate Limiting**: Backend has built-in rate limiting
2. **API Keys**: Use environment variables
3. **Access Control**: Implement authentication (production)
4. **Audit Logs**: All alerts logged with timestamps

### Data Privacy

1. **No Personal Data**: Only wallet addresses stored
2. **Local Storage**: Data stays in browser
3. **Encrypted Transit**: HTTPS for all communications
4. **Minimal Retention**: Clear old alerts periodically

---

## 📈 Performance

### Monitoring Frequency
- **Check Interval**: 60 seconds
- **API Calls**: 1 per wallet per minute
- **Recommended Max**: 50 wallets

### Resource Usage
- **Memory**: ~10-20 MB per wallet
- **Network**: ~1 KB per check
- **CPU**: Minimal (pattern detection)

### Optimization Tips
1. Monitor only high-priority wallets
2. Adjust check interval if needed
3. Pause inactive wallets
4. Clear old alerts regularly

---

## 🐛 Troubleshooting

### Emails Not Sending

**Problem**: Alerts not received

**Solutions**:
1. Check SMTP credentials in .env
2. Verify email address is correct
3. Check spam/junk folder
4. Enable "Less secure app access" (Gmail)
5. Use App Password instead of main password
6. Check backend console for errors

### Monitoring Not Working

**Problem**: Wallets not being checked

**Solutions**:
1. Click "Start Monitoring" button
2. Check wallet status (should be "active")
3. Verify internet connection
4. Check browser console for errors
5. Ensure backend is running

### High False Positives

**Problem**: Too many alerts

**Solutions**:
1. Increase risk score threshold
2. Disable low severity alerts
3. Increase minimum transaction amount
4. Disable specific pattern types
5. Review and adjust rules

---

## 📊 Use Cases

### 1. Law Enforcement Investigation

**Scenario**: Tracking suspect's wallet

**Setup**:
- Add suspect wallet address
- Set risk threshold: 30 (sensitive)
- Enable all pattern types
- Set minimum amount: 0.1 BTC
- NCB email: investigations@ncb.gov.in

**Result**: Real-time alerts for all suspicious activity

### 2. Exchange Compliance

**Scenario**: Monitoring high-risk customers

**Setup**:
- Add customer wallet addresses
- Set risk threshold: 50 (moderate)
- Enable high/medium severity
- Set minimum amount: 5.0 BTC
- NCB email: compliance@exchange.com

**Result**: Automated compliance monitoring

### 3. Ransomware Tracking

**Scenario**: Following ransom payments

**Setup**:
- Add ransom wallet address
- Set risk threshold: 20 (very sensitive)
- Enable all patterns
- Set minimum amount: 0.01 BTC
- NCB email: cybercrime@ncb.gov.in

**Result**: Track fund movement in real-time

### 4. Money Laundering Detection

**Scenario**: Monitoring suspected laundering

**Setup**:
- Add multiple related wallets
- Set risk threshold: 40
- Enable mixer, loop, peeling detection
- Set minimum amount: 2.0 BTC
- NCB email: aml@ncb.gov.in

**Result**: Detect obfuscation attempts

---

## 🔮 Future Enhancements

### Planned Features

1. **Multi-Wallet Groups**
   - Group related wallets
   - Aggregate statistics
   - Group-level alerts

2. **Advanced Scheduling**
   - Custom check intervals
   - Time-based rules
   - Business hours only

3. **SMS Alerts**
   - Text message notifications
   - Critical alerts only
   - Multiple recipients

4. **Webhook Integration**
   - POST alerts to external systems
   - Custom payload format
   - Retry logic

5. **Machine Learning**
   - Behavioral analysis
   - Anomaly detection
   - Predictive alerts

6. **Dashboard Analytics**
   - Charts and graphs
   - Trend analysis
   - Risk heatmaps

7. **Mobile App**
   - iOS/Android apps
   - Push notifications
   - On-the-go monitoring

---

## 📞 Support

### Getting Help

**Documentation**: `/docs/WALLET_MONITOR_GUIDE.md`
**GitHub Issues**: Report bugs and request features
**Email**: support@chainphantom.com

### Common Questions

**Q: How many wallets can I monitor?**
A: Recommended maximum is 50 wallets for optimal performance.

**Q: Can I monitor Ethereum wallets?**
A: Currently Bitcoin only. Ethereum support coming soon.

**Q: Are alerts sent in real-time?**
A: Checks occur every 60 seconds. Alerts sent immediately when detected.

**Q: Can I customize the email template?**
A: Yes, modify the HTML in `backend/index.js` email endpoint.

**Q: Is this suitable for production use?**
A: Yes, but implement proper authentication and access control.

---

## 📄 License

This feature is part of ChainPhantom and follows the same license terms.

---

**Version**: 1.0  
**Last Updated**: October 2025  
**Status**: ✅ Production Ready  
**Maintainer**: ChainPhantom Development Team
