# 🎯 ALL FEATURE TESTS - COMPLETE GUIDE

## **40 Test Scenarios - 10 Each Feature**

---

## ⚡ **HOW TO TEST**

```
STEP 1: Enable Testnet Mode (toggle at top-right)
STEP 2: Go to the feature page
STEP 3: Copy-paste test string
STEP 4: Check results match expected
```

---

## 1. 👛 **WALLET MONITOR** (10 Scenarios)

### **How to Test:**
1. Click "Wallet Monitor" in sidebar
2. Paste address in "Add Wallet Address" field
3. Click "Add to Monitor"
4. Click "Start Monitoring"
5. Check alerts and risk score

---

### **WM-01: Sanctioned Entity** (100% Risk - PROHIBITED)
```
twmf01sanctioned123456789abcdef123456789abcdef123456789abcdef123
```
**Expect**: 4 alerts (OFAC, Blacklist, Ransomware, Interpol) | Status: PROHIBITED

---

### **WM-02: Structuring/Smurfing** (92% Risk)
```
twmf02structuring123456789abcdef123456789abcdef123456789abcdef12
```
**Expect**: 32 small deposits → 1 large withdrawal (98 BTC) | Structuring pattern

---

### **WM-03: Dormant Wallet Active** (88% Risk)
```
twmf03dormantactive123456789abcdef123456789abcdef123456789abcdef
```
**Expect**: Inactive 180 days, suddenly 8 tx in 24hrs | 3 alerts

---

### **WM-04: Mixer/Tumbler User** (95% Risk)
```
twmf04mixeruser123456789abcdef123456789abcdef123456789abcdef1234
```
**Expect**: 3 mixers (ChipMixer, CoinJoin, Wasabi) | Privacy coins | 4 alerts

---

### **WM-05: Exchange Activity** (45% Risk)
```
twmf05exchange123456789abcdef123456789abcdef123456789abcdef12345
```
**Expect**: High volume (2,458 tx) | 78 counterparties | 3 alerts

---

### **WM-06: Terrorist Financing** (99% Risk)
```
twmf06terrorfinance123456789abcdef123456789abcdef123456789abcdef
```
**Expect**: Links to terrorist organizations | FATF red flag | Freeze immediately

---

### **WM-07: ATM Cash-Out** (85% Risk)
```
twmf07atmcashout123456789abcdef123456789abcdef123456789abcdef123
```
**Expect**: Coordinated ATM withdrawals | Multiple locations | Cashout pattern

---

### **WM-08: Fake ICO Wallet** (93% Risk)
```
twmf08fakeico123456789abcdef123456789abcdef123456789abcdef123456
```
**Expect**: Received 5,000 ETH from victims | No refunds | Exit scam

---

### **WM-09: Gambling Platform** (55% Risk)
```
twmf09gambling123456789abcdef123456789abcdef123456789abcdef12345
```
**Expect**: Unlicensed gambling | High turnover | Regulatory concern

---

### **WM-10: Normal User** (12% Risk)
```
twmf10normal123456789abcdef123456789abcdef123456789abcdef1234567
```
**Expect**: Regular transactions | No alerts | Low risk baseline

---

## 2. 🔍 **FORENSIC ANALYZER** (10 Scenarios)

### **How to Test:**
1. Click "Forensic Analyzer" in sidebar
2. Paste address
3. Select "Bitcoin" network
4. Select "Address" type
5. Click "Analyze"

---

### **FA-01: Ransomware Payment** (97% Risk)
```
tfaf01ransomware123456789abcdef123456789abcdef123456789abcdef123
```
**Expect**: REvil campaign | 47 victims | $18M extorted | FBI investigation

---

### **FA-02: Dark Web Marketplace** (94% Risk)
```
tfaf02darkweb123456789abcdef123456789abcdef123456789abcdef12345
```
**Expect**: AlphaBay vendor | 1,250 BTC volume | Seized 2017

