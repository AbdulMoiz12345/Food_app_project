import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Addnew from './Addnew';
import { Itemcontext } from '../../ShopContextProvider';
import axios from 'axios';

jest.mock('axios'); // Mock axios

// Test Case 1: Should render the Addnew component correctly
test('should render the Addnew component correctly', () => {
  render(
    <Itemcontext.Provider value={{ sellerId: '12345' }}>
      <Addnew />
    </Itemcontext.Provider>
  );

  // Check if the title is rendered
  expect(screen.getByText(/Add New Food Item/i)).toBeInTheDocument();

  // Check if all required fields are rendered
  expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Name of Food/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Upload Image/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add Food/i })).toBeInTheDocument();
});

// Test Case 2: Should update category, name, and description on input
test('should update category, name, and description on input', () => {
  render(
    <Itemcontext.Provider value={{ sellerId: '12345' }}>
      <Addnew />
    </Itemcontext.Provider>
  );

  const categorySelect = screen.getByLabelText(/Category/i);
  const nameInput = screen.getByLabelText(/Name of Food/i);
  const descriptionTextArea = screen.getByLabelText(/Description/i);

  fireEvent.change(categorySelect, { target: { value: 'Rice/Biryani' } });
  fireEvent.change(nameInput, { target: { value: 'Biryani' } });
  fireEvent.change(descriptionTextArea, { target: { value: 'Delicious spicy biryani' } });

  expect(categorySelect.value).toBe('Rice/Biryani');
  expect(nameInput.value).toBe('Biryani');
  expect(descriptionTextArea.value).toBe('Delicious spicy biryani');
});

// Test Case 3: Should handle file input correctly
test('should handle file input correctly', () => {
  render(
    <Itemcontext.Provider value={{ sellerId: '12345' }}>
      <Addnew />
    </Itemcontext.Provider>
  );

  const fileInput = screen.getByLabelText(/Upload Image/i);
  const file = new File(['dummy content'], 'food-image.jpg', { type: 'image/jpeg' });

  fireEvent.change(fileInput, { target: { files: [file] } });

  // Verify that the image file is selected
  expect(fileInput.files[0].name).toBe('food-image.jpg');
});

// Test Case 4: Should add options correctly
test('should add options correctly', () => {
  render(
    <Itemcontext.Provider value={{ sellerId: '12345' }}>
      <Addnew />
    </Itemcontext.Provider>
  );

  const optionRadio = screen.getByLabelText(/Full/i);
  const priceInput = screen.getByPlaceholderText(/Enter price for the selected option/i);
  const addButton = screen.getByText(/Add Option/i);

  fireEvent.click(optionRadio);
  fireEvent.change(priceInput, { target: { value: '100' } });
  fireEvent.click(addButton);

  // Check if the added option is displayed
  expect(screen.getByText(/Full: 100/i)).toBeInTheDocument();
});






  