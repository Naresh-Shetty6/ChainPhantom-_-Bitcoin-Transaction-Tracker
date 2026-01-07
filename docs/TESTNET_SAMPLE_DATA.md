# Testnet Sample Data Reference

This document provides sample testnet data examples for testing and development purposes.

## Testnet Address Formats

Bitcoin testnet addresses use different prefixes than mainnet:

- **P2PKH (Legacy)**: Start with `m` or `n` (e.g., `mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT`)
- **P2SH (Script Hash)**: Start with `2` (e.g., `2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`)
- **Bech32 (Native SegWit)**: Start with `tb1` (e.g., `tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`)

## Sample Addresses

```
mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT
n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y
2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc
tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn
```

## Sample Transaction Hashes

```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567
c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678
```

## Dashboard Stats Example

```json
{
  "latestBlock": {
    "height": 2503456,
    "hash": "0000000000000000000a1b2c3d4e5f6789012345678901234567890abcdef12",
    "time": 1704123456000,
    "txCount": 342,
    "size": 1245678
  },
  "mempool": {
    "txCount": 2847,
    "size": "3.2 MB",
    "fees": {
      "hourFee": 8,
      "halfHourFee": 12,
      "fastestFee": 18
    }
  },
  "network": {
    "hashrate": "35.7 TH/s",
    "difficulty": "4.23 T",
    "nextDifficultyChange": "+2.1%",
    "blocksUntilChange": 1234
  }
}
```

## Address Data Example

```json
{
  "address": "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
  "total_received": 15000000000,
  "total_sent": 12000000000,
  "balance": 3000000000,
  "n_tx": 47,
  "transactions": [
    {
      "hash": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      "time": 1704123456,
      "value": 5000000000,
      "type": "received"
    }
  ]
}
```

## Transaction Data Example

```json
{
  "hash": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
  "txid": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
  "time": 1704123456,
  "size": 542,
  "fee": 12345,
  "block_height": 2503456,
  "confirmations": 12,
  "inputs": [
    {
      "prev_out": {
        "addr": "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
        "value": 500000000
      }
    }
  ],
  "out": [
    {
      "addr": "2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc",
      "value": 700000000
    }
  ]
}
```

## Forensic Analysis Example

```json
{
  "address": "mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT",
  "riskScore": 75,
  "riskLevel": "high",
  "patterns": [
    {
      "type": "high_frequency",
      "severity": "high",
      "count": 8,
      "description": "Unusual transaction frequency detected"
    },
    {
      "type": "mixing_service",
      "severity": "high",
      "count": 2,
      "description": "Possible mixing service involvement"
    }
  ],
  "transactionCount": 47,
  "totalVolume": 150.5
}
```

## Test Scenarios

### High-Risk Address
- Address: `mzBcXKPaEDcm2F8mNf3YgR7vJ9wL2qH5sT`
- Risk Score: 87
- Patterns: Mixing service, high frequency, rapid mixing

### Exchange Address
- Address: `n3R7vJ9wL2qH5sTmzBcXKPaEDcm2F8mNf3Y`
- Risk Score: 25
- Exchange: Testnet Exchange 1
- High transaction count, low risk

### Normal User Address
- Address: `2MxKPaEDcm2F8mNf3YgR7vJ9wL2qH5sTmzBc`
- Risk Score: 12
- Minimal patterns
- Low transaction count

### CoinJoin Transaction
- Hash: `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`
- Multiple inputs/outputs
- Risk Score: 75
- Pattern: CoinJoin detected

### Peeling Chain Transaction
- Hash: `b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567`
- One large input, small output + change
- Risk Score: 55
- Pattern: Peeling chain detected

## Usage in Testing

Import the sample data in your test files:

```javascript
import { sampleTestnetData, getRandomSample } from '../utils/testnetSampleData';

// Use complete dashboard stats
const stats = sampleTestnetData.dashboardStats;

// Get a specific scenario
const highRiskAddress = getRandomSample('highRiskAddress');

// Get testnet addresses
const addresses = sampleTestnetData.testnetAddresses;
```

## Notes

- All values are in satoshis (1 BTC = 100,000,000 satoshis)
- Testnet block heights are typically in the 2,500,000+ range
- Testnet hashrates are much lower than mainnet (TH/s vs EH/s)
- Testnet difficulty is much lower than mainnet
- All timestamps are Unix timestamps (seconds since epoch)

