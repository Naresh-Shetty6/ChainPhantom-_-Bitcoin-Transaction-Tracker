import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import Dashboard from './components/Dashboard';
import TransactionTable from './components/TransactionTable';
import SuspiciousPatterns from './components/SuspiciousPatterns';
import TransactionChain from './components/TransactionChain';
import TransactionGraph from './components/TransactionGraph';
import ExchangeDetection from './components/ExchangeDetection';
import MultiChainDashboard from './components/MultiChainDashboard';
import ForensicAnalyzer from './components/ForensicAnalyzer';
import AdvancedForensics from './components/AdvancedForensics';
import EnhancedMultiChain from './components/EnhancedMultiChain';
import TransactionDetails from './components/TransactionDetails';
import Blocks from './components/Blocks';
import Network from './components/Network';
import RecentTransactions from './components/RecentTransactions';
import WalletMonitor from './components/WalletMonitor';
import './App.css';

// Helper function to convert satoshis to BTC
const satoshisToBTC = (satoshis) => {
  return (satoshis / 100000000).toFixed(8);
};

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchType, setSearchType] = useState(null); // 'transaction', 'address', 'block'
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = async (term, type) => {
    if (!term) return;
    
    setSearchType(type);
    setLoading(true);
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
        // If type is not explicitly provided, try to determine it
        const response = await fetch(`http://localhost:5000/api/search/${term}`);
        if (!response.ok) {
          throw new Error('No data found for the provided input.');
        }
        
        const data = await response.json();
        setTransactions(data.transactions || []);
        setSearchResult({
          query: term,
          data: data
        });
        
        // Default to transaction if we can't determine type
        navigate(`/tx/${term}`);
      }
    } catch (err) {
      setSearchError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const renderTransactionDetails = (tx) => {
    if (!tx) return null;

    const getFeeRateClass = (feeRate) => {
      if (feeRate > 100) return 'fee-high';
      if (feeRate > 50) return 'fee-medium';
      if (feeRate > 10) return 'fee-low';
      return 'fee-very-low';
    };

    // Helper function to safely format values
    const safeNumber = (value, defaultValue = 0) => {
      return value !== undefined && value !== null ? value : defaultValue;
    };

    return (
      <div className="transaction-details-container">
        <h2 className="mb-4">Transaction Details</h2>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <div className="detail-label">Hash</div>
                  <div className="detail-value hash">{tx.hash || 'Unknown'}</div>
                </div>
                <div className="mb-3">
                  <div className="detail-label">Status</div>
                  <div className="detail-value">
                    <span className={`badge ${tx.confirmed ? 'bg-success' : 'bg-warning'}`}>
                      {tx.confirmed ? 'Confirmed' : 'Unconfirmed'}
                    </span>
                  </div>
                </div>
                {tx.block_height && (
                  <div className="mb-3">
                    <div className="detail-label">Block</div>
                    <div className="detail-value">
                      <a href={`/block/${tx.block_height}`} className="block-link">
                        {tx.block_height || 'Pending'}
                      </a>
                    </div>
                  </div>
                )}
                <div className="mb-3">
                  <div className="detail-label">Timestamp</div>
                  <div className="detail-value">{tx.time ? new Date(tx.time * 1000).toLocaleString() : 'Unknown'}</div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <div className="detail-label">Size</div>
                  <div className="detail-value">{safeNumber(tx.size).toLocaleString()} bytes</div>
                </div>
                <div className="mb-3">
                  <div className="detail-label">Weight</div>
                  <div className="detail-value">{safeNumber(tx.weight).toLocaleString()} WU</div>
                </div>
                <div className="mb-3">
                  <div className="detail-label">Virtual Size</div>
                  <div className="detail-value">{safeNumber(tx.vsize).toLocaleString()} vB</div>
                </div>
                <div className="mb-3">
                  <div className="detail-label">Version</div>
                  <div className="detail-value">{tx.version}</div>
                </div>
                <div className="mb-3">
                  <div className="detail-label">Fee</div>
                  <div className="detail-value">{(safeNumber(tx.fee) / 100000000).toFixed(8)} BTC</div>
                </div>
                <div className="mb-3">
                  <div className="detail-label">Fee Rate</div>
                  <div className="detail-value">
                    <span className={`fee-badge ${getFeeRateClass(safeNumber(tx.fee_rate))}`}>
                      {safeNumber(tx.fee_rate).toFixed(2)} sat/vB
                    </span> 
                  </div>
                </div>
                <div className="mb-3">
                  <div className="detail-label">Locktime</div>
                  <div className="detail-value">{tx.locktime}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="input-output-container">
          <div className="inputs card mb-4">
            <div className="card-header">Inputs ({(tx.vin || []).length})</div>
            <div className="card-body">
              {(tx.vin || []).map((input, index) => (
                <div key={index} className="input-item mb-3">
                  <div className="address-info">
                    <div className="address-label">Address:</div>
                    <div className="address-value">
                      {input.prevout && input.prevout.scriptpubkey_address ? (
                        <a href={`/address/${input.prevout.scriptpubkey_address}`} className="address-link">
                          {input.prevout.scriptpubkey_address}
                        </a>
                      ) : (
                        <span className="text-muted">No address (possibly coinbase)</span>
                      )}
                    </div>
                  </div>
                  <div className="value-info">
                    <div className="value-label">Value:</div>
                    <div className="value-amount">
                      {input.prevout && input.prevout.value !== undefined ? (
                        `${(input.prevout.value / 100000000).toFixed(8)} BTC`
                      ) : (
                        'Unknown value'
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(tx.vin || []).length === 0 && <div className="no-data">No inputs found</div>}
            </div>
          </div>
          <div className="outputs card mb-4">
            <div className="card-header">Outputs ({(tx.vout || []).length})</div>
            <div className="card-body">
              {(tx.vout || []).map((output, index) => (
                <div key={index} className="output-item mb-3">
                  <div className="address-info">
                    <div className="address-label">Address:</div>
                    <div className="address-value">
                      {output.scriptpubkey_address ? (
                        <a href={`/address/${output.scriptpubkey_address}`} className="address-link">
                          {output.scriptpubkey_address}
                        </a>
                      ) : (
                        <span className="text-muted">No address (possibly OP_RETURN)</span>
                      )}
                    </div>
                  </div>
                  <div className="value-info">
                    <div className="value-label">Value:</div>
                    <div className="value-amount">
                      {output.value !== undefined ? (
                        `${(output.value / 100000000).toFixed(8)} BTC`
                      ) : (
                        'Unknown value'
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(tx.vout || []).length === 0 && <div className="no-data">No outputs found</div>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddressDetails = (address, txs) => {
    // Calculate total received and sent
    let totalReceived = 0;
    let totalSent = 0;
    
    txs.forEach(tx => {
      // Find outputs to this address (received)
      tx.outputs?.forEach(output => {
        if (output.addresses?.includes(address)) {
          totalReceived += output.value || 0;
        }
      });
      
      // Find inputs from this address (sent)
      tx.inputs?.forEach(input => {
        if (input.addresses?.includes(address)) {
          totalSent += input.output_value || 0;
        }
      });
    });
    
    const balance = totalReceived - totalSent;
    
    return (
      <div className="container mt-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <i className="fas fa-wallet me-2"></i>
              Address Details
            </div>
            <div className="hash-display">
              <small className="text-muted text-truncate" style={{fontFamily: 'monospace'}}>{address}</small>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="row mb-3">
                  <div className="col-md-4 fw-bold">Balance:</div>
                  <div className="col-md-8 text-info">
                    {(balance / 1e8).toFixed(8)} BTC
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4 fw-bold">Total Received:</div>
                  <div className="col-md-8">
                    {(totalReceived / 1e8).toFixed(8)} BTC
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row mb-3">
                  <div className="col-md-4 fw-bold">Total Sent:</div>
                  <div className="col-md-8">
                    {(totalSent / 1e8).toFixed(8)} BTC
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-4 fw-bold">Transactions:</div>
                  <div className="col-md-8">
                    {txs.length}
                  </div>
                </div>
              </div>
            </div>
            
            {/* QR Code placeholder for wallets */}
            <div className="row mt-3">
              <div className="col-md-12 text-center">
                <div className="qr-code-placeholder">
                  <i className="fas fa-qrcode"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Suspicious Patterns Detection */}
        <SuspiciousPatterns address={address} />
        
        {/* Exchange Detection */}
        <ExchangeDetection address={address} transactions={txs} />
        
        <div className="card mt-4">
          <div className="card-header">
            <i className="fas fa-history me-2"></i>
            Transaction History
          </div>
          <div className="card-body p-0">
            <TransactionTable transactions={txs} />
          </div>
        </div>
      </div>
    );
  };

  // Component for Transaction Details
  const TransactionPage = () => {
    return <TransactionDetails />;
  };

  // Component for Address Details
  const AddressDetails = ({ address }) => {
    const [addressData, setAddressData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchAddressData = async () => {
        setLoading(true);
        
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
    }, [address]);

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