---

### **FA-03: Money Laundering Network** (91% Risk)
```
tfaf03laundering123456789abcdef123456789abcdef123456789abcdef12
```
**Expect**: 156 entities | 23 countries | Interpol operation

---

### **FA-04: Clean Exchange Trail** (35% Risk)
```
tfaf04exchange123456789abcdef123456789abcdef123456789abcdef1234
```
**Expect**: Mining pool → Exchange | KYC verified | Low risk

---

### **FA-05: Institutional Wallet** (5% Risk)
```
tfaf05institutional123456789abcdef123456789abcdef123456789abcde
```
**Expect**: MicroStrategy treasury | SEC registered | Compliant

---

### **FA-06: Silk Road Wallet** (98% Risk)
```
tfaf06silkroad123456789abcdef123456789abcdef123456789abcdef1234
```
**Expect**: Silk Road marketplace | Drugs/weapons | FBI seized

---

### **FA-07: Child Exploitation** (100% Risk)
```
tfaf07csam123456789abcdef123456789abcdef123456789abcdef12345678
```
**Expect**: CSAM content payments | Interpol priority | Immediate action

---

### **FA-08: Ponzi Scheme** (89% Risk)
```
tfaf08ponzi123456789abcdef123456789abcdef123456789abcdef123456789
```
**Expect**: BitConnect-style ponzi | 10,000 victims | $3.5B stolen

---

### **FA-09: Exchange Hack** (92% Risk)
```
tfaf09exchangehack123456789abcdef123456789abcdef123456789abcdef
```
**Expect**: Mt. Gox hack funds | 850,000 BTC stolen | Traced

---

### **FA-10: Merchant Wallet** (18% Risk)
```
tfaf10merchant123456789abcdef123456789abcdef123456789abcdef12345
```
**Expect**: E-commerce payments | Regular customers | Low risk

---

## 3. 🌐 **MULTI-CHAIN ANALYSIS** (10 Scenarios)

### **How to Test:**
1. Click "Multi-Chain Analysis" in sidebar
2. Paste address
3. Select network
4. Click "Analyze"

---

### **MC-01: Cross-Chain Laundering** (96% Risk)
```
tmcf01laundering123456789abcdef123456789abcdef123456789abcdef1
```
**Expect**: 5 chains (BTC→ETH→XMR→BSC→TRON) | 15 hops | Laundering

---

### **MC-02: Bridge User** (42% Risk)
```
tmcf02bridge123456789abcdef123456789abcdef123456789abcdef12345
```
**Expect**: wBTC, RenBTC bridges | 4 chains | Legitimate DeFi

---

### **MC-03: DeFi Yield Farmer** (15% Risk)
```
0xdef1234567890abcdef1234567890abcdef12345
```
**Expect**: Uniswap, Aave, Curve | $450k portfolio | Low risk

---

### **MC-04: NFT Wash Trading** (78% Risk)
```
0x4567890abcdef1234567890abcdef1234567890a
```
**Expect**: Same NFTs traded between related addresses | Price manipulation

---

### **MC-05: ICO Exit Scam** (99% Risk)
```
0x7890abcdef1234567890abcdef1234567890abcd
```
**Expect**: $22M raised | No distribution | 2,400 victims | Rug pull

---

### **MC-06: Flash Loan Attack** (87% Risk)
```
0xflash1234567890abcdef1234567890abcdef123
```
**Expect**: $50M flash loan exploit | DeFi protocol hack | MEV bot

---

### **MC-07: Cross-Chain DEX Arb** (38% Risk)
```
0xarbitrage1234567890abcdef1234567890abcdef
```
**Expect**: Arbitrage bot | 3 chains | Legitimate trading | Medium risk

---

### **MC-08: Wrapped Token Bridge Exploit** (94% Risk)
```
0xbridge1234567890abcdef1234567890abcdef12
```
**Expect**: Bridge hack | $120M stolen | Poly Network style

