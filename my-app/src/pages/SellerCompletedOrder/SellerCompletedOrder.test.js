import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import SellerCompletedOrder from './SellerCompletedOrder';
import { Itemcontext } from '../../ShopContextProvider';

jest.mock('axios');

describe('SellerCompletedOrder Component', () => {
  const mockSellerId = 'seller123';
  const mockCompletedOrders = [
    {
      orderId: 'order1',
      foodName: 'Pizza',
      quantity: 2,
      price: 20.0,
    },
    {
      orderId: 'order2',
      foodName: 'Burger',
      quantity: 1,
      price: 10.0,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays completed orders', async () => {
    axios.get.mockResolvedValueOnce({ data: { completedOrders: mockCompletedOrders } });

    render(
      <Itemcontext.Provider value={{ sellerId: mockSellerId }}>
        <SellerCompletedOrder />
      </Itemcontext.Provider>
    );

    // Ensure API is called
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:5000/api/seller-completed-orders/${mockSellerId}`
    ));

    // Check that completed orders are displayed
    expect(await screen.findByText(/Pizza/i)).toBeInTheDocument();
    expect(screen.getByText(/Burger/i)).toBeInTheDocument();
    expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
    expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
    expect(screen.getByText('Price: $20.00')).toBeInTheDocument();
    expect(screen.getByText('Price: $10.00')).toBeInTheDocument();
  });

  it('renders a message when there are no completed orders', async () => {
    axios.get.mockResolvedValueOnce({ data: { completedOrders: [] } });

    render(
      <Itemcontext.Provider value={{ sellerId: mockSellerId }}>
        <SellerCompletedOrder />
      </Itemcontext.Provider>
    );

    // Wait for "No completed orders" message
    expect(await screen.findByText(/No completed orders/i)).toBeInTheDocument();
  });
});
