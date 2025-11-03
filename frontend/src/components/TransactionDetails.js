import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TransactionDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPlus, faMinus, faNetworkWired, 
  faProjectDiagram, faNetworkWired as faChartNetwork, faTimes,
  faFileExport, faFileCode, faFileCsv, faFilePdf,
  faExchangeAlt, faExclamationTriangle, faAddressBook,
  faArrowCircleUp, faArrowCircleDown, faCopy,
  faArrowRight, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { API_KEY } from '../config';
import TransactionChainVisualization from './TransactionChainVisualization';
import TransactionPatternDetector from './TransactionPatternDetector';
import { generateMockTransactionChain, processTransactionChainData } from '../utils/mockDataGenerator';
import { Button, Spinner } from 'react-bootstrap';
import jsPDF from 'jspdf';

const TransactionDetails = () => {
  const [transaction, setTransaction] = useState(null);
  const [senderAddresses, setSenderAddresses] = useState([]);
  const [receiverAddresses, setReceiverAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [traceDepth, setTraceDepth] = useState(1);
  const [viewMode, setViewMode] = useState('tree');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [graphPosition, setGraphPosition] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [relatedTransactions, setRelatedTransactions] = useState([]);
  const [isChainLoading, setIsChainLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [transactionChainLoading, setTransactionChainLoading] = useState(false);
  const [transactionChainError, setTransactionChainError] = useState(null);
  const [transactionChainData, setTransactionChainData] = useState([]);
  const [exportPdfFunction, setExportPdfFunction] = useState(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [patternDetectionData, setPatternDetectionData] = useState(null);
  
  const graphRef = useRef(null);
  const searchInputRef = useRef(null);
  const { txId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTransactionData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch real transaction data from the blockchain.info API
        const apiUrl = `https://blockchain.info/rawtx/${txId}?api_key=${API_KEY}`;
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched transaction data:", data);
        
        // Process the data to extract sender and receiver addresses
        const inputs = data.inputs || [];
        const outputs = data.out || [];
        
        // Extract sender addresses from inputs
        const senders = inputs
          .map(input => input.prev_out?.addr)
          .filter(Boolean);
        
        // Extract receiver addresses from outputs
        const receivers = outputs
          .map(output => output.addr)
          .filter(Boolean);
        
        // Ensure inputs and outputs are properly formatted
        const formattedTx = {
          ...data,
          txid: data.hash,
          fee: data.fee || 0,
          vin: inputs.map(input => ({
            addr: input.prev_out?.addr || "Unknown",
            value: input.prev_out?.value || 0
          })),
          vout: outputs.map(output => ({
            scriptPubKey: { addresses: [output.addr] },
            value: output.value / 100000000 // Convert satoshis to BTC
          }))
        };
        
        setTransaction(formattedTx);
        setSenderAddresses(senders);
        setReceiverAddresses(receivers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transaction data:', err);
        setError(`Could not fetch transaction data: ${err.message}`);
        setLoading(false);
        
        // Fallback to API 2 if first API fails
        try {
          const apiUrl2 = `https://api.blockchair.com/bitcoin/dashboards/transaction/${txId}?key=${API_KEY}`;
          const response = await fetch(apiUrl2);
          
          if (!response.ok) {
            throw new Error(`Second API request failed with status ${response.status}`);
          }
          
          const data = await response.json();
          console.log("Fallback API data:", data);
          const txData = data.data[txId]?.transaction || null;
          
          if (txData) {
            // Extract inputs and outputs
            const inputs = data.data[txId]?.inputs || [];
            const outputs = data.data[txId]?.outputs || [];
            
            // Extract sender addresses
            const senders = inputs
              .map(input => input.recipient)
              .filter(Boolean);
            
            // Extract receiver addresses
            const receivers = outputs
              .map(output => output.recipient)
              .filter(Boolean);
            
            // Format the transaction data to match our structure
            const formattedTx = {
              txid: txData.hash,
              hash: txData.hash,
              size: txData.size,
              fee: txData.fee,
              time: txData.time,
              block_height: txData.block_id,
              vin: inputs.map(input => ({
                addr: input.recipient,
                value: input.value
              })),
              vout: outputs.map(output => ({
                scriptPubKey: { addresses: [output.recipient] },
                value: output.value / 100000000 // Convert satoshis to BTC
              }))
            };
            
            setTransaction(formattedTx);
            setSenderAddresses(senders);
            setReceiverAddresses(receivers);
            setLoading(false);
          } else {
            throw new Error('Transaction not found in second API response');
          }
        } catch (secondErr) {
          console.error('Error with fallback API:', secondErr);
          setError(`Could not fetch transaction data from any source. Please try again later.`);
          setLoading(false);
        }
      }
    };

    if (txId) {
      fetchTransactionData();
    }
  }, [txId, API_KEY]);

  // Separate effect for fetching related transactions when transaction data is ready
  useEffect(() => {
    if (transaction && (transaction.hash || transaction.txid)) {
      const txHash = transaction.hash || transaction.txid;
      fetchRelatedTransactions(txHash, traceDepth);
    }
  }, [transaction, traceDepth]);

  // Handle graph mouse events
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.target.closest('.transaction-graph')) {
        setIsDragging(true);
      }
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        setGraphPosition(prev => ({
          x: prev.x + e.movementX,
          y: prev.y + e.movementY
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (e) => {
      if (e.target.closest('.visualization-container')) {
        e.preventDefault();
        setZoomLevel(prev => {
          const newZoom = prev - e.deltaY * 0.1;
          return Math.min(Math.max(newZoom, 0.5), 2);
        });
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [isDragging]);

  // Define these functions outside of the render flow to avoid ESLint warnings
  const handleDepthChange = useCallback((newDepth) => {
    newDepth = Number(newDepth);
    console.log(`Changing trace depth to: ${newDepth}`);
    
    // Only update if value actually changed
    if (traceDepth !== newDepth) {
      setTraceDepth(newDepth);
      // The useEffect with [transaction, traceDepth] dependency will handle fetching data
    }
  }, [traceDepth]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(0.5, prev - 0.1));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setGraphPosition({ x: 0, y: 0 });
    setSelectedNode(null);
  };
  
  const toggleSearch = () => {
    const newSearching = !isSearching;
    setIsSearching(newSearching);
    
    if (newSearching && searchInputRef.current) {
      // Focus the search input when search is toggled on
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  };
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Search through the related transactions and known addresses
    const allNodes = [
      ...relatedTransactions,
      ...senderAddresses.map((addr, idx) => ({ 
        id: `sender-${idx}`, 
        type: 'address', 
        hash: addr 
      })),
      ...receiverAddresses.map((addr, idx) => ({ 
        id: `receiver-${idx}`, 
        type: 'address', 
        hash: addr 
      }))
    ];
    
    const results = allNodes.filter(node => 
      node.hash && node.hash.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
  };
  
  const handleSearchResult = (result) => {
    // Check if the selected result is available at current depth
    const nodeExists = nodesForDepth.some(node => node.id === result.id);
    
    // If not, adjust the trace depth
    if (!nodeExists) {
      // Find the minimum depth that includes this node
      for (let depth = 1; depth <= 3; depth++) {
        const nodes = {
          tree: {
            1: [{ id: 'sample-tx' }],
            2: [{ id: 'sample-tx' }, { id: 'tx1' }, { id: 'address1' }],
            3: [{ id: 'sample-tx' }, { id: 'tx1' }, { id: 'address1' }, { id: 'tx2' }, { id: 'address2' }, { id: 'additional-tx' }, { id: 'additional-address' }]
          },
          network: {
            1: [{ id: 'sample-tx' }],
            2: [{ id: 'sample-tx' }, { id: 'tx1' }, { id: 'address1' }],
            3: [{ id: 'sample-tx' }, { id: 'tx1' }, { id: 'address1' }, { id: 'tx2' }, { id: 'address2' }, { id: 'additional-tx' }, { id: 'additional-address' }]
          },
          force: {
            1: [{ id: 'sample-tx' }],
            2: [{ id: 'sample-tx' }, { id: 'tx1' }, { id: 'address1' }],
            3: [{ id: 'sample-tx' }, { id: 'tx1' }, { id: 'address1' }, { id: 'tx2' }, { id: 'address2' }, { id: 'additional-tx' }, { id: 'additional-address' }]
          }
        };
        
        if (nodes[viewMode][depth].some(node => node.id === result.id)) {
          setTraceDepth(depth);
          break;
        }
      }
    }
    
    setSelectedNode(result.id);
    setSearchOpen(false);
  };
  
  const handleZoom = (direction) => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev + 0.1 : prev - 0.1;
      return Math.max(0.5, Math.min(2, newZoom));
    });
  };
  
  const copyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  // Define transaction data for different depths - Use actual transaction data
  const transactionsForDepth = useMemo(() => {
    return relatedTransactions.filter(node => node.type === 'transaction');
  }, [relatedTransactions]);

  // Get paths for different depths
  const pathsForDepth = useMemo(() => {
    // Generate paths based on relatedTransactions
    if (relatedTransactions.length < 2) return [];
    
    // Create paths between nodes
    const paths = [];
    const mainNode = relatedTransactions.find(node => node.main);
    
    if (mainNode) {
      // Connect main node to other nodes
      relatedTransactions.forEach((node, index) => {
        if (!node.main) {
          paths.push({
            id: `path-${mainNode.id}-${node.id}`,
            class: `path-${index}`,
            source: mainNode.id,
            target: node.id
          });
        }
      });
    }
    
    return paths;
  }, [relatedTransactions]);

  // Generate nodes based on depth
  const nodesForDepth = useMemo(() => {
    return relatedTransactions;
  }, [relatedTransactions]);

  // New function to fetch related transactions for chain visualization
  const fetchRelatedTransactions = async (currentTxId, depth = 1) => {
    if (!currentTxId || depth <= 0) return [];
    
    setIsChainLoading(true);
    
    try {
      // Create the base transaction node
      const baseTransaction = {
        id: 'main-tx-' + currentTxId,
        type: 'transaction',
        hash: currentTxId,
        main: true,
        x: 150,
        y: 180
      };
      
      let constructedChain = [baseTransaction];
      
      // Fetch main transaction inputs and outputs
      if (transaction) {
        // Add input addresses
        if (transaction.inputs && transaction.inputs.length > 0) {
          const inputAddresses = transaction.inputs
            .filter(input => input.prev_out && input.prev_out.addr)
            .map((input, index) => ({
              id: `input-address-${index}`,
              type: 'address',
              hash: input.prev_out.addr,
              amount: input.prev_out.value / 100000000,
              x: 20,
              y: 80 + (index * 40)
            }));
          
          constructedChain = [...constructedChain, ...inputAddresses];
        }
        
        // Add output addresses
        if (transaction.out && transaction.out.length > 0) {
          const outputAddresses = transaction.out
            .filter(output => output.addr)
            .map((output, index) => ({
              id: `output-address-${index}`,
              type: 'address',
              hash: output.addr,
              amount: output.value / 100000000,
              x: 280,
              y: 80 + (index * 40)
            }));
          
          constructedChain = [...constructedChain, ...outputAddresses];
        }
        
        // For depth > 1, add additional data
        if (depth > 1) {
          // Add more mock transactions for depth 2
          for (let i = 0; i < 3; i++) {
            const mockTx = {
              id: `tx-level2-${i}`,
              type: 'transaction',
              hash: `${currentTxId.substring(0, 6)}...${i}`,
              main: false,
              x: 350,
              y: 100 + (i * 80)
            };
            
            // Add address nodes connecting to this tx
            const mockAddress = {
              id: `addr-level2-${i}`,
              type: 'address',
              hash: `Mock-Address-${i}`,
              x: 250,
              y: 100 + (i * 80)
            };
            
            constructedChain.push(mockTx);
            constructedChain.push(mockAddress);
          }
        }
        
        // For depth > 2, add even more data
        if (depth > 2) {
          // Add more mock transactions for depth 3
          for (let i = 0; i < 5; i++) {
            const mockTx = {
              id: `tx-level3-${i}`,
              type: 'transaction',
              hash: `${currentTxId.substring(0, 4)}...${i}`,
              main: false,
              x: 450,
              y: 80 + (i * 60)
            };
            
            // Add address nodes connecting to this tx
            const mockAddress = {
              id: `addr-level3-${i}`,
              type: 'address',
              hash: `Level3-Address-${i}`,
              x: 350,
              y: 80 + (i * 60)
            };
            
            constructedChain.push(mockTx);
            constructedChain.push(mockAddress);
          }
        }
      }
      
      console.log("Generated chain data:", constructedChain);
      setRelatedTransactions(constructedChain);
      setIsChainLoading(false);
    } catch (error) {
      console.error('Error fetching related transactions:', error);
      setIsChainLoading(false);
      setError('Failed to fetch transaction chain data');
    }
  };

  // Update related transactions when trace depth changes
  useEffect(() => {
    if (transaction && (transaction.hash || transaction.txid)) {
      fetchRelatedTransactions(transaction.hash || transaction.txid, traceDepth);
    }
  }, [traceDepth, transaction]);

  // Normalize transaction data to ensure inputs and outputs are accessible
  const normalizeTransaction = () => {
    if (!transaction) return {};
    
    // Handle blockchain.info api format
    if (transaction.inputs && transaction.out) {
      return {
        ...transaction,
        vin: transaction.inputs.map(input => ({
          addr: input.prev_out?.addr,
          value: input.prev_out?.value
        })),
        vout: transaction.out.map(output => ({
          scriptPubKey: { addresses: [output.addr] },
          value: (output.value / 100000000) // Convert satoshis to BTC
        }))
      };
    }
    
    return transaction;
  };
  
  // Get normalized transaction data
  const normalizedTx = normalizeTransaction();

  // Update the fetchTransactionChainData function to use the traceDepth state
  const fetchTransactionChainData = useCallback(async (txHash, depth) => {
    setTransactionChainLoading(true);
    setTransactionChainError(null);
    
    try {
      let data;
      let mockTxData = generateMockTransactionChain(txHash, depth);
      data = processTransactionChainData(mockTxData);
      
      setTransactionChainData(data);
      setTransactionChainLoading(false);
    } catch (error) {
      console.error("Error fetching transaction chain data:", error);
      setTransactionChainError("Failed to fetch transaction chain data. Please try again later.");
      setTransactionChainLoading(false);
    }
  }, []);

  // Handle node click in visualization
  const handleNodeClick = (node) => {
    if (node.type === 'transaction' && node.hash !== txHash) {
      // Navigate to the clicked transaction
      navigate(`/transaction/${node.hash}`);
    }
  };

  useEffect(() => {
    if (transaction?.hash) {
      fetchTransactionChainData(transaction.hash, traceDepth);
    }
  }, [transaction, fetchTransactionChainData, traceDepth]);

  // Add any conditional rendering after all hooks have been called
  if (loading) {
    return <div className="loading">Loading transaction details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Use the real transaction data for visualization
  const nodeData = relatedTransactions;

  return (
    <div className="transaction-detail-page">
      {/* Transaction header - First image */}
      <div className="transaction-header">
        <div className="transaction-title">
          <FontAwesomeIcon icon={faExchangeAlt} /> Transaction Details
        </div>
        <div className="transaction-id">
          {transaction.hash || transaction.txid}
        </div>
      </div>
      
      {/* Transaction summary grid - First image */}
      <div className="transaction-details-grid">
        <div className="detail-row">
              <div className="detail-label">Status:</div>
              <div className="detail-value">
            <span className="status confirmed">
              {transaction.block_height ? 'Confirmed' : 'Unconfirmed'}
                </span>
              </div>
            </div>
        <div className="detail-row">
              <div className="detail-label">Timestamp:</div>
          <div className="detail-value">
            {transaction.time ? new Date(transaction.time * 1000).toLocaleString() : 'Pending'}
          </div>
            </div>
        <div className="detail-row">
              <div className="detail-label">Block:</div>
              <div className="detail-value">
            {transaction.block_height ? (
              <a href={`/block/${transaction.block_height}`} className="block-link" role="button">
                {transaction.block_height}
              </a>
            ) : (
              'Unconfirmed'
            )}
              </div>
            </div>
        <div className="detail-row">
              <div className="detail-label">Total BTC:</div>
          <div className="detail-value">
            {transaction.vout?.reduce((total, output) => total + Number(output.value || 0), 0).toFixed(8)} BTC
          </div>
            </div>
        <div className="detail-row">
              <div className="detail-label">Fees:</div>
              <div className="detail-value">
            {(transaction.fee / 100000000).toFixed(8)} BTC 
            {transaction.size && (
              <span> ({(transaction.fee / transaction.size).toFixed(2)} sat/vB)</span>
            )}
              </div>
            </div>
        <div className="detail-row">
              <div className="detail-label">Size:</div>
          <div className="detail-value">
            {transaction.size} bytes
          </div>
        </div>
      </div>
      
      {/* Suspicious pattern detection - Enhanced Pattern Detector */}
      {transaction && normalizedTx.vin && normalizedTx.vout && (
        <TransactionPatternDetector 
          transaction={transaction}
          inputs={normalizedTx.vin}
          outputs={normalizedTx.vout}
          onPatternDataChange={setPatternDetectionData}
        />
      )}
      
      {/* Transaction Addresses Summary - Second image */}
      <div className="addresses-outer-container">
        <div className="transaction-addresses-header">
          <FontAwesomeIcon icon={faAddressBook} /> Transaction Addresses Summary
                    </div>
        <div className="addresses-container">
          <div className="address-row">
            <div className="address-section">
              <div className="address-section-inner">
                <div className="address-type">
                  <div className="address-icon sender">
                    <FontAwesomeIcon icon={faArrowCircleUp} />
                  </div>
                  <div className="address-label">Sender Addresses</div>
                  <div className="address-count">({senderAddresses.length})</div>
                </div>
                <div className="address-list">
                    {senderAddresses.length > 0 ? (
                    senderAddresses.map((address, index) => (
                      <div key={`sender-${index}`} className="address-item">
                        <div className="address-text">{address}</div>
                        <button 
                          className="copy-button" 
                          onClick={() => copyToClipboard(address)}
                          aria-label="Copy address"
                        >
                          <FontAwesomeIcon icon={faCopy} />
                          </button>
                        {copiedAddress === address && (
                          <div className="copy-tooltip">Copied!</div>
                        )}
                        </div>
                      ))
                    ) : (
                    <div className="no-addresses-message">No sender addresses found</div>
                    )}
                </div>
                    </div>
                    </div>
            
            <div className="address-section">
              <div className="address-section-inner">
                <div className="address-type">
                  <div className="address-icon receiver">
                    <FontAwesomeIcon icon={faArrowCircleDown} />
                  </div>
                  <div className="address-label">Receiver Addresses</div>
                  <div className="address-count">({receiverAddresses.length})</div>
                </div>
                <div className="address-list">
                    {receiverAddresses.length > 0 ? (
                    receiverAddresses.map((address, index) => (
                      <div key={`receiver-${index}`} className="address-item">
                        <div className="address-text">{address}</div>
                        <button 
                          className="copy-button" 
                          onClick={() => copyToClipboard(address)}
                          aria-label="Copy address"
                        >
                          <FontAwesomeIcon icon={faCopy} />
                          </button>
                        {copiedAddress === address && (
                          <div className="copy-tooltip">Copied!</div>
                        )}
                        </div>
                      ))
                    ) : (
                    <div className="no-addresses-message">No receiver addresses found</div>
                    )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="inputs-outputs-container">
            <div className="io-sections">
              <div className="io-section">
                <div className="io-header">
                  <FontAwesomeIcon icon={faArrowRight} />
                  Inputs
              </div>
                {normalizedTx.vin && normalizedTx.vin.length > 0 ? (
                  normalizedTx.vin.map((input, index) => (
                    <div key={`input-${index}`} className="io-content">
                      <div className="io-address-label">Address:</div>
                      <div className="io-address-value">
                        {input.addr || input.prevout?.scriptpubkey_address || 'Unknown Address'}
                      </div>
                      <div className="io-amount">
                        {input.value ? (input.value / 100000000).toFixed(8) : 'Unknown'} BTC
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data-message">No input data available</div>
                )}
            </div>
            
              <div className="io-section">
                <div className="io-header">
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Outputs
              </div>
                {normalizedTx.vout && normalizedTx.vout.length > 0 ? (
                  normalizedTx.vout.map((output, index) => (
                    <div key={`output-${index}`} className="io-content">
                      <div className="io-address-label">Address:</div>
                      <div className="io-address-value">
                        {output.scriptPubKey?.addresses?.[0] || output.addr || 'Unknown Address'}
                      </div>
                      <div className="io-amount">
                        {typeof output.value === 'number' ? output.value.toFixed(8) : 'Unknown'} BTC
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-data-message">No output data available</div>
                )}
              </div>
            </div>
              </div>
            </div>
          </div>
          
      {/* Transaction Chain Visualization Section */}
      <div className="transaction-detail-panel mb-4">
        <div className="panel-header">
          <h3>
            <FontAwesomeIcon icon={faProjectDiagram} className="section-icon" />
            Transaction Chain
          </h3>
          <div className="trace-depth-control">
            <label htmlFor="trace-depth">Trace Depth:</label>
            <select 
              id="trace-depth" 
              value={traceDepth} 
              onChange={(e) => {
                // Prevent the default browser behavior
                e.preventDefault();
                e.stopPropagation();
                // Get the value as a number
                const value = parseInt(e.target.value, 10);
                // Update the state
                handleDepthChange(value);
                return false;
              }}
              className="trace-depth-select"
            >
              <option value="1">1 Level</option>
              <option value="2">2 Levels</option>
              <option value="3">3 Levels</option>
            </select>
          </div>
        </div>
        <div className="panel-content">
          {transactionChainLoading ? (
            <div className="loading-indicator">
              <Spinner animation="border" role="status" size="sm" />
              <span className="ms-2">Loading transaction chain...</span>
            </div>
          ) : transactionChainError ? (
            <div className="alert alert-danger m-2">{transactionChainError}</div>
          ) : (
            <TransactionChainVisualization 
              relatedTransactions={relatedTransactions} 
              isLoading={isChainLoading}
              onNodeClick={handleNodeClick}
              traceDepth={traceDepth}
              onDepthChange={handleDepthChange}
              onExportPDF={setExportPdfFunction}
            />
          )}
        </div>
      </div>

      {/* Export section - Fourth image */}
      <div className="export-section">
        <div className="export-title">
          <FontAwesomeIcon icon={faFileExport} /> Export Transaction Data
        </div>
        <div className="export-options">
          <button 
            className="export-btn json"
            onClick={() => {
              // Combine transaction data with pattern detection data
              const exportData = {
                transaction: transaction,
                patternAnalysis: patternDetectionData || {
                  riskScore: 0,
                  patterns: [],
                  timestamp: new Date().toISOString(),
                  message: "No pattern analysis available"
                },
                exportedAt: new Date().toISOString()
              };
              
              const jsonData = JSON.stringify(exportData, null, 2);
              const blob = new Blob([jsonData], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `transaction_analysis_${transaction.txid.substring(0, 8)}.json`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            <FontAwesomeIcon icon={faFileCode} /> JSON
          </button>
          <button 
            className="export-btn csv"
            onClick={() => {
              // Generate CSV content with pattern analysis
              let csvContent = "ChainPhantom Transaction Analysis Report\n";
              csvContent += `Generated: ${new Date().toLocaleString()}\n`;
              csvContent += `Transaction ID: ${transaction.txid}\n\n`;
              
              // Add Pattern Analysis Section
              csvContent += "=== PATTERN ANALYSIS ===\n";
              if (patternDetectionData && patternDetectionData.patterns && patternDetectionData.patterns.length > 0) {
                csvContent += `Risk Score: ${patternDetectionData.riskScore}/100\n`;
                csvContent += `Analysis Date: ${new Date(patternDetectionData.timestamp).toLocaleString()}\n\n`;
                
                csvContent += "Pattern Type,Severity,Description\n";
                patternDetectionData.patterns.forEach(pattern => {
                  // Escape commas in description
                  const description = pattern.description.replace(/,/g, ';');
                  csvContent += `${pattern.type},${pattern.severity.toUpperCase()},"${description}"\n`;
                });
              } else {
                csvContent += "Risk Score: 0/100\n";
                csvContent += "No suspicious patterns detected\n";
              }
              
              csvContent += "\n=== TRANSACTION DETAILS ===\n";
              csvContent += `Size: ${transaction.size} bytes\n`;
              csvContent += `Fee: ${(transaction.fee / 100000000).toFixed(8)} BTC\n`;
              csvContent += `Status: ${transaction.block_height ? 'Confirmed' : 'Unconfirmed'}\n\n`;
              
              // Add input data
              csvContent += "=== INPUTS ===\n";
              csvContent += "Type,Address,Amount (BTC)\n";
              transaction.vin.forEach(input => {
                csvContent += `Input,${input.addr || 'Unknown'},${input.value ? (input.value / 100000000).toFixed(8) : 'Unknown'}\n`;
              });
              
              // Add output data
              csvContent += "\n=== OUTPUTS ===\n";
              csvContent += "Type,Address,Amount (BTC)\n";
              transaction.vout.forEach(output => {
                csvContent += `Output,${output.scriptPubKey?.addresses?.[0] || "Unknown"},${output.value || 'Unknown'}\n`;
              });
              
              // Create and download file
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `transaction_analysis_${transaction.txid.substring(0, 8)}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            <FontAwesomeIcon icon={faFileCsv} /> CSV
          </button>
        </div>
        <div className="generate-report">
          <button 
            className="report-btn"
            onClick={() => {
              // Generate PDF directly here instead of relying on the visualization component
              setIsPdfGenerating(true);
              
              try {
                // Create a PDF document
                const pdf = new jsPDF({
                  orientation: 'portrait',
                  unit: 'mm',
                  format: 'a4'
                });
                
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const margin = 15;
                const contentWidth = pageWidth - (margin * 2);
                
                // Add header with logo simulation
                pdf.setFillColor(13, 18, 38); // Dark blue header
                pdf.rect(0, 0, pageWidth, 30, 'F');
                
                // Add title
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(18);
                pdf.setFont("helvetica", "bold");
                pdf.text("ChainPhantom", margin, 12);
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                pdf.text("Blockchain Analysis Report", margin, 20);
                
                // Add decorative line
                pdf.setDrawColor(74, 159, 255); // Light blue
                pdf.setLineWidth(0.5);
                pdf.line(margin, 32, pageWidth - margin, 32);
                
                // Add report title
                pdf.setTextColor(13, 18, 38);
                pdf.setFontSize(16);
                pdf.setFont("helvetica", "bold");
                pdf.text("Transaction Analysis Report", margin, margin + 22);
                
                // Add metadata section with improved layout
                pdf.setFontSize(10);
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(80, 80, 80);
                pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, margin + 32);
                
                if (transaction && transaction.txid) {
                  // Create a summary box
                  pdf.setFillColor(240, 240, 245);
                  pdf.roundedRect(margin, margin + 36, contentWidth, 45, 3, 3, 'F');
                  
                  // Transaction summary
                  pdf.setTextColor(13, 18, 38);
                  pdf.setFontSize(12);
                  pdf.setFont("helvetica", "bold");
                  pdf.text("Transaction Summary", margin + 5, margin + 45);
                  
                  pdf.setFontSize(9);
                  pdf.setFont("helvetica", "normal");
                  
                  // Two-column layout for transaction details
                  const col1 = margin + 5;
                  const col2 = margin + contentWidth/2;
                  
                  pdf.setFont("helvetica", "bold");
                  pdf.text("Transaction ID:", col1, margin + 54);
                  pdf.setFont("helvetica", "normal");
                  pdf.text(transaction.txid.substring(0, 20) + "...", col1 + 30, margin + 54);
                  
                  if (transaction.time) {
                    const txDate = new Date(transaction.time * 1000);
                    pdf.setFont("helvetica", "bold");
                    pdf.text("Date:", col1, margin + 62);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(txDate.toLocaleString(), col1 + 30, margin + 62);
                  }
                  
                  if (transaction.size) {
                    pdf.setFont("helvetica", "bold");
                    pdf.text("Size:", col2, margin + 54);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(`${transaction.size} bytes`, col2 + 25, margin + 54);
                  }
                  
                  if (transaction.fee) {
                    pdf.setFont("helvetica", "bold");
                    pdf.text("Fee:", col2, margin + 62);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(`${(transaction.fee / 100000000).toFixed(8)} BTC`, col2 + 25, margin + 62);
                  }
                  
                  const blockStatus = transaction.block_height ? 'Confirmed' : 'Unconfirmed';
                  pdf.setFont("helvetica", "bold");
                  pdf.text("Status:", col1, margin + 70);
                  pdf.setFont("helvetica", "normal");
                  pdf.text(blockStatus, col1 + 30, margin + 70);
                  
                  if (transaction.confirmations != null) {
                    pdf.setFont("helvetica", "bold");
                    pdf.text("Confirmations:", col2, margin + 70);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(`${transaction.confirmations}`, col2 + 25, margin + 70);
                  }
                  
                  // Calculate total value
                  let totalValue = 0;
                  if (transaction.vout && transaction.vout.length > 0) {
                    totalValue = transaction.vout.reduce((sum, output) => sum + (output.value || 0), 0);
                  }
                  
                  let yPosition = margin + 90;
                  
                  // Add section headers with blue background
                  const addSectionHeader = (title, y) => {
                    pdf.setFillColor(30, 80, 140); // Darker blue background for better contrast
                    pdf.rect(margin, y, contentWidth, 8, 'F');
                    pdf.setTextColor(255, 255, 255); // White text for better visibility
                    pdf.setFontSize(12);
                    pdf.setFont("helvetica", "bold");
                    pdf.text(title, margin + 4, y + 6);
                    return y + 12;
                  };
                  
                  // Pattern Analysis Section
                  yPosition = addSectionHeader("Pattern Analysis", yPosition);
                  
                  if (patternDetectionData && patternDetectionData.patterns && patternDetectionData.patterns.length > 0) {
                    // Risk Score Box
                    const riskScore = patternDetectionData.riskScore;
                    let riskColor, riskLevel;
                    
                    if (riskScore >= 70) {
                      riskColor = [231, 76, 60]; // Red
                      riskLevel = 'CRITICAL';
                    } else if (riskScore >= 50) {
                      riskColor = [243, 156, 18]; // Orange
                      riskLevel = 'HIGH';
                    } else if (riskScore >= 30) {
                      riskColor = [241, 196, 15]; // Yellow
                      riskLevel = 'MEDIUM';
                    } else if (riskScore >= 10) {
                      riskColor = [52, 152, 219]; // Blue
                      riskLevel = 'LOW';
                    } else {
                      riskColor = [46, 204, 113]; // Green
                      riskLevel = 'MINIMAL';
                    }
                    
                    // Risk score display box
                    pdf.setFillColor(240, 240, 245);
                    pdf.roundedRect(margin, yPosition, contentWidth, 15, 2, 2, 'F');
                    
                    pdf.setFontSize(11);
                    pdf.setFont("helvetica", "bold");
                    pdf.setTextColor(80, 80, 80);
                    pdf.text("Risk Score:", margin + 5, yPosition + 6);
                    
                    pdf.setFontSize(14);
                    pdf.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
                    pdf.text(`${riskScore}/100`, margin + 35, yPosition + 6);
                    
                    pdf.setFontSize(11);
                    pdf.text(`(${riskLevel} RISK)`, margin + 60, yPosition + 6);
                    
                    pdf.setFontSize(9);
                    pdf.setTextColor(100, 100, 100);
                    pdf.setFont("helvetica", "normal");
                    pdf.text(`Analysis Date: ${new Date(patternDetectionData.timestamp).toLocaleString()}`, margin + 5, yPosition + 12);
                    
                    yPosition += 20;
                    
                    // Patterns table
                    pdf.setFillColor(240, 240, 245);
                    pdf.rect(margin, yPosition, contentWidth, 7, 'F');
                    
                    pdf.setTextColor(80, 80, 80);
                    pdf.setFontSize(9);
                    pdf.setFont("helvetica", "bold");
                    pdf.text("Pattern Type", margin + 3, yPosition + 5);
                    pdf.text("Severity", margin + 50, yPosition + 5);
                    pdf.text("Description", margin + 75, yPosition + 5);
                    
                    yPosition += 10;
                    
                    // Pattern details
                    pdf.setFont("helvetica", "normal");
                    patternDetectionData.patterns.forEach((pattern, index) => {
                      // Check if we need a new page
                      if (yPosition > pageHeight - 30) {
                        pdf.addPage();
                        yPosition = margin + 10;
                      }
                      
                      // Alternating row background
                      if (index % 2 === 1) {
                        pdf.setFillColor(248, 248, 250);
                        pdf.rect(margin, yPosition - 5, contentWidth, 10, 'F');
                      }
                      
                      // Set color based on severity
                      let severityColor;
                      if (pattern.severity === 'high') {
                        severityColor = [231, 76, 60]; // Red
                      } else if (pattern.severity === 'medium') {
                        severityColor = [243, 156, 18]; // Orange
                      } else {
                        severityColor = [52, 152, 219]; // Blue
                      }
                      
                      pdf.setTextColor(50, 50, 50);
                      pdf.text(pattern.type.replace(/_/g, ' ').toUpperCase(), margin + 3, yPosition);
                      
                      pdf.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
                      pdf.setFont("helvetica", "bold");
                      pdf.text(pattern.severity.toUpperCase(), margin + 50, yPosition);
                      
                      pdf.setFont("helvetica", "normal");
                      pdf.setTextColor(50, 50, 50);
                      // Wrap description text if too long
                      const maxWidth = contentWidth - 80;
                      const descriptionLines = pdf.splitTextToSize(pattern.description, maxWidth);
                      pdf.text(descriptionLines[0], margin + 75, yPosition);
                      
                      yPosition += 10;
                    });
                    
                    yPosition += 5;
                  } else {
                    // No patterns detected
                    pdf.setFillColor(240, 248, 245);
                    pdf.roundedRect(margin, yPosition, contentWidth, 12, 2, 2, 'F');
                    
                    pdf.setTextColor(46, 204, 113);
                    pdf.setFontSize(11);
                    pdf.setFont("helvetica", "bold");
                    pdf.text("✓ No suspicious patterns detected", margin + 5, yPosition + 8);
                    
                    pdf.setFontSize(9);
                    pdf.setTextColor(100, 100, 100);
                    pdf.setFont("helvetica", "normal");
                    pdf.text("Risk Score: 0/100 (MINIMAL RISK)", margin + contentWidth - 60, yPosition + 8);
                    
                    yPosition += 17;
                  }
                  
                  // Check if we need a new page before inputs section
                  if (yPosition > pageHeight - 60) {
                    pdf.addPage();
                    yPosition = margin + 10;
                  }
                  
                  // Inputs section with tabular format
                  yPosition = addSectionHeader("Input Addresses", yPosition);
                  
                  if (transaction.vin && transaction.vin.length > 0) {
                    // Table header
                    pdf.setFillColor(240, 240, 245);
                    pdf.rect(margin, yPosition, contentWidth, 7, 'F');
                    
                    pdf.setTextColor(80, 80, 80);
                    pdf.setFontSize(9);
                    pdf.setFont("helvetica", "bold");
                    pdf.text("No.", margin + 3, yPosition + 5);
                    pdf.text("Address", margin + 15, yPosition + 5);
                    pdf.text("Amount (BTC)", margin + contentWidth - 30, yPosition + 5);
                    
                    yPosition += 10;
                    
                    // Table content
                    pdf.setFont("helvetica", "normal");
                    pdf.setTextColor(50, 50, 50);
                    
                    transaction.vin.forEach((input, index) => {
                      // Check if we need a new page
                      if (yPosition > pageHeight - 30) {
                        pdf.addPage();
                        yPosition = margin + 10;
                      }
                      
                      const addrText = input.addr || "Unknown Address";
                      const displayAddr = addrText.length > 32 ? addrText.substring(0, 29) + "..." : addrText;
                      const amount = input.value ? (input.value / 100000000).toFixed(8) : "Unknown";
                      
                      pdf.text(`${index+1}`, margin + 3, yPosition);
                      pdf.text(displayAddr, margin + 15, yPosition);
                      pdf.text(amount, margin + contentWidth - 30, yPosition);
                      
                      // Alternating row background
                      if (index % 2 === 1) {
                        pdf.setFillColor(248, 248, 250);
                        pdf.rect(margin, yPosition - 5, contentWidth, 7, 'F');
                      }
                      
                      yPosition += 8;
                    });
                    
                    // Add a divider
                    pdf.setDrawColor(200, 200, 200);
                    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
                    yPosition += 10;
                  } else {
                    pdf.setTextColor(100, 100, 100);
                    pdf.setFontSize(9);
                    pdf.text("No input data available", margin + 5, yPosition);
                    yPosition += 10;
                  }
                  
                  // Ensure there's enough space for outputs section
                  if (yPosition > pageHeight - 60) {
                    pdf.addPage();
                    yPosition = margin + 10;
                  }
                  
                  // Outputs section with tabular format
                  yPosition = addSectionHeader("Output Addresses", yPosition);
                  
                  if (transaction.vout && transaction.vout.length > 0) {
                    // Table header
                    pdf.setFillColor(240, 240, 245);
                    pdf.rect(margin, yPosition, contentWidth, 7, 'F');
                    
                    pdf.setTextColor(80, 80, 80);
                    pdf.setFontSize(9);
                    pdf.setFont("helvetica", "bold");
                    pdf.text("No.", margin + 3, yPosition + 5);
                    pdf.text("Address", margin + 15, yPosition + 5);
                    pdf.text("Amount (BTC)", margin + contentWidth - 30, yPosition + 5);
                    
                    yPosition += 10;
                    
                    // Table content
                    pdf.setFont("helvetica", "normal");
                    pdf.setTextColor(50, 50, 50);
                    
                    transaction.vout.forEach((output, index) => {
                      // Check if we need a new page
                      if (yPosition > pageHeight - 30) {
                        pdf.addPage();
                        yPosition = margin + 10;
                      }
                      
                      const address = output.scriptPubKey?.addresses?.[0] || "Unknown Address";
                      const displayAddr = address.length > 32 ? address.substring(0, 29) + "..." : address;
                      const amount = output.value != null ? output.value.toFixed(8) : "Unknown";
                      
                      // Alternating row background
                      if (index % 2 === 1) {
                        pdf.setFillColor(248, 248, 250);
                        pdf.rect(margin, yPosition - 5, contentWidth, 7, 'F');
                      }
                      
                      pdf.text(`${index+1}`, margin + 3, yPosition);
                      pdf.text(displayAddr, margin + 15, yPosition);
                      pdf.text(amount, margin + contentWidth - 30, yPosition);
                      
                      yPosition += 8;
                    });
                  } else {
                    pdf.setTextColor(100, 100, 100);
                    pdf.setFontSize(9);
                    pdf.text("No output data available", margin + 5, yPosition);
                    yPosition += 10;
                  }
                  
                  // Add related transactions section if available
                  if (relatedTransactions && relatedTransactions.length > 0) {
                    // Check if we need a new page
                    if (yPosition > pageHeight - 60) {
                      pdf.addPage();
                      yPosition = margin + 10;
                    }
                    
                    yPosition = addSectionHeader("Related Transactions", yPosition);
                    
                    // Filter only transaction nodes
                    const transactions = relatedTransactions.filter(node => node.type === 'transaction');
                    
                    if (transactions.length > 0) {
                      // Table header
                      pdf.setFillColor(240, 240, 245);
                      pdf.rect(margin, yPosition, contentWidth, 7, 'F');
                      
                      pdf.setTextColor(80, 80, 80);
                      pdf.setFontSize(9);
                      pdf.setFont("helvetica", "bold");
                      pdf.text("No.", margin + 3, yPosition + 5);
                      pdf.text("Transaction Hash", margin + 15, yPosition + 5);
                      pdf.text("Type", margin + contentWidth - 30, yPosition + 5);
                      
                      yPosition += 10;
                      
                      // Table content
                      pdf.setFont("helvetica", "normal");
                      pdf.setTextColor(50, 50, 50);
                      
                      transactions.forEach((tx, i) => {
                        // Check if we need a new page
                        if (yPosition > pageHeight - 30) {
                          pdf.addPage();
                          yPosition = margin + 10;
                        }
                        
                        const txHash = tx.hash || "Unknown";
                        const displayHash = txHash.length > 50 ? txHash.substring(0, 47) + "..." : txHash;
                        const txType = tx.main ? "Main Transaction" : "Related Transaction";
                        
                        // Highlight main transaction with a different color
                        if (tx.main) {
                          pdf.setTextColor(74, 159, 255);
                          pdf.setFont("helvetica", "bold");
                        } else {
                          pdf.setTextColor(50, 50, 50);
                          pdf.setFont("helvetica", "normal");
                        }
                        
                        // Alternating row background
                        if (i % 2 === 1) {
                          pdf.setFillColor(248, 248, 250);
                          pdf.rect(margin, yPosition - 5, contentWidth, 7, 'F');
                        }
                        
                        pdf.text(`${i+1}`, margin + 3, yPosition);
                        pdf.text(displayHash, margin + 15, yPosition);
                        pdf.text(txType, margin + contentWidth - 30, yPosition);
                        
                        yPosition += 8;
                      });
                    } else {
                      pdf.setTextColor(100, 100, 100);
                      pdf.setFontSize(9);
                      pdf.text("No related transactions available", margin + 5, yPosition);
                      yPosition += 10;
                    }
                  }
                } else {
                  // No transaction data
                  pdf.setTextColor(150, 0, 0);
                  pdf.text("No transaction data available.", margin, margin + 30);
                }
                
                // Add footer to each page
                const totalPages = pdf.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                  pdf.setPage(i);
                  pdf.setFontSize(8);
                  pdf.setTextColor(100, 100, 100);
                  pdf.text(`Generated by ChainPhantom - Page ${i} of ${totalPages}`, margin, pageHeight - 10);
                  
                  // Add decorative footer line
                  pdf.setDrawColor(200, 200, 200);
                  pdf.setLineWidth(0.1);
                  pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
                }
                
                // Create descriptive filename
                const filename = transaction && transaction.txid 
                  ? `chainphantom-tx-${transaction.txid.substring(0, 8)}.pdf`
                  : `chainphantom-report-${new Date().getTime()}.pdf`;
                
                // Save the PDF directly
                pdf.save(filename);
                
                // Reset loading state
                setTimeout(() => {
                  setIsPdfGenerating(false);
                }, 500);
                
              } catch (error) {
                console.error("Error generating PDF:", error);
                alert("Failed to generate PDF. Please try again.");
                setIsPdfGenerating(false);
              }
            }}
            disabled={isPdfGenerating || !transaction}
          >
            <FontAwesomeIcon icon={faFilePdf} /> 
            {isPdfGenerating ? 'Generating PDF...' : 'Generate PDF Report'}
            {isPdfGenerating && <span className="ms-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails; 