const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust the path to your Express app
const Orders = require('../models/Orders'); // Adjust the path to your Orders model
const MadeOrder = require('../models/MadeOrder'); // Adjust path for MadeOrder
const CompletedOrder = require('../models/CompletedOrder'); // Adjust path for CompletedOrder

describe('GET /api/customer-orders/:buyerId', () => {
  beforeAll(async () => {
    // Ensure only one connection is made
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27017/test-db', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  afterAll(async () => {
    // Clean up after tests
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should fetch all types of orders (pending, made, completed) for a buyer', async () => {
    const buyerId = 'buyer123';

    // Mock the data for Orders, MadeOrder, and CompletedOrder collections
    const mockOrders = [
      { _id: 'order1', buyerId: 'buyer123', status: 'pending' },
      { _id: 'order2', buyerId: 'buyer123', status: 'pending' },
    ];
    const mockMadeOrders = [
      { _id: 'madeOrder1', buyerId: 'buyer123', status: 'made' },
    ];
    const mockCompletedOrders = [
      { _id: 'completedOrder1', buyerId: 'buyer123', status: 'completed' },
    ];

    // Mock the find method for the models
    jest.spyOn(Orders, 'find').mockResolvedValue(mockOrders);
    jest.spyOn(MadeOrder, 'find').mockResolvedValue(mockMadeOrders);
    jest.spyOn(CompletedOrder, 'find').mockResolvedValue(mockCompletedOrders);

    // Act: Make the GET request
    const response = await request(app).get(`/api/customer-orders/${buyerId}`);

    // Assert: Verify that the response contains the correct data
    expect(response.status).toBe(200);
    expect(response.body.orders).toHaveLength(2); // Pending orders
    expect(response.body.madeOrders).toHaveLength(1); // Made orders
    expect(response.body.completedOrders).toHaveLength(1); // Completed orders
    expect(response.body.orders[0].status).toBe('pending');
    expect(response.body.madeOrders[0].status).toBe('made');
    expect(response.body.completedOrders[0].status).toBe('completed');
  });

  it('should return a 500 status code when there is a server error', async () => {
    const buyerId = 'buyer123';

    // Simulate a server error by making the find method throw an error
    jest.spyOn(Orders, 'find').mockRejectedValueOnce(new Error('Database error'));
    jest.spyOn(MadeOrder, 'find').mockRejectedValueOnce(new Error('Database error'));
    jest.spyOn(CompletedOrder, 'find').mockRejectedValueOnce(new Error('Database error'));

    // Act: Make the GET request
    const response = await request(app).get(`/api/customer-orders/${buyerId}`);

    // Assert: Verify that the response returns status 500
    expect(response.status).toBe(500);
    expect(response.text).toBe('Server Error');
  });
});
