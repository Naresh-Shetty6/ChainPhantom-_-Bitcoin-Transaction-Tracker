import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders search input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText(/search by transaction hash or address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('calls onSearch when form is submitted', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/search by transaction hash or address/i);
    const button = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(input, { target: { value: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' } });
    fireEvent.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', expect.any(String));
  });

  test('prevents empty search submission', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const button = screen.getByRole('button', { name: /search/i });
    fireEvent.click(button);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});
