# Test Entries for ChainPhantom

Quick reference guide for testing ChainPhantom with testnet data.

## 🚨 ChainPhantom Rules Test Cases

### Three Main Detection Rules

#### **Rule 1: Exceeds Monthly Average Transactions**
```
meXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```
- **Detection**: Wallet has 45 transactions vs 20 monthly average
- **Risk**: Medium (55/100)
- **Alert**: ⚠️ "FLAGGED: Transactions exceed monthly average"

#### **Rule 2: High Frequency Short Span**
```
mhXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```
- **Detection**: 15 transactions in < 24 hours (exceeds 10 threshold)
- **Risk**: High (65/100)
- **Alert**: 🚨 "FLAGGED: More than 10 transactions in short time span"

#### **Rule 3: Lump Sum Transaction**
```
mlXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```
- **Detection**: Single transaction > 100 BTC
- **Risk**: High (70/100)
- **Alert**: 🚨 "FLAGGED: Lump sum transaction detected"

📖 **Detailed documentation**: See `docs/CHAINPHANTOM_RULES_TEST_CASES.md`

---

## Quick Copy-Paste Test Entries

### Testnet Addresses

**High-Risk Address (Mixing Patterns)**
```
mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT
```

**Exchange Address (High Volume)**
```
n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y
```

**Normal User Address**
```
2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
```

**P2PKH Address (Legacy)**
```
mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn
```

**Bech32 Address (Native SegWit)**
```
tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
```

### Testnet Transaction Hashes

**CoinJoin Transaction**
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

**Peeling Chain Transaction**
```
b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567
```

**Normal Transaction**
```
c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678
```

**High-Value Transaction**
```
d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890
```

### Testnet Block Heights

**Recent Block**
```
2503456
```

**Older Block**
```
2500000
```

**Block Hash**
```
0000000000000000000a1b2c3d4e5f6789012345678901234567890abcdef12
```

## Testing Scenarios

### 1. Address Analysis Tests

#### High-Risk Address
- **Address**: `mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT`
- **Expected**: High risk score, mixing patterns detected
- **Test**: Search this address and verify risk analysis shows high-risk patterns

#### Exchange Address
- **Address**: `n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y`
- **Expected**: Exchange identified, high transaction volume, low risk
- **Test**: Search this address and verify exchange detection

#### Normal User
- **Address**: `2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
- **Expected**: Low risk, normal transaction patterns
- **Test**: Search this address and verify minimal risk indicators

### 2. Transaction Analysis Tests

#### CoinJoin Transaction
- **Hash**: `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`
- **Expected**: CoinJoin pattern detected, multiple inputs/outputs
- **Test**: View transaction details and verify pattern detection

#### Peeling Chain Transaction
- **Hash**: `b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567`
- **Expected**: Peeling chain pattern detected
- **Test**: View transaction details and verify pattern analysis

### 3. Block Tests

#### Recent Block
- **Height**: `2503456`
- **Expected**: Block details with recent transactions
- **Test**: View block details and verify transaction list

#### Block by Hash
- **Hash**: `0000000000000000000a1b2c3d4e5f6789012345678901234567890abcdef12`
- **Expected**: Block details retrieved
- **Test**: Search by hash and verify block information

### 4. Feature Tests

#### Dashboard
- **Test**: Switch to testnet mode and view dashboard
- **Expected**: Mock data displayed for blocks, transactions, mempool, network stats

#### Network Statistics
- **Test**: Navigate to Network page in testnet mode
- **Expected**: Testnet network stats with lower hashrate and difficulty

#### Forensic Analysis
- **Address**: `mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT`
- **Test**: Perform forensic analysis
- **Expected**: Risk patterns detected and displayed with detailed analysis

#### Multi-Chain Analysis
- **Address**: `mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT`
- **Test**: Search address in multi-chain analysis
- **Expected**: Multi-chain data displayed with risk assessment

#### Transaction Details
- **Hash**: `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`
- **Test**: View transaction details
- **Expected**: Transaction details with pattern detection and chain visualization

#### Wallet Monitor
- **Addresses**: 
  - `mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT`
  - `n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y`
  - `2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
- **Test**: Monitor multiple addresses
- **Expected**: Multiple addresses monitored with alerts and risk scores

## Testnet Mode Testing

### Switching to Testnet
1. Click the network indicator in the navbar
2. Select "Testnet"
3. Verify all components show testnet mock data

### What to Verify in Testnet Mode

1. **Dashboard**
   - Recent blocks show testnet block heights (2,500,000+)
   - Network stats show lower hashrate (TH/s instead of EH/s)
   - Mempool shows testnet transaction counts

2. **Address Search**
   - All addresses use testnet prefixes (m, n, 2, tb1)
   - Mock data is returned instead of API calls

3. **Transaction Search**
   - Transaction details show testnet addresses
   - Pattern detection works with mock data

4. **Network Stats**
   - Hashrate in TH/s range
   - Lower difficulty values
   - Testnet-specific peer counts

## Using Test Entries in Code

```javascript
import { testEntries, quickTestEntries, getRandomAddress } from './utils/testEntries';

// Get specific test entry
const highRiskAddress = testEntries.addresses.highRisk;

// Get quick copy-paste entry
const address = quickTestEntries.addressHighRisk;

// Get random test entry
const randomAddress = getRandomAddress();
```

## Notes

- All test entries are for **testnet only**
- In testnet mode, all API calls are bypassed and mock data is used
- Test entries are designed to trigger different risk patterns and scenarios
- Block heights are in the 2,500,000+ range for testnet
- All addresses use testnet address formats (m, n, 2, tb1 prefixes)

