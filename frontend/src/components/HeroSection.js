import React from 'react';
import './HeroSection.css'; // We’ll add this CSS next

const HeroSection = () => {
  return (
    <div className="hero-section text-white d-flex align-items-center">
      <div className="container text-center">
        <h1 className="display-4 fw-bold">Chainphantom</h1>
        <p className="lead">“Trace the Trail of Crypto Transactions”</p>
      </div>
    </div>
  );
};

export default HeroSection;
