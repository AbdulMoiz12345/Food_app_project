import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { Itemcontext } from '../../ShopContextProvider';
import Customerorders from './Customerorders';

jest.mock('axios');

describe('Customerorders Component', () => {
  const mockBuyerId = '12345';

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('displays "No pending orders" when there are no pending orders', async () => {
    const mockResponse = {
      data: {
        orders: [],
        madeOrders: [
          { orderId: '2', foodName: 'Burger', quantity: 2, price: 5 },
        ],
        completedOrders: [
          { orderId: '3', foodName: 'Pasta', quantity: 1, price: 12 },
        ],
      },
    };

    axios.get.mockResolvedValueOnce(mockResponse);

    render(
      <Itemcontext.Provider value={{ buyerId: mockBuyerId }}>
        <Customerorders />
      </Itemcontext.Provider>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    expect(screen.getByText(/No pending orders/i)).toBeInTheDocument();
  });

  it('displays "No orders on the way" when there are no orders on the way', async () => {
    const mockResponse = {
      data: {
        orders: [
          { orderId: '1', name: 'Pizza', quantity: 1, price: 10 },
        ],
        madeOrders: [],
        completedOrders: [
          { orderId: '3', foodName: 'Pasta', quantity: 1, price: 12 },
        ],
      },
    };

    axios.get.mockResolvedValueOnce(mockResponse);

    render(
      <Itemcontext.Provider value={{ buyerId: mockBuyerId }}>
        <Customerorders />
      </Itemcontext.Provider>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    expect(screen.getByText(/No orders on the way/i)).toBeInTheDocument();
  });

  it('displays "No completed orders" when there are no completed orders', async () => {
    const mockResponse = {
      data: {
        orders: [
          { orderId: '1', name: 'Pizza', quantity: 1, price: 10 },
        ],
        madeOrders: [
          { orderId: '2', foodName: 'Burger', quantity: 2, price: 5 },
        ],
        completedOrders: [],
      },
    };

    axios.get.mockResolvedValueOnce(mockResponse);

    render(
      <Itemcontext.Provider value={{ buyerId: mockBuyerId }}>
        <Customerorders />
      </Itemcontext.Provider>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    expect(screen.getByText(/No completed orders/i)).toBeInTheDocument();
  });

  it('shows loading state while fetching orders', () => {
    const mockResponse = {
      data: {
        orders: [],
        madeOrders: [],
        completedOrders: [],
      },
    };

    axios.get.mockResolvedValueOnce(mockResponse);

    render(
      <Itemcontext.Provider value={{ buyerId: mockBuyerId }}>
        <Customerorders />
      </Itemcontext.Provider>
    );

    expect(screen.getByText(/Your Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/No pending orders/i)).toBeInTheDocument();
  });
});
