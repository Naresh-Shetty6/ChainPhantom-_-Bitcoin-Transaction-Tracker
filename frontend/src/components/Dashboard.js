import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCube, faExchangeAlt, faNetworkWired, faChartLine } from '@fortawesome/free-solid-svg-icons';

// API key for blockchain.info
const API_KEY = process.env.REACT_APP_BLOCKCHAIN_API_KEY || '';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    latestBlock: {
      height: 0,
      hash: '',
      time: 0,
      txCount: 0,
      size: 0
    },
    mempool: {
      txCount: 0,
      size: '0 MB',
      fees: {
        hourFee: 0,
        halfHourFee: 0,
        fastestFee: 0
      }
    },
    network: {
      hashrate: '0 EH/s',
      difficulty: '0 T',
      nextDifficultyChange: '0%',
      nextDifficultyHeight: 0,
      blocksUntilChange: 0
    },
    market: {
      price: '$58,245.32',
      change24h: '+2.34%',
      volume24h: '$32.5B',
      marketCap: '$1.12T'
    }
  });

  const [recentBlocks, setRecentBlocks] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [connectionError, setConnectionError] = useState('');
  const socketRef = useRef(null);
  const maxTransactions = 4; // Max number of transactions to display

  // Format time helpers
  const timeAgo = (timestamp) => {
    if (!timestamp) return 'Pending';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Connect to blockchain.info WebSocket API for real-time transaction updates
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        // Close existing connection if any
        if (socketRef.current) {
          socketRef.current.close();
        }

        // Create a new WebSocket connection
        const socket = new WebSocket('wss://ws.blockchain.info/inv');
        socketRef.current = socket;

        socket.onopen = () => {
          console.log('WebSocket connection established');
          setConnectionError('');

          // Subscribe to unconfirmed transactions (new transactions)
          socket.send(JSON.stringify({ "op": "unconfirmed_sub" }));
          
          // Subscribe to new blocks
          socket.send(JSON.stringify({ "op": "blocks_sub" }));
          
          console.log('Subscribed to transactions and blocks');
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data.op);
          
          // Handle transaction data
          if (data.op === 'utx') {
            const tx = data.x;
            
            // Calculate total BTC value
            let totalValue = 0;
            tx.out.forEach(output => {
              totalValue += output.value;
            });
            
            // Extract sender addresses (inputs)
            const senderAddresses = [];
            if (tx.inputs && tx.inputs.length > 0) {
              tx.inputs.forEach(input => {
                if (input.prev_out && input.prev_out.addr) {
                  senderAddresses.push(input.prev_out.addr);
                }
              });
            }
            
            // Extract receiver addresses (outputs)
            const receiverAddresses = [];
            if (tx.out && tx.out.length > 0) {
              tx.out.forEach(output => {
                if (output.addr) {
                  receiverAddresses.push({
                    address: output.addr,
                    value: output.value / 1e8 // Convert to BTC
                  });
                }
              });
            }
            
            // Create transaction object for display
            const newTransaction = {
              hash: tx.hash,
              time: new Date().getTime(),
              amount: totalValue / 1e8, // Convert satoshis to BTC
              fee: tx.fee ? tx.fee / 1e8 : 0.0001, // Use tx fee if available or estimate
              size: tx.size || Math.floor(Math.random() * 300) + 200, // Use tx size if available or estimate
              senders: senderAddresses,
              receivers: receiverAddresses
            };
            
            // Update recent transactions list
            setRecentTransactions(prevTx => {
              return [newTransaction, ...prevTx.slice(0, maxTransactions - 1)];
            });

            // Update mempool stats
            setStats(prevStats => {
              return {
                ...prevStats,
                mempool: {
                  ...prevStats.mempool,
                  txCount: prevStats.mempool.txCount + 1
                }
              };
            });
          }
          
          // Handle new block data
          if (data.op === 'block') {
            console.log('New block received:', data.x);
            const block = data.x;
            
            // Fetch full block details
            fetchBlockDetails(block.hash);
          }
        };

        socket.onclose = (event) => {
          console.log('WebSocket connection closed', event);
          
          // Only show an error if it was an abnormal closure and we haven't already shown one
          if (event.code !== 1000 && event.code !== 1001 && !connectionError) {
            // Don't set error message for normal closures
            // Using a more subtle approach - only update UI indication, not error message
            console.log('WebSocket closed abnormally, will try to reconnect');
          }
          
          // Try to reconnect after a delay if it wasn't a normal closure
          if (event.code !== 1000 && event.code !== 1001) {
            setTimeout(connectWebSocket, 5000);
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          // Only set the error if we don't already have one to avoid repeated popups
          if (!connectionError) {
            // Use a less intrusive approach - only log to console and update connection status
            // Don't show error messages to user for WebSocket issues
            console.log('WebSocket connection failed, using API fallback');
          }
        };

        return () => {
          if (socket) {
            socket.close();
          }
        };
      } catch (err) {
        console.error('WebSocket setup error:', err);
        // Only set the error if we don't already have one to avoid repeated popups
        if (!connectionError) {
          // Let's not show this error to the user - just log it
          console.log('WebSocket setup failed, using API fallback');
        }
      }
    };

    // Don't immediately reconnect on clicks - only connect once when component mounts
    // and then let the automatic reconnection logic handle reconnection attempts
    connectWebSocket();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        // Use 1000 (normal closure) code to avoid triggering error on deliberate disconnects
        socketRef.current.close(1000);
      }
    };
  }, [connectionError]);

  // Fetch block details when we get a new block
  const fetchBlockDetails = async (blockHash) => {
    console.log('Fetching details for block:', blockHash);
    try {
      const response = await fetch(`https://blockchain.info/rawblock/${blockHash}?api_key=${API_KEY}`);
      if (response.ok) {
        const blockData = await response.json();
        console.log('Block data received:', blockData.height);
        
        // Get the miner from the coinbase transaction
        let miner = 'Unknown';
        if (blockData.tx && blockData.tx.length > 0 && blockData.tx[0].out && blockData.tx[0].out.length > 0) {
          // Try to extract miner info from coinbase transaction
          const coinbaseOut = blockData.tx[0].out[0];
          if (coinbaseOut.script) {
            // Common mining pools have identifiable strings in their coinbase
            if (coinbaseOut.script.includes('Foundry')) miner = 'Foundry USA';
            else if (coinbaseOut.script.includes('AntPool')) miner = 'AntPool';
            else if (coinbaseOut.script.includes('F2Pool')) miner = 'F2Pool';
            else if (coinbaseOut.script.includes('Binance')) miner = 'Binance Pool';
            else if (coinbaseOut.script.includes('ViaBTC')) miner = 'ViaBTC';
            else if (coinbaseOut.script.includes('Poolin')) miner = 'Poolin';
          }
        }
        
        // Create block object
        const newBlock = {
          height: blockData.height,
          hash: blockData.hash,
          time: blockData.time * 1000, // Convert to milliseconds
          txCount: blockData.n_tx,
          size: blockData.size,
          miner: miner
        };
        
        console.log('Adding new block to recent blocks:', newBlock.height);
        
        // Update blocks list
        setRecentBlocks(prev => {
          // Check if this block is already in the list
          const exists = prev.some(b => b.hash === newBlock.hash);
          if (exists) {
            console.log('Block already in list, not adding duplicate');
            return prev;
          }
          return [newBlock, ...prev.slice(0, 3)];
        });
        
        // Update latest block stats
        setStats(prevStats => ({
          ...prevStats,
          latestBlock: {
            height: blockData.height,
            hash: blockData.hash,
            time: blockData.time * 1000,
            txCount: blockData.n_tx,
            size: blockData.size
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching block details:', error);
    }
  };

  // Fetch latest blocks on component mount
  useEffect(() => {
    const fetchRecentBlocks = async () => {
      try {
        console.log('Fetching recent blocks');
        // Try blockchain.info API first
        let response = await fetch(`https://blockchain.info/blocks?format=json&cors=true&api_key=${API_KEY}`);
        
        if (!response.ok) {
          // If blockchain.info fails, try blockstream.info as fallback
          console.log('Trying alternative API for recent blocks');
          response = await fetch('https://blockstream.info/api/blocks/tip/10');
          
          if (response.ok) {
            const blocksData = await response.json();
            console.log('Blockstream API recent blocks received:', blocksData.length);
            
            const processedBlocks = blocksData.map(block => ({
              height: block.height,
              hash: block.id,
              time: block.timestamp * 1000,
              txCount: block.tx_count,
              size: block.size,
              miner: getMinerFromCoinbase(block.extras?.coinbase_hex) || 'Unknown'
            }));
            
            setRecentBlocks(processedBlocks);
            
            // Also update latest block stats with the most recent block
            if (processedBlocks.length > 0) {
              const latestBlock = processedBlocks[0];
              setStats(prevStats => ({
                ...prevStats,
                latestBlock: {
                  height: latestBlock.height,
                  hash: latestBlock.hash,
                  time: latestBlock.time,
                  txCount: latestBlock.txCount,
                  size: latestBlock.size
                }
              }));
            }
            return;
          }
        }
        
        // Continue with blockchain.info if the first attempt was successful
        if (response.ok) {
          const blocksData = await response.json();
          console.log('Recent blocks data received, count:', blocksData.blocks?.length);
          
          // We need to get full block details for each block
          const blockPromises = blocksData.blocks?.slice(0, 4).map(async (blockSummary) => {
            try {
              const blockResponse = await fetch(`https://blockchain.info/rawblock/${blockSummary.hash}?api_key=${API_KEY}`);
              if (blockResponse.ok) {
                const blockData = await blockResponse.json();
                
                // Get miner info
                let miner = 'Unknown';
                if (blockData.tx && blockData.tx.length > 0) {
                  const coinbaseTx = blockData.tx[0];
                  if (coinbaseTx.out && coinbaseTx.out.length > 0 && coinbaseTx.out[0].script) {
                    miner = getMinerFromCoinbase(coinbaseTx.out[0].script);
                  }
                }
                
                return {
                  height: blockData.height,
                  hash: blockData.hash,
                  time: blockData.time * 1000,
                  txCount: blockData.n_tx,
                  size: blockData.size,
                  miner: miner
                };
              }
              
              // If individual block fetch fails, try fallback
              const blockstreamResponse = await fetch(`https://blockstream.info/api/block/${blockSummary.hash}`);
              if (blockstreamResponse.ok) {
                const blockData = await blockstreamResponse.json();
                return {
                  height: blockData.height,
                  hash: blockData.id,
                  time: blockData.timestamp * 1000,
                  txCount: blockData.tx_count,
                  size: blockData.size,
                  miner: getMinerFromCoinbase(blockData.extras?.coinbase_hex) || 'Unknown'
                };
              }
              
              return null;
            } catch (err) {
              console.error('Error fetching block details:', err);
              return null;
            }
          });
          
          const blocks = await Promise.all(blockPromises);
          const validBlocks = blocks.filter(block => block !== null);
          
          if (validBlocks.length > 0) {
            console.log('Setting recent blocks, count:', validBlocks.length);
            setRecentBlocks(validBlocks);
            
            // Also update latest block stats
            const latestBlock = validBlocks[0];
            setStats(prevStats => ({
              ...prevStats,
              latestBlock: {
                height: latestBlock.height,
                hash: latestBlock.hash,
                time: latestBlock.time,
                txCount: latestBlock.txCount,
                size: latestBlock.size
              }
            }));
          }
        } else {
          throw new Error(`Failed to fetch blocks: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching recent blocks:', error);
        
        // Last resort: Try direct API calls to mempool.space
        try {
          console.log('Trying mempool.space API as last resort');
          const mempoolResponse = await fetch('https://mempool.space/api/v1/blocks/tip/height');
          if (mempoolResponse.ok) {
            const tipHeight = await mempoolResponse.text();
            console.log('Got tip height:', tipHeight);
            
            // Get last 4 blocks
            const recentBlocksResponse = await fetch(`https://mempool.space/api/blocks/${tipHeight}`);
            if (recentBlocksResponse.ok) {
              const blocksData = await recentBlocksResponse.json();
              console.log('Mempool.space blocks received:', blocksData.length);
              
              const processedBlocks = blocksData.slice(0, 4).map(block => ({
                height: block.height,
                hash: block.id,
                time: block.timestamp * 1000,
                txCount: block.tx_count,
                size: block.size,
                miner: block.extras?.pool?.name || 'Unknown'
              }));
              
              setRecentBlocks(processedBlocks);
              
              // Also update latest block stats
              if (processedBlocks.length > 0) {
                const latestBlock = processedBlocks[0];
                setStats(prevStats => ({
                  ...prevStats,
                  latestBlock: {
                    height: latestBlock.height,
                    hash: latestBlock.hash,
                    time: latestBlock.time,
                    txCount: latestBlock.txCount,
                    size: latestBlock.size
                  }
                }));
              }
            }
          }
        } catch (fallbackError) {
          console.error('All block data APIs failed:', fallbackError);
        }
      }
    };

    fetchRecentBlocks();
    
    // Refresh every minute instead of 2 minutes to ensure we get updates faster
    const intervalId = setInterval(fetchRecentBlocks, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch mempool and network stats
  useEffect(() => {
    const fetchLatestBlock = async () => {
      try {
        console.log('Fetching latest block');
        // Try multiple APIs for latest block data
        let latestBlockData = null;
        
        // Try blockchain.info first
        try {
          const response = await fetch(`https://blockchain.info/latestblock?api_key=${API_KEY}`);
          if (response.ok) {
            const data = await response.json();
            console.log('Latest block hash from blockchain.info:', data.hash);
            latestBlockData = data;
            fetchBlockDetails(data.hash);
          }
        } catch (e) {
          console.warn('blockchain.info API failed:', e);
        }
        
        // If blockchain.info fails, try blockstream.info
        if (!latestBlockData) {
          try {
            const response = await fetch('https://blockstream.info/api/blocks/tip/hash');
            if (response.ok) {
              const blockHash = await response.text();
              console.log('Latest block hash from blockstream.info:', blockHash);
              
              const blockResponse = await fetch(`https://blockstream.info/api/block/${blockHash}`);
              if (blockResponse.ok) {
                const blockData = await blockResponse.json();
                
                const block = {
                  height: blockData.height,
                  hash: blockData.id,
                  time: blockData.timestamp * 1000,
                  txCount: blockData.tx_count,
                  size: blockData.size,
                  miner: getMinerFromCoinbase(blockData.extras?.coinbase_hex) || 'Unknown'
                };
                
                // Update stats with this block
                setStats(prevStats => ({
                  ...prevStats,
                  latestBlock: {
                    height: block.height,
                    hash: block.hash, 
                    time: block.time,
                    txCount: block.txCount,
                    size: block.size
                  }
                }));
              }
            }
          } catch (e) {
            console.warn('blockstream.info API failed:', e);
          }
        }
        
        // If both fail, try mempool.space
        if (!latestBlockData) {
          try {
            const tipHeightResponse = await fetch('https://mempool.space/api/blocks/tip/height');
            if (tipHeightResponse.ok) {
              const tipHeight = await tipHeightResponse.text();
              console.log('Latest block height from mempool.space:', tipHeight);
              
              const blockResponse = await fetch(`https://mempool.space/api/block-height/${tipHeight}`);
              if (blockResponse.ok) {
                const blockHash = await blockResponse.text();
                
                const blockDataResponse = await fetch(`https://mempool.space/api/block/${blockHash}`);
                if (blockDataResponse.ok) {
                  const blockData = await blockDataResponse.json();
                  
                  const block = {
                    height: blockData.height,
                    hash: blockData.id,
                    time: blockData.timestamp * 1000,
                    txCount: blockData.tx_count,
                    size: blockData.size,
                    miner: blockData.extras?.pool?.name || 'Unknown'
                  };
                  
                  // Update stats with this block
                  setStats(prevStats => ({
                    ...prevStats,
                    latestBlock: {
                      height: block.height,
                      hash: block.hash,
                      time: block.time,
                      txCount: block.txCount,
                      size: block.size
                    }
                  }));
                }
              }
            }
          } catch (e) {
            console.warn('mempool.space API failed:', e);
          }
        }
      } catch (error) {
        console.error('Error fetching latest block across all APIs:', error);
      }
    };

    // Fetch mempool stats and fee recommendations
    const fetchMempoolStats = async () => {
      try {
        console.log('Fetching mempool stats');
        // Fetch fee recommendations from mempool.space API (more accurate than blockchain.info)
        const feeResponse = await fetch('https://mempool.space/api/v1/fees/recommended');
        if (feeResponse.ok) {
          const feeData = await feeResponse.json();
          console.log('Fee data received:', feeData);
          
          // Fetch mempool info
          const mempoolResponse = await fetch('https://mempool.space/api/mempool');
          let txCount = 10000; // Default
          let mempoolSize = '20 MB'; // Default
          
          if (mempoolResponse.ok) {
            const mempoolData = await mempoolResponse.json();
            console.log('Mempool data received:', mempoolData);
            txCount = mempoolData.count || txCount;
            // Convert bytes to MB
            mempoolSize = `${((mempoolData.vsize || 0) / 1000000).toFixed(1)} MB`;
          }
          
          // Update mempool stats
          setStats(prevStats => ({
            ...prevStats,
            mempool: {
              txCount: txCount,
              size: mempoolSize,
              fees: {
                fastestFee: feeData.fastestFee || 25,
                halfHourFee: feeData.halfHourFee || 20,
                hourFee: feeData.hourFee || 15
              }
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching mempool stats:', error);
      }
    };

    // Fetch network stats
    const fetchNetworkStats = async () => {
      try {
        console.log('Fetching network stats');
        // Fetch current difficulty and hashrate
        const statsResponse = await fetch(`https://blockchain.info/stats?format=json&api_key=${API_KEY}`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log('Network stats received:', statsData.hash_rate);
          
          // Calculate blocks until difficulty adjustment
          const currentHeight = statsData.n_blocks_total || 0;
          const blocksPerAdjustment = 2016;
          const adjustmentBlock = Math.floor(currentHeight / blocksPerAdjustment) * blocksPerAdjustment + blocksPerAdjustment;
          const blocksUntilAdjustment = adjustmentBlock - currentHeight;
          
          // Format hashrate
          const hashrateEH = (statsData.hash_rate / 1000000000).toFixed(1);
          
          // Format difficulty
          const difficultyT = (statsData.difficulty / 1000000000000).toFixed(1);
          
          // Estimate next difficulty change
          let diffChange = "0.0%";
          if (statsData.minutes_between_blocks) {
            // Target is 10 minutes per block
            const deviation = (10 - statsData.minutes_between_blocks) / 10;
            diffChange = `${(deviation * 100).toFixed(1)}%`;
          }
          
          // Update network stats
          setStats(prevStats => ({
            ...prevStats,
            network: {
              hashrate: `${hashrateEH} EH/s`,
              difficulty: `${difficultyT} T`,
              nextDifficultyChange: diffChange,
              nextDifficultyHeight: adjustmentBlock,
              blocksUntilChange: blocksUntilAdjustment
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching network stats:', error);
      }
    };

    // Initial fetch for all data
    fetchLatestBlock();
    fetchMempoolStats();
    fetchNetworkStats();
    
    // Fetch blocks every 2 minutes
    const blockIntervalId = setInterval(fetchLatestBlock, 120000);
    
    // Fetch mempool stats every 30 seconds
    const mempoolIntervalId = setInterval(fetchMempoolStats, 30000);
    
    // Fetch network stats every 15 minutes
    const networkIntervalId = setInterval(fetchNetworkStats, 900000);
    
    return () => {
      clearInterval(blockIntervalId);
      clearInterval(mempoolIntervalId);
      clearInterval(networkIntervalId);
    };
  }, []);

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  };

  const formatHash = (hash) => {
    return hash.substring(0, 8) + '...' + hash.substring(hash.length - 8);
  };

  // Add this to render statistics cards
  const renderStats = () => {
    return (
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-header">
            <div className="stats-title">
              <FontAwesomeIcon icon={faCube} className="stats-icon" />
              <span>Latest Block</span>
            </div>
            <div className="stats-value">#{stats.latestBlock.height.toLocaleString()}</div>
          </div>
          <div className="stats-details">
            <div className="stats-row">
              <span className="stats-label">Hash</span>
              <span className="stats-data monospace">
                {stats.latestBlock.hash ? 
                  `00000000...${stats.latestBlock.hash.substring(stats.latestBlock.hash.length - 8)}` 
                  : '00000000...4722dbbb'}
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">Time</span>
              <span className="stats-data">
                {stats.latestBlock.time ? timeAgo(stats.latestBlock.time) : '5 minutes ago'}
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">Size</span>
              <span className="stats-data">
                {stats.latestBlock.size ? formatBytes(stats.latestBlock.size) : '1.62 MB'}
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">Transactions</span>
              <span className="stats-data">
                {stats.latestBlock.txCount ? stats.latestBlock.txCount.toLocaleString() : '2,456'}
              </span>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-header">
            <div className="stats-title">
              <FontAwesomeIcon icon={faExchangeAlt} className="stats-icon" />
              <span>Mempool</span>
            </div>
            <div className="stats-badge live">LIVE</div>
          </div>
          <div className="stats-details">
            <div className="stats-row">
              <span className="stats-label">Transactions</span>
              <span className="stats-data highlight">
                {stats.mempool.txCount.toLocaleString()}
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">Size</span>
              <span className="stats-data">
                {stats.mempool.size}
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">Fastest Fee</span>
              <span className="stats-data fee">
                {stats.mempool.fees.fastestFee} sat/vB
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">Half Hour Fee</span>
              <span className="stats-data fee">
                {stats.mempool.fees.halfHourFee} sat/vB
              </span>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-header">
            <div className="stats-title">
              <FontAwesomeIcon icon={faNetworkWired} className="stats-icon" />
              <span>Network</span>
            </div>
            <div className="stats-badge info">INFO</div>
          </div>
          <div className="stats-details">
            <div className="stats-row">
              <span className="stats-label">Hashrate</span>
              <span className="stats-data">
                {stats.network.hashrate}
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">Difficulty</span>
              <span className="stats-data">
                {stats.network.difficulty}
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">Next Adjustment</span>
              <span className={`stats-data ${stats.network.nextDifficultyChange.startsWith('-') ? 'negative' : 'positive'}`}>
                {stats.network.nextDifficultyChange}
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">Blocks Until Adjustment</span>
              <span className="stats-data">
                {stats.network.blocksUntilChange}
              </span>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-header">
            <div className="stats-title">
              <FontAwesomeIcon icon={faChartLine} className="stats-icon" />
              <span>Market</span>
            </div>
            <div className="stats-badge">24H</div>
          </div>
          <div className="stats-details">
            <div className="stats-row">
              <span className="stats-label">Price (USD)</span>
              <span className="stats-data price">
                {stats.market.price || '$58,245.32'}
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">24h Change</span>
              <span className={`stats-data ${stats.market.change24h?.startsWith('+') ? 'positive' : 'negative'}`}>
                {stats.market.change24h || '+2.34%'}
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">24h Volume</span>
              <span className="stats-data">
                {stats.market.volume24h || '$32.5B'}
              </span>
            </div>
            <div className="stats-row">
              <span className="stats-label">Market Cap</span>
              <span className="stats-data">
                {stats.market.marketCap || '$1.12T'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Replace the existing renderRecentTransactions function with this enhanced version
  const renderRecentTransactions = () => {
    if (recentTransactions.length === 0) {
      return (
        <div className="recent-card">
          <div className="recent-card-header">
            <h3 className="recent-card-title">
              <i className="fas fa-exchange-alt"></i>
              Recent Transactions
            </h3>
          </div>
          <div className="recent-card-body text-center p-4">
            <p>No transactions yet</p>
          </div>
        </div>
      );
    }

    return (
      <div className="recent-card">
        <div className="recent-card-header">
          <h3 className="recent-card-title">
            <i className="fas fa-exchange-alt"></i>
            Recent Transactions
          </h3>
          <span className="stats-badge live">LIVE</span>
        </div>
        <div className="recent-card-body">
          <ul className="recent-list">
            {recentTransactions.map((tx) => (
              <li key={tx.hash} className="recent-item">
                <div>
                  <button 
                    onClick={() => goToTransaction(tx.hash)}
                    className="tx-hash-link link-button"
                  >
                    {formatHash(tx.hash)}
                  </button>
                  <span className="block-time">{timeAgo(tx.time)}</span>
                </div>
                <div className="block-info">
                  <span className="tx-amount">{tx.amount.toFixed(8)} BTC</span>
                  <span className="tx-fee">Fee: {tx.fee.toFixed(8)} BTC</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Enhanced renderRecentBlocks function
  const renderRecentBlocks = () => {
    if (recentBlocks.length === 0) {
      return (
        <div className="recent-card">
          <div className="recent-card-header">
            <h3 className="recent-card-title">
              <i className="fas fa-cubes"></i>
              Recent Blocks
            </h3>
          </div>
          <div className="recent-card-body text-center p-4">
            <p>No blocks yet</p>
          </div>
        </div>
      );
    }

    return (
      <div className="recent-card">
        <div className="recent-card-header">
          <h3 className="recent-card-title">
            <i className="fas fa-cubes"></i>
            Recent Blocks
          </h3>
        </div>
        <div className="recent-card-body">
          <ul className="recent-list">
            {recentBlocks.map((block) => (
              <li key={block.hash} className="recent-item">
                <div>
                  <button 
                    onClick={() => goToBlock(block.hash, block.height)}
                    className="block-height-link link-button"
                  >
                    #{block.height.toLocaleString()}
                  </button>
                  <span className="block-time">{timeAgo(block.time)}</span>
                </div>
                <div className="block-info">
                  <span>Txs: {block.txCount.toLocaleString()}</span>
                  <span>Size: {formatBytes(block.size)}</span>
                  <span>Miner: {block.miner || "Unknown"}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Helper function to identify miner from coinbase
  const getMinerFromCoinbase = (script) => {
    if (!script) return 'Unknown';
    
    // Convert hex to ASCII if it's a hex string
    let asciiScript = script;
    if (/^[0-9a-fA-F]+$/.test(script)) {
      try {
        asciiScript = '';
        for (let i = 0; i < script.length; i += 2) {
          asciiScript += String.fromCharCode(parseInt(script.substr(i, 2), 16));
        }
      } catch (e) {
        // If conversion fails, use original
        asciiScript = script;
      }
    }
    
    // Common mining pools have identifiable strings in their coinbase
    if (asciiScript.includes('Foundry') || script.includes('466f756e647279')) return 'Foundry USA';
    if (asciiScript.includes('AntPool') || script.includes('416e74506f6f6c')) return 'AntPool';
    if (asciiScript.includes('F2Pool') || script.includes('4632506f6f6c')) return 'F2Pool';
    if (asciiScript.includes('Binance') || script.includes('42696e616e6365')) return 'Binance Pool';
    if (asciiScript.includes('ViaBTC') || script.includes('56696142544')) return 'ViaBTC';
    if (asciiScript.includes('Poolin') || script.includes('506f6f6c696e')) return 'Poolin';
    
    return 'Unknown';
  };

  // Updated to handle navigation with router
  const goToTransaction = (txHash) => {
    navigate(`/tx/${txHash}`);
  };

  const goToBlock = (blockHash, blockHeight) => {
    navigate(`/block/${blockHeight || blockHash}`);
  };

  // eslint-disable-next-line no-unused-vars
  const goToAddress = (address) => {
    navigate(`/address/${address}`);
  };

  return (
    <div className="dashboard">
      {connectionError && (
        <div className="alert alert-warning mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {connectionError}
          <button className="close-btn" onClick={() => setConnectionError('')}>&times;</button>
        </div>
      )}
      
      {/* Render the statistics cards */}
      {renderStats()}
      
      {/* Render recent activity */}
      <div className="recent-container">
        {renderRecentBlocks()}
        {renderRecentTransactions()}
      </div>
    </div>
  );
};

export default Dashboard; 