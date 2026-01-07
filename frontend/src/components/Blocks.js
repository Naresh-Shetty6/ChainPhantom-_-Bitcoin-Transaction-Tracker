import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useNetwork } from '../contexts/NetworkContext';
import { getTestnetBlocks } from '../utils/testnetMockData';
import './blocks-transactions.css';

const Blocks = () => {
  const { isTestnet } = useNetwork();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Using multiple API endpoints for better reliability
  const API_ENDPOINTS = [
    'https://blockchain.info/blocks?format=json',
    'https://blockstream.info/api/blocks'
  ];

  const fetchRecentBlocks = useCallback(async () => {
    setLoading(true);
    
    // Use testnet mock data if in testnet mode
    if (isTestnet) {
      setTimeout(() => {
        const mockBlocks = getTestnetBlocks(10);
        setBlocks(mockBlocks);
        setLoading(false);
        setError(null);
      }, 500);
      return;
    }
    
    for (let i = 0; i < API_ENDPOINTS.length; i++) {
      try {
        const endpoint = API_ENDPOINTS[i];
        console.log(`Attempting to fetch blocks from endpoint ${i + 1}: ${endpoint}`);
        
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          console.warn(`API endpoint ${i + 1} failed with status: ${response.status}`);
          continue; // Try next endpoint
        }
        
        const data = await response.json();
        
        // Handle different API response formats
        let formattedBlocks = [];
        if (endpoint.includes('blockchain.info')) {
          formattedBlocks = data.blocks.map(block => ({
            height: block.height,
            hash: block.hash,
            time: block.time,
            n_tx: block.n_tx,
            size: block.size
          }));
        } else if (endpoint.includes('blockstream.info')) {
          formattedBlocks = await Promise.all(
            data.slice(0, 10).map(async blockData => {
              try {
                // Fetch detailed block info
                const blockResponse = await fetch(`https://blockstream.info/api/block/${blockData.id}`);
                if (blockResponse.ok) {
                  const blockDetail = await blockResponse.json();
                  return {
                    height: blockDetail.height,
                    hash: blockDetail.id,
                    time: blockDetail.timestamp,
                    n_tx: blockDetail.tx_count,
                    size: blockDetail.size
                  };
                }
                return null;
              } catch (err) {
                console.error(`Error fetching block details for ${blockData.id}:`, err);
                return null;
              }
            })
          );
          // Filter out any failed block fetches
          formattedBlocks = formattedBlocks.filter(block => block !== null);
        }
        
        if (formattedBlocks.length > 0) {
          setBlocks(formattedBlocks);
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
    setError('Unable to fetch block data. Please try again later.');
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecentBlocks();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      fetchRecentBlocks();
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [fetchRecentBlocks, retryCount, isTestnet]);

  // Format time to human-readable format
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Format block size for display
  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Handle retry
  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
    setError(null);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading blockchain data...</p>
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

  if (!blocks || blocks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <i className="fas fa-cubes"></i>
        </div>
        <p className="empty-state-message">No blocks found</p>
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
    <div className="blocks-table-container">
      <div className="table-header">
        <h2>Recent Blocks</h2>
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
              <th>HEIGHT</th>
              <th>HASH</th>
              <th>TIMESTAMP</th>
              <th>TRANSACTIONS</th>
              <th>SIZE</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block, index) => (
              <tr key={index} className="block-row">
                <td>
                  <Link to={`/block/${block.height}`} className="block-link">
                    {block.height.toLocaleString()}
                  </Link>
                </td>
                <td className="hash-cell">
                  <Link to={`/block/${block.hash}`} className="block-link">
                    {block.hash.substring(0, 8)}...{block.hash.substring(block.hash.length - 8)}
                  </Link>
                </td>
                <td className="time-cell">{formatTime(block.time)}</td>
                <td>{block.n_tx ? block.n_tx.toLocaleString() : 'Unknown'}</td>
                <td className="size-cell">{formatSize(block.size)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Blocks; 