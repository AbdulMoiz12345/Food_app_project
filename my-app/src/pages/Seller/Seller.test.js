import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Seller from './Seller';
import { Itemcontext } from '../../ShopContextProvider';
import axios from 'axios';

// Mock the axios module
jest.mock('axios');

describe('Seller Component', () => {
  const mockSetFoodId = jest.fn();
  const sellerContextValue = {
    sellerId: '12345',
    setfoodid: mockSetFoodId,
  };

  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  

  test('should filter food items based on search input', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1',
          name: 'Biryani',
          category: 'Rice/Biryani',
          description: 'Delicious biryani',
          options: [{ type: 'Full', price: 500 }],
          imageUrl: 'http://example.com/image.jpg',
        },
        {
          _id: '2',
          name: 'Chicken Curry',
          category: 'Chicken',
          description: 'Spicy chicken curry',
          options: [{ type: 'Full', price: 300 }],
          imageUrl: 'http://example.com/image2.jpg',
        },
      ],
    });

    render(
      <Itemcontext.Provider value={sellerContextValue}>
        <Seller />
      </Itemcontext.Provider>
    );

    // Wait for the food items to load
    await waitFor(() => screen.getByText('Biryani'));

    // Simulate typing in the search input
    fireEvent.change(screen.getByPlaceholderText('Search for a food item...'), {
      target: { value: 'Chicken' },
    });

    // Check that the filtered food item appears
    expect(screen.getByText('Chicken Curry')).toBeInTheDocument();
    expect(screen.queryByText('Biryani')).not.toBeInTheDocument();
  });

  test('should handle delete functionality', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1',
          name: 'Biryani',
          category: 'Rice/Biryani',
          description: 'Delicious biryani',
          options: [{ type: 'Full', price: 500 }],
          imageUrl: 'http://example.com/image.jpg',
        },
      ],
    });

    axios.delete.mockResolvedValueOnce({});

    render(
      <Itemcontext.Provider value={sellerContextValue}>
        <Seller />
      </Itemcontext.Provider>
    );

    // Wait for the food items to load
    await waitFor(() => screen.getByText('Biryani'));

    // Find the delete button and click it
    fireEvent.click(screen.getByText('Delete'));

    // Check if the item was deleted
    await waitFor(() => {
      expect(screen.queryByText('Biryani')).not.toBeInTheDocument();
    });
  });

  test('should open update modal when clicking update button', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1',
          name: 'Biryani',
          category: 'Rice/Biryani',
          description: 'Delicious biryani',
          options: [{ type: 'Full', price: 500 }],
          imageUrl: 'http://example.com/image.jpg',
        },
      ],
    });

    render(
      <Itemcontext.Provider value={sellerContextValue}>
        <Seller />
      </Itemcontext.Provider>
    );

    // Wait for the food items to load
    await waitFor(() => screen.getByText('Biryani'));

    // Find the update button and click it
    fireEvent.click(screen.getByText('Update'));

    // Check if the modal opens (based on the button to close the modal)
    expect(screen.getByText('Update Food Item')).toBeInTheDocument();
  });

  test('should close modal when clicking close button in update modal', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1',
          name: 'Biryani',
          category: 'Rice/Biryani',
          description: 'Delicious biryani',
          options: [{ type: 'Full', price: 500 }],
          imageUrl: 'http://example.com/image.jpg',
        },
      ],
    });

    render(
      <Itemcontext.Provider value={sellerContextValue}>
        <Seller />
      </Itemcontext.Provider>
    );

    // Wait for the food items to load
    await waitFor(() => screen.getByText('Biryani'));

    // Find the update button and click it
    fireEvent.click(screen.getByText('Update'));

    // Check if the modal is opened
    expect(screen.getByText('Update Food Item')).toBeInTheDocument();

    // Find the close button in the modal and click it
    fireEvent.click(screen.getByText('X'));

    // Check if the modal is closed
    expect(screen.queryByText('Update Food Item')).not.toBeInTheDocument();
  });
});
