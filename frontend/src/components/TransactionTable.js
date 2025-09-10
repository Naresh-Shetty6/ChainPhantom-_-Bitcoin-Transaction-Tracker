import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Link } from 'react-router-dom';
import './blocks-transactions.css';

const satoshisToBTC = (satoshis) => {
  if (satoshis === undefined || satoshis === null) return '0.00000000';
  return (satoshis / 100000000).toFixed(8);
};

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#343a40',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid',
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    marginRight: 5,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  value: {
    fontWeight: 'normal',
  },
});

// PDF Document Component
const TransactionPDF = ({ transaction }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Transaction Details</Text>
      
      <View style={styles.section}>
        <Text style={styles.title}>General Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{transaction.txid}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Block:</Text>
          <Text style={styles.value}>{transaction.blockHeight || 'Pending'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Size:</Text>
          <Text style={styles.value}>{transaction.size} bytes</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fee:</Text>
          <Text style={styles.value}>{transaction.fee ? `${satoshisToBTC(transaction.fee)} BTC` : 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{transaction.confirmations > 0 ? 'Confirmed' : 'Pending'}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.title}>Inputs</Text>
        {transaction.vin.map((input, i) => (
          <View key={`input-${i}`} style={styles.row}>
            <Text style={styles.label}>Input {i+1}:</Text>
            <Text style={styles.value}>
              {input.addresses && input.addresses.length > 0 
                ? input.addresses[0] 
                : 'No address (coinbase or scriptSig)'} 
              - {input.value ? `${satoshisToBTC(input.value)} BTC` : '?'}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.title}>Outputs</Text>
        {transaction.vout.map((output, i) => (
          <View key={`output-${i}`} style={styles.row}>
            <Text style={styles.label}>Output {i+1}:</Text>
            <Text style={styles.value}>
              {output.addresses && output.addresses.length > 0 
                ? output.addresses[0] 
                : 'OP_RETURN or custom script'} 
              - {satoshisToBTC(output.value)} BTC
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const TransactionTable = ({ transactions = [] }) => {
  const [selectedTx, setSelectedTx] = useState(null);
  const detailsRef = useRef(null);
  const [txList, setTxList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // API endpoints to try for fetching transactions
  const API_ENDPOINTS = [
    'https://blockchain.info/unconfirmed-transactions?format=json',
    'https://blockchain.info/rawblock/000000000000000000070a0e1e51f2af51632431d1fb2178007af2ba8bd860e2?format=json'
  ];

  const fetchTransactions = useCallback(async () => {
    // If transactions are provided as props, use them
    if (transactions && transactions.length > 0) {
      setTxList(transactions);
      setLoading(false);
      setError(null);
      return;
    }
    
    // Otherwise fetch from external APIs
    setLoading(true);
    
    for (let i = 0; i < API_ENDPOINTS.length; i++) {
      try {
        const endpoint = API_ENDPOINTS[i];
        console.log(`Attempting to fetch transactions from endpoint ${i + 1}: ${endpoint}`);
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          console.warn(`API endpoint ${i + 1} failed with status: ${response.status}`);
          continue; // Try next endpoint
        }
        
        const data = await response.json();
        
        // Handle different API response formats
        let formattedTxs = [];
        if (endpoint.includes('unconfirmed-transactions')) {
          formattedTxs = data.txs || [];
        } else if (endpoint.includes('rawblock')) {
          // Extract transactions from a block
          formattedTxs = data.tx || [];
        }
        
        if (formattedTxs.length > 0) {
          // Limit to 10 transactions for performance
          setTxList(formattedTxs.slice(0, 10));
          setLoading(false);
          setError(null);
          return; // Successfully got data, exit the function
        }
      } catch (err) {
        console.error(`Error fetching from endpoint ${i + 1}:`, err);
        // Continue to next endpoint
      }
    }
    
    // If we get here, all endpoints failed
    setError('Unable to fetch transaction data. Please try again.');
    setLoading(false);
  }, [transactions]);

  useEffect(() => {
    fetchTransactions();
    
    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchTransactions();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchTransactions, retryCount]);
  
  const handleTxClick = (txId) => {
    if (selectedTx === txId) {
      setSelectedTx(null);
    } else {
      setSelectedTx(txId);
    }
  };
  
  const formatHash = (hash) => {
    if (!hash) return 'Unknown';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };
  
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };
  
  const getFeeRateClass = (feeRate) => {
    if (feeRate > 50) return 'fee-high';
    if (feeRate > 10) return 'fee-medium';
    return 'fee-low';
  };
  
  const calculateAmount = (tx) => {
    if (!tx) return 0;
    
    // Handle blockchain.info format
    if (tx.out && Array.isArray(tx.out)) {
      return tx.out.reduce((sum, output) => sum + (output.value || 0), 0);
    }
    
    // Handle other formats
    if (tx.vout && Array.isArray(tx.vout)) {
      return tx.vout.reduce((sum, output) => sum + (output.value || 0), 0);
    }
    
    return 0;
  };
  
  const getStatus = (tx) => {
    if (tx.block_height || tx.blockheight) return 'Confirmed';
    return 'Unconfirmed';
  };

  const renderTransactionDetails = (tx) => {
    if (!tx) return null;
    
    return (
      <div className="transaction-details" ref={detailsRef}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Transaction Details</span>
          <PDFDownloadLink 
            document={<TransactionPDF transaction={tx} />} 
            fileName={`transaction-${tx.txid.substring(0, 8)}.pdf`}
            className="btn btn-sm btn-primary"
          >
            {({ blob, url, loading, error }) => 
              loading ? 'Generating PDF...' : 'Download PDF'
            }
          </PDFDownloadLink>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Transaction ID:</strong> {tx.txid}</p>
              <p><strong>Block:</strong> {tx.blockHeight || 'Pending'}</p>
              <p><strong>Size:</strong> {tx.size} bytes</p>
              <p><strong>Virtual Size:</strong> {tx.vsize} vB</p>
            </div>
            <div className="col-md-6">
              <p><strong>Weight:</strong> {tx.weight} WU</p>
              <p><strong>Confirmations:</strong> {tx.confirmations || 0}</p>
              <p><strong>Status:</strong> {tx.confirmations > 0 ? 'Confirmed' : 'Pending'}</p>
            </div>
          </div>
          
          <div className="tx-io-container">
            <div className="tx-inputs">
              <div className="header">
                Inputs ({tx.vin.length})
              </div>
              {tx.vin.map((input, index) => (
                <div key={`input-${index}`} className="io-item">
                  <div className="address-container">
                    <div className="address-label">From:</div>
                    <div className="address-value">
                      {input.addresses && input.addresses.length > 0 ? (
                        <a href={`/address/${input.addresses[0]}`}>
                          {input.addresses[0]}
                        </a>
                      ) : (
                        <span className="text-muted">No address (coinbase or scriptSig)</span>
                      )}
                    </div>
                  </div>
                  <div className="value-container">
                    <div className="value-label">Amount:</div>
                    <div className="value-amount input">
                      {input.value ? satoshisToBTC(input.value) : '?'} BTC
                    </div>
                  </div>
                  {input.txid && (
                    <div className="value-container">
                      <div className="value-label">Outpoint:</div>
                      <div className="value-amount">
                        <a href={`/tx/${input.txid}`}>
                          {formatHash(input.txid)}:{input.vout}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="tx-outputs">
              <div className="header">
                Outputs ({tx.vout.length})
              </div>
              {tx.vout.map((output, index) => (
                <div key={`output-${index}`} className="io-item">
                  <div className="address-container">
                    <div className="address-label">To:</div>
                    <div className="address-value">
                      {output.addresses && output.addresses.length > 0 ? (
                        <a href={`/address/${output.addresses[0]}`}>
                          {output.addresses[0]}
                        </a>
                      ) : (
                        <span className="text-muted">OP_RETURN or custom script</span>
                      )}
                    </div>
                  </div>
                  <div className="value-container">
                    <div className="value-label">Amount:</div>
                    <div className="value-amount output">
                      {satoshisToBTC(output.value)} BTC
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handle retry button click
  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
    setError(null);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading transactions...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <div className="error-action">
          <button 
            onClick={handleRetry} 
            title="Try again"
          >
            <i className="fas fa-sync-alt"></i> Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (!txList || txList.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <i className="fas fa-exchange-alt"></i>
        </div>
        <p className="empty-state-message">No transactions found</p>
        <button 
          onClick={handleRetry} 
          className="btn btn-sm btn-outline-primary mt-3"
        >
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>
    );
  }
  
  return (
    <div className="transaction-table-container">
      <div className="table-header">
        <h2>Recent Transactions</h2>
        <button 
          onClick={handleRetry}
          title="Refresh data"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
    
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>TRANSACTION HASH</th>
              <th>TIME</th>
              <th>AMOUNT</th>
              <th>FEE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {txList.map((tx, index) => (
              <tr key={index} className="transaction-row">
                <td className="hash-cell">
                  <Link to={`/tx/${tx.hash || tx.txid}`} className="tx-hash-link">
                    {formatHash(tx.hash || tx.txid)}
                  </Link>
                </td>
                <td className="time-cell">{formatTime(tx.time || tx.created)}</td>
                <td className="amount-cell">{satoshisToBTC(calculateAmount(tx))} BTC</td>
                <td className="fee-cell">{satoshisToBTC(tx.fee)} BTC</td>
                <td>
                  <span className={`status-badge ${getStatus(tx).toLowerCase()}`}>
                    {getStatus(tx)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
