const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust the path to your Express app
const Orders = require('../models/Orders'); // Adjust the path to your Orders model

describe('POST /api/orders', () => {
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

  it('should successfully create a new order', async () => {
    const newOrder = {
      sellerId: 'seller123',
      buyerId: 'buyer123',
      foodId: 'food123',
      name: 'Pizza',
      amount: 20,
      quantity: 2,
      price: 10,
      orderedAt: new Date(),
    };

    const response = await request(app)
      .post('/api/orders')
      .send(newOrder);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Order created successfully');
    expect(response.body.order).toHaveProperty('_id');
    expect(response.body.order.sellerId).toBe(newOrder.sellerId);
    expect(response.body.order.buyerId).toBe(newOrder.buyerId);
    expect(response.body.order.foodId).toBe(newOrder.foodId);
    expect(response.body.order.name).toBe(newOrder.name);
  });
});
it('should return an error if required fields are missing', async () => {
    const incompleteOrder = {
      sellerId: 'seller123',
      buyerId: 'buyer123',
      foodId: 'food123',
      name: 'Pizza',
      // Missing 'quantity' and 'price'
      amount: 20,
      orderedAt: new Date(),
    };
  
    const response = await request(app)
      .post('/api/orders')
      .send(incompleteOrder);
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('All fields are required');
  });
  it('should handle server errors gracefully', async () => {
    // Mock the save function to throw an error
    jest.spyOn(Orders.prototype, 'save').mockRejectedValueOnce(new Error('Database error'));
  
    const validOrder = {
      sellerId: 'seller123',
      buyerId: 'buyer123',
      foodId: 'food123',
      name: 'Pizza',
      amount: 20,
      quantity: 2,
      price: 10,
      orderedAt: new Date(),
    };
  
    const response = await request(app)
      .post('/api/orders')
      .send(validOrder);
  
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
    