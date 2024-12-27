const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); // Make sure this is the correct path to your app.js
const CompletedOrder = require('../models/CompletedOrder'); // Correct path to your CompletedOrder model

// Mock the CompletedOrder model
jest.mock('../models/CompletedOrder', () => ({
  find: jest.fn(),
}));

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/Food-app');
});

afterAll(async () => {
  await mongoose.connection.close();
  jest.restoreAllMocks();
});

describe('GET /api/seller-completed-orders/:sellerId', () => {

  it('should return completed orders for the given seller ID', async () => {
    const sellerId = '12345';
    const mockCompletedOrders = [
      { _id: 'order1', sellerId, name: 'Biryani', quantity: 2, amount: 40, status: 'completed' },
      { _id: 'order2', sellerId, name: 'Salad', quantity: 1, amount: 10, status: 'completed' },
    ];

    CompletedOrder.find.mockResolvedValueOnce(mockCompletedOrders); // Mocking the response for CompletedOrder.find
    
    const response = await request(app)
      .get(`/api/seller-completed-orders/${sellerId}`)
      .send();

    expect(response.status).toBe(200); // Verifying the status code
    expect(response.body.completedOrders).toEqual(mockCompletedOrders); // Verifying the completed orders returned
    expect(CompletedOrder.find).toHaveBeenCalledWith({ sellerId }); // Verifying the query made to fetch completed orders
  });

  it('should return an empty list if no completed orders are found', async () => {
    const sellerId = '12345';
    const mockCompletedOrders = [];

    CompletedOrder.find.mockResolvedValueOnce(mockCompletedOrders); // Mocking the response for no completed orders
    
    const response = await request(app)
      .get(`/api/seller-completed-orders/${sellerId}`)
      .send();

    expect(response.status).toBe(200); // Verifying the status code
    expect(response.body.completedOrders).toEqual(mockCompletedOrders); // Verifying that no completed orders are returned
  });

  
});
