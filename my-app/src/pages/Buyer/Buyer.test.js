import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Buyer from './Buyer'; // Adjust path as needed
import { Itemcontext } from '../../ShopContextProvider';
import '@testing-library/jest-dom';

jest.mock('axios'); // Mock axios

describe('Buyer Component Tests', () => {
  it('should fetch and display food items', async () => {
    const mockItems = [
      { _id: '1', name: 'Pizza', description: 'Cheese Pizza', imageUrl: 'pizza.jpg', options: [] },
      { _id: '2', name: 'Burger', description: 'Beef Burger', imageUrl: 'burger.jpg', options: [] },
    ];
  
    axios.get.mockResolvedValueOnce({ data: mockItems });
  
    const mockContextValue = {
      cartitem: [],
      setcartitem: jest.fn(),
    };
  
    render(
      <Itemcontext.Provider value={mockContextValue}>
        <Buyer />
      </Itemcontext.Provider>
    );
  
    // Ensure the loading text is displayed initially
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  
    // Verify that images are rendered as items
    const items = await screen.findAllByRole('img');
    expect(items).toHaveLength(2);
  
    // Check that the titles are displayed
    expect(screen.getByRole('heading', { name: /Pizza/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Burger/i })).toBeInTheDocument();
  
    // Check that the descriptions are displayed
    expect(screen.getByText('Cheese Pizza')).toBeInTheDocument();
    expect(screen.getByText('Beef Burger')).toBeInTheDocument();
  });
  
  it('should handle loading state', () => {
    render(<Buyer />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('should display an error message if API call fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch data'));

    render(<Buyer />);

    const errorMessage = await screen.findByText(/Error: Failed to fetch data/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should filter items based on search query', async () => {
    const mockItems = [
      { _id: '1', name: 'Pizza', description: 'Cheese Pizza', imageUrl: 'pizza.jpg', options: [] },
      { _id: '2', name: 'Burger', description: 'Beef Burger', imageUrl: 'burger.jpg', options: [] },
    ];
  
    const mockContextValue = {
      cartitem: [],
      setcartitem: jest.fn(),
    };
  
    axios.get.mockResolvedValueOnce({ data: mockItems });
  
    render(
      <Itemcontext.Provider value={mockContextValue}>
        <Buyer />
      </Itemcontext.Provider>
    );
  
    const searchInput = await screen.findByPlaceholderText(/Search food.../i);
    expect(searchInput).toBeInTheDocument();
  
    fireEvent.change(searchInput, { target: { value: 'Pizza' } });
  
    // Verify filtered title
    const filteredTitle = await screen.findByRole('heading', { name: /Pizza/i });
    expect(filteredTitle).toBeInTheDocument();
  
    // Ensure the description appears
    const filteredDescription = await screen.findByText(/Cheese Pizza/i);
    expect(filteredDescription).toBeInTheDocument();
  
    // Ensure "Burger" is not displayed
    expect(screen.queryByText(/Burger/i)).not.toBeInTheDocument();
  });
  
});


