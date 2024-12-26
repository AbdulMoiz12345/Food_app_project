import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Sellerorder from './Sellerorder';
import { Itemcontext } from '../../ShopContextProvider';

jest.mock('axios');

describe('Sellerorder Component', () => {
  const mockSellerId = 'seller123';
  const mockOrders = [
    {
      _id: 'order1',
      name: 'Pizza',
      buyerId: 'buyer123',
      quantity: 2,
      price: 20.0,
      orderedAt: new Date().toISOString(),
    },
    {
      _id: 'order2',
      name: 'Burger',
      buyerId: 'buyer456',
      quantity: 1,
      price: 10.0,
      orderedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays orders', async () => {
    axios.post.mockResolvedValueOnce({ data: { orders: mockOrders } });

    render(
      <Itemcontext.Provider value={{ sellerId: mockSellerId }}>
        <Sellerorder />
      </Itemcontext.Provider>
    );

    // Ensure API is called
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/seller-orders', { sellerId: mockSellerId }));

    // Check that orders are displayed
    expect(await screen.findByText(/Pizza/i)).toBeInTheDocument();
    expect(screen.getByText(/Burger/i)).toBeInTheDocument();
    expect(screen.getByText('$20.00')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });

  it('handles marking an order as complete', async () => {
    axios.post.mockResolvedValueOnce({ data: { orders: mockOrders } });
    axios.patch.mockResolvedValueOnce({ status: 200 });
  
    render(
      <Itemcontext.Provider value={{ sellerId: mockSellerId }}>
        <Sellerorder />
      </Itemcontext.Provider>
    );
  
    // Wait for orders to render
    await waitFor(() => expect(screen.getByText(/Pizza/i)).toBeInTheDocument());
  
    const completeButton = await screen.findAllByText(/Complete/i);
    fireEvent.click(completeButton[0]);
  
    // Wait for UI update
    await waitFor(() => {
      expect(screen.queryByText(/Pizza/i)).not.toBeInTheDocument();
    });
  });
  
  it('shows an error if fetching orders fails', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(
      <Itemcontext.Provider value={{ sellerId: mockSellerId }}>
        <Sellerorder />
      </Itemcontext.Provider>
    );

    // Wait for error message
    await waitFor(() => expect(screen.getByText(/No orders available/i)).toBeInTheDocument());
  });

 
  it('renders "No orders available" when there are no orders', async () => {
    axios.post.mockResolvedValueOnce({ data: { orders: [] } });

    render(
      <Itemcontext.Provider value={{ sellerId: mockSellerId }}>
        <Sellerorder />
      </Itemcontext.Provider>
    );

    // Wait for "No orders available" message
    expect(await screen.findByText(/No orders available/i)).toBeInTheDocument();
  });

  it('renders the correct number of rows in the table', async () => {
    axios.post.mockResolvedValueOnce({ data: { orders: mockOrders } });

    render(
      <Itemcontext.Provider value={{ sellerId: mockSellerId }}>
        <Sellerorder />
      </Itemcontext.Provider>
    );

    // Wait for table to render
    const rows = await screen.findAllByRole('row');
    expect(rows.length).toBe(mockOrders.length + 1); // +1 for the header row
  });
});
