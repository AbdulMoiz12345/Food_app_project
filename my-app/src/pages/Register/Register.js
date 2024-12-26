import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    address: '',
    phone: '',
    role: 'buyer', // Default role
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace the URL with your backend endpoint
      const response = await axios.post('http://localhost:5000/api/register', formData);
      setResponseMessage(response.data.message || 'Registration successful!');
    } catch (error) {
      setResponseMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            required
          />
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </label>
        <label>
          Register As:
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="rider">Rider</option>
          </select>
        </label>
        <button type="submit" className='register_button' style={{backgroundColor:'#007bff'}}>Register</button>
      </form>

      {/* Response message */}
      {responseMessage && <p className="response-message">{responseMessage}</p>}
    </div>
  );
};

export default Register;
