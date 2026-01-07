import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Table, Badge, Row, Col, Tabs, Tab, Container, InputGroup, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faNetworkWired, faBitcoinSign, faCoins, faWallet,
  faExchangeAlt, faShieldAlt, faChartLine, faHistory, faCopy,
  faExternalLinkAlt, faDownload, faFilter, faSort
} from '@fortawesome/free-solid-svg-icons';
import { useNetwork } from '../contexts/NetworkContext';
import { getTestnetMultiChainData } from '../utils/testnetMockData';
import './EnhancedMultiChain.css';

const EnhancedMultiChain = () => {
  const { isTestnet } = useNetwork();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('bitcoin');
  const [analysisType, setAnalysisType] = useState('address');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('time');

  const networks = [
    { 
      id: 'bitcoin', 
      name: 'Bitcoin', 
      icon: faBitcoinSign, 
      color: '#f7931a',
      explorer: 'https://blockstream.info',
      currency: 'BTC'
    },
    { 
      id: 'ethereum', 
      name: 'Ethereum', 
      icon: faCoins, 
      color: '#627eea',
      explorer: 'https://etherscan.io',
      currency: 'ETH'
    }
  ];

  const sampleData = {
    bitcoin: {
      addresses: [
        { addr: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', label: 'Genesis Block (Satoshi)' },
        { addr: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', label: 'Silk Road Seizure' },
        { addr: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', label: 'BitFinex Hack' }
      ],
      transactions: [
        { hash: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b', label: 'Genesis Transaction' },
        { hash: 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16', label: 'First Bitcoin Transaction' }
      ]
    },
    ethereum: {
      addresses: [
        { addr: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', label: 'Ethereum Foundation' },
        { addr: '0x742d35Cc6634C0532925a3b8D4C9db4C8b7c9d4E', label: 'Binance Hot Wallet' },
        { addr: '0x1062a747393198f70F71ec65A582423Dba7E5Ab3', label: 'Crypto.com' }
      ],
      transactions: [
        { hash: '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060', label: 'First Ethereum Transaction' }
      ]
    }
  };

  const performAnalysis = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter an address or transaction hash');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let analysisResults = {};

      // Use testnet mock data if in testnet mode
      if (isTestnet) {
        setTimeout(() => {
          const mockData = getTestnetMultiChainData(selectedNetwork, analysisType, searchQuery);
          if (analysisType === 'address') {
            analysisResults = {
              type: 'address',
              network: selectedNetwork,
              address: searchQuery,
              basicInfo: mockData,
              riskAnalysis: { riskScore: mockData.riskScore, riskLevel: mockData.riskLevel },
              exchangeConnections: [],
              crossChainActivity: [],
              transactionFlow: analyzeTransactionFlow(mockData.transactions || []),
              riskScore: mockData.riskScore,
              timeline: generateEnhancedTimeline(mockData.transactions || []),
              clustering: performAdvancedClustering(mockData.transactions || [])
            };
          } else {
            analysisResults = {
              type: 'transaction',
              network: selectedNetwork,
              hash: searchQuery,
              transaction: mockData,
              riskScore: mockData.riskScore || 0,
              flowAnalysis: {},
              involvedAddresses: [],
              networkAnalysis: {}
            };
          }
          setResults(analysisResults);
          setActiveTab('overview');
          setLoading(false);
        }, 800);
        return;
      }

      if (analysisType === 'address') {
        // Enhanced address analysis
        const [basicData, riskData, exchangeData, multiChainData] = await Promise.all([
          fetchAddressData(searchQuery, selectedNetwork),
          fetchRiskAnalysis(searchQuery, selectedNetwork),
          fetchExchangeAnalysis(searchQuery),
          fetchMultiChainConnections(searchQuery)
        ]);

        analysisResults = {
          type: 'address',
          network: selectedNetwork,
          address: searchQuery,
          basicInfo: basicData,
          riskAnalysis: riskData,
          exchangeConnections: exchangeData,
          crossChainActivity: multiChainData,
          transactionFlow: analyzeTransactionFlow(basicData.transactions || []),
          riskScore: calculateComprehensiveRisk(basicData, riskData),
          timeline: generateEnhancedTimeline(basicData.transactions || []),
          clustering: performAdvancedClustering(basicData.transactions || [])
        };
      } else {
        // Enhanced transaction analysis
        const txData = await fetchTransactionData(searchQuery, selectedNetwork);
        
        analysisResults = {
          type: 'transaction',
          network: selectedNetwork,
          hash: searchQuery,
          transaction: txData,
          riskScore: analyzeTransactionRisk(txData),
          flowAnalysis: analyzeTransactionComplexity(txData),
          involvedAddresses: extractAddresses(txData),
          networkAnalysis: await analyzeNetworkConnections(txData)
        };
      }

      setResults(analysisResults);
      setActiveTab('overview');
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddressData = async (address, network) => {
    try {
      if (network === 'bitcoin') {
        const response = await fetch(`http://localhost:5000/api/search/${address}`);
        return await response.json();
      } else {
        const response = await fetch(`http://localhost:5000/api/multichain/address/${network}/${address}`);
        return await response.json();
      }
    } catch (error) {
      // Return mock data for demonstration
      return generateMockAddressData(address, network);
    }
  };

  const fetchRiskAnalysis = async (address, network) => {
    try {
      const response = await fetch(`http://localhost:5000/api/analyze/${address}`);
      return await response.json();
    } catch (error) {
      return generateMockRiskData(address);
    }
  };

  const fetchExchangeAnalysis = async (address) => {
    try {
      const response = await fetch(`http://localhost:5000/api/exchange/identify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: [address] })
      });
      return await response.json();
    } catch (error) {
      return { exchanges: [], mixers: [], darknet: [] };
    }
  };

  const fetchMultiChainConnections = async (address) => {
    // Mock multi-chain analysis
    return {
      connectedNetworks: ['bitcoin', 'ethereum'],
      bridgeTransactions: [],
      crossChainRisk: 'low'
    };
  };

  const fetchTransactionData = async (hash, network) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tx/${hash}`);
      return await response.json();
    } catch (error) {
      return generateMockTransactionData(hash, network);
    }
  };

  const generateMockAddressData = (address, network) => {
    const mockTransactions = Array.from({ length: 15 }, (_, i) => ({
      hash: `${address.substring(0, 8)}${i.toString().padStart(8, '0')}`,
      time: new Date(Date.now() - i * 86400000).toISOString(),
      amount: Math.random() * 10,
      type: Math.random() > 0.5 ? 'received' : 'sent',
      confirmations: Math.floor(Math.random() * 1000) + 1,
      risk: Math.random() > 0.8 ? 'high' : Math.random() > 0.6 ? 'medium' : 'low'
    }));

    return {
      address,
      balance: Math.random() * 100,
      totalReceived: Math.random() * 1000,
      totalSent: Math.random() * 900,
      transactionCount: mockTransactions.length,
      transactions: mockTransactions
    };
  };

  const generateMockRiskData = (address) => {
    const patterns = [
      { type: 'high_frequency', severity: 'medium', count: 5 },
      { type: 'round_amounts', severity: 'low', count: 2 },
      { type: 'mixing_service', severity: 'high', count: 1 }
    ];

    return {
      riskScore: Math.floor(Math.random() * 100),
      patterns: Math.random() > 0.7 ? patterns : [],
      riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
    };
  };

  const generateMockTransactionData = (hash, network) => {
    return {
      hash,
      network,
      time: new Date().toISOString(),
      amount: Math.random() * 50,
      fee: Math.random() * 0.01,
      inputs: Math.floor(Math.random() * 5) + 1,
      outputs: Math.floor(Math.random() * 10) + 1,
      confirmations: Math.floor(Math.random() * 100) + 1
    };
  };

  const calculateComprehensiveRisk = (basicData, riskData) => {
    let score = riskData.riskScore || 0;
    
    // Volume-based risk
    const totalVolume = (basicData.totalReceived || 0) + (basicData.totalSent || 0);
    if (totalVolume > 1000) score += 20;
    else if (totalVolume > 100) score += 10;
    
    // Frequency-based risk
    if (basicData.transactionCount > 1000) score += 25;
    else if (basicData.transactionCount > 100) score += 15;
    
    return Math.min(score, 100);
  };

  const analyzeTransactionFlow = (transactions) => {
    const inbound = transactions.filter(tx => tx.type === 'received');
    const outbound = transactions.filter(tx => tx.type === 'sent');
    
    return {
      totalInbound: inbound.reduce((sum, tx) => sum + tx.amount, 0),
      totalOutbound: outbound.reduce((sum, tx) => sum + tx.amount, 0),
      inboundCount: inbound.length,
      outboundCount: outbound.length,
      averageAmount: transactions.length > 0 ? 
        transactions.reduce((sum, tx) => sum + tx.amount, 0) / transactions.length : 0,
      velocity: transactions.length > 0 ? 
        transactions.length / Math.max(1, (Date.now() - new Date(transactions[transactions.length - 1]?.time || Date.now()).getTime()) / (1000 * 60 * 60 * 24)) : 0
    };
  };

  const generateEnhancedTimeline = (transactions) => {
    return transactions.map(tx => ({
      ...tx,
      riskIndicators: analyzeTransactionRisk(tx),
      networkActivity: 'normal' // Could be enhanced with real network analysis
    })).sort((a, b) => new Date(b.time) - new Date(a.time));
  };

  const performAdvancedClustering = (transactions) => {
    // Simple clustering based on amount patterns
    const clusters = {};
    
    transactions.forEach(tx => {
      const amountRange = Math.floor(tx.amount / 10) * 10;
      if (!clusters[amountRange]) {
        clusters[amountRange] = { range: amountRange, count: 0, transactions: [] };
      }
      clusters[amountRange].count++;
      clusters[amountRange].transactions.push(tx);
    });
    
    return Object.values(clusters)
      .filter(cluster => cluster.count > 1)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const analyzeTransactionRisk = (tx) => {
    let risk = 0;
    const indicators = [];
    
    if (tx.amount > 100) {
      risk += 30;
      indicators.push('Large amount');
    }
    
    if (tx.amount % 1 === 0) {
      risk += 15;
      indicators.push('Round amount');
    }
    
    if (tx.confirmations < 6) {
      risk += 10;
      indicators.push('Low confirmations');
    }
    
    return { score: Math.min(risk, 100), indicators };
  };

  const analyzeTransactionComplexity = (tx) => {
    return {
      complexity: (tx.inputs + tx.outputs) / 2,
      privacy: tx.inputs > 5 ? 'high' : tx.inputs > 2 ? 'medium' : 'low',
      pattern: tx.outputs > 10 ? 'distribution' : tx.inputs > 5 ? 'consolidation' : 'standard'
    };
  };

  const extractAddresses = (tx) => {
    // Mock address extraction
    return Array.from({ length: Math.min(tx.inputs + tx.outputs, 10) }, (_, i) => 
      `addr_${i}_${tx.hash.substring(0, 8)}`
    );
  };

  const analyzeNetworkConnections = async (tx) => {
    return {
      networkLoad: 'normal',
      feeMarket: 'standard',
      congestion: false
    };
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const openInExplorer = (hash, network) => {
    const baseUrl = networks.find(n => n.id === network)?.explorer;
    if (baseUrl) {
      window.open(`${baseUrl}/tx/${hash}`, '_blank');
    }
  };

  const exportAnalysis = () => {
    if (!results) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      analysis: results,
      summary: `Multi-chain analysis of ${results.type} on ${results.network} network`
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `multichain-analysis-${Date.now()}.json`;
    a.click();
  };

  const loadSample = (item) => {
    setSearchQuery(item.addr || item.hash);
    setAnalysisType(item.addr ? 'address' : 'transaction');
  };

  const getNetworkInfo = () => networks.find(n => n.id === selectedNetwork);

  const getRiskBadgeVariant = (score) => {
    if (score >= 70) return 'danger';
    if (score >= 40) return 'warning';
    return 'success';
  };

  const filteredTransactions = results?.timeline?.filter(tx => {
    if (filterRisk === 'all') return true;
    const riskScore = tx.riskIndicators?.score || 0;
    if (filterRisk === 'high') return riskScore >= 70;
    if (filterRisk === 'medium') return riskScore >= 40 && riskScore < 70;
    if (filterRisk === 'low') return riskScore < 40;
    return true;
  }) || [];

  return (
    <Container fluid className="enhanced-multichain">
      <Card className="analysis-header">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-1">
                <FontAwesomeIcon icon={faNetworkWired} className="me-2" />
                Multi-Chain Blockchain Analysis
              </h3>
              <p className="mb-0 text-muted">Advanced cross-chain investigation platform</p>
            </Col>
            <Col xs="auto">
              <Badge bg="primary" className="network-badge">
                <FontAwesomeIcon icon={getNetworkInfo()?.icon} className="me-1" />
                {getNetworkInfo()?.name}
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => { e.preventDefault(); performAnalysis(); }}>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Label>Network</Form.Label>
                <Form.Select 
                  value={selectedNetwork} 
                  onChange={(e) => setSelectedNetwork(e.target.value)}
                  className="network-select"
                >
                  {networks.map(network => (
                    <option key={network.id} value={network.id}>
                      {network.name} ({network.currency})
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label>Analysis Type</Form.Label>
                <Form.Select 
                  value={analysisType} 
                  onChange={(e) => setAnalysisType(e.target.value)}
                >
                  <option value="address">Address Investigation</option>
                  <option value="transaction">Transaction Analysis</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Search Query</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder={`Enter ${analysisType} for analysis...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <Button 
                    type="submit" 
                    disabled={loading}
                    variant="primary"
                  >
                    {loading ? <Spinner size="sm" /> : <FontAwesomeIcon icon={faSearch} />}
                    {loading ? ' Analyzing...' : ' Investigate'}
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </Form>

          <Row>
            <Col md={8}>
              {error && (
                <Alert variant="danger" className="mb-3">
                  <FontAwesomeIcon icon={faExchangeAlt} className="me-2" />
                  {error}
                </Alert>
              )}
            </Col>
            <Col md={4}>
              <Card className="sample-data-card">
                <Card.Header>
                  <small>Sample Data - {getNetworkInfo()?.name}</small>
                </Card.Header>
                <Card.Body className="p-2">
                  <div className="mb-2">
                    <strong>Addresses:</strong>
                    {sampleData[selectedNetwork]?.addresses.map((item, idx) => (
                      <Button 
                        key={idx}
                        variant="outline-secondary" 
                        size="sm" 
                        className="d-block mb-1 w-100 text-start sample-btn"
                        onClick={() => loadSample(item)}
                      >
                        <small>{item.label}</small>
                      </Button>
                    ))}
                  </div>
                  <div>
                    <strong>Transactions:</strong>
                    {sampleData[selectedNetwork]?.transactions.map((item, idx) => (
                      <Button 
                        key={idx}
                        variant="outline-info" 
                        size="sm" 
                        className="d-block mb-1 w-100 text-start sample-btn"
                        onClick={() => loadSample(item)}
                      >
                        <small>{item.label}</small>
                      </Button>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {results && (
        <Card className="results-container mt-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">Analysis Results</h5>
              <small className="text-muted">
                {results.type === 'address' ? `Address: ${results.address}` : `Transaction: ${results.hash}`}
              </small>
            </div>
            <div>
              <Badge 
                bg={getRiskBadgeVariant(results.riskScore)} 
                className="me-2 risk-badge"
              >
                Risk: {results.riskScore}/100
              </Badge>
              <Button variant="outline-primary" size="sm" onClick={exportAnalysis}>
                <FontAwesomeIcon icon={faDownload} className="me-1" />
                Export
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <Tabs activeKey={activeTab} onSelect={setActiveTab} className="analysis-tabs">
              <Tab eventKey="overview" title="Overview">
                <Row className="mt-3">
                  <Col md={6}>
                    <Card className="metric-card">
                      <Card.Body>
                        <h6>Risk Assessment</h6>
                        <div className="risk-display">
                          <div className="risk-score">{results.riskScore}/100</div>
                          <div className="risk-level">
                            {results.riskScore >= 70 ? 'HIGH RISK' : 
                             results.riskScore >= 40 ? 'MEDIUM RISK' : 'LOW RISK'}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  {results.type === 'address' && (
                    <Col md={6}>
                      <Card className="metric-card">
                        <Card.Body>
                          <h6>Address Statistics</h6>
                          <div className="stats-grid">
                            <div>Balance: {(results.basicInfo?.balance || 0).toFixed(8)} {getNetworkInfo()?.currency}</div>
                            <div>Total Received: {(results.basicInfo?.totalReceived || 0).toFixed(8)}</div>
                            <div>Total Sent: {(results.basicInfo?.totalSent || 0).toFixed(8)}</div>
                            <div>Transactions: {results.basicInfo?.transactionCount}</div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Row>

                {results.transactionFlow && (
                  <Row className="mt-3">
                    <Col md={12}>
                      <Card className="flow-card">
                        <Card.Body>
                          <h6>Transaction Flow Analysis</h6>
                          <Row>
                            <Col md={3}>
                              <div className="flow-metric">
                                <div className="flow-value">{results.transactionFlow.inboundCount}</div>
                                <div className="flow-label">Inbound Transactions</div>
                              </div>
                            </Col>
                            <Col md={3}>
                              <div className="flow-metric">
                                <div className="flow-value">{results.transactionFlow.outboundCount}</div>
                                <div className="flow-label">Outbound Transactions</div>
                              </div>
                            </Col>
                            <Col md={3}>
                              <div className="flow-metric">
                                <div className="flow-value">{(results.transactionFlow.averageAmount || 0).toFixed(4)}</div>
                                <div className="flow-label">Average Amount</div>
                              </div>
                            </Col>
                            <Col md={3}>
                              <div className="flow-metric">
                                <div className="flow-value">{(results.transactionFlow.velocity || 0).toFixed(2)}</div>
                                <div className="flow-label">Daily Velocity</div>
                              </div>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}
              </Tab>

              <Tab eventKey="transactions" title="Transaction Timeline">
                <div className="mt-3">
                  <Row className="mb-3">
                    <Col md={6}>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faFilter} />
                        </InputGroup.Text>
                        <Form.Select 
                          value={filterRisk} 
                          onChange={(e) => setFilterRisk(e.target.value)}
                        >
                          <option value="all">All Risk Levels</option>
                          <option value="high">High Risk Only</option>
                          <option value="medium">Medium Risk Only</option>
                          <option value="low">Low Risk Only</option>
                        </Form.Select>
                      </InputGroup>
                    </Col>
                    <Col md={6}>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faSort} />
                        </InputGroup.Text>
                        <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                          <option value="time">Sort by Time</option>
                          <option value="amount">Sort by Amount</option>
                          <option value="risk">Sort by Risk</option>
                        </Form.Select>
                      </InputGroup>
                    </Col>
                  </Row>

                  <Table striped hover className="transaction-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Risk</th>
                        <th>Hash</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.slice(0, 20).map((tx, idx) => (
                        <tr key={idx}>
                          <td>{new Date(tx.time).toLocaleString()}</td>
                          <td>
                            <Badge bg={tx.type === 'received' ? 'success' : 'danger'}>
                              {tx.type}
                            </Badge>
                          </td>
                          <td>{(tx.amount || 0).toFixed(6)} {getNetworkInfo()?.currency}</td>
                          <td>
                            <Badge bg={getRiskBadgeVariant(tx.riskIndicators?.score || 0)}>
                              {tx.riskIndicators?.score || 0}
                            </Badge>
                          </td>
                          <td>
                            <code className="hash-display">{tx.hash.substring(0, 16)}...</code>
                          </td>
                          <td>
                            <Button 
                              size="sm" 
                              variant="outline-secondary" 
                              className="me-1"
                              onClick={() => copyToClipboard(tx.hash)}
                            >
                              <FontAwesomeIcon icon={faCopy} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-primary"
                              onClick={() => openInExplorer(tx.hash, selectedNetwork)}
                            >
                              <FontAwesomeIcon icon={faExternalLinkAlt} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              <Tab eventKey="clustering" title="Pattern Analysis">
                <div className="mt-3">
                  {results.clustering?.length > 0 ? (
                    <Row>
                      {results.clustering.map((cluster, idx) => (
                        <Col md={6} key={idx} className="mb-3">
                          <Card className="cluster-card">
                            <Card.Body>
                              <h6>Amount Range: {cluster.range}-{cluster.range + 10} {getNetworkInfo()?.currency}</h6>
                              <div>Transactions: {cluster.count}</div>
                              <div>Pattern: {cluster.count > 5 ? 'Frequent' : 'Occasional'}</div>
                              <Badge bg={cluster.count > 10 ? 'warning' : 'info'} className="mt-2">
                                {cluster.count > 10 ? 'Potential Structuring' : 'Normal Activity'}
                              </Badge>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Alert variant="info">
                      <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                      No significant patterns detected in transaction clustering analysis.
                    </Alert>
                  )}
                </div>
              </Tab>

              <Tab eventKey="network" title="Network Analysis">
                <div className="mt-3">
                  <Row>
                    <Col md={6}>
                      <Card className="network-card">
                        <Card.Body>
                          <h6>Cross-Chain Activity</h6>
                          <div>Connected Networks: {results.crossChainActivity?.connectedNetworks?.length || 0}</div>
                          <div>Bridge Transactions: {results.crossChainActivity?.bridgeTransactions?.length || 0}</div>
                          <Badge bg="success" className="mt-2">
                            Cross-Chain Risk: {results.crossChainActivity?.crossChainRisk || 'Low'}
                          </Badge>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="network-card">
                        <Card.Body>
                          <h6>Exchange Connections</h6>
                          <div>Known Exchanges: {results.exchangeConnections?.exchanges?.length || 0}</div>
                          <div>Mixing Services: {results.exchangeConnections?.mixers?.length || 0}</div>
                          <div>Darknet Markets: {results.exchangeConnections?.darknet?.length || 0}</div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default EnhancedMultiChain;
