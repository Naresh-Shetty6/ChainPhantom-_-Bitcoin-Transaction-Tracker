const fs = require('fs');
const path = require('path');

// Load exchange database
const exchangeData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/exchanges.json'), 'utf8')
);

class ExchangeDetectionService {
  constructor() {
    this.addressMap = new Map();
    this.loadAddresses();
  }

  loadAddresses() {
    // Load all exchange addresses
    Object.entries(exchangeData.exchanges).forEach(([key, exchange]) => {
      exchange.addresses.forEach(address => {
        this.addressMap.set(address, {
          type: 'exchange',
          name: exchange.name,
          country: exchange.country,
          riskLevel: exchange.riskLevel,
          kyc: exchange.kyc,
          category: 'centralized_exchange'
        });
      });
    });

    // Load mixer addresses
    Object.entries(exchangeData.mixers).forEach(([key, mixer]) => {
      mixer.addresses.forEach(address => {
        this.addressMap.set(address, {
          type: 'mixer',
          name: mixer.name,
          riskLevel: mixer.riskLevel,
          status: mixer.status,
          category: 'privacy_service'
        });
      });
    });

    // Load darknet addresses
    Object.entries(exchangeData.darknet).forEach(([key, darknet]) => {
      darknet.addresses.forEach(address => {
        this.addressMap.set(address, {
          type: 'darknet',
          name: darknet.name,
          riskLevel: darknet.riskLevel,
          status: darknet.status,
          category: 'illicit_service'
        });
      });
    });

    // Load gambling addresses
    Object.entries(exchangeData.gambling).forEach(([key, gambling]) => {
      gambling.addresses.forEach(address => {
        this.addressMap.set(address, {
          type: 'gambling',
          name: gambling.name,
          riskLevel: gambling.riskLevel,
          category: 'gambling_service'
        });
      });
    });
  }

  identifyAddress(address) {
    return this.addressMap.get(address) || null;
  }

  analyzeTransactionFlow(transactions) {
    const analysis = {
      exchanges: [],
      mixers: [],
      darknet: [],
      gambling: [],
      riskScore: 0,
      leaActions: []
    };

    transactions.forEach(tx => {
      // Check inputs
      if (tx.inputs) {
        tx.inputs.forEach(input => {
          if (input.addresses) {
            input.addresses.forEach(addr => {
              const identification = this.identifyAddress(addr);
              if (identification) {
                this.categorizeIdentification(identification, analysis, 'input', tx.hash);
              }
            });
          }
        });
      }

      // Check outputs
      if (tx.outputs) {
        tx.outputs.forEach(output => {
          if (output.addresses) {
            output.addresses.forEach(addr => {
              const identification = this.identifyAddress(addr);
              if (identification) {
                this.categorizeIdentification(identification, analysis, 'output', tx.hash);
              }
            });
          }
        });
      }
    });

    // Generate LEA action recommendations
    this.generateLeaActions(analysis);

    return analysis;
  }

  categorizeIdentification(identification, analysis, direction, txHash) {
    const entry = {
      ...identification,
      direction,
      txHash,
      timestamp: new Date().toISOString()
    };

    switch (identification.type) {
      case 'exchange':
        analysis.exchanges.push(entry);
        analysis.riskScore += identification.riskLevel === 'low' ? 5 : 15;
        break;
      case 'mixer':
        analysis.mixers.push(entry);
        analysis.riskScore += 50;
        break;
      case 'darknet':
        analysis.darknet.push(entry);
        analysis.riskScore += 100;
        break;
      case 'gambling':
        analysis.gambling.push(entry);
        analysis.riskScore += 20;
        break;
    }
  }

  generateLeaActions(analysis) {
    // Exchange-related actions
    if (analysis.exchanges.length > 0) {
      const exchangeNames = [...new Set(analysis.exchanges.map(e => e.name))];
      analysis.leaActions.push({
        priority: 'high',
        action: 'subpoena_exchange',
        description: `Subpoena KYC records from: ${exchangeNames.join(', ')}`,
        exchanges: exchangeNames,
        legalBasis: 'Financial transaction investigation',
        urgency: 'standard'
      });
    }

    // Mixer-related actions
    if (analysis.mixers.length > 0) {
      analysis.leaActions.push({
        priority: 'critical',
        action: 'mixer_investigation',
        description: 'Funds passed through privacy mixers - advanced blockchain analysis required',
        urgency: 'immediate',
        recommendation: 'Engage specialized blockchain forensics team'
      });
    }

    // Darknet-related actions
    if (analysis.darknet.length > 0) {
      analysis.leaActions.push({
        priority: 'critical',
        action: 'darknet_investigation',
        description: 'Funds linked to darknet markets - coordinate with cybercrime unit',
        urgency: 'immediate',
        recommendation: 'Cross-reference with ongoing darknet investigations'
      });
    }

    // High-risk score actions
    if (analysis.riskScore > 100) {
      analysis.leaActions.push({
        priority: 'critical',
        action: 'freeze_assets',
        description: 'High-risk transaction pattern detected - consider asset freezing',
        urgency: 'immediate',
        legalBasis: 'Suspicious transaction activity'
      });
    }
  }

  getRiskLevel(score) {
    if (score > 100) return 'critical';
    if (score > 50) return 'high';
    if (score > 20) return 'medium';
    return 'low';
  }
}

module.exports = new ExchangeDetectionService();
