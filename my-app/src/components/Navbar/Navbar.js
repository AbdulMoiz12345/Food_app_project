import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Itemcontext } from '../../ShopContextProvider';
import './Navbar.css';
import axios from 'axios';

const Navbar = () => {
  const { userState, setUserState, cartitem, sellerId } = useContext(Itemcontext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle the menu on mobile
  const [orders, setOrders] = useState([]); // State to store orders

  const handleLogout = () => {
    setUserState(null); // Reset the user state on logout
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the menu visibility
  };

  // Fetch orders for the seller
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/seller-orders', { sellerId });
        setOrders(response.data.orders);
        console.log(response.data.orders); // Log the orders
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    // Refetch orders when navigating to the seller page
    if (sellerId && location.pathname.includes("/seller")) {
      fetchOrders();
    }
  }, [sellerId, location.pathname]); // Depend on both sellerId and location.pathname

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src="/path-to-logo/logo.png" alt="Logo" />
        </Link>
      </div>
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleMenu}>
        <div className={`line ${menuOpen ? 'open' : ''}`}></div>
        <div className={`line ${menuOpen ? 'open' : ''}`}></div>
        <div className={`line ${menuOpen ? 'open' : ''}`}></div>
      </div>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {/* Conditional links based on user state */}
        {userState === 'buyer' && (
          <>
            <li><Link to="/Buyer">Home</Link></li>
            <li>
              <Link to="/cart" className="cart-link">
                <i className="fas fa-shopping-cart"></i> {/* Cart Icon */}
                {cartitem.length > 0 && (
                  <span className="cart-badge">{cartitem.length}</span> // Badge
                )}
              </Link>
            </li>
            <li><Link to="/customerorder">Orders</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </>
        )}
        {userState === 'seller' && (
          <>
            <li><Link to="/seller">My Products</Link></li>
            <li>
              <Link to="/sellerorders">
                Orders
                {orders.length > 0 && (
                  <span className="orders-badge">{orders.length}</span> // Badge for orders
                )}
              </Link>
            </li>
            <li><Link to="/sellercompletedorders">Completed</Link></li>
            <li><Link to="/addnew">Add Item</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </>
        )}
        {userState === 'rider' && (
          <>
            <li><Link to="/rider">Home</Link></li>
            <li><Link to="/riderorder">Orders</Link></li>
            <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
          </>
        )}
        {/* Display links for users who are not logged in or on the homepage */}
        {(location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
