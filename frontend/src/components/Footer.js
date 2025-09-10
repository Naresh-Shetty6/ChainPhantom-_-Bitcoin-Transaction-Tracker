import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 className="footer-title">ChainPhantom</h5>
            <p className="footer-description">
              A modern Bitcoin blockchain explorer with transaction tracing capabilities.
            </p>
          </div>
          <div className="col-md-6">
            <div className="footer-links">
              <div className="footer-link-group">
                <h6>Explorer</h6>
                <ul>
                  <li><a href="/transactions">Transactions</a></li>
                  <li><a href="/blocks">Blocks</a></li>
                </ul>
              </div>
              <div className="footer-link-group">
                <h6>Resources</h6>
                <ul>
                  <li><a href="/api">API</a></li>
                  <li><a href="/docs">Documentation</a></li>
                </ul>
              </div>
              <div className="footer-link-group">
                <h6>About</h6>
                <ul>
                  <li><a href="/about">About Us</a></li>
                  <li><a href="/privacy">Privacy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="copyright">
            © {new Date().getFullYear()} ChainPhantom - Powered by BlockCypher
          </div>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
