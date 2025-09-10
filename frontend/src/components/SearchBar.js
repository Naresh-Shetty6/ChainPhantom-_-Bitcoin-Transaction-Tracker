import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faExchangeAlt, faWallet, faCube } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css';
import SearchHistory from './SearchHistory';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();
  const searchHistoryRef = useRef(null);

  // Clear any errors or suggestions when the search term changes
  useEffect(() => {
    setError(null);
    
    // Only show suggestions if there's a search term
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }

    // Show suggestions based on search term
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        // This is a simplified example. In a real app, you'd fetch from your API
        const response = await fetch(`https://mempool.space/api/v1/search?q=${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }
        
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        // Don't show the error in the UI for suggestions, just log it
      } finally {
        setIsLoading(false);
      }
    };
    
    // Use a debounce for API calls
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim().length >= 3) {
        fetchSuggestions();
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        searchHistoryRef.current &&
        !searchHistoryRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const determineSearchType = (term) => {
    term = term.trim();
    
    // Check if it's a block height (numbers only)
    if (/^\d+$/.test(term) && term.length < 10) {
      return 'block';
    }
    
    // Check if it's a Bitcoin address
    if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(term)) {
      return 'address';
    }
    
    // Check if it's a transaction ID (64 hex chars)
    if (/^[a-fA-F0-9]{64}$/.test(term)) {
      return 'tx';
    }
    
    // If we can't determine, assume it's a transaction
    return 'tx';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    const type = determineSearchType(searchTerm);
    
    // Clear any previous errors
    setError(null);
    
    // Add to search history
    if (searchHistoryRef.current) {
      searchHistoryRef.current.addSearch(searchTerm, type);
    }
    
    // Call the onSearch prop
    onSearch(searchTerm, type);
    
    // Navigate based on search type
    navigateToResult(searchTerm, type);
    
    // Clear suggestions
    setSuggestions([]);

    // Clear the search input after submission
    setSearchTerm('');
  };

  const handleSuggestionClick = (suggestion) => {
    const type = determineSearchType(suggestion);
    
    // Add to search history
    if (searchHistoryRef.current) {
      searchHistoryRef.current.addSearch(suggestion, type);
    }
    
    // Call the onSearch prop
    onSearch(suggestion, type);
    
    // Navigate based on search type
    navigateToResult(suggestion, type);
    
    // Clear the suggestions
    setSuggestions([]);
    
    // First update the search term with the selection then clear it after a short delay
    setSearchTerm(suggestion);
    setTimeout(() => setSearchTerm(''), 500);
  };

  const navigateToResult = (term, type) => {
    switch (type) {
      case 'tx':
        navigate(`/tx/${term}`);
        break;
      case 'address':
        navigate(`/address/${term}`);
        break;
      case 'block':
        navigate(`/block/${term}`);
        break;
      default:
        // Default to transaction if type is unknown
        navigate(`/tx/${term}`);
    }
  };

  const handleHistorySelect = (historyItem) => {
    setSearchTerm(historyItem.term);
    navigateToResult(historyItem.term, historyItem.type);
    onSearch(historyItem.term, historyItem.type);
    
    // Clear the search term after navigation
    setTimeout(() => setSearchTerm(''), 500);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search for transaction, address, or block..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="search-button">
          <FontAwesomeIcon icon={faSearch} />
        </button>
        
        {error && <div className="search-error">{error}</div>}
        
        {suggestions.length > 0 && (
          <div ref={suggestionsRef} className="suggestions-container">
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index} 
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-icon">
                    <FontAwesomeIcon icon={
                      determineSearchType(suggestion) === 'tx' ? faExchangeAlt : 
                      determineSearchType(suggestion) === 'address' ? faWallet : 
                      faCube
                    } />
                  </span>
                  <span className="suggestion-text">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
      
      <div className="search-tools">
        <SearchHistory 
          ref={searchHistoryRef}
          onSelectHistory={handleHistorySelect}
        />
      </div>
    </div>
  );
};

export default SearchBar;
