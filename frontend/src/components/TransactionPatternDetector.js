import React, { useState, useEffect, useCallback } from 'react';
import './TransactionPatternDetector.css';
import EnhancedWalletRules from './EnhancedWalletRules';
import { FaExclamationTriangle, FaInfoCircle, FaExclamationCircle, FaSyncAlt, FaRandom, FaLayerGroup, FaHandHoldingUsd, FaShieldAlt, FaHourglass, FaMoneyBillWave, FaFilter, FaExpand, FaCompress, FaChartLine, FaClock, FaCoins } from 'react-icons/fa';

const TransactionPatternDetector = ({ transaction, inputs, outputs, onPatternDataChange }) => {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detectedPatterns, setDetectedPatterns] = useState([]);
  const [transactionChain, setTransactionChain] = useState(null);
  const [analysisDepth, setAnalysisDepth] = useState(3);
  const [riskScore, setRiskScore] = useState(0);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [expandedView, setExpandedView] = useState(false);
  const [patternTimeline, setPatternTimeline] = useState([]);
  const maxDepth = 3; // Define maxDepth as a constant
  
  // Initialize enhanced wallet rules
  const enhancedRules = EnhancedWalletRules();
  
  // Update API key fallback and remove it from the API calls
  const API_KEY = process.env.REACT_APP_BLOCKCHAIN_API_KEY || '';

  // Build a transaction chain by recursively following inputs and outputs
  const buildTransactionChain = useCallback(async (txHash, depth = 0, visitedAddresses = new Set(), visitedTransactions = new Set(), addressChains = new Map(), parentAddress = null) => {
    if (depth >= maxDepth) {
      return { txHash, children: [], depth, status: 'max-depth' };
    }
    
    try {
      // Fetch transaction data
      const response = await fetch(`https://blockchain.info/rawtx/${txHash}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction: ${txHash}`);
      }
      
      const txData = await response.json();
      
      // Create the transaction node
      const txNode = {
        txHash,
        data: txData,
        children: [],
        depth,
        status: 'loaded',
        timestamp: txData.time
      };
      
      // Track which addresses received funds from this transaction
      const outputAddresses = [];
      
      // Process outputs
      if (txData.out && Array.isArray(txData.out)) {
        txData.out.forEach(output => {
          if (output.addr) {
            outputAddresses.push({
              address: output.addr,
              value: output.value
            });
            
            // Track the receiving address in our chains
            if (!addressChains.has(output.addr)) {
              addressChains.set(output.addr, []);
            }
            
            // Add this transaction to the address's chain
            addressChains.get(output.addr).push({
              txHash,
              direction: 'received',
              value: output.value,
              time: txData.time
            });
            
            // If this is an address we've seen before, we may have a loop
            if (visitedAddresses.has(output.addr)) {
              txNode.hasLoop = true;
            }
            
            visitedAddresses.add(output.addr);
          }
        });
      }
      
      // Only continue recursion if we're not at max depth
      if (depth < maxDepth - 1) {
        // For each output address, check for further transactions
        for (const outputAddr of outputAddresses) {
          try {
            // Fetch next transactions for this address
            const addrResponse = await fetch(`https://blockchain.info/rawaddr/${outputAddr.address}?limit=10`); // Increased limit to catch more patterns
            
            if (!addrResponse.ok) {
              continue;
            }
            
            const addrData = await addrResponse.json();
            
            // Find transactions where this address is an input (i.e., it's spending the received funds)
            // but only transactions that happened AFTER the current transaction
            const nextTxs = addrData.txs.filter(tx => 
              tx.time > txData.time && 
              tx.hash !== txHash && 
              !visitedTransactions.has(tx.hash) &&
              tx.inputs.some(input => input.prev_out && input.prev_out.addr === outputAddr.address)
            );
            
            // Sort by time (most recent first) to find quick succession patterns
            nextTxs.sort((a, b) => b.time - a.time);
            
            // Limit to just a few transactions to avoid explosion
            const limitedNextTxs = nextTxs.slice(0, 3); // Increased from 2 to 3
            
            // Recursively process each next transaction
            for (const nextTx of limitedNextTxs) {
              visitedTransactions.add(nextTx.hash);
              
              if (parentAddress) {
                // Add this transaction to the parent address's chain (for detecting loops)
                if (!addressChains.has(parentAddress)) {
                  addressChains.set(parentAddress, []);
                }
                
                addressChains.get(parentAddress).push({
                  txHash: nextTx.hash,
                  direction: 'sent',
                  value: nextTx.inputs.find(input => input.prev_out && input.prev_out.addr === parentAddress)?.prev_out.value || 0,
                  time: nextTx.time
                });
              }
              
              const childNode = await buildTransactionChain(
                nextTx.hash, 
                depth + 1, 
                visitedAddresses, 
                visitedTransactions, 
                addressChains,
                outputAddr.address
              );
              
              txNode.children.push(childNode);
              
              // If a child has a loop, propagate that up
              if (childNode.hasLoop) {
                txNode.hasLoop = true;
              }
            }
          } catch (addrErr) {
            console.error(`Error fetching address data for ${outputAddr.address}:`, addrErr);
          }
        }
      }
      
      return txNode;
    } catch (err) {
      console.error(`Error fetching transaction ${txHash}:`, err);
      return { txHash, status: 'error', depth, children: [] };
    }
  }, [maxDepth]);

  // Define analyzeTransaction using useCallback
  const analyzeTransaction = useCallback(() => {
    if (!transaction) {
      setError('No transaction data provided for pattern detection');
      setLoading(false);
      return;
    }
    
    // Check if we have inputs and outputs
    if (!inputs || !inputs.length || !outputs || !outputs.length) {
      setPatterns([]);
      setLoading(false);
      return;
    }
    
    // Simple pattern detection based on inputs/outputs
    const detectedPatterns = [];
    
    // *** ENHANCED WALLET RULES EVALUATION ***
    // Create mock wallet data for rule evaluation
    const mockWallet = {
      address: inputs[0]?.prev_out?.addr || 'unknown',
      transactionHistory: [transaction], // Current transaction
      monthlyStats: {
        averageDaily: 0.1, // Mock average for demonstration
        lastCalculated: new Date().toISOString()
      }
    };
    
    // Evaluate enhanced wallet rules
    const triggeredRules = enhancedRules.evaluateWalletRules(mockWallet, transaction);
    
    // Add triggered rules to detected patterns
    triggeredRules.forEach(rule => {
      let icon = <FaInfoCircle />;
      let description = '';
      
      if (rule.rule === 'monthly_average_exceeded') {
        icon = <FaChartLine />;
        description = `Transaction (${rule.details.transactionValue.toFixed(2)} BTC) exceeds monthly average threshold (${rule.details.threshold.toFixed(2)} BTC)`;
      } else if (rule.rule === 'fast_succession_transactions') {
        icon = <FaClock />;
        description = `${rule.details.transactionCount} transactions detected within ${rule.details.timeWindowHours} hours (threshold: ${rule.details.threshold})`;
      } else if (rule.rule === 'lump_sum_transaction') {
        icon = <FaCoins />;
        description = `Large transaction amount: ${rule.details.transactionValue.toFixed(2)} BTC (threshold: ${rule.details.threshold} BTC)`;
      }
      
      detectedPatterns.push({
        type: rule.rule,
        severity: rule.severity,
        description: description,
        icon: icon,
        details: rule.details
      });
    });
    
    // Check for round number outputs (potential structuring)
    const roundNumberOutputs = outputs.filter(output => {
      const value = output.value || 0;
      // Check for common round BTC values (0.1, 0.5, 1.0, etc)
      return value % 10000000 === 0 || // 0.1 BTC increments
             value % 50000000 === 0 || // 0.5 BTC increments
             value % 100000000 === 0;  // 1.0 BTC increments
    });
    
    if (roundNumberOutputs.length > 0) {
      detectedPatterns.push({
        type: 'round_number',
        severity: 'medium',
        description: `${roundNumberOutputs.length} outputs with round BTC values`,
        icon: <FaInfoCircle />
      });
    }
    
    // Check for unusually high fees
    if (transaction.fee && transaction.size) {
      const feeRate = transaction.fee / transaction.size;
      if (feeRate > 150) { // Very high fee
        detectedPatterns.push({
          type: 'high_fee',
          severity: 'high',
          description: `Extremely high fee rate: ${feeRate.toFixed(2)} sat/byte`,
          icon: <FaExclamationTriangle />
        });
      } else if (feeRate > 100) { // More than 100 sat/byte is quite high
        detectedPatterns.push({
          type: 'high_fee',
          severity: 'medium',
          description: `Unusually high fee rate: ${feeRate.toFixed(2)} sat/byte`,
          icon: <FaExclamationCircle />
        });
      }
    }
    
    // Check for multiple small inputs (potential dust collection)
    const smallInputsThreshold = 10000; // 0.0001 BTC
    const smallInputs = inputs.filter(input => input.prev_out && input.prev_out.value < smallInputsThreshold);
    
    if (smallInputs.length >= 5) {
      detectedPatterns.push({
        type: 'dust_collection',
        severity: smallInputs.length >= 10 ? 'medium' : 'low',
        description: `${smallInputs.length} very small inputs combined (dust collection)`,
        icon: <FaInfoCircle />
      });
    }
    
    // Check for potential peeling chain pattern
    if (outputs.length === 2) {
      const sortedOutputs = [...outputs].sort((a, b) => b.value - a.value);
      if (sortedOutputs[0].value > sortedOutputs[1].value * 5) {
        detectedPatterns.push({
          type: 'peeling',
          severity: 'medium',
          description: 'Potential peeling chain pattern detected',
          icon: <FaExclamationCircle />
        });
      }
    }
    
    // Set the detected patterns
    setPatterns(detectedPatterns);
    setLoading(false);
  }, [transaction, inputs, outputs]);

  // Effect hook to analyze the transaction when it changes
  useEffect(() => {
    if (!transaction || !inputs || !outputs) {
      setLoading(false);
      return;
    }

    analyzeTransaction();
  }, [transaction, inputs, outputs, analyzeTransaction]);

  useEffect(() => {
    if (!transaction) {
      setError('No transaction data provided for pattern detection');
      setLoading(false);
      return;
    }
    
    const detectSuspiciousPatterns = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Use the buildTransactionChain with proper parameters
        const addressChains = new Map();
        const chain = await buildTransactionChain(
          transaction.hash || transaction.txid, 
          0, 
          new Set(), 
          new Set([transaction.hash || transaction.txid]), 
          addressChains
        );
        
        setTransactionChain(chain);
        
        // Apply detection algorithms to the chain
        const patterns = [];
        
        if (chain && chain.data) {
          // Check for loops in the transaction chain
          const loops = detectLoops(addressChains);
          if (loops.length > 0) {
            patterns.push({
              type: 'loop',
              severity: 'high',
              description: `${loops.length} circular transaction pattern(s) detected`,
              icon: <FaSyncAlt />
            });
          }
          
          // Check for mixer-like patterns
          const mixers = detectMixers(chain);
          if (mixers.length > 0) {
            patterns.push({
              type: 'mixer',
              severity: 'high',
              description: `Potential mixing pattern with ${mixers.length} similar outputs`,
              icon: <FaRandom />
            });
          }
          
          // Check for peeling chains
          const peelingChains = detectPeelingChains(chain);
          if (peelingChains.length > 0) {
            patterns.push({
              type: 'peeling_chain',
              severity: 'medium',
              description: `${peelingChains.length} potential peeling chain(s) detected`,
              icon: <FaLayerGroup />
            });
          }
          
          // Check for fast successive transactions
          const fastTransactions = detectFastSuccessions(chain);
          if (fastTransactions.length > 0) {
            patterns.push({
              type: 'fast_succession',
              severity: 'medium',
              description: `${fastTransactions.length} transactions in quick succession (<10 min)`,
              icon: <FaHourglass />
            });
          }
          
          // Check for time-based anomalies (after hours transactions)
          const timeAnomalies = detectTimeAnomalies(chain);
          if (timeAnomalies) {
            patterns.push({
              type: 'time_anomaly',
              severity: 'low',
              description: timeAnomalies,
              icon: <FaHourglass />
            });
          }
          
          // Check for layering and structuring patterns
          const layeringPatterns = detectLayering(chain, addressChains);
          if (layeringPatterns.length > 0) {
            patterns.push({
              type: 'layering',
              severity: 'high',
              description: `Complex layering pattern involving ${layeringPatterns.length} transaction stages`,
              icon: <FaMoneyBillWave />
            });
          }
        }
        
        setDetectedPatterns([...patterns]);
      } catch (error) {
        console.error('Error detecting transaction patterns:', error);
        setError('Failed to analyze transaction patterns: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    detectSuspiciousPatterns();
  }, [transaction, buildTransactionChain, maxDepth]);

  // Detect loops in transaction chains
  const detectLoops = (addressChains) => {
    const loops = [];
    
    // Check each address chain for loops
    addressChains.forEach((transactions, address) => {
      // Group by transaction
      const txMap = new Map();
      
      transactions.forEach(tx => {
        if (!txMap.has(tx.txHash)) {
          txMap.set(tx.txHash, []);
        }
        txMap.get(tx.txHash).push(tx);
      });
      
      // Check if any transaction appears more than once with different directions
      txMap.forEach((txs, txHash) => {
        const sentTxs = txs.filter(tx => tx.direction === 'sent');
        const receivedTxs = txs.filter(tx => tx.direction === 'received');
        
        if (sentTxs.length > 0 && receivedTxs.length > 0) {
          loops.push({
            address,
            txHash,
            sentTxs,
            receivedTxs
          });
        }
      });
      
      // Also check for multi-hop loops (A->B->C->A)
      if (transactions.length >= 3) {
        // Sort by time
        const sortedTxs = [...transactions].sort((a, b) => a.time - b.time);
        
        // Check if the same address reappears as receiver after being a sender
        const senders = new Set();
        const receivers = new Set();
        
        for (const tx of sortedTxs) {
          if (tx.direction === 'sent') {
            senders.add(tx.txHash);
          } else if (tx.direction === 'received' && senders.size > 0) {
            receivers.add(tx.txHash);
            
            // If we find an address that receives after sending, it could be a loop
            if (senders.size > 0 && receivers.size > 0) {
              // This is a simplification; a true loop detector would trace the actual path
              loops.push({
                address,
                txHash: tx.txHash,
                isMultiHop: true,
                sentTxs: sortedTxs.filter(t => t.direction === 'sent'),
                receivedTxs: sortedTxs.filter(t => t.direction === 'received')
              });
              break;
            }
          }
        }
      }
    });
    
    return loops;
  };

  // Detect potential mixing patterns
  const detectMixers = (txChain) => {
    if (!txChain || !txChain.data) return [];
    
    const mixers = [];
    
    // For a mixer, we usually look for:
    // 1. Multiple inputs
    // 2. Multiple outputs
    // 3. Outputs with similar values (potential "standard denominations")
    
    const tx = txChain.data;
    
    if (tx.inputs && tx.inputs.length > 3 && tx.out && tx.out.length > 3) {
      // Group outputs by value to find similar amounts
      const valueGroups = {};
      
      tx.out.forEach(output => {
        // Round to nearest 0.01 BTC to detect similar values
        const roundedValue = Math.round(output.value / 1000000) * 1000000;
        if (!valueGroups[roundedValue]) {
          valueGroups[roundedValue] = [];
        }
        valueGroups[roundedValue].push(output);
      });
      
      // Check if there are groups of similar-valued outputs
      Object.entries(valueGroups).forEach(([value, outputs]) => {
        if (outputs.length >= 3) {
          mixers.push({
            value: parseInt(value) / 100000000, // Convert to BTC
            count: outputs.length,
            outputs
          });
        }
      });
      
      // Additional check: if more than 50% of outputs have the same or similar value
      if (tx.out.length >= 5) {
        const valueFrequency = {};
        tx.out.forEach(output => {
          const roundedValue = Math.round(output.value / 1000000) * 1000000;
          valueFrequency[roundedValue] = (valueFrequency[roundedValue] || 0) + 1;
        });
        
        const mostCommonValue = Object.entries(valueFrequency)
          .sort((a, b) => b[1] - a[1])[0];
        
        if (mostCommonValue[1] >= tx.out.length * 0.5) {
          // At least 50% of outputs have the same value
          if (!mixers.some(m => m.value === parseInt(mostCommonValue[0]) / 100000000)) {
            mixers.push({
              value: parseInt(mostCommonValue[0]) / 100000000,
              count: mostCommonValue[1],
              outputs: tx.out.filter(o => Math.round(o.value / 1000000) * 1000000 === parseInt(mostCommonValue[0]))
            });
          }
        }
      }
    }
    
    return mixers;
  };

  // Detect peeling chain patterns
  const detectPeelingChains = (txChain) => {
    if (!txChain) return [];
    
    const peelingChains = [];
    const MIN_CHAIN_LENGTH = 3;
    
    // A peeling chain typically has:
    // 1. A large input
    // 2. A small output (the "peel")
    // 3. A large change output that becomes the input to the next transaction
    // This pattern repeats multiple times
    
    const findPeelingChain = (node, chain = []) => {
      if (!node.data || !node.data.out || node.data.out.length < 2) {
        return;
      }
      
      // Sort outputs by value
      const sortedOutputs = [...node.data.out].sort((a, b) => b.value - a.value);
      
      // Check if this has the peeling pattern: one large output and one or more smaller ones
      if (sortedOutputs.length >= 2 && 
          sortedOutputs[0].value > sortedOutputs[1].value * 2) {
        
        // Add this transaction to the chain
        chain.push({
          txHash: node.txHash,
          largeOutput: sortedOutputs[0].value / 100000000, // Convert to BTC
          smallOutputs: sortedOutputs.slice(1).map(o => o.value / 100000000)
        });
        
        // Recursively check children
        node.children.forEach(child => {
          findPeelingChain(child, [...chain]);
        });
        
        // If we have a chain of sufficient length, add it to our results
        if (chain.length >= MIN_CHAIN_LENGTH) {
          peelingChains.push([...chain]);
        }
      } else {
        // Continue checking children
        node.children.forEach(child => {
          findPeelingChain(child, []);
        });
      }
    };
    
    findPeelingChain(txChain);
    
    return peelingChains;
  };
  
  // Detect if transactions occur in fast succession (< 10 minutes apart)
  const detectFastSuccessions = (txChain) => {
    if (!txChain || !txChain.children) return [];
    
    const fastTransactions = [];
    const TEN_MINUTES = 600; // 10 minutes in seconds
    
    const checkFastTransactions = (node, parentTimestamp) => {
      if (!node.data || !node.timestamp) return;
      
      if (parentTimestamp && (node.timestamp - parentTimestamp < TEN_MINUTES)) {
        fastTransactions.push({
          txHash: node.txHash,
          timeDifference: node.timestamp - parentTimestamp,
          timestamp: node.timestamp
        });
      }
      
      // Recursively check children
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          checkFastTransactions(child, node.timestamp);
        });
      }
    };
    
    if (txChain.children && txChain.children.length > 0) {
      txChain.children.forEach(child => {
        checkFastTransactions(child, txChain.timestamp);
      });
    }
    
    return fastTransactions;
  };
  
  // Detect unusual transaction times (night-time transactions, etc.)
  const detectTimeAnomalies = (txChain) => {
    if (!txChain || !txChain.data || !txChain.data.time) return null;
    
    const timestamp = txChain.data.time;
    const txDate = new Date(timestamp * 1000);
    const txHour = txDate.getHours();
    
    // Check for night-time transactions (midnight to 5 AM)
    if (txHour >= 0 && txHour < 5) {
      return `Transaction occurred during unusual hours (${txHour}:${txDate.getMinutes().toString().padStart(2, '0')} AM)`;
    }
    
    return null;
  };
  
  // Detect layering patterns (complex multi-stage transactions)
  const detectLayering = (txChain, addressChains) => {
    const layeringPatterns = [];
    
    // Look for transactions that:
    // 1. Split into multiple addresses, then
    // 2. Those addresses send to the same destination
    
    // Find addresses that receive from multiple source addresses
    const potentialMergeAddresses = new Set();
    
    addressChains.forEach((transactions, address) => {
      // Find addresses that receive from multiple transactions
      const receivedTxs = transactions.filter(tx => tx.direction === 'received');
      
      if (receivedTxs.length >= 2) {
        // This address has received from multiple transactions
        const uniqueSources = new Set(receivedTxs.map(tx => tx.txHash));
        
        if (uniqueSources.size >= 2) {
          potentialMergeAddresses.add(address);
        }
      }
    });
    
    // Now check if any transactions in the chain lead to these merge addresses
    const findLayeringPatterns = (node, path = [], seenAddresses = new Set()) => {
      if (!node.data || !node.data.out) return;
      
      // Check if any outputs go to merge addresses
      const outputsToMergeAddresses = node.data.out.filter(out => 
        out.addr && potentialMergeAddresses.has(out.addr)
      );
      
      if (outputsToMergeAddresses.length > 0) {
        // This transaction is part of a layering pattern
        layeringPatterns.push({
          startTx: node.txHash,
          mergeAddresses: outputsToMergeAddresses.map(out => out.addr),
          pathLength: path.length + 1
        });
      }
      
      // Add current transaction to path
      path.push(node.txHash);
      
      // Track addresses seen in this path
      node.data.out.forEach(out => {
        if (out.addr) {
          seenAddresses.add(out.addr);
        }
      });
      
      // Recursively check children
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          findLayeringPatterns(child, [...path], new Set(seenAddresses));
        });
      }
    };
    
    findLayeringPatterns(txChain);
    
    return layeringPatterns;
  };

  // Calculate risk score based on detected patterns
  const calculateRiskScore = useCallback((patterns) => {
    const weights = {
      critical: 40, // Enhanced rules critical severity
      high: 30,
      medium: 15,
      low: 5
    };
    
    let score = 0;
    patterns.forEach(pattern => {
      score += weights[pattern.severity] || 0;
    });
    
    // Normalize to 0-100 scale
    return Math.min(100, score);
  }, []);

  // Filter patterns by severity
  const filterPatterns = (patterns, severity) => {
    if (severity === 'all') return patterns;
    return patterns.filter(p => p.severity === severity);
  };

  // Combine basic and advanced patterns, with deduplication
  const allPatterns = [...patterns];
  detectedPatterns.forEach(advPattern => {
    if (!allPatterns.some(p => p.type === advPattern.type)) {
      allPatterns.push(advPattern);
    }
  });
  
  // Apply filter
  const filteredPatterns = filterPatterns(allPatterns, filterSeverity);
  
  // Update risk score when patterns change
  useEffect(() => {
    const newRiskScore = calculateRiskScore(allPatterns);
    setRiskScore(newRiskScore);
    
    // Send pattern data to parent component
    if (onPatternDataChange) {
      onPatternDataChange({
        transaction: transaction?.hash || transaction?.txid,
        timestamp: new Date().toISOString(),
        riskScore: newRiskScore,
        patterns: allPatterns.map(p => ({
          type: p.type,
          severity: p.severity,
          description: p.description
        }))
      });
    }
  }, [allPatterns, calculateRiskScore, onPatternDataChange, transaction]);

  // Get risk level based on score
  const getRiskLevel = (score) => {
    if (score >= 70) return { level: 'Critical', color: '#e74c3c', icon: '🔴' };
    if (score >= 50) return { level: 'High', color: '#f39c12', icon: '🟠' };
    if (score >= 30) return { level: 'Medium', color: '#f1c40f', icon: '🟡' };
    if (score >= 10) return { level: 'Low', color: '#3498db', icon: '🔵' };
    return { level: 'Minimal', color: '#2ecc71', icon: '🟢' };
  };

  const riskLevel = getRiskLevel(riskScore);

  // Get CSS class based on severity
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'critical':
        return 'pattern-critical';
      case 'high':
        return 'pattern-high';
      case 'medium':
        return 'pattern-medium';
      case 'low':
        return 'pattern-low';
      default:
        return '';
    }
  };

  // Get icon based on pattern type
  const getPatternIcon = (type) => {
    switch (type) {
      case 'loop':
        return <FaSyncAlt />;
      case 'mixer':
        return <FaRandom />;
      case 'peeling':
      case 'peeling_chain':
        return <FaLayerGroup />;
      case 'high_fee':
        return <FaHandHoldingUsd />;
      case 'fast_succession':
      case 'time_anomaly':
        return <FaHourglass />;
      case 'layering':
        return <FaMoneyBillWave />;
      // Enhanced wallet rules icons
      case 'monthly_average_exceeded':
        return <FaChartLine />;
      case 'fast_succession_transactions':
        return <FaClock />;
      case 'lump_sum_transaction':
        return <FaCoins />;
      default:
        return <FaExclamationTriangle />;
    }
  };

  if (loading) {
    return (
      <div className="pattern-detector">
        <div className="pattern-header">
          <FaShieldAlt className="mr-2" /> Suspicious Pattern Detection
        </div>
        <div className="pattern-loading">
          <div className="spinner"></div>
          <p>Analyzing transaction patterns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pattern-detector">
        <div className="pattern-header">
          <FaShieldAlt className="mr-2" /> Suspicious Pattern Detection
        </div>
        <div className="pattern-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`pattern-detector ${expandedView ? 'expanded' : ''}`}>
      <div className="pattern-header">
        <div className="header-left">
          <FaShieldAlt className="mr-2" /> Suspicious Pattern Detection
        </div>
        <div className="header-right">
          <button 
            className="control-btn" 
            onClick={() => setExpandedView(!expandedView)}
            title={expandedView ? 'Collapse' : 'Expand'}
          >
            {expandedView ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>
      
      {/* Risk Score Dashboard */}
      <div className="risk-dashboard">
        <div className="risk-score-container">
          <div className="risk-score-circle" style={{ borderColor: riskLevel.color }}>
            <div className="risk-score-value" style={{ color: riskLevel.color }}>
              {riskScore}
            </div>
            <div className="risk-score-label">Risk Score</div>
          </div>
          <div className="risk-details">
            <div className="risk-level" style={{ color: riskLevel.color }}>
              {riskLevel.icon} {riskLevel.level} Risk
            </div>
            <div className="risk-stats">
              <div className="stat-item">
                <span className="stat-label">Patterns Detected:</span>
                <span className="stat-value">{allPatterns.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">High Severity:</span>
                <span className="stat-value severity-high">
                  {allPatterns.filter(p => p.severity === 'high').length}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Analysis Depth:</span>
                <span className="stat-value">{maxDepth} levels</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="pattern-filters">
        <div className="filter-label">
          <FaFilter /> Filter by Severity:
        </div>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterSeverity === 'all' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('all')}
          >
            All ({allPatterns.length})
          </button>
          <button 
            className={`filter-btn ${filterSeverity === 'critical' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('critical')}
          >
            Critical ({allPatterns.filter(p => p.severity === 'critical').length})
          </button>
          <button 
            className={`filter-btn ${filterSeverity === 'high' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('high')}
          >
            High ({allPatterns.filter(p => p.severity === 'high').length})
          </button>
          <button 
            className={`filter-btn ${filterSeverity === 'medium' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('medium')}
          >
            Medium ({allPatterns.filter(p => p.severity === 'medium').length})
          </button>
          <button 
            className={`filter-btn ${filterSeverity === 'low' ? 'active' : ''}`}
            onClick={() => setFilterSeverity('low')}
          >
            Low ({allPatterns.filter(p => p.severity === 'low').length})
          </button>
        </div>
      </div>
      
      <div className="pattern-content">
        {filteredPatterns.length > 0 ? (
          <div className="patterns-list">
            {filteredPatterns.map((pattern, index) => (
              <div 
                key={`pattern-${index}`} 
                className={`pattern-item ${getSeverityClass(pattern.severity)}`}
              >
                <div className="pattern-icon">
                  {getPatternIcon(pattern.type)}
                </div>
                <div className="pattern-info">
                  <div className="pattern-description">{pattern.description}</div>
                  <div className="pattern-severity">
                    Severity: <span className={`severity-${pattern.severity}`}>{pattern.severity.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-patterns">
            {filterSeverity === 'all' ? (
              <>
                <p>No suspicious patterns detected in this transaction.</p>
                <p className="pattern-note">Note: Analysis depth is limited to {maxDepth} transaction levels.</p>
              </>
            ) : (
              <p>No patterns found with {filterSeverity} severity. Try adjusting the filter.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPatternDetector; 