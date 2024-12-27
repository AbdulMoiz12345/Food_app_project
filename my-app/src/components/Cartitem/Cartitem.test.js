import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Itemcontext } from '../../ShopContextProvider';
import Cartitem from './Cartitem';

describe('Cartitem Component', () => {
  const mockCartItems = [{ foodId: '1', name: 'Pizza', price: 10 }];
  const mockSetCartItem = jest.fn();

  it('removes item from the cart when delete is clicked', () => {
    render(
      <Itemcontext.Provider value={{ cartitem: mockCartItems, setcartitem: mockSetCartItem }}>
        <Cartitem item={mockCartItems[0]} />
      </Itemcontext.Provider>
    );

    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    expect(mockSetCartItem).toHaveBeenCalledWith([]);
  });
});
