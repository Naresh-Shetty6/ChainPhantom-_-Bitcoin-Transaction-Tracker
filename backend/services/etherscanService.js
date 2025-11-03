const fetch = require('node-fetch');

class EtherscanService {
  constructor() {
    this.apiKey = process.env.ETHERSCAN_API_KEY;
    this.baseUrl = 'https://api.etherscan.io/api';
  }

  // Get account balance and transaction count
  async getAccountInfo(address) {
    try {
      const [balanceResponse, txCountResponse] = await Promise.all([
        fetch(`${this.baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${this.apiKey}`),
        fetch(`${this.baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=desc&apikey=${this.apiKey}`)
      ]);

      const balanceData = await balanceResponse.json();
      const txCountData = await txCountResponse.json();

      if (balanceData.status !== '1' || txCountData.status !== '1') {
        throw new Error('Failed to fetch account information');
      }

      return {
        address,
        balance: balanceData.result,
        balanceEth: (parseInt(balanceData.result) / Math.pow(10, 18)).toFixed(8),
        transactionCount: txCountData.result.length,
        network: 'ethereum'
      };
    } catch (error) {
      console.error('Etherscan API error:', error);
      throw error;
    }
  }

  // Get transaction list for an address
  async getTransactions(address, page = 1, offset = 10) {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${offset}&sort=desc&apikey=${this.apiKey}`
      );

      const data = await response.json();

      if (data.status !== '1') {
        throw new Error(data.message || 'Failed to fetch transactions');
      }

      return data.result.map(tx => ({
        hash: tx.hash,
        blockNumber: tx.blockNumber,
        timeStamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        from: tx.from,
        to: tx.to,
        value: tx.value,
        valueEth: (parseInt(tx.value) / Math.pow(10, 18)).toFixed(8),
        gas: tx.gas,
        gasPrice: tx.gasPrice,
        gasUsed: tx.gasUsed,
        txreceipt_status: tx.txreceipt_status,
        input: tx.input,
        contractAddress: tx.contractAddress,
        cumulativeGasUsed: tx.cumulativeGasUsed,
        confirmations: tx.confirmations,
        network: 'ethereum'
      }));
    } catch (error) {
      console.error('Etherscan transaction fetch error:', error);
      throw error;
    }
  }

  // Get transaction details by hash
  async getTransactionByHash(txHash) {
    try {
      const [txResponse, receiptResponse] = await Promise.all([
        fetch(`${this.baseUrl}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${this.apiKey}`),
        fetch(`${this.baseUrl}?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${this.apiKey}`)
      ]);

      const txData = await txResponse.json();
      const receiptData = await receiptResponse.json();

      if (!txData.result || !receiptData.result) {
        throw new Error('Transaction not found');
      }

      const tx = txData.result;
      const receipt = receiptData.result;

      return {
        hash: tx.hash,
        blockNumber: parseInt(tx.blockNumber, 16),
        blockHash: tx.blockHash,
        transactionIndex: parseInt(tx.transactionIndex, 16),
        from: tx.from,
        to: tx.to,
        value: parseInt(tx.value, 16).toString(),
        valueEth: (parseInt(tx.value, 16) / Math.pow(10, 18)).toFixed(8),
        gas: parseInt(tx.gas, 16),
        gasPrice: parseInt(tx.gasPrice, 16),
        gasUsed: parseInt(receipt.gasUsed, 16),
        status: parseInt(receipt.status, 16),
        input: tx.input,
        nonce: parseInt(tx.nonce, 16),
        contractAddress: receipt.contractAddress,
        logs: receipt.logs,
        network: 'ethereum',
        timestamp: await this.getBlockTimestamp(parseInt(tx.blockNumber, 16))
      };
    } catch (error) {
      console.error('Etherscan transaction details error:', error);
      throw error;
    }
  }

  // Get block timestamp
  async getBlockTimestamp(blockNumber) {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=proxy&action=eth_getBlockByNumber&tag=0x${blockNumber.toString(16)}&boolean=false&apikey=${this.apiKey}`
      );

