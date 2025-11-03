import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MultiChainSearch from './MultiChainSearch';
import MultiChainResults from './MultiChainResults';
import './MultiChainDashboard.css';

const MultiChainDashboard = () => {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <Container fluid className="multichain-dashboard">
      <Row>
        <Col lg={4} xl={3}>
          <div className="search-panel">
            <MultiChainSearch onResults={handleSearchResults} />
          </div>
        </Col>
        <Col lg={8} xl={9}>
          <div className="results-panel">
            {searchResults ? (
              <MultiChainResults results={searchResults} />
            ) : (
              <div className="welcome-message">
                <div className="welcome-content">
                  <h3>Multi-Chain Blockchain Analysis</h3>
                  <p>
                    Analyze Bitcoin and Ethereum addresses and transactions with advanced 
                    forensic capabilities including suspicious pattern detection, exchange 
                    identification, and risk assessment.
                  </p>
                  <div className="features-list">
                    <div className="feature-item">
                      <i className="fas fa-search"></i>
                      <span>Cross-chain address analysis</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-shield-alt"></i>
                      <span>Risk scoring and pattern detection</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-building"></i>
                      <span>Exchange and service identification</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-chart-line"></i>
                      <span>Transaction flow visualization</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MultiChainDashboard;
