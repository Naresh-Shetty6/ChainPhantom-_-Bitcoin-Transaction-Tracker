import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Table, Badge, Row, Col, Tabs, Tab, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faShieldAlt, faExclamationTriangle, faBuilding,
  faUserSecret, faChartLine, faFileExport, faGavel, faNetworkWired
} from '@fortawesome/free-solid-svg-icons';
import './ForensicAnalyzer.css';

const ForensicAnalyzer = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const analyzeAddress = async () => {
    if (!address.trim()) {
      setError('Please enter a Bitcoin address');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Parallel API calls for comprehensive analysis
      const [basicInfo, suspiciousPatterns, exchangeAnalysis] = await Promise.all([
        fetch(`http://localhost:5000/api/search/${address}`).then(r => r.json()),
        fetch(`http://localhost:5000/api/analyze/${address}`).then(r => r.json()),
        fetch(`http://localhost:5000/api/exchange/generate-lea-actions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, transactions: [] })
        }).then(r => r.json())
      ]);

      // Comprehensive forensic analysis
      const forensicReport = {
        address,
        basicInfo,
        riskAssessment: {
          overallScore: suspiciousPatterns.riskScore || 0,
          riskLevel: suspiciousPatterns.riskLevel || 'low',
          patterns: suspiciousPatterns.patterns || []
        },
        exchangeConnections: exchangeAnalysis,
        timeline: generateTimeline(basicInfo.txs || []),
        flowAnalysis: analyzeTransactionFlow(basicInfo.txs || []),
        recommendations: generateRecommendations(suspiciousPatterns, exchangeAnalysis)
      };

      setAnalysis(forensicReport);
    } catch (err) {
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeline = (transactions) => {
    return transactions.slice(0, 10).map(tx => ({
      date: new Date(tx.received).toLocaleDateString(),
      amount: (tx.total / 100000000).toFixed(8),
      type: tx.total > 0 ? 'received' : 'sent',
      hash: tx.hash
    }));
  };

  const analyzeTransactionFlow = (transactions) => {
    const totalReceived = transactions.reduce((sum, tx) => sum + (tx.total > 0 ? tx.total : 0), 0);
    const totalSent = transactions.reduce((sum, tx) => sum + (tx.total < 0 ? Math.abs(tx.total) : 0), 0);
    
    return {
      totalReceived: (totalReceived / 100000000).toFixed(8),
      totalSent: (totalSent / 100000000).toFixed(8),
      netFlow: ((totalReceived - totalSent) / 100000000).toFixed(8),
      transactionCount: transactions.length,
      averageAmount: transactions.length > 0 ? ((totalReceived + totalSent) / transactions.length / 100000000).toFixed(8) : '0'
    };
  };

  const generateRecommendations = (suspicious, exchange) => {
    const recommendations = [];
    
    if (suspicious.riskScore > 50) {
      recommendations.push({
        type: 'high_risk',
        action: 'Enhanced Due Diligence Required',
        description: 'Address shows multiple suspicious patterns requiring detailed investigation'
      });
    }

    if (exchange.serviceConnections?.mixers?.length > 0) {
      recommendations.push({
        type: 'mixer_detected',
        action: 'Mixer Investigation',
        description: 'Address has connections to cryptocurrency mixers - potential money laundering'
      });
    }

    if (exchange.serviceConnections?.exchanges?.length > 0) {
      recommendations.push({
        type: 'exchange_kyc',
        action: 'Request KYC Data',
        description: 'Subpoena exchange records for identity verification'
      });
    }

    return recommendations;
  };

  const exportReport = () => {
    if (!analysis) return;
    
    const reportData = {
      timestamp: new Date().toISOString(),
      address: analysis.address,
      riskLevel: analysis.riskAssessment.riskLevel,
      riskScore: analysis.riskAssessment.overallScore,
      recommendations: analysis.recommendations,
      summary: `Forensic analysis of Bitcoin address ${analysis.address} completed with ${analysis.riskAssessment.riskLevel} risk level.`
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensic-report-${analysis.address.substring(0, 8)}.json`;
    a.click();
  };

  return (
    <div className="forensic-analyzer">
      <Card className="analyzer-header">
        <Card.Header>
          <h4>
            <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
            Blockchain Forensic Analyzer
          </h4>
          <p className="mb-0">Comprehensive cryptocurrency investigation tool for law enforcement</p>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => { e.preventDefault(); analyzeAddress(); }}>
            <Row>
              <Col md={8}>
                <Form.Control
                  type="text"
                  placeholder="Enter Bitcoin address for forensic analysis..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="analyzer-input"
                />
              </Col>
              <Col md={4}>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                  className="w-100 analyzer-btn"
                >
                  {loading ? 'Analyzing...' : 'Start Analysis'}
                  <FontAwesomeIcon icon={faSearch} className="ms-2" />
                </Button>
              </Col>
            </Row>
          </Form>

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
            <h5>Performing Forensic Analysis</h5>
            <ProgressBar animated now={100} className="mb-3" />
            <p>Analyzing transaction patterns, exchange connections, and risk factors...</p>
          </Card.Body>
        </Card>
      )}

      {analysis && (
        <Card className="mt-4 analysis-results">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">Forensic Analysis Report</h5>
              <small className="text-muted">Address: {analysis.address}</small>
            </div>
            <div>
              <Badge 
                bg={analysis.riskAssessment.riskLevel === 'high' ? 'danger' : 
                    analysis.riskAssessment.riskLevel === 'medium' ? 'warning' : 'success'}
                className="me-2"
              >
                Risk: {analysis.riskAssessment.riskLevel.toUpperCase()}
              </Badge>
              <Button variant="outline-primary" size="sm" onClick={exportReport}>
                <FontAwesomeIcon icon={faFileExport} className="me-1" />
                Export Report
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
              <Tab eventKey="overview" title="Overview">
                <Row>
                  <Col md={6}>
                    <Card className="metric-card">
                      <Card.Body>
                        <h6>Risk Assessment</h6>
                        <div className="risk-score">
                          Score: {analysis.riskAssessment.overallScore}/100
                        </div>
                        <ProgressBar 
                          now={analysis.riskAssessment.overallScore} 
                          variant={analysis.riskAssessment.riskLevel === 'high' ? 'danger' : 
                                  analysis.riskAssessment.riskLevel === 'medium' ? 'warning' : 'success'}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="metric-card">
                      <Card.Body>
                        <h6>Transaction Flow</h6>
                        <div>Total Received: {analysis.flowAnalysis.totalReceived} BTC</div>
                        <div>Total Sent: {analysis.flowAnalysis.totalSent} BTC</div>
                        <div>Net Flow: {analysis.flowAnalysis.netFlow} BTC</div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab>

              <Tab eventKey="patterns" title="Suspicious Patterns">
                {analysis.riskAssessment.patterns.length > 0 ? (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Pattern Type</th>
                        <th>Description</th>
                        <th>Severity</th>
                        <th>Evidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.riskAssessment.patterns.map((pattern, index) => (
                        <tr key={index}>
                          <td>{pattern.type.replace(/_/g, ' ').toUpperCase()}</td>
                          <td>{pattern.description}</td>
                          <td>
                            <Badge bg={pattern.severity === 'high' ? 'danger' : 
                                      pattern.severity === 'medium' ? 'warning' : 'info'}>
                              {pattern.severity}
                            </Badge>
                          </td>
                          <td>{pattern.transactions?.length || 0} transactions</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="success">
                    <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                    No suspicious patterns detected
                  </Alert>
                )}
              </Tab>

              <Tab eventKey="recommendations" title="LEA Actions">
                {analysis.recommendations.length > 0 ? (
                  <div className="recommendations">
                    {analysis.recommendations.map((rec, index) => (
                      <Alert key={index} variant="info">
                        <Alert.Heading>
                          <FontAwesomeIcon icon={faGavel} className="me-2" />
                          {rec.action}
                        </Alert.Heading>
                        <p>{rec.description}</p>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <Alert variant="success">
                    No immediate law enforcement actions required
                  </Alert>
                )}
              </Tab>

              <Tab eventKey="timeline" title="Transaction Timeline">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Amount (BTC)</th>
                      <th>Transaction Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.timeline.map((item, index) => (
                      <tr key={index}>
                        <td>{item.date}</td>
                        <td>
                          <Badge bg={item.type === 'received' ? 'success' : 'danger'}>
                            {item.type}
                          </Badge>
                        </td>
                        <td>{item.amount}</td>
                        <td>
                          <code>{item.hash.substring(0, 16)}...</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ForensicAnalyzer;
