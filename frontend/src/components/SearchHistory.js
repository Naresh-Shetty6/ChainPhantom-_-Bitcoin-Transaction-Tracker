import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchHistory.css';

// Constants
const HISTORY_STORAGE_KEY = 'chainPhantomSearchHistory';
const MAX_HISTORY_ITEMS = 10;

// Helper functions
const addToHistory = (term, type) => {
  const history = getHistory();
  const timestamp = Date.now();
  
  // Check if term already exists and remove it
  const filteredHistory = history.filter(item => item.term !== term);
  
  // Add new item to the beginning
  const newHistory = [{ term, type, timestamp }, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
  
  return newHistory;
};

const getHistory = () => {
  const history = localStorage.getItem(HISTORY_STORAGE_KEY);
  return history ? JSON.parse(history) : [];
};

const clearHistory = () => {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
  return [];
};

const removeHistoryItem = (term) => {
  const history = getHistory();
  const newHistory = history.filter(item => item.term !== term);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
  return newHistory;
};

// Component
const SearchHistory = forwardRef((props, ref) => {
  const [history, setHistory] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  // Load history on component mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    addSearch: (term, type) => {
      const newHistory = addToHistory(term, type);
      setHistory(newHistory);
    },
    clearHistory: () => {
      const newHistory = clearHistory();
      setHistory(newHistory);
    },
    toggleVisibility: () => {
      setIsVisible(prev => !prev);
    }
  }));

  const handleItemClick = (item) => {
    setIsVisible(false);
    if (item.type === 'transaction') {
      navigate(`/tx/${item.term}`);
    } else if (item.type === 'address') {
      navigate(`/address/${item.term}`);
    } else if (item.type === 'block') {
      navigate(`/block/${item.term}`);
    }
  };

  const handleRemoveItem = (e, term) => {
    e.stopPropagation();
    const newHistory = removeHistoryItem(term);
    setHistory(newHistory);
  };

  const handleClearHistory = () => {
    const newHistory = clearHistory();
    setHistory(newHistory);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const timeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
    
    return 'just now';
  };
  
  // Get filtered history
  const filteredHistory = filterType === 'all' 
    ? history 
    : history.filter(item => item.type === filterType);

  // Render appropriate icon based on type
  const renderIcon = (type) => {
    switch(type) {
      case 'transaction':
        return <i className="fas fa-exchange-alt"></i>;
      case 'address':
        return <i className="fas fa-wallet"></i>;
      case 'block':
        return <i className="fas fa-cube"></i>;
      default:
        return <i className="fas fa-search"></i>;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="search-history">
      <div className="history-header">
        <h3>Search History</h3>
        <div className="history-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filterType === 'transaction' ? 'active' : ''}`}
              onClick={() => handleFilterChange('transaction')}
            >
              Transactions
            </button>
            <button 
              className={`filter-btn ${filterType === 'address' ? 'active' : ''}`}
              onClick={() => handleFilterChange('address')}
            >
              Addresses
            </button>
            <button 
              className={`filter-btn ${filterType === 'block' ? 'active' : ''}`}
              onClick={() => handleFilterChange('block')}
            >
              Blocks
            </button>
          </div>
          <button className="clear-history-btn" onClick={handleClearHistory}>
            Clear History
          </button>
        </div>
      </div>
      
      {filteredHistory.length === 0 ? (
        <div className="empty-history">
          No search history available
        </div>
      ) : (
        <ul className="history-list">
          {filteredHistory.map((item) => (
            <li 
              key={`${item.term}-${item.timestamp}`} 
              className="history-item"
              onClick={() => handleItemClick(item)}
            >
              <div className="history-item-icon">
                {renderIcon(item.type)}
              </div>
              <div className="history-item-content">
                <div className="history-item-term">{item.term}</div>
                <div className="history-item-meta">
                  <span className="history-item-type">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                  <span className="history-item-time">
                    {timeAgo(item.timestamp)}
                  </span>
                </div>
              </div>
              <button 
                className="remove-history-item" 
                onClick={(e) => handleRemoveItem(e, item.term)}
              >
                <i className="fas fa-times"></i>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default SearchHistory; 