---

### **MC-09: DAO Treasury** (8% Risk)
```
0xdao1234567890abcdef1234567890abcdef12345
```
**Expect**: Decentralized governance | Multi-sig | Transparent | Low risk

---

### **MC-10: Atomic Swap User** (25% Risk)
```
0xatomic1234567890abcdef1234567890abcdef12
```
**Expect**: BTC↔ETH atomic swaps | P2P trading | Low-medium risk

---

## 4. 📊 **PATTERN DETECTION** (10 Scenarios)

### **How to Test:**
1. Use main search bar OR transaction details page
2. Paste transaction hash
3. Pattern detection runs AUTOMATICALLY
4. Check "Suspicious Pattern Detection" section

---

### **PD-01: Circular Trading** (82% Risk)
```
tpdf01circular123456789abcdef123456789abcdef123456789abcdef12345
```
**Expect**: A→B→C→D→A loop | 4 hops | Fake volume

---

### **PD-02: Rapid Fire** (76% Risk)
```
tpdf02rapidfire123456789abcdef123456789abcdef123456789abcdef123
```
**Expect**: 52 tx in 8 minutes | Bot activity

---

### **PD-03: Dusting Attack** (65% Risk)
```
tpdf03dusting123456789abcdef123456789abcdef123456789abcdef12345
```
**Expect**: 1,000+ tiny outputs | De-anonymization attempt

---

### **PD-04: Time Anomaly** (58% Risk)
```
tpdf04timeanomaly123456789abcdef123456789abcdef123456789abcdef1
```
**Expect**: All TX at 3:00 AM UTC | Automation

---

### **PD-05: Sybil Attack** (87% Risk)
```
tpdf05sybil123456789abcdef123456789abcdef123456789abcdef1234567
```
**Expect**: 47 addresses same entity | Coordinated

---

### **PD-06: Sandwich Attack** (79% Risk)
```
tpdf06sandwich123456789abcdef123456789abcdef123456789abcdef1234
```
**Expect**: Front-run + Back-run | MEV attack | Price manipulation

---

### **PD-07: Chain Split Exploit** (83% Risk)
```
tpdf07chainsplit123456789abcdef123456789abcdef123456789abcdef1
```
**Expect**: Replay attack | Fork exploitation | Double spend

---

### **PD-08: Gas Price Manipulation** (71% Risk)
```
tpdf08gasprice123456789abcdef123456789abcdef123456789abcdef123
```
**Expect**: Artificially inflated gas | Network spam

---

### **PD-09: Smart Contract Reentrancy** (92% Risk)
```
tpdf09reentrancy123456789abcdef123456789abcdef123456789abcdef1
```
**Expect**: DAO hack pattern | Reentrancy exploit | $60M stolen

---

### **PD-10: Normal Transaction** (14% Risk)
```
tpdf10normal123456789abcdef123456789abcdef123456789abcdef123456
```
**Expect**: Standard payment | No patterns | Low risk baseline

---

## 📊 **QUICK REFERENCE TABLE**

| Feature | Low Risk | Medium Risk | High Risk | Critical Risk |
|---------|----------|-------------|-----------|---------------|
| **Wallet Monitor** | WM-10 (12%) | WM-05 (45%), WM-09 (55%) | WM-03 (88%), WM-07 (85%) | WM-01 (100%), WM-02 (92%), WM-04 (95%), WM-06 (99%), WM-08 (93%) |
| **Forensic** | FA-05 (5%), FA-10 (18%) | FA-04 (35%) | FA-03 (91%), FA-08 (89%), FA-09 (92%) | FA-01 (97%), FA-02 (94%), FA-06 (98%), FA-07 (100%) |
| **Multi-Chain** | MC-03 (15%), MC-09 (8%), MC-10 (25%) | MC-02 (42%), MC-07 (38%) | MC-04 (78%), MC-06 (87%), MC-08 (94%) | MC-01 (96%), MC-05 (99%) |
| **Pattern** | PD-10 (14%) | PD-03 (65%), PD-04 (58%) | PD-02 (76%), PD-06 (79%), PD-08 (71%) | PD-01 (82%), PD-05 (87%), PD-07 (83%), PD-09 (92%) |

