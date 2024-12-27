import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';
import { Itemcontext } from '../../ShopContextProvider';

describe('Card Component Tests', () => {
  const mockItem = {
    _id: '1',
    name: 'Pizza',
    description: 'Delicious pizza',
    imageUrl: 'pizza.jpg',
    options: [{ type: 'Small', price: 10 }],
    sellerId: 'seller123',
  };

  const mockCartContext = {
    cartitem: [],
    setcartitem: jest.fn(),
  };

  it('adds item to cart when Add To Cart is clicked', () => {
    render(
      <Itemcontext.Provider value={mockCartContext}>
        <Card item={mockItem} />
      </Itemcontext.Provider>
    );

    const addToCartButton = screen.getByText(/Add To Cart/i);
    fireEvent.click(addToCartButton);

    expect(mockCartContext.setcartitem).toHaveBeenCalled();
  });
});
