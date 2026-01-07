import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNetwork } from '../contexts/NetworkContext';
import { getTestnetNetworkStats } from '../utils/testnetMockData';

const Network = () => {
  const { isTestnet } = useNetwork();
  const [networkStats, setNetworkStats] = useState({
    hashrate: '827.0 EH/s',
    difficulty: '123.2 T',
    unconfirmedTx: '12,453',
    nextHalving: '412 days',
    blockchainSize: '491.76 GB',
    nextDifficultyChange: '-1.4%',
    blocksUntilAdjustment: 1564,
    mempool: {
      txCount: 12453,
      size: '24.8 MB',
      totalFees: '0.54213 BTC',
      minFee: '2.1 sat/vB',
      medianFee: '8.7 sat/vB',
      maxFee: '62.3 sat/vB'
    },
    peers: {
      total: 8342,
      inbound: 5123,
      outbound: 3219,
      ipv4: 6821,
      ipv6: 1521,
      tor: 723
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNetworkStats = async () => {
      try {
        setLoading(true);
        
        // Use testnet mock data if in testnet mode
        if (isTestnet) {
          setTimeout(() => {
            const mockStats = getTestnetNetworkStats();
            setNetworkStats(mockStats);
            setLoading(false);
          }, 800);
          return;
        }
        
        // Placeholder for actual API call to get network stats
        // const response = await fetch('https://api.blockchain.info/stats');
        // const data = await response.json();
        // setNetworkStats(data);
        
        // Simulating API call delay
        setTimeout(() => {
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching network stats:', err);
        setError('Failed to load network statistics. Please try again later.');
        setLoading(false);
      }
    };

    fetchNetworkStats();
  }, [isTestnet]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading network statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="network-stats-container">
      <h2 className="mb-4">Network Overview</h2>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <i className="fas fa-network-wired"></i>
                Network Status
              </h3>
              <span className="stats-badge info">LIVE</span>
            </div>
            <div className="stats-card-body">
              <div className="stats-row">
                <span className="stats-label">Hash Rate</span>
                <span className="stats-value">{networkStats.hashrate}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Difficulty</span>
                <span className="stats-value">{networkStats.difficulty}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Unconfirmed Transactions</span>
                <span className="stats-value">{networkStats.unconfirmedTx}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Next Halving</span>
                <span className="stats-value">{networkStats.nextHalving}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Blockchain Size</span>
                <span className="stats-value">{networkStats.blockchainSize}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Next Difficulty Adjustment</span>
                <span className="stats-value warning">{networkStats.nextDifficultyChange}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Blocks Until Adjustment</span>
                <span className="stats-value">{networkStats.blocksUntilAdjustment}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <i className="fas fa-memory"></i>
                Mempool Status
              </h3>
              <span className="stats-badge warning">BUSY</span>
            </div>
            <div className="stats-card-body">
              <div className="stats-row">
                <span className="stats-label">Transaction Count</span>
                <span className="stats-value">{networkStats.mempool.txCount.toLocaleString()}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Size</span>
                <span className="stats-value">{networkStats.mempool.size}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Total Fees</span>
                <span className="stats-value">{networkStats.mempool.totalFees}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Minimum Fee (sat/vB)</span>
                <span className="stats-value">{networkStats.mempool.minFee}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Median Fee (sat/vB)</span>
                <span className="stats-value">{networkStats.mempool.medianFee}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Maximum Fee (sat/vB)</span>
                <span className="stats-value">{networkStats.mempool.maxFee}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <i className="fas fa-project-diagram"></i>
                Peer Information
              </h3>
              <span className="stats-badge success">HEALTHY</span>
            </div>
            <div className="stats-card-body">
              <div className="stats-row">
                <span className="stats-label">Total Peers</span>
                <span className="stats-value">{networkStats.peers.total.toLocaleString()}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Inbound Connections</span>
                <span className="stats-value">{networkStats.peers.inbound.toLocaleString()}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Outbound Connections</span>
                <span className="stats-value">{networkStats.peers.outbound.toLocaleString()}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">IPv4 Peers</span>
                <span className="stats-value">{networkStats.peers.ipv4.toLocaleString()}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">IPv6 Peers</span>
                <span className="stats-value">{networkStats.peers.ipv6.toLocaleString()}</span>
              </div>
              <div className="stats-row">
                <span className="stats-label">Tor Peers</span>
                <span className="stats-value">{networkStats.peers.tor.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">
                <i className="fas fa-chart-line"></i>
                Fee Estimator
              </h3>
            </div>
            <div className="stats-card-body">
              <div className="fee-estimator">
                <div className="fee-option">
                  <div className="fee-priority">High Priority</div>
                  <div className="fee-time">~10 minutes</div>
                  <div className="fee-rate">42.1 sat/vB</div>
                  <button className="fee-select-btn">Select</button>
                </div>
                <div className="fee-option">
                  <div className="fee-priority">Medium Priority</div>
                  <div className="fee-time">~30 minutes</div>
                  <div className="fee-rate">18.7 sat/vB</div>
                  <button className="fee-select-btn">Select</button>
                </div>
                <div className="fee-option">
                  <div className="fee-priority">Low Priority</div>
                  <div className="fee-time">~1 hour</div>
                  <div className="fee-rate">8.2 sat/vB</div>
                  <button className="fee-select-btn">Select</button>
                </div>
                <div className="fee-option">
                  <div className="fee-priority">Economy</div>
                  <div className="fee-time">~12 hours</div>
                  <div className="fee-rate">3.1 sat/vB</div>
                  <button className="fee-select-btn">Select</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network; 