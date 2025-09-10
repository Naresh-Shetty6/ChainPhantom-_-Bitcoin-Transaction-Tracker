import React, { useState, useEffect, useCallback, useRef } from 'react';
import TransactionGraph from './TransactionGraph';
import TransactionReport from './TransactionReport';
import './TransactionChain.css';
import { API_KEY } from '../config';

const TransactionChain = ({ txHash }) => {
  const [chain, setChain] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [depth, setDepth] = useState(2);
  const [traceMode, setTraceMode] = useState('outputs'); // 'outputs' or 'inputs'
  const [suspiciousPatterns, setSuspiciousPatterns] = useState([]);
  const [visitedHashes, setVisitedHashes] = useState(new Set());
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'graph'
  const [transactionData, setTransactionData] = useState(null);

  // Recursively fetch transaction chain data
  const fetchTransactionData = useCallback(async (hash, currentDepth, maxDepth, visitedTxs = new Set()) => {
    // Prevent infinite loops by tracking visited transactions
    if (visitedTxs.has(hash)) {
      return {
        hash,
        time: null,
        total: 0,
        block: null,
        loopDetected: true,
        visited: true,
        children: []
      };
    }
    
    // Add current hash to visited set
    const updatedVisitedTxs = new Set(visitedTxs);
    updatedVisitedTxs.add(hash);
    
    try {
      const response = await fetch(`https://blockchain.info/rawtx/${hash}?api_key=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction ${hash}`);
      }
      
      const txData = await response.json();
      
      // Create node for current transaction
      const node = {
        hash: txData.hash,
        time: txData.time * 1000,
        total: txData.out.reduce((sum, output) => sum + output.value, 0),
        fee: txData.fee || 0,
        block: txData.block_height || null,
        confirmations: txData.confirmations || 0,
        loopDetected: false,
        visited: visitedTxs.size > 1, // Mark as visited if not the root transaction
        children: [],
        inputs: txData.inputs?.length || 0,
        outputs: txData.out?.length || 0
      };
      
      // If this is the root transaction, save its full data
      if (currentDepth === 0) {
        setTransactionData({
          txid: txData.hash,
          hash: txData.hash,
          time: txData.time,
          block_height: txData.block_height,
          confirmations: txData.confirmations || 0,
          fee: txData.fee || 0,
          fee_rate: txData.fee_rate || 0,
          total: txData.out.reduce((sum, output) => sum + output.value, 0),
          total_output_value: txData.out.reduce((sum, output) => sum + output.value, 0),
          size: txData.size || 0,
          confirmed: txData.block_height ? true : false,
          inputs: txData.inputs?.map(input => ({
            address: input.prev_out?.addr || "Unknown",
            value: input.prev_out?.value || 0,
            coinbase: !!input.coinbase
          })) || [],
          outputs: txData.out?.map(output => ({
            address: output.addr || "Unknown",
            value: output.value || 0
          })) || []
        });
      }
      
      // Stop recursion if max depth reached
      if (currentDepth >= maxDepth) {
        return node;
      }
      
      // Process child transactions based on trace mode
      if (traceMode === 'outputs') {
        // Follow transaction outputs
        const childPromises = [];
        const outputsToCheck = txData.out.slice(0, 5); // Limit to avoid rate limiting
        
        for (const output of outputsToCheck) {
          if (output.spent) {
            try {
              // Try to get the spending transaction
              const spentTxResponse = await fetch(`https://blockchain.info/rawtx/${output.spending_outpoints?.[0]?.tx_index}?api_key=${API_KEY}`);
              if (spentTxResponse.ok) {
                const spentTx = await spentTxResponse.json();
                // Recursively fetch child transaction data
                childPromises.push(fetchTransactionData(
                  spentTx.hash, 
                  currentDepth + 1, 
                  maxDepth, 
                  updatedVisitedTxs
                ));
              }
            } catch (error) {
              console.warn('Error fetching spending transaction:', error);
            }
          }
        }
        
        // Process child results
        if (childPromises.length > 0) {
          const childResults = await Promise.all(childPromises);
          node.children = childResults.filter(result => result !== null);
        }
      } else {
        // Follow transaction inputs (backward tracing)
        const childPromises = [];
        const inputsToCheck = txData.inputs.slice(0, 5); // Limit to avoid rate limiting
        
        for (const input of inputsToCheck) {
          if (input.prev_out && input.prev_out.tx_index) {
            try {
              // Getting the previous transaction from this input
              childPromises.push(fetchTransactionData(
                input.prev_out.tx_hash, 
                currentDepth + 1, 
                maxDepth, 
                updatedVisitedTxs
              ));
            } catch (error) {
              console.warn('Error fetching input transaction:', error);
            }
          }
        }
        
        // Process input results
        if (childPromises.length > 0) {
          const childResults = await Promise.all(childPromises);
          node.children = childResults.filter(result => result !== null);
        }
      }
      
      return node;
    } catch (error) {
      console.error(`Error fetching transaction ${hash}:`, error);
      return null;
    }
  }, [traceMode]);

  // Create a ref for the collectVisitedHashes function for recursion
  const collectVisitedHashesRef = useRef();
  
  // Helper function to collect all transaction hashes in the chain
  const collectVisitedHashes = useCallback((node, hashSet) => {
    if (!node) return;
    
    hashSet.add(node.hash);
    
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => collectVisitedHashesRef.current(child, hashSet));
    }
  }, []);
  
  // Assign the callback to the ref
  collectVisitedHashesRef.current = collectVisitedHashes;

  const fetchTransactionChain = useCallback(async () => {
    if (!txHash) return;
    
    setLoading(true);
    setError('');
    setSuspiciousPatterns([]);
    
    try {
      // Start the recursive chain fetching from the root transaction
      const chainData = await fetchTransactionData(txHash, 0, depth, new Set());
      
      if (chainData) {
        setChain(chainData);
        
        // Find and analyze suspicious patterns
        const patterns = detectSuspiciousPatterns(chainData);
        setSuspiciousPatterns(patterns);
        
        // Track all visited transaction hashes
        const allVisitedHashes = new Set();
        collectVisitedHashesRef.current(chainData, allVisitedHashes);
        setVisitedHashes(allVisitedHashes);
      } else {
        throw new Error('Failed to fetch transaction chain');
      }
    } catch (err) {
      console.error('API error fetching transaction chain:', err.message);
      setError(`Failed to trace transaction chain: ${err.message}. Please try again later.`);
      setChain(null);
      setTransactionData(null);
    } finally {
      setLoading(false);
    }
  }, [txHash, depth, fetchTransactionData, detectSuspiciousPatterns]);

  // Function to detect suspicious patterns in the transaction chain
  const detectSuspiciousPatterns = (chainData) => {
    const patterns = [];
    const txHashes = new Set();
    
    // Helper function to traverse the chain and detect patterns
    const traverse = (node, path = [], depth = 0) => {
      if (!node) return;
      
      // Check for loops (transaction appears more than once in the chain)
      if (txHashes.has(node.hash)) {
        patterns.push({
          type: 'loop',
          hash: node.hash,
          message: 'Transaction loop detected',
          severity: 'high'
        });
      }
      
      txHashes.add(node.hash);
      
      // Check for potential mixing behavior (many inputs and outputs)
      if (node.inputs > 5 && node.outputs > 5) {
        patterns.push({
          type: 'mixer',
          hash: node.hash,
          message: `Potential mixer (${node.inputs} inputs, ${node.outputs} outputs)`,
          severity: 'medium'
        });
      }
      
      // Check for transaction with high fees (potential fee manipulation)
      if (node.fee > 100000) { // 0.001 BTC
        patterns.push({
          type: 'high_fee',
          hash: node.hash,
          message: `Unusually high fee: ${(node.fee / 1e8).toFixed(8)} BTC`,
          severity: 'low'
        });
      }
      
      // Recursively check children
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          traverse(child, [...path, node.hash], depth + 1);
        });
      }
    };
    
    // Start traversal from root
    traverse(chainData);
    
    return patterns;
  };

  useEffect(() => {
    if (txHash) {
      fetchTransactionChain();
    }
  }, [txHash, depth, traceMode, fetchTransactionChain]);

  const renderTransaction = (tx, level = 0, isLastChild = true) => {
    if (!tx) return null;
    
    // Create unique ID for each transaction node
    const nodeId = `tx-${tx.hash}-${level}`;
    
    return (
      <div key={nodeId} className="tx-chain-item">
        <div className={`tx-chain-connector ${isLastChild ? 'last-child' : ''} ${level > 0 ? 'with-line' : ''}`}>
          {level > 0 && <div className="connector-dot"></div>}
        </div>
        
        <div className={`tx-card ${tx.visited ? 'tx-visited' : ''} ${tx.loopDetected ? 'tx-loop' : ''}`}>
          <div className="tx-header">
            <div className="tx-hash">
              <a href={`/tx/${tx.hash}`} className="tx-hash-link" target="_blank" rel="noopener noreferrer" title="View transaction details">
                {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
              </a>
              {tx.loopDetected && <span className="loop-badge" title="Loop detected">⭮</span>}
              {tx.visited && <span className="visited-badge" title="Already visited">↻</span>}
            </div>
            <div className="tx-info">
              {tx.block && (
                <div className="tx-block" title={`Block #${tx.block}`}>
                  <i className="fas fa-cube me-1"></i>
                  {tx.block}
                </div>
              )}
              {tx.confirmations > 0 && (
                <div className="tx-confirmations" title={`${tx.confirmations} confirmations`}>
                  <i className="fas fa-check-circle ms-2 me-1"></i>
                  {tx.confirmations}
                </div>
              )}
            </div>
          </div>
          
          <div className="tx-body">
            <div className="tx-details">
              <div className="tx-amount" title="Transaction amount">
                <i className="fas fa-coins me-1"></i>
                {(tx.total / 1e8).toFixed(8)} BTC
              </div>
              <div className="tx-time" title={tx.time ? new Date(tx.time).toLocaleString() : 'Unknown time'}>
                <i className="far fa-clock me-1"></i>
                {tx.time ? new Date(tx.time).toLocaleString() : 'Unknown'}
              </div>
            </div>
            
            {tx.loopDetected && (
              <div className="tx-loop-warning">
                <i className="fas fa-exclamation-triangle me-1"></i>
                Loop detected in transaction chain
              </div>
            )}
            
            {tx.children && tx.children.length > 0 && (
              <div className="tx-children">
                {tx.children.map((child, index) => 
                  renderTransaction(child, level + 1, index === tx.children.length - 1)
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSuspiciousPatterns = () => {
    if (suspiciousPatterns.length === 0) return null;
    
    return (
      <div className="suspicious-patterns mt-3">
        <div className="alert alert-warning">
          <h6 className="mb-2">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Suspicious Patterns Detected
          </h6>
          <ul className="list-unstyled mb-0">
            {suspiciousPatterns.map((pattern, idx) => (
              <li key={idx} className={`pattern-item severity-${pattern.severity}`}>
                <strong>{pattern.type}:</strong> {pattern.message} 
                <a 
                  href={`https://www.blockchain.com/explorer/transactions/btc/${pattern.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ms-2 small"
                >
                  <i className="fas fa-external-link-alt"></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="tx-chain-container">
        <div className="tx-chain-loading">
          <div className="loading-spinner"></div>
          <p>Tracing transaction chain...</p>
        </div>
      </div>
    );
  }

  if (error && !chain) {
    return (
      <div className="tx-chain-container">
        <div className="tx-chain-error">
          <p>Error: {error}</p>
          <button className="btn btn-accent" onClick={fetchTransactionChain}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Create the chain data object to pass to the report component
  const chainExportData = {
    visitedHashes,
    depth,
    traceMode,
    suspiciousPatterns
  };

  return (
    <div className="tx-chain-container">
      {error && (
        <div className="alert alert-warning mb-3">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}
      
      <div className="tx-chain-controls">
        <div className="depth-control">
          <label htmlFor="depth-slider">Trace Depth: {depth}</label>
          <input
            type="range"
            id="depth-slider"
            min="1"
            max="3"
            value={depth}
            onChange={(e) => setDepth(parseInt(e.target.value))}
            className="form-range"
          />
          <small className="text-muted d-block mt-1">
            Higher depth values may be limited by API restrictions
          </small>
        </div>
        
        <div className="trace-mode-control d-flex align-items-center">
          <label className="me-2">Trace Direction:</label>
          <div className="btn-group">
            <button 
              className={`btn btn-sm ${traceMode === 'outputs' ? 'btn-accent' : 'btn-outline-secondary'}`}
              onClick={() => setTraceMode('outputs')}
            >
              Forward (Outputs)
            </button>
            <button 
              className={`btn btn-sm ${traceMode === 'inputs' ? 'btn-accent' : 'btn-outline-secondary'}`}
              onClick={() => setTraceMode('inputs')}
            >
              Backward (Inputs)
            </button>
          </div>
        </div>
        
        <div className="view-mode-control d-flex align-items-center">
          <label className="me-2">View Mode:</label>
          <div className="btn-group">
            <button 
              className={`btn btn-sm ${viewMode === 'tree' ? 'btn-accent' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('tree')}
            >
              Tree View
            </button>
            <button 
              className={`btn btn-sm ${viewMode === 'graph' ? 'btn-accent' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('graph')}
            >
              Graph View
            </button>
          </div>
        </div>
        
        <button className="btn btn-accent" onClick={fetchTransactionChain}>
          Refresh
        </button>
      </div>
      
      {suspiciousPatterns.length > 0 && renderSuspiciousPatterns()}
      
      <div className="tx-chain-stats mb-3">
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-label">Total Transactions:</span>
            <span className="stat-value">{visitedHashes.size}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Trace Mode:</span>
            <span className="stat-value">{traceMode === 'outputs' ? 'Follow Outputs' : 'Follow Inputs'}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Max Depth:</span>
            <span className="stat-value">{depth}</span>
          </div>
        </div>
      </div>

      {transactionData && (
        <TransactionReport 
          transaction={transactionData} 
          chainData={chainExportData} 
        />
      )}
      
      {viewMode === 'tree' ? (
        <div className="tx-chain-visualization">
          {chain ? (
            renderTransaction(chain)
          ) : (
            <div className="tx-chain-placeholder">
              <p>No transaction chain data available</p>
            </div>
          )}
        </div>
      ) : (
        <div className="tx-chain-graph">
          {chain ? (
            <TransactionGraph transactionData={chain} />
          ) : (
            <div className="tx-chain-placeholder">
              <p>No transaction chain data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionChain; 