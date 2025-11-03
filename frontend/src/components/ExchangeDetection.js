import React, { useState, useEffect } from 'react';
import { Card, Badge, Alert, Table, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBuilding, faExclamationTriangle, faEye, 
  faGavel, faShieldAlt, faDice, faUserSecret 
} from '@fortawesome/free-solid-svg-icons';
import './ExchangeDetection.css';

const ExchangeDetection = ({ address, transactions }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (address && transactions) {
      analyzeExchangeConnections();
    }
  }, [address, transactions]);

  const analyzeExchangeConnections = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/exchange/generate-lea-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          transactions
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze exchange connections');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const getServiceIcon = (type) => {
    switch (type) {
      case 'exchange': return faBuilding;
      case 'mixer': return faUserSecret;
      case 'darknet': return faExclamationTriangle;
      case 'gambling': return faDice;
      default: return faEye;
    }
  };

  const getServiceColor = (type) => {
    switch (type) {
      case 'exchange': return '#007bff';
      case 'mixer': return '#dc3545';
      case 'darknet': return '#000000';
      case 'gambling': return '#ffc107';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <Card className="exchange-detection-card">
        <Card.Header>
          <FontAwesomeIcon icon={faBuilding} className="me-2" />
          Exchange & Service Detection
        </Card.Header>
        <Card.Body className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Analyzing service connections...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="exchange-detection-card">
        <Card.Header>
          <FontAwesomeIcon icon={faBuilding} className="me-2" />
          Exchange & Service Detection
        </Card.Header>
        <Card.Body>
          <Alert variant="danger">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            {error}
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="exchange-detection-container">
      <Card className="exchange-detection-card mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <FontAwesomeIcon icon={faBuilding} className="me-2" />
            Exchange & Service Detection
          </div>
          <Badge bg={getRiskBadgeVariant(analysis.riskLevel)} className="risk-badge">
            Risk: {analysis.riskLevel.toUpperCase()} ({analysis.riskScore})
          </Badge>
        </Card.Header>
        <Card.Body>
          {/* Service Connections Summary */}
          <div className="service-summary mb-4">
            <div className="row">
              <div className="col-md-3">
                <div className="service-stat">
                  <FontAwesomeIcon icon={faBuilding} style={{color: '#007bff'}} />
                  <div className="stat-number">{analysis.serviceConnections.exchanges.length}</div>
                  <div className="stat-label">Exchanges</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="service-stat">
                  <FontAwesomeIcon icon={faUserSecret} style={{color: '#dc3545'}} />
                  <div className="stat-number">{analysis.serviceConnections.mixers.length}</div>
                  <div className="stat-label">Mixers</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="service-stat">
                  <FontAwesomeIcon icon={faExclamationTriangle} style={{color: '#000000'}} />
                  <div className="stat-number">{analysis.serviceConnections.darknet.length}</div>
                  <div className="stat-label">Darknet</div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="service-stat">
                  <FontAwesomeIcon icon={faDice} style={{color: '#ffc107'}} />
                  <div className="stat-number">{analysis.serviceConnections.gambling.length}</div>
                  <div className="stat-label">Gambling</div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          {Object.entries(analysis.serviceConnections).map(([serviceType, services]) => {
            if (services.length === 0) return null;
            
            return (
              <div key={serviceType} className="service-section mb-4">
                <h6 className="service-section-title">
                  <FontAwesomeIcon 
                    icon={getServiceIcon(serviceType)} 
                    style={{color: getServiceColor(serviceType)}}
                    className="me-2"
                  />
                  {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Connections
                </h6>
                <Table striped bordered hover size="sm" className="service-table">
                  <thead>
                    <tr>
                      <th>Service Name</th>
                      <th>Direction</th>
                      <th>Risk Level</th>
                      <th>Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{service.name}</strong>
                          {service.country && <div className="text-muted small">{service.country}</div>}
                        </td>
                        <td>
                          <Badge bg={service.direction === 'input' ? 'success' : 'primary'}>
                            {service.direction === 'input' ? 'Received From' : 'Sent To'}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getRiskBadgeVariant(service.riskLevel)}>
                            {service.riskLevel}
                          </Badge>
                        </td>
                        <td className="tx-hash">
                          <code>{service.txHash.substring(0, 16)}...</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            );
          })}
        </Card.Body>
      </Card>

      {/* LEA Actions */}
      {analysis.leaActions && analysis.leaActions.length > 0 && (
        <Card className="lea-actions-card">
          <Card.Header>
            <FontAwesomeIcon icon={faGavel} className="me-2" />
            Law Enforcement Action Recommendations
          </Card.Header>
          <Card.Body>
            {analysis.leaActions.map((action, index) => (
              <Alert 
                key={index} 
                variant={action.priority === 'critical' ? 'danger' : action.priority === 'high' ? 'warning' : 'info'}
                className="lea-action-alert"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Alert.Heading className="h6">
                      <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
                      {action.action.replace(/_/g, ' ').toUpperCase()}
                    </Alert.Heading>
                    <p className="mb-2">{action.description}</p>
                    {action.recommendation && (
                      <div className="recommendation">
                        <strong>Recommendation:</strong> {action.recommendation}
                      </div>
                    )}
                    {action.legalBasis && (
                      <div className="legal-basis">
                        <strong>Legal Basis:</strong> {action.legalBasis}
                      </div>
                    )}
                  </div>
                  <Badge bg={action.urgency === 'immediate' ? 'danger' : 'warning'}>
                    {action.urgency}
                  </Badge>
                </div>
              </Alert>
            ))}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ExchangeDetection;
