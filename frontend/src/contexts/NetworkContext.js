import React, { createContext, useContext, useState, useEffect } from 'react';

const NetworkContext = createContext();

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

export const NetworkProvider = ({ children }) => {
  const [networkType, setNetworkType] = useState(() => {
    // Get from localStorage or default to Mainnet
    const saved = localStorage.getItem('networkType');
    return saved || 'Mainnet';
  });

  const isTestnet = networkType === 'Testnet';

  const toggleNetwork = () => {
    const newNetwork = networkType === 'Mainnet' ? 'Testnet' : 'Mainnet';
    setNetworkType(newNetwork);
    localStorage.setItem('networkType', newNetwork);
  };

  useEffect(() => {
    // Save to localStorage whenever network changes
    localStorage.setItem('networkType', networkType);
  }, [networkType]);

  return (
    <NetworkContext.Provider value={{ networkType, isTestnet, toggleNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};

