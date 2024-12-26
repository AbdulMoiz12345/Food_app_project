import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'; // Import waitFor here
import axios from 'axios';
import { Itemcontext } from '../../ShopContextProvider';
import Cart from './Cart';

jest.mock('axios');

describe('Cart Component', () => {
  const mockCartItems = [
    { foodId: '1', name: 'Pizza', quantity: 1, price: 10 },
    { foodId: '2', name: 'Burger', quantity: 2, price: 5 },
  ];
  const mockSetCartItem = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays items in the cart', () => {
    render(
      <Itemcontext.Provider value={{ cartitem: mockCartItems, setcartitem: mockSetCartItem }}>
        <Cart />
      </Itemcontext.Provider>
    );

    expect(screen.getByText(/Pizza/i)).toBeInTheDocument();
    expect(screen.getByText(/Burger/i)).toBeInTheDocument();
    expect(screen.getByText(/Total: 15/i)).toBeInTheDocument(); // Corrected the expected total price
  });


  it('displays a message when the cart is empty', () => {
    render(
      <Itemcontext.Provider value={{ cartitem: [], setcartitem: mockSetCartItem }}>
        <Cart />
      </Itemcontext.Provider>
    );

    expect(screen.getByText(/Nothing in cart/i)).toBeInTheDocument();
  });
});
