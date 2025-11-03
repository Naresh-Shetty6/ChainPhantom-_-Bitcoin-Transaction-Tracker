import React from 'react';
import { Card, Badge, Table, Alert, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBitcoinSign, faCoins, faWallet, faExchangeAlt,
  faExclamationTriangle, faShieldAlt, faHistory
} from '@fortawesome/free-solid-svg-icons';
import ExchangeDetection from './ExchangeDetection';
import './MultiChainResults.css';

const MultiChainResults = ({ results }) => {
  if (!results) return null;

  const getNetworkIcon = (network) => {
    switch (network) {
      case 'ethereum': return faCoins;
      case 'bitcoin': return faBitcoinSign;
      default: return faWallet;
    }
  };

  const getNetworkColor = (network) => {
    switch (network) {
      case 'ethereum': return '#627eea';
      case 'bitcoin': return '#f7931a';
      default: return '#6c757d';
    }
  };

  const getRiskBadgeVariant = (riskLevel) => {
    switch (riskLevel) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'success';
    }
  };

  const formatValue = (value, network) => {
    if (network === 'ethereum') {
      return `${parseFloat(value).toFixed(6)} ETH`;
    } else if (network === 'bitcoin') {
      return `${(parseFloat(value) / 100000000).toFixed(8)} BTC`;
    }
    return value;
  };

  const renderAddressResults = () => (
    <div className="multichain-results">
      {/* Header Card */}
      <Card className="results-header-card mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <FontAwesomeIcon 
              icon={getNetworkIcon(results.network)} 
              style={{ color: getNetworkColor(results.network) }}
              className="me-2"
            />
            {results.network.charAt(0).toUpperCase() + results.network.slice(1)} Address Analysis
          </div>
          {results.overallRiskLevel && (
            <Badge bg={getRiskBadgeVariant(results.overallRiskLevel)} className="risk-badge">
              Risk: {results.overallRiskLevel.toUpperCase()}
            </Badge>
          )}
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="address-info">
                <h6>Address</h6>
                <code className="address-hash">{results.address}</code>
              </div>
            </Col>
            <Col md={6}>
              <div className="balance-info">
                <h6>Balance</h6>
                <div className="balance-amount">
                  <FontAwesomeIcon icon={faCoins} className="me-2" />
                  {results.balanceFormatted}
                </div>
              </div>
            </Col>
          </Row>
          
          <Row className="mt-3">
            <Col md={4}>
              <div className="stat-item">
                <div className="stat-number">{results.transactionCount || results.transactions?.length || 0}</div>
                <div className="stat-label">Total Transactions</div>
              </div>
            </Col>
            {results.tokenTransfers && (
              <Col md={4}>
                <div className="stat-item">
                  <div className="stat-number">{results.tokenTransfers.length}</div>
                  <div className="stat-label">Token Transfers</div>
                </div>
              </Col>
            )}
            {results.suspiciousPatterns && (
              <Col md={4}>
                <div className="stat-item">
                  <div className="stat-number">{results.suspiciousPatterns.patterns?.length || 0}</div>
                  <div className="stat-label">Suspicious Patterns</div>
                </div>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Suspicious Patterns */}
      {results.suspiciousPatterns && results.suspiciousPatterns.patterns?.length > 0 && (
        <Card className="suspicious-patterns-card mb-4">
          <Card.Header>
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            Suspicious Activity Detected
          </Card.Header>
          <Card.Body>
            {results.suspiciousPatterns.patterns.map((pattern, index) => (
              <Alert 
                key={index}
                variant={pattern.severity === 'high' ? 'danger' : pattern.severity === 'medium' ? 'warning' : 'info'}
                className="pattern-alert"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Alert.Heading className="h6">
                      {pattern.type.replace(/_/g, ' ').toUpperCase()}
                    </Alert.Heading>
                    <p className="mb-2">{pattern.description}</p>
                    {pattern.transactions && (
                      <div className="related-txs">
                        <small className="text-muted">Related transactions:</small>
                        {pattern.transactions.slice(0, 3).map((txHash, i) => (
                          <div key={i} className="tx-hash-small">
                            <code>{txHash.substring(0, 16)}...</code>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Badge bg={pattern.severity === 'high' ? 'danger' : pattern.severity === 'medium' ? 'warning' : 'info'}>
                    {pattern.severity}
                  </Badge>
                </div>
              </Alert>
            ))}
          </Card.Body>
        </Card>
      )}

      {/* Exchange Detection for Ethereum */}
      {results.network === 'ethereum' && results.exchangeAnalysis && (
        <ExchangeDetection 
          address={results.address} 
          transactions={results.transactions}
        />
      )}

      {/* Token Transfers (Ethereum only) */}
      {results.tokenTransfers && results.tokenTransfers.length > 0 && (
        <Card className="token-transfers-card mb-4">
          <Card.Header>
            <FontAwesomeIcon icon={faExchangeAlt} className="me-2" />
            Recent Token Transfers
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover size="sm" className="token-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>From/To</th>
                  <th>Amount</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {results.tokenTransfers.slice(0, 10).map((transfer, index) => (
                  <tr key={index}>
                    <td>
                      <Badge bg="secondary">{transfer.tokenSymbol}</Badge>
                      <div className="token-name">{transfer.tokenName}</div>
                    </td>
                    <td>
                      <div className="address-direction">
                        {transfer.from.toLowerCase() === results.address.toLowerCase() ? (
                          <span className="text-danger">To: {transfer.to.substring(0, 10)}...</span>
                        ) : (
                          <span className="text-success">From: {transfer.from.substring(0, 10)}...</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {(parseFloat(transfer.value) / Math.pow(10, transfer.tokenDecimal)).toFixed(4)}
                    </td>
                    <td>
                      <small>{new Date(transfer.timeStamp).toLocaleDateString()}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Recent Transactions */}
      {results.transactions && results.transactions.length > 0 && (
        <Card className="transactions-card">
          <Card.Header>
            <FontAwesomeIcon icon={faHistory} className="me-2" />
            Recent Transactions
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover size="sm" className="transactions-table">
              <thead>
                <tr>
                  <th>Hash</th>
                  <th>From/To</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {results.transactions.slice(0, 15).map((tx, index) => (
                  <tr key={index}>
                    <td>
                      <code className="tx-hash">{tx.hash.substring(0, 16)}...</code>
                    </td>
                    <td>
                      <div className="tx-direction">
                        {tx.from.toLowerCase() === results.address.toLowerCase() ? (
                          <span className="text-danger">To: {tx.to.substring(0, 10)}...</span>
                        ) : (
                          <span className="text-success">From: {tx.from.substring(0, 10)}...</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {results.network === 'ethereum' ? 
                        `${parseFloat(tx.valueEth).toFixed(6)} ETH` : 
                        formatValue(tx.value, results.network)
                      }
                    </td>
                    <td>
                      {results.network === 'ethereum' ? (
                        <Badge bg={tx.txreceipt_status === '1' ? 'success' : 'danger'}>
                          {tx.txreceipt_status === '1' ? 'Success' : 'Failed'}
                        </Badge>
                      ) : (
                        <Badge bg="success">Confirmed</Badge>
                      )}
                    </td>
                    <td>
                      <small>{new Date(tx.timeStamp).toLocaleDateString()}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );

  const renderTransactionResults = () => (
    <Card className="transaction-details-card">
      <Card.Header>
        <FontAwesomeIcon 
          icon={getNetworkIcon(results.network)} 
          style={{ color: getNetworkColor(results.network) }}
          className="me-2"
        />
        {results.network.charAt(0).toUpperCase() + results.network.slice(1)} Transaction Details
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <div className="detail-item">
              <strong>Hash:</strong>
              <code className="detail-value">{results.hash}</code>
            </div>
            <div className="detail-item">
              <strong>From:</strong>
              <code className="detail-value">{results.from}</code>
            </div>
            <div className="detail-item">
              <strong>To:</strong>
              <code className="detail-value">{results.to}</code>
            </div>
          </Col>
          <Col md={6}>
            <div className="detail-item">
              <strong>Value:</strong>
              <span className="detail-value">
                {results.network === 'ethereum' ? 
                  `${results.valueEth} ETH` : 
                  formatValue(results.value, results.network)
                }
              </span>
            </div>
            <div className="detail-item">
              <strong>Block:</strong>
              <span className="detail-value">{results.blockNumber}</span>
            </div>
            {results.timestamp && (
              <div className="detail-item">
                <strong>Time:</strong>
                <span className="detail-value">{new Date(results.timestamp).toLocaleString()}</span>
              </div>
            )}
          </Col>
        </Row>
        
        {results.network === 'ethereum' && (
          <Row className="mt-3">
            <Col md={12}>
              <div className="detail-item">
                <strong>Gas Used:</strong>
                <span className="detail-value">{results.gasUsed?.toLocaleString()} / {results.gas?.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <strong>Status:</strong>
                <Badge bg={results.status === 1 ? 'success' : 'danger'}>
                  {results.status === 1 ? 'Success' : 'Failed'}
                </Badge>
              </div>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <div className="multichain-results-container">
      {results.searchType === 'address' ? renderAddressResults() : renderTransactionResults()}
    </div>
  );
};

export default MultiChainResults;