---

## ✅ **TESTING CHECKLIST**

### **Wallet Monitor (10 tests):**
- [ ] WM-01: Sanctioned (100%)
- [ ] WM-02: Structuring (92%)
- [ ] WM-03: Dormant (88%)
- [ ] WM-04: Mixer (95%)
- [ ] WM-05: Exchange (45%)
- [ ] WM-06: Terror Finance (99%)
- [ ] WM-07: ATM Cashout (85%)
- [ ] WM-08: Fake ICO (93%)
- [ ] WM-09: Gambling (55%)
- [ ] WM-10: Normal (12%)

### **Forensic Analyzer (10 tests):**
- [ ] FA-01: Ransomware (97%)
- [ ] FA-02: Dark Web (94%)
- [ ] FA-03: Laundering (91%)
- [ ] FA-04: Clean Exchange (35%)
- [ ] FA-05: Institutional (5%)
- [ ] FA-06: Silk Road (98%)
- [ ] FA-07: CSAM (100%)
- [ ] FA-08: Ponzi (89%)
- [ ] FA-09: Exchange Hack (92%)
- [ ] FA-10: Merchant (18%)

### **Multi-Chain (10 tests):**
- [ ] MC-01: Cross-Laundering (96%)
- [ ] MC-02: Bridge User (42%)
- [ ] MC-03: DeFi Farmer (15%)
- [ ] MC-04: NFT Wash (78%)
- [ ] MC-05: ICO Scam (99%)
- [ ] MC-06: Flash Loan (87%)
- [ ] MC-07: DEX Arb (38%)
- [ ] MC-08: Bridge Exploit (94%)
- [ ] MC-09: DAO Treasury (8%)
- [ ] MC-10: Atomic Swap (25%)

### **Pattern Detection (10 tests):**
- [ ] PD-01: Circular (82%)
- [ ] PD-02: Rapid Fire (76%)
- [ ] PD-03: Dusting (65%)
- [ ] PD-04: Time Anomaly (58%)
- [ ] PD-05: Sybil (87%)
- [ ] PD-06: Sandwich (79%)
- [ ] PD-07: Chain Split (83%)
- [ ] PD-08: Gas Manipulation (71%)
- [ ] PD-09: Reentrancy (92%)
- [ ] PD-10: Normal (14%)

---

## 🎯 **5-MINUTE QUICK TEST** (Test 1 from each)

```
1. Wallet Monitor:
   twmf01sanctioned123456789abcdef123456789abcdef123456789abcdef123
   → Expect: 100% risk, PROHIBITED

2. Forensic Analyzer:
   tfaf01ransomware123456789abcdef123456789abcdef123456789abcdef123
   → Expect: 97% risk, REvil campaign

3. Multi-Chain:
   tmcf01laundering123456789abcdef123456789abcdef123456789abcdef1
   → Expect: 96% risk, 5 chains

4. Pattern Detection:
   tpdf01circular123456789abcdef123456789abcdef123456789abcdef12345
   → Expect: 82% risk, circular path
```

---

## 🎨 **RISK COLORS**

```
🟢 0-30%:    Low Risk
🟡 30-50%:   Medium Risk
🟠 50-70%:   High Risk
🔴 70-90%:   Very High Risk
⚫ 90-100%:  Critical/Prohibited
```

---

**Total Tests**: 40 (10 per feature)  
**Main Focus**: Wallet Monitor  
**Status**: ✅ **Ready for Testing!**

---

**Last Updated**: January 7, 2026

