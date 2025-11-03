import React, { useState } from 'react';
import { Card, Form, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faNetworkWired, faBitcoinSign, 
  faCoins, faExchangeAlt 
} from '@fortawesome/free-solid-svg-icons';
import './MultiChainSearch.css';

const MultiChainSearch = ({ onResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [searchType, setSearchType] = useState('address');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const networks = [
    { value: 'ethereum', label: 'Ethereum', icon: faCoins, color: '#627eea' },
    { value: 'bitcoin', label: 'Bitcoin', icon: faBitcoinSign, color: '#f7931a' }
  ];

  const searchTypes = [
    { value: 'address', label: 'Address Analysis' },
    { value: 'transaction', label: 'Transaction Lookup' }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = searchType === 'address' 
        ? `/api/multichain/address/${selectedNetwork}/${searchTerm}`
        : `/api/multichain/transaction/${selectedNetwork}/${searchTerm}`;

      const response = await fetch(`http://localhost:5000${endpoint}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data = await response.json();
      
      if (onResults) {
        onResults({
          ...data,
          searchTerm,
          searchType,
          network: selectedNetwork
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getNetworkIcon = (networkValue) => {
    const network = networks.find(n => n.value === networkValue);
    return network ? network.icon : faNetworkWired;
  };

  const getNetworkColor = (networkValue) => {
    const network = networks.find(n => n.value === networkValue);
    return network ? network.color : '#6c757d';
  };

  return (
    <Card className="multichain-search-card">
      <Card.Header>
        <FontAwesomeIcon icon={faNetworkWired} className="me-2" />
        Multi-Chain Blockchain Analysis
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSearch}>
          {/* Network Selection */}
          <div className="network-selection mb-3">
            <Form.Label className="fw-bold">Select Network</Form.Label>
            <div className="network-buttons">
              {networks.map((network) => (
                <Button
                  key={network.value}
                  variant={selectedNetwork === network.value ? 'primary' : 'outline-secondary'}
                  className={`network-btn ${selectedNetwork === network.value ? 'active' : ''}`}
                  onClick={() => setSelectedNetwork(network.value)}
                  style={{
                    borderColor: selectedNetwork === network.value ? network.color : undefined,
                    backgroundColor: selectedNetwork === network.value ? network.color : undefined
                  }}
                >
                  <FontAwesomeIcon icon={network.icon} className="me-2" />
                  {network.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Type Selection */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Analysis Type</Form.Label>
            <Form.Select 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
              className="search-type-select"
            >
              {searchTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Search Input */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              {searchType === 'address' ? 'Wallet Address' : 'Transaction Hash'}
            </Form.Label>
            <div className="search-input-group">
              <Form.Control
                type="text"
                placeholder={
                  searchType === 'address' 
                    ? `Enter ${selectedNetwork} address...`
                    : `Enter ${selectedNetwork} transaction hash...`
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                disabled={loading}
              />
              <Button 
                type="submit" 
                variant="primary" 
                disabled={loading || !searchTerm.trim()}
                className="search-btn"
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <FontAwesomeIcon icon={faSearch} />
                )}
              </Button>
            </div>
          </Form.Group>

          {/* Network Info */}
          <div className="network-info">
            <Badge 
              bg="secondary" 
              className="network-badge"
              style={{ backgroundColor: getNetworkColor(selectedNetwork) }}
            >
              <FontAwesomeIcon icon={getNetworkIcon(selectedNetwork)} className="me-1" />
              {networks.find(n => n.value === selectedNetwork)?.label} Network
            </Badge>
            <small className="text-muted ms-2">
              {searchType === 'address' ? 'Analyze wallet activity and risk patterns' : 'Get detailed transaction information'}
            </small>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="danger" className="mt-3">
              <FontAwesomeIcon icon={faExchangeAlt} className="me-2" />
              {error}
            </Alert>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MultiChainSearch;
