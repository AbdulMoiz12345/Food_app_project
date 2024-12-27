const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming your Express app is in 'app.js'
const CompletedOrder = require('../models/CompletedOrder'); // CompletedOrder model
const User = require('../models/User'); // User model

jest.mock('../models/CompletedOrder');
jest.mock('../models/User');

describe('GET /api/rider-orders/:riderId', () => {
  
    // Test Case 1: Successfully Fetch Rider Orders with Buyer and Seller Details
    it('should successfully fetch all completed orders with buyer and seller details', async () => {
      const mockRiderId = new mongoose.Types.ObjectId(); // Instantiate with 'new'
      const mockBuyer = { address: '123 Buyer St', phone: '123456789', email: 'buyer@example.com' };
      const mockSeller = { address: '456 Seller Ave', phone: '987654321', email: 'seller@example.com' };
      const mockCompletedOrder = {
        _id: new mongoose.Types.ObjectId(), // Instantiate with 'new'
        foodName: 'Pizza',
        quantity: 2,
        price: 15.0,
        amount: 30.0,
        buyerId: mockRiderId, // Mock the correct buyerId
        sellerId: new mongoose.Types.ObjectId(), // Use a different ObjectId for seller
      };
  
      // Mock the `CompletedOrder` and `User` models
      CompletedOrder.find.mockResolvedValue([mockCompletedOrder]);
      User.findById.mockImplementation(id => {
        if (id.toString() === mockRiderId.toString()) return Promise.resolve(mockBuyer); // Return buyer for mockRiderId
        return Promise.resolve(mockSeller); // Return seller for the other ID
      });
  
      const response = await request(app).get(`/api/rider-orders/${mockRiderId}`);
  
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.orders.length).toBe(1);
      expect(response.body.orders[0].buyer.address).toBe('123 Buyer St');
      expect(response.body.orders[0].seller.address).toBe('456 Seller Ave'); // Ensure correct details for seller
    });
  
    // Test Case 2: Handle Missing Buyer or Seller Information
    it('should return default "Unknown" values when buyer or seller details are missing', async () => {
      const mockRiderId = new mongoose.Types.ObjectId(); // Instantiate with 'new'
      const mockCompletedOrder = {
        _id: new mongoose.Types.ObjectId(), // Instantiate with 'new'
        foodName: 'Pizza',
        quantity: 2,
        price: 15.0,
        amount: 30.0,
        buyerId: mockRiderId,
        sellerId: mockRiderId,
      };
  
      // Simulate missing user details (null response)
      CompletedOrder.find.mockResolvedValue([mockCompletedOrder]);
      User.findById.mockImplementation(id => null); // Simulate missing user details
  
      const response = await request(app).get(`/api/rider-orders/${mockRiderId}`);
  
      expect(response.status).toBe(200);
      expect(response.body.orders[0].buyer.address).toBe('Unknown');
      expect(response.body.orders[0].seller.address).toBe('Unknown');
    });
  
    // Test Case 3: Handle Rider with No Completed Orders
    it('should return an empty array if the rider has no completed orders', async () => {
      const mockRiderId = new mongoose.Types.ObjectId(); // Instantiate with 'new'
      CompletedOrder.find.mockResolvedValue([]); // No completed orders for the rider
  
      const response = await request(app).get(`/api/rider-orders/${mockRiderId}`);
  
      expect(response.status).toBe(200);
      expect(response.body.orders).toEqual([]);
      expect(response.body.success).toBe(true);
    });
  

  
    // Test Case 5: Handle Server Error
    it('should return a 500 status code when there is a server error', async () => {
      const mockRiderId = new mongoose.Types.ObjectId(); // Instantiate with 'new'
      CompletedOrder.find.mockRejectedValue(new Error('Database error'));
  
      const response = await request(app).get(`/api/rider-orders/${mockRiderId}`);
  
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Internal server error');
    });
  
    // Test Case 6: Verify Order Details are Correct
    it('should return correct details for buyer and seller', async () => {
      const mockRiderId = new mongoose.Types.ObjectId(); // Instantiate with 'new'
      const mockBuyer = { address: '123 Buyer St', phone: '123456789', email: 'buyer@example.com' };
      const mockSeller = { address: '456 Seller Ave', phone: '987654321', email: 'seller@example.com' };
      const mockCompletedOrder = {
        _id: new mongoose.Types.ObjectId(), // Instantiate with 'new'
        foodName: 'Pizza',
        quantity: 2,
        price: 15.0,
        amount: 30.0,
        buyerId: mockRiderId,
        sellerId: new mongoose.Types.ObjectId(), // Different ObjectId for seller
      };
  
      CompletedOrder.find.mockResolvedValue([mockCompletedOrder]);
      User.findById.mockImplementation(id => {
        if (id.toString() === mockRiderId.toString()) return Promise.resolve(mockBuyer); // Return buyer for mockRiderId
        return Promise.resolve(mockSeller); // Return seller for the other ID
      });
  
      const response = await request(app).get(`/api/rider-orders/${mockRiderId}`);
  
      expect(response.status).toBe(200);
      expect(response.body.orders[0].buyer.address).toBe('123 Buyer St');
      expect(response.body.orders[0].seller.address).toBe('456 Seller Ave');
      expect(response.body.orders[0].buyer.phone).toBe('123456789');
      expect(response.body.orders[0].seller.phone).toBe('987654321');
    });
  });
  
