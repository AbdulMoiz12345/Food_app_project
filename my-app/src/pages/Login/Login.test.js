import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';  // Adjust path if necessary
import { Itemcontext } from '../../ShopContextProvider';  // Adjust path if necessary
import { BrowserRouter as Router } from 'react-router-dom';  // For using Link inside the component

// Mock context values
const mockSetUserState = jest.fn();
const mockSetBuyerId = jest.fn();
const mockSetSellerId = jest.fn();
const mockSetRiderId = jest.fn();
const mockSetAddress_Buyer = jest.fn();
const mockSetAddress_Seller = jest.fn();
const mockSetFoodId = jest.fn();
const mockSetCartItem = jest.fn();

describe('Login Component', () => {
  // Render the component with mocked context values
  const renderLogin = () =>
    render(
      <Router>
        <Itemcontext.Provider
          value={{
            cartitem: [],
            setcartitem: mockSetCartItem,
            buyerId: null,
            setBuyerId: mockSetBuyerId,
            sellerId: null,
            setSellerId: mockSetSellerId,
            riderId: null,
            setRiderId: mockSetRiderId,
            userState: null,
            setUserState: mockSetUserState,
            foodid: null,
            setfoodid: mockSetFoodId,
            Address_Buyer: null,
            setAddress_Buyer: mockSetAddress_Buyer,
            Address_Seller: null,
            setAddress_Seller: mockSetAddress_Seller,
          }}
        >
          <Login />
        </Itemcontext.Provider>
      </Router>
    );

  test('renders the login form correctly', () => {
    renderLogin();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Role:/i)).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
  });

  test('updates email input field value on change', () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/Email:/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  test('updates password input field value on change', () => {
    renderLogin();
    const passwordInput = screen.getByLabelText(/Password:/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  test('sets role to "buyer" by default', () => {
    renderLogin();
    const roleSelect = screen.getByLabelText(/Role:/i);
    expect(roleSelect.value).toBe('buyer');
  });
});
