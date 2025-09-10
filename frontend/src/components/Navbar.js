import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [networkType, setNetworkType] = useState('Mainnet');

  // Function to toggle network between Mainnet and Testnet
  const toggleNetwork = () => {
    const newNetwork = networkType === 'Mainnet' ? 'Testnet' : 'Mainnet';
    setNetworkType(newNetwork);
    // Add network switching logic here (e.g., changing API endpoints)
    console.log(`Switched to ${newNetwork}`);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation handler
  const navigateTo = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="brand-text">Chain<span className="brand-accent">Phantom</span></span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-home me-1"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/transactions" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-exchange-alt me-1"></i>Transactions
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blocks" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-cubes me-1"></i>Blocks
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/network" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-network-wired me-1"></i>Network
              </Link>
            </li>
            <li className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <i className="fas fa-tools me-1"></i>Tools
              </button>
              <ul className="dropdown-menu dropdown-menu-dark">
                <li><Link className="dropdown-item" to="/api" onClick={() => setIsMenuOpen(false)}>API</Link></li>
                <li><Link className="dropdown-item" to="/visualizer" onClick={() => setIsMenuOpen(false)}>Transaction Visualizer</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/detector" onClick={() => setIsMenuOpen(false)}>Suspicious Activity Detector</Link></li>
              </ul>
            </li>
          </ul>
          <div className="network-indicator ms-3" onClick={toggleNetwork} style={{ cursor: 'pointer' }}>
            <span className="network-dot" style={{ backgroundColor: networkType === 'Mainnet' ? '#3498db' : '#f39c12' }}></span>
            <span className="network-text">{networkType}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;