      const data = await response.json();
      
      if (!data.result) {
        return null;
      }

      return new Date(parseInt(data.result.timestamp, 16) * 1000).toISOString();
    } catch (error) {
      console.error('Block timestamp fetch error:', error);
      return null;
    }
  }

  // Get ERC-20 token transfers for an address
  async getTokenTransfers(address, contractAddress = null, page = 1, offset = 10) {
    try {
      let url = `${this.baseUrl}?module=account&action=tokentx&address=${address}&page=${page}&offset=${offset}&sort=desc&apikey=${this.apiKey}`;
      
      if (contractAddress) {
        url += `&contractaddress=${contractAddress}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== '1') {
        return [];
      }

      return data.result.map(tx => ({
        hash: tx.hash,
        blockNumber: tx.blockNumber,
        timeStamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        from: tx.from,
        to: tx.to,
        value: tx.value,
        tokenName: tx.tokenName,
        tokenSymbol: tx.tokenSymbol,
        tokenDecimal: tx.tokenDecimal,
        contractAddress: tx.contractAddress,
        gas: tx.gas,
        gasPrice: tx.gasPrice,
        gasUsed: tx.gasUsed,
        network: 'ethereum',
        type: 'token_transfer'
      }));
    } catch (error) {
      console.error('Token transfers fetch error:', error);
      throw error;
    }
  }

  // Detect suspicious patterns in Ethereum transactions
  detectSuspiciousPatterns(transactions, address) {
    const patterns = [];
    let riskScore = 0;

    if (!transactions || transactions.length === 0) {
      return { patterns, riskScore, riskLevel: 'low' };
    }

    // Pattern 1: High-frequency transactions
    const recentTxs = transactions.filter(tx => {
      const txTime = new Date(tx.timeStamp);
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return txTime > hourAgo;
    });

    if (recentTxs.length > 10) {
      patterns.push({
        type: 'high_frequency',
        description: `${recentTxs.length} transactions in the last hour`,
        severity: 'medium',
        transactions: recentTxs.slice(0, 5).map(tx => tx.hash)
      });
      riskScore += 30;
    }

    // Pattern 2: Large value transactions (>10 ETH)
    const largeTxs = transactions.filter(tx => parseFloat(tx.valueEth) > 10);
    if (largeTxs.length > 0) {
      patterns.push({
        type: 'large_transactions',
        description: `${largeTxs.length} transactions over 10 ETH`,
        severity: 'high',
        transactions: largeTxs.slice(0, 3).map(tx => tx.hash)
      });
      riskScore += 40;
    }

    // Pattern 3: Failed transactions (potential MEV/sandwich attacks)
    const failedTxs = transactions.filter(tx => tx.txreceipt_status === '0');
    if (failedTxs.length > 5) {
      patterns.push({
        type: 'failed_transactions',
        description: `${failedTxs.length} failed transactions detected`,
        severity: 'medium',
        transactions: failedTxs.slice(0, 3).map(tx => tx.hash)
      });
      riskScore += 25;
    }

    // Pattern 4: Contract interactions (potential DeFi/smart contract risks)
    const contractTxs = transactions.filter(tx => tx.input && tx.input !== '0x');
    if (contractTxs.length > transactions.length * 0.8) {
      patterns.push({
        type: 'high_contract_interaction',
        description: `${Math.round((contractTxs.length / transactions.length) * 100)}% contract interactions`,
        severity: 'low',
        transactions: contractTxs.slice(0, 3).map(tx => tx.hash)
      });
      riskScore += 15;
    }

    // Determine overall risk level
    let riskLevel = 'low';
    if (riskScore >= 70) riskLevel = 'critical';
    else if (riskScore >= 50) riskLevel = 'high';
    else if (riskScore >= 25) riskLevel = 'medium';

    return {
      patterns,
      riskScore,
      riskLevel,
      totalTransactions: transactions.length,
      analysisTimestamp: new Date().toISOString()
    };
  }
}

module.exports = new EtherscanService();
