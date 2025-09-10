import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './blocks-transactions.css';
import { API_KEY } from '../config';

const satoshisToBTC = (satoshis) => {
  if (satoshis === undefined || satoshis === null) return '0.00000000';
  return (satoshis / 100000000).toFixed(8);
};

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Try to fetch from blockchain.info with API key
        const response = await fetch(`https://blockchain.info/unconfirmed-transactions?format=json&api_key=${API_KEY}`);
        
        if (response.ok) {
          const data = await response.json();
          const formattedTxs = data.txs ? data.txs.slice(0, 5) : [];
          setTransactions(formattedTxs);
          setLoading(false);
          return;
        }
        
        // Fallback to a second API if the first fails
        const fallbackResponse = await fetch(`https://mempool.space/api/v1/mempool/recent?api-key=${API_KEY}`);
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setTransactions(fallbackData.slice(0, 5));
          setLoading(false);
          return;
        }
        
        throw new Error('Failed to fetch transaction data');
      } catch (err) {
        console.error('Error fetching recent transactions:', err);
        setError('Unable to fetch recent transactions. Please try again later.');
        setLoading(false);
      }
    };

    fetchTransactions();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchTransactions, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const calculateTotalOutput = (tx) => {
    if (!tx) return 0;
    
    if (tx.out && Array.isArray(tx.out)) {
      return tx.out.reduce((sum, output) => sum + (output.value || 0), 0);
    }
    
    if (tx.vout && Array.isArray(tx.vout)) {
      return tx.vout.reduce((sum, output) => sum + (output.value || 0), 0);
    }
    
    return 0;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 60) return 'less than a minute ago';
    if (diff < 3600) return `${Math.floor(diff / 60)} minute${Math.floor(diff / 60) !== 1 ? 's' : ''} ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) !== 1 ? 's' : ''} ago`;
    
    return new Date(timestamp * 1000).toLocaleString();
  };

  const truncateHash = (hash) => {
    if (!hash) return '';
    return hash.substring(0, 7) + '...' + hash.substring(hash.length - 7);
  };

  if (loading) {
    return (
      <div className="recent-transactions-panel">
        <div className="panel-header">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 5L5 21M5 5l16 16M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path>
            </svg>
            Recent Transactions
          </h2>
          <span className="live-badge">LIVE</span>
        </div>
        <div className="transaction-list">
          <div style={{ padding: '20px', textAlign: 'center', color: '#8aa2c7' }}>
            Loading transactions...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-transactions-panel">
        <div className="panel-header">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 5L5 21M5 5l16 16M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path>
            </svg>
            Recent Transactions
          </h2>
        </div>
        <div className="transaction-list">
          <div style={{ padding: '20px', textAlign: 'center', color: '#e74c3c' }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-transactions-panel">
      <div className="panel-header">
        <h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 5L5 21M5 5l16 16M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path>
          </svg>
          Recent Transactions
        </h2>
        <span className="live-badge">LIVE</span>
      </div>
      <div className="transaction-list">
        {transactions.map(tx => (
          <div key={tx.hash} className="transaction-item">
            <Link to={`/tx/${tx.hash}`} className="transaction-hash">
              {truncateHash(tx.hash)}
            </Link>
            <div className="transaction-details">
              <span className="transaction-amount">{satoshisToBTC(calculateTotalOutput(tx))} BTC</span>
              <span className="transaction-fee">Fee: {satoshisToBTC(tx.fee)} BTC</span>
            </div>
            <div className="transaction-time">{formatTime(tx.time)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions; 