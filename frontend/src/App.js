import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useNetwork } from './contexts/NetworkContext';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import Dashboard from './components/Dashboard';
import TransactionTable from './components/TransactionTable';
import SuspiciousPatterns from './components/SuspiciousPatterns';
import ExchangeDetection from './components/ExchangeDetection';
import AdvancedForensics from './components/AdvancedForensics';
import EnhancedMultiChain from './components/EnhancedMultiChain';
import TransactionDetails from './components/TransactionDetails';
import Blocks from './components/Blocks';
import Network from './components/Network';
import RecentTransactions from './components/RecentTransactions';
import WalletMonitor from './components/WalletMonitor';
import './App.css';


function App() {
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = async (term, type) => {
    if (!term) return;
    
    setSearchError('');
    
    try {
      // Navigate to appropriate route based on search type
      if (type === 'tx') {
        navigate(`/tx/${term}`);
      } else if (type === 'address') {
        navigate(`/address/${term}`);
      } else if (type === 'block') {
        navigate(`/block/${term}`);
      } else {
        // Default to transaction if we can't determine type
        navigate(`/tx/${term}`);
      }
    } catch (err) {
      setSearchError(err.message || 'Something went wrong.');
    }
  };

  // Component for Transaction Details
  const TransactionPage = () => {
    return <TransactionDetails />;
  };

  // Component for Address Details
  const AddressDetails = ({ address }) => {
    const [addressData, setAddressData] = useState(null);
    const [forensicData, setForensicData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isTestnet } = useNetwork();

    useEffect(() => {
      const fetchAddressData = async () => {
        setLoading(true);
        
        // Use testnet mock data if in testnet mode
        if (isTestnet) {
          const { getTestnetAddress, getTestnetForensicAnalysis } = require('./utils/testnetMockData');
          setTimeout(() => {
            const mockData = getTestnetAddress(address);
            const forensicAnalysis = getTestnetForensicAnalysis(address);
            setAddressData(mockData);
            setForensicData(forensicAnalysis);
            setLoading(false);
          }, 500);
          return;
        }
        
        try {
          const apiUrl = `http://localhost:5000/api/address/${address}`;
          console.log('Frontend calling:', apiUrl);
          
          const response = await fetch(apiUrl);
          const data = await response.json();
          
          console.log('Frontend received data:', data);
          
          if (response.ok && !data.error) {
            console.log('Setting address data:', data);
            setAddressData(data);
          } else {
            console.log('Response not OK or has error');
            // Set empty data on error
            setAddressData({
              address: address,
              total_received: 0,
              total_sent: 0,
              balance: 0,
              n_tx: 0,
              transactions: []
            });
          }
          
        } catch (err) {
          console.error('Frontend error:', err);
          // Set empty data on error
          setAddressData({
            address: address,
            total_received: 0,
            total_sent: 0,
            balance: 0,
            n_tx: 0,
            transactions: []
          });
        } finally {
          setLoading(false);
        }
      };

      fetchAddressData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, isTestnet]);

    if (loading) {
      return (
        <div className="container mt-4">
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
          </div>
        </div>
      );
    }

    if (error && !addressData) {
      return (
        <div className="container mt-4">
          <div className="card">
            <div className="card-header text-danger">Error</div>
            <div className="card-body">
              <p>{error}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mt-4">
        {/* Address Header */}
        <div className="card mb-4" style={{ backgroundColor: '#1a2637', border: '1px solid #2c3e50' }}>
          <div className="card-header" style={{ backgroundColor: '#0f1a2e', borderBottom: '2px solid #3498db' }}>
            <h5 style={{ color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-wallet" style={{ color: '#3498db' }}></i>
              Wallet Address Details
            </h5>
          </div>
          <div className="card-body">
            <div style={{ 
              fontFamily: 'monospace', 
              fontSize: '0.95rem', 
              color: '#4a9fff',
              backgroundColor: '#0f1520',
              padding: '12px',
              borderRadius: '6px',
              wordBreak: 'break-all',
              border: '1px solid #2c3e50'
            }}>
              {addressData.address}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          {/* Current Balance */}
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card" style={{ 
              backgroundColor: '#1a2637', 
              border: '1px solid #2c3e50',
              height: '100%',
              transition: 'transform 0.3s'
            }}>
              <div className="card-body" style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ 
                  fontSize: '2.5rem', 
                  marginBottom: '10px',
                  color: '#2ecc71'
                }}>
                  <i className="fas fa-coins"></i>
                </div>
                <h6 style={{ 
                  color: '#8aa2c7', 
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '10px'
                }}>
                  Current Balance
                </h6>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: '#2ecc71',
                  fontFamily: 'monospace'
                }}>
                  {(addressData.balance / 100000000).toFixed(8)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#8aa2c7', marginTop: '5px' }}>
                  BTC
                </div>
              </div>
            </div>
          </div>

          {/* Total Received */}
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card" style={{ 
              backgroundColor: '#1a2637', 
              border: '1px solid #2c3e50',
              height: '100%',
              transition: 'transform 0.3s'
            }}>
              <div className="card-body" style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ 
                  fontSize: '2.5rem', 
                  marginBottom: '10px',
                  color: '#3498db'
                }}>
                  <i className="fas fa-arrow-down"></i>
                </div>
                <h6 style={{ 
                  color: '#8aa2c7', 
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '10px'
                }}>
                  Total Received
                </h6>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: '#3498db',
                  fontFamily: 'monospace'
                }}>
                  {(addressData.total_received / 100000000).toFixed(8)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#8aa2c7', marginTop: '5px' }}>
                  BTC (Lifetime)
                </div>
              </div>
            </div>
          </div>

          {/* Total Sent */}
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card" style={{ 
              backgroundColor: '#1a2637', 
              border: '1px solid #2c3e50',
              height: '100%',
              transition: 'transform 0.3s'
            }}>
              <div className="card-body" style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ 
                  fontSize: '2.5rem', 
                  marginBottom: '10px',
                  color: '#e74c3c'
                }}>
                  <i className="fas fa-arrow-up"></i>
                </div>
                <h6 style={{ 
                  color: '#8aa2c7', 
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '10px'
                }}>
                  Total Sent
                </h6>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: '#e74c3c',
                  fontFamily: 'monospace'
                }}>
                  {(addressData.total_sent / 100000000).toFixed(8)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#8aa2c7', marginTop: '5px' }}>
                  BTC (Lifetime)
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Count */}
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card" style={{ 
              backgroundColor: '#1a2637', 
              border: '1px solid #2c3e50',
              height: '100%',
              transition: 'transform 0.3s'
            }}>
              <div className="card-body" style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ 
                  fontSize: '2.5rem', 
                  marginBottom: '10px',
                  color: '#f39c12'
                }}>
                  <i className="fas fa-exchange-alt"></i>
                </div>
                <h6 style={{ 
                  color: '#8aa2c7', 
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '10px'
                }}>
                  Transactions
                </h6>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: '#f39c12',
                  fontFamily: 'monospace'
                }}>
                  {addressData.transactions ? addressData.transactions.length : 0}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#8aa2c7', marginTop: '5px' }}>
                  Total Count
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Suspicious Pattern Detection */}
        {forensicData && forensicData.patterns && forensicData.patterns.length > 0 && (
          <div className="card mb-4" style={{ backgroundColor: '#1a2637', border: '1px solid #2c3e50' }}>
            <div className="card-header" style={{ backgroundColor: '#0f1a2e', borderBottom: '2px solid #e74c3c' }}>
              <h5 style={{ color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-exclamation-triangle" style={{ color: '#e74c3c' }}></i>
                Suspicious Pattern Detection
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <span className="me-3" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: forensicData.riskScore >= 70 ? '#e74c3c' : forensicData.riskScore >= 50 ? '#f39c12' : '#3498db' }}>
                    Risk Score: {forensicData.riskScore}/100
                  </span>
                  <span className={`badge ${forensicData.riskLevel === 'high' ? 'bg-danger' : forensicData.riskLevel === 'medium' ? 'bg-warning' : 'bg-info'}`}>
                    {forensicData.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
              </div>
              <div className="patterns-list">
                {forensicData.patterns.map((pattern, index) => (
                  <div 
                    key={index} 
                    className="alert mb-2"
                    style={{ 
                      backgroundColor: pattern.severity === 'high' ? '#2d1b1b' : pattern.severity === 'medium' ? '#2d251b' : '#1b1d2d',
                      border: `1px solid ${pattern.severity === 'high' ? '#e74c3c' : pattern.severity === 'medium' ? '#f39c12' : '#3498db'}`,
                      color: '#ffffff'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <strong style={{ color: pattern.severity === 'high' ? '#e74c3c' : pattern.severity === 'medium' ? '#f39c12' : '#3498db' }}>
                          {pattern.type.replace(/_/g, ' ').toUpperCase()}
                        </strong>
                        <p className="mb-0 mt-1">{pattern.description}</p>
                        {pattern.count && (
                          <small className="text-muted">Count: {pattern.count}</small>
                        )}
                      </div>
                      <span className={`badge ${pattern.severity === 'high' ? 'bg-danger' : pattern.severity === 'medium' ? 'bg-warning' : 'bg-info'}`}>
                        {pattern.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Recent Transactions */}
        {addressData.transactions && addressData.transactions.length > 0 && (
          <div className="card" style={{ backgroundColor: '#1a2637', border: '1px solid #2c3e50' }}>
            <div className="card-header" style={{ backgroundColor: '#0f1a2e', borderBottom: '2px solid #3498db' }}>
              <h5 style={{ color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-list" style={{ color: '#3498db' }}></i>
                Recent Transactions
              </h5>
            </div>
            <div className="card-body">
              <TransactionTable transactions={addressData.transactions} />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Component for Block Details
  const BlockDetails = ({ blockId }) => {
    // This would normally fetch block data
    return (
      <div className="container mt-4">
        <div className="card">
          <div className="card-header">Block Details</div>
          <div className="card-body">
            <p>Block ID: {blockId}</p>
            <p>This is a placeholder for block details.</p>
          </div>
        </div>
      </div>
    );
  };

  // Wrap components that need URL parameters
  const AddressPage = () => {
    const { addressId } = useParams();
    return <AddressDetails address={addressId} />;
  };

  const BlockPage = () => {
    const { blockId } = useParams();
    return <BlockDetails blockId={blockId} />;
  };

  return (
    <div className="app-container">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a2940',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
      <Navbar />
    
      {/* Only show hero section on home page */}
      {location.pathname === '/' && (
        <div className="hero-section">
          <div className="tagline">
            <h1>ChainPhantom</h1>
            <p>Trace the Trail of Crypto Transactions</p>
          </div>
          <div className="search-wrapper">
            <SearchBar onSearch={handleSearch} />
          </div>
          {searchError && <div className="search-error">{searchError}</div>}
        </div>
      )}
      
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tx/:txId" element={<TransactionPage />} />
          <Route path="/transaction/:txId" element={<TransactionPage />} />
          <Route path="/address/:addressId" element={<AddressPage />} />
          <Route path="/block/:blockId" element={<BlockPage />} />
          <Route path="/transactions" element={
            <div>
              <h2>Recent Transactions</h2>
              <RecentTransactions />
            </div>
          } />
          <Route path="/blocks" element={<Blocks />} />
          <Route path="/network" element={<Network />} />
          <Route path="/detector" element={<SuspiciousPatterns />} />
          <Route path="/wallet-monitor" element={<WalletMonitor />} />
          <Route path="/multichain" element={<EnhancedMultiChain />} />
          <Route path="/forensics" element={<AdvancedForensics />} />
          <Route path="/visualizer" element={<TransactionPage />} />
          <Route path="/api" element={
            <div className="my-5">
              <h2>API Documentation</h2>
              <p>Access ChainPhantom blockchain data via our REST API.</p>
              <div className="card">
                <div className="card-body">
                  <h5>API Endpoints</h5>
                  <ul>
                    <li><code>/api/tx/{'{hash}'}</code> - Get transaction details</li>
                    <li><code>/api/address/{'{address}'}</code> - Get address information</li>
                    <li><code>/api/block/{'{height_or_hash}'}</code> - Get block information</li>
                    <li><code>/api/stats</code> - Get blockchain network statistics</li>
                  </ul>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
