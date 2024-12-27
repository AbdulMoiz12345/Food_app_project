const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); // Make sure this is correct path to your app.js
const Orders = require('../models/Orders');
const MadeOrder = require('../models/MadeOrder');

// Mock the Orders and MadeOrder models
jest.mock('../models/Orders', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

jest.mock('../models/MadeOrder', () => ({
  save: jest.fn(),
}));

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/Food-app');
});

afterAll(async () => {
  await mongoose.connection.close();
  jest.restoreAllMocks();
});

describe('POST /api/seller-orders', () => {
  it('should return orders for the given seller ID', async () => {
    const sellerId = '12345';
    const mockOrders = [
      { _id: 'order1', sellerId, name: 'Biryani', quantity: 2, amount: 40 },
      { _id: 'order2', sellerId, name: 'Salad', quantity: 1, amount: 10 },
    ];

    Orders.find.mockResolvedValueOnce(mockOrders);

    const response = await request(app)
      .post('/api/seller-orders')
      .send({ sellerId });

    expect(response.status).toBe(200);
    expect(response.body.orders).toEqual(mockOrders);
    expect(Orders.find).toHaveBeenCalledWith({ sellerId });
  });

  it('should return error if seller ID is not provided', async () => {
    const response = await request(app).post('/api/seller-orders').send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Seller ID is required');
  });

  it('should handle internal server errors', async () => {
    const sellerId = '12345';
    Orders.find.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post('/api/seller-orders')
      .send({ sellerId });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
});

describe('PATCH /api/orders/:orderId/complete', () => {

  it('should return an error if the order is not found', async () => {
    const orderId = 'nonexistentOrderId';
    Orders.findById.mockResolvedValueOnce(null);

    const response = await request(app)
      .patch(`/api/orders/${orderId}/complete`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Order not found');
  });

  it('should handle internal server errors when marking the order as complete', async () => {
    const orderId = 'order1';
    const mockOrder = {
      _id: orderId,
      sellerId: '12345',
      buyerId: '54321',
      name: 'Biryani',
      quantity: 2,
      amount: 40,
      price: 20,
    };

    Orders.findById.mockResolvedValueOnce(mockOrder);
    MadeOrder.save.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .patch(`/api/orders/${orderId}/complete`)
      .send();

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal Server Error');
  });
});
