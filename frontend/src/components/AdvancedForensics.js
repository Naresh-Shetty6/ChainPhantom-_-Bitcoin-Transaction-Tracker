import React, { useState } from 'react';
import { Card, Form, Button, Alert, Table, Badge, Row, Col, Tabs, Tab, ProgressBar, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faShieldAlt, faExclamationTriangle, faGavel,
  faArrowRight, faDownload, faEye
} from '@fortawesome/free-solid-svg-icons';
import { useNetwork } from '../contexts/NetworkContext';
import { getTestnetForensicAnalysis } from '../utils/testnetMockData';
import './AdvancedForensics.css';

const AdvancedForensics = () => {
  const { isTestnet } = useNetwork();
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState('address');
  const [network, setNetwork] = useState('bitcoin');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');

  // Sample addresses for testing
  const sampleAddresses = {
    bitcoin: [
      '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', // Genesis block
      '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', // Silk Road
      '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy'  // BitFinex hack
    ],
    ethereum: [
      '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', // Ethereum Foundation
      '0x742d35Cc6634C0532925a3b8D4C9db4C8b7c9d4E', // Binance
      '0x1062a747393198f70F71ec65A582423Dba7E5Ab3'  // Crypto.com
    ]
  };

  const performForensicAnalysis = async () => {
    if (!searchInput.trim()) {
      setError('Please enter an address or transaction hash');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let analysisData = {};

      // Use testnet mock data if in testnet mode
      if (isTestnet) {
        setTimeout(() => {
          if (searchType === 'address') {
            const mockAnalysis = getTestnetForensicAnalysis(searchInput);
            analysisData = {
              type: 'address',
              address: searchInput,
              network: network,
              balance: Math.random() * 100,
              totalReceived: mockAnalysis.totalVolume,
              totalSent: mockAnalysis.totalVolume * 0.9,
              transactionCount: mockAnalysis.transactionCount,
              transactions: [],
              riskScore: mockAnalysis.riskScore,
              suspiciousPatterns: mockAnalysis.patterns,
              exchangeInfo: [],
              clustering: {},
              timeline: []
            };
          } else {
            // Transaction analysis for testnet
            const { getTestnetTransaction } = require('../utils/testnetMockData');
            const mockTx = getTestnetTransaction(searchInput);
            analysisData = {
              type: 'transaction',
              hash: searchInput,
              network: network,
              transaction: mockTx,
              riskScore: Math.floor(Math.random() * 100),
              suspiciousPatterns: [],
              exchangeInfo: []
            };
          }
          setResults(analysisData);
          setActiveTab('analysis');
          setLoading(false);
        }, 800);
        return;
      }

      if (searchType === 'address') {
        // Address analysis
        const [basicInfo, suspiciousPatterns, exchangeInfo] = await Promise.all([
          fetch(`http://localhost:5000/api/search/${searchInput}`).then(r => r.json()).catch(() => ({})),
          fetch(`http://localhost:5000/api/analyze/${searchInput}`).then(r => r.json()).catch(() => ({})),
          fetch(`http://localhost:5000/api/exchange/identify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ addresses: [searchInput] })
          }).then(r => r.json()).catch(() => ({}))
        ]);

        analysisData = {
          type: 'address',
          address: searchInput,
          network: network,
          balance: basicInfo.balance || 0,
          totalReceived: basicInfo.total_received || 0,
          totalSent: basicInfo.total_sent || 0,
          transactionCount: basicInfo.n_tx || 0,
          transactions: basicInfo.txs || [],
          riskScore: suspiciousPatterns.riskScore || calculateRiskScore(basicInfo),
          suspiciousPatterns: suspiciousPatterns.patterns || [],
          exchangeInfo: exchangeInfo.results || [],
          clustering: performWalletClustering(basicInfo.txs || []),
          timeline: generateTransactionTimeline(basicInfo.txs || [])
        };
      } else {
        // Transaction analysis
        const txInfo = await fetch(`http://localhost:5000/api/tx/${searchInput}`)
          .then(r => r.json())
          .catch(() => ({}));

        analysisData = {
          type: 'transaction',
          hash: searchInput,
          network: network,
          transaction: txInfo,
          riskScore: analyzeTxRisk(txInfo),
          flowAnalysis: analyzeTransactionFlow(txInfo),
          addressAnalysis: await analyzeInvolvedAddresses(txInfo)
        };
      }

      setResults(analysisData);
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskScore = (data) => {
    let score = 0;
    
    // High transaction frequency
    if (data.n_tx > 1000) score += 20;
    else if (data.n_tx > 100) score += 10;
    
    // Large amounts
    const totalValue = (data.total_received || 0) + (data.total_sent || 0);
    if (totalValue > 1000000000000) score += 30; // > 10,000 BTC
    else if (totalValue > 100000000000) score += 15; // > 1,000 BTC
    
    // Round number transactions (potential structuring)
    const roundTxs = (data.txs || []).filter(tx => 
      tx.total % 100000000 === 0 // Exact BTC amounts
    ).length;
    if (roundTxs > 5) score += 25;
    
    return Math.min(score, 100);
  };

  const performWalletClustering = (transactions) => {
    const clusters = new Map();
    const addressFreq = new Map();
    
    transactions.forEach(tx => {
      tx.inputs?.forEach(input => {
        const addr = input.addresses?.[0];
        if (addr) {
          addressFreq.set(addr, (addressFreq.get(addr) || 0) + 1);
        }
      });
      
      tx.outputs?.forEach(output => {
        const addr = output.addresses?.[0];
        if (addr) {
          addressFreq.set(addr, (addressFreq.get(addr) || 0) + 1);
        }
      });
    });
    
    return Array.from(addressFreq.entries())
      .filter(([addr, freq]) => freq > 2)
      .map(([addr, freq]) => ({ address: addr, frequency: freq }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  };

  const generateTransactionTimeline = (transactions) => {
    return transactions.slice(0, 20).map(tx => ({
      hash: tx.hash,
      time: new Date(tx.received),
      amount: Math.abs(tx.total) / 100000000,
      type: tx.total > 0 ? 'received' : 'sent',
      confirmations: tx.confirmations
    })).sort((a, b) => b.time - a.time);
  };

  const analyzeTxRisk = (tx) => {
    let risk = 0;
    
    // Large transaction
    if (tx.total > 1000000000) risk += 30; // > 10 BTC
    
    // Many inputs (potential mixing)
    if (tx.inputs?.length > 10) risk += 25;
    
    // Many outputs (potential distribution)
    if (tx.outputs?.length > 20) risk += 20;
    
    // Low fee (potential spam/dust)
    if (tx.fees < 1000) risk += 15;
    
    return Math.min(risk, 100);
  };

  const analyzeTransactionFlow = (tx) => {
    const inputSum = tx.inputs?.reduce((sum, input) => sum + (input.output_value || 0), 0) || 0;
    const outputSum = tx.outputs?.reduce((sum, output) => sum + (output.value || 0), 0) || 0;
    
    return {
      inputCount: tx.inputs?.length || 0,
      outputCount: tx.outputs?.length || 0,
      totalInput: inputSum / 100000000,
      totalOutput: outputSum / 100000000,
      fees: (tx.fees || 0) / 100000000,
      complexity: ((tx.inputs?.length || 0) + (tx.outputs?.length || 0)) / 2
    };
  };

  const analyzeInvolvedAddresses = async (tx) => {
    const addresses = new Set();
    
    tx.inputs?.forEach(input => {
      input.addresses?.forEach(addr => addresses.add(addr));
    });
    
    tx.outputs?.forEach(output => {
      output.addresses?.forEach(addr => addresses.add(addr));
    });
    
    return Array.from(addresses).slice(0, 10);
  };

  const exportForensicReport = () => {
    if (!results) return;
    
    const report = {
      timestamp: new Date().toISOString(),
      investigator: 'ChainPhantom Forensic System',
      subject: results.type === 'address' ? results.address : results.hash,
      network: results.network,
      riskAssessment: {
        score: results.riskScore,
        level: results.riskScore > 70 ? 'HIGH' : results.riskScore > 40 ? 'MEDIUM' : 'LOW'
      },
      findings: {
        suspiciousPatterns: results.suspiciousPatterns || [],
        exchangeConnections: results.exchangeInfo || [],
        clustering: results.clustering || [],
        recommendations: generateInvestigationRecommendations(results)
      },
      summary: generateExecutiveSummary(results)
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensic-report-${results.type}-${Date.now()}.json`;
    a.click();
  };

  const generateInvestigationRecommendations = (data) => {
    const recommendations = [];
    
    if (data.riskScore > 70) {
      recommendations.push('HIGH PRIORITY: Enhanced due diligence required');
      recommendations.push('Consider freezing associated accounts pending investigation');
    }
    
    if (data.exchangeInfo?.length > 0) {
      recommendations.push('Subpoena exchange records for KYC information');
      recommendations.push('Request transaction history from identified exchanges');
    }
    
    if (data.clustering?.length > 5) {
      recommendations.push('Investigate wallet clustering patterns');
      recommendations.push('Analyze co-spending relationships');
    }
    
    return recommendations;
  };

  const generateExecutiveSummary = (data) => {
    const riskLevel = data.riskScore > 70 ? 'HIGH' : data.riskScore > 40 ? 'MEDIUM' : 'LOW';
    
    if (data.type === 'address') {
      return `Forensic analysis of ${data.network} address ${data.address} reveals ${riskLevel} risk profile. ` +
             `Address has ${data.transactionCount} transactions with total volume of ${((data.totalReceived + data.totalSent) / 100000000).toFixed(2)} ${data.network.toUpperCase()}. ` +
             `${data.suspiciousPatterns.length} suspicious patterns detected. ${data.exchangeInfo.length} exchange connections identified.`;
    } else {
      return `Transaction ${data.hash} analysis shows ${riskLevel} risk indicators. ` +
             `Transaction involves ${data.flowAnalysis?.inputCount || 0} inputs and ${data.flowAnalysis?.outputCount || 0} outputs ` +
             `with complexity score of ${data.flowAnalysis?.complexity || 0}.`;
    }
  };

  const loadSampleAddress = (addr) => {
    setSearchInput(addr);
    setSearchType('address');
  };

  return (
    <div className="advanced-forensics">
      <Card className="forensics-header">
        <Card.Header>
          <h3>
            <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
            Advanced Blockchain Forensics
          </h3>
          <p className="mb-0">Professional-grade cryptocurrency investigation platform</p>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <Form onSubmit={(e) => { e.preventDefault(); performForensicAnalysis(); }}>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Select value={network} onChange={(e) => setNetwork(e.target.value)}>
                      <option value="bitcoin">Bitcoin</option>
                      <option value="ethereum">Ethereum</option>
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <Form.Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                      <option value="address">Address Analysis</option>
                      <option value="transaction">Transaction Analysis</option>
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <Button type="submit" disabled={loading} className="w-100">
                      {loading ? 'Analyzing...' : 'Investigate'}
                      <FontAwesomeIcon icon={faSearch} className="ms-2" />
                    </Button>
                  </Col>
                </Row>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder={`Enter ${searchType} for forensic analysis...`}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </InputGroup>
              </Form>
            </Col>
            <Col md={4}>
              <Card className="sample-data">
                <Card.Header>
                  <small>Sample Test Data</small>
                </Card.Header>
                <Card.Body className="p-2">
                  {sampleAddresses[network].map((addr, idx) => (
                    <Button 
                      key={idx}
                      variant="outline-secondary" 
                      size="sm" 
                      className="mb-1 w-100 text-start"
                      onClick={() => loadSampleAddress(addr)}
                    >
                      <code>{addr.substring(0, 20)}...</code>
                    </Button>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {error && (
            <Alert variant="danger" className="mt-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              {error}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {loading && (
        <Card className="mt-4">
          <Card.Body className="text-center">
            <h5>Performing Advanced Forensic Analysis</h5>
            <ProgressBar animated now={100} className="mb-3" />
            <p>Analyzing patterns, clustering wallets, and assessing risk factors...</p>
          </Card.Body>
        </Card>
      )}

      {results && (
        <Card className="mt-4 results-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">Forensic Investigation Report</h5>
              <small className="text-muted">
                {results.type === 'address' ? `Address: ${results.address}` : `Transaction: ${results.hash}`}
              </small>
            </div>
            <div>
              <Badge 
                bg={results.riskScore > 70 ? 'danger' : results.riskScore > 40 ? 'warning' : 'success'}
                className="me-2"
              >
                Risk: {results.riskScore}/100
              </Badge>
              <Button variant="primary" size="sm" onClick={exportForensicReport}>
                <FontAwesomeIcon icon={faDownload} className="me-1" />
                Export Report
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <Tabs activeKey={activeTab} onSelect={setActiveTab}>
              <Tab eventKey="analysis" title="Risk Analysis">
                <Row className="mt-3">
                  <Col md={6}>
                    <Card className="metric-card">
                      <Card.Body>
                        <h6>Risk Assessment</h6>
                        <div className="risk-meter">
                          <ProgressBar 
                            now={results.riskScore} 
                            variant={results.riskScore > 70 ? 'danger' : results.riskScore > 40 ? 'warning' : 'success'}
                            label={`${results.riskScore}%`}
                          />
                        </div>
                        <div className="mt-2">
                          <small>
                            Level: <strong>{results.riskScore > 70 ? 'HIGH RISK' : results.riskScore > 40 ? 'MEDIUM RISK' : 'LOW RISK'}</strong>
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  {results.type === 'address' && (
                    <Col md={6}>
                      <Card className="metric-card">
                        <Card.Body>
                          <h6>Address Statistics</h6>
                          <div>Balance: {(results.balance / 100000000).toFixed(8)} {results.network.toUpperCase()}</div>
                          <div>Total Received: {(results.totalReceived / 100000000).toFixed(8)}</div>
                          <div>Total Sent: {(results.totalSent / 100000000).toFixed(8)}</div>
                          <div>Transactions: {results.transactionCount}</div>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Row>
              </Tab>

              <Tab eventKey="clustering" title="Wallet Clustering">
                {results.clustering?.length > 0 ? (
                  <Table striped className="mt-3">
                    <thead>
                      <tr>
                        <th>Related Address</th>
                        <th>Interaction Frequency</th>
                        <th>Risk Level</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.clustering.map((cluster, idx) => (
                        <tr key={idx}>
                          <td><code>{cluster.address}</code></td>
                          <td>{cluster.frequency} transactions</td>
                          <td>
                            <Badge bg={cluster.frequency > 10 ? 'danger' : cluster.frequency > 5 ? 'warning' : 'info'}>
                              {cluster.frequency > 10 ? 'High' : cluster.frequency > 5 ? 'Medium' : 'Low'}
                            </Badge>
                          </td>
                          <td>
                            <Button size="sm" variant="outline-primary" onClick={() => loadSampleAddress(cluster.address)}>
                              <FontAwesomeIcon icon={faEye} /> Investigate
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info" className="mt-3">No significant wallet clustering detected</Alert>
                )}
              </Tab>

              <Tab eventKey="timeline" title="Transaction Timeline">
                {results.timeline?.length > 0 ? (
                  <Table striped className="mt-3">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Transaction</th>
                        <th>Confirmations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.timeline.map((tx, idx) => (
                        <tr key={idx}>
                          <td>{tx.time.toLocaleString()}</td>
                          <td>
                            <Badge bg={tx.type === 'received' ? 'success' : 'danger'}>
                              {tx.type}
                            </Badge>
                          </td>
                          <td>{tx.amount.toFixed(8)}</td>
                          <td><code>{tx.hash.substring(0, 16)}...</code></td>
                          <td>{tx.confirmations}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info" className="mt-3">No transaction timeline available</Alert>
                )}
              </Tab>

              <Tab eventKey="recommendations" title="Investigation Actions">
                <div className="mt-3">
                  <Alert variant="info">
                    <Alert.Heading>
                      <FontAwesomeIcon icon={faGavel} className="me-2" />
                      Investigation Recommendations
                    </Alert.Heading>
                    <ul className="mb-0">
                      {generateInvestigationRecommendations(results).map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </Alert>
                  
                  <Card>
                    <Card.Header>Executive Summary</Card.Header>
                    <Card.Body>
                      <p>{generateExecutiveSummary(results)}</p>
                    </Card.Body>
                  </Card>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AdvancedForensics;
