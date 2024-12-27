const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); // Adjust according to your project structure
const MadeOrder = require('../models/MadeOrder');
const User = require('../models/User');
const CompletedOrder = require('../models/CompletedOrder');

// Mock Data Setup
const mockBuyerId = new mongoose.Types.ObjectId();
const mockSellerId = new mongoose.Types.ObjectId();
const mockRiderId = 'rider123';

describe('Rider Orders API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully fetch all made orders with buyer and seller details', async () => {
    // Mock MadeOrder, User (buyer, seller) data with required fields
    const mockBuyer = new User({ 
      _id: mockBuyerId, 
      address: 'Buyer Address', 
      phone: '12345', 
      email: 'buyer@example.com', 
      role: 'buyer', 
      password: 'password123' 
    });

    const mockSeller = new User({ 
      _id: mockSellerId, 
      address: 'Seller Address', 
      phone: '54321', 
      email: 'seller@example.com', 
      role: 'seller', 
      password: 'password123' 
    });

    const mockMadeOrder = new MadeOrder({
      foodName: 'Pizza',
      quantity: 2,
      price: 10,
      amount: 20,
      buyerId: mockBuyerId,
      sellerId: mockSellerId
    });

    // Mocking database interactions
    jest.spyOn(User, 'findById').mockImplementation((id) => {
      if (id.toString() === mockBuyerId.toString()) return mockBuyer;
      if (id.toString() === mockSellerId.toString()) return mockSeller;
      return null;
    });
    jest.spyOn(MadeOrder, 'find').mockResolvedValue([mockMadeOrder]);

    const response = await request(app).get('/api/rider-orders');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.orders).toHaveLength(1);
    expect(response.body.orders[0].buyer.address).toBe('Buyer Address');
    expect(response.body.orders[0].seller.address).toBe('Seller Address');
  });

  it('should return an error if there is a server error', async () => {
    // Simulate server error by throwing error in mock
    jest.spyOn(MadeOrder, 'find').mockRejectedValue(new Error('Server error'));

    const response = await request(app).get('/api/rider-orders');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Internal server error');
  });

  it('should successfully mark an order as complete and move it to completed orders', async () => {
    const mockMadeOrder = new MadeOrder({
      _id: new mongoose.Types.ObjectId(),
      foodName: 'Pizza',
      quantity: 2,
      price: 10,
      amount: 20,
      buyerId: mockBuyerId,
      sellerId: mockSellerId
    });

    // Mock database operations
    jest.spyOn(MadeOrder, 'findByIdAndDelete').mockResolvedValue(mockMadeOrder);
    jest.spyOn(CompletedOrder.prototype, 'save').mockResolvedValue({});

    const response = await request(app)
      .patch(`/api/rider-orders/${mockMadeOrder._id}/complete`)
      .send({ riderId: mockRiderId });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Order marked as complete');
  });

  it('should return 404 if the order is not found', async () => {
    const nonExistentOrderId = new mongoose.Types.ObjectId();

    jest.spyOn(MadeOrder, 'findByIdAndDelete').mockResolvedValue(null);

    const response = await request(app)
      .patch(`/api/rider-orders/${nonExistentOrderId}/complete`)
      .send({ riderId: mockRiderId });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Order not found');
  });

  it('should return a 500 status code when there is a server error', async () => {
    const mockMadeOrder = new MadeOrder({
      _id: new mongoose.Types.ObjectId(),
      foodName: 'Pizza',
      quantity: 2,
      price: 10,
      amount: 20,
      buyerId: mockBuyerId,
      sellerId: mockSellerId
    });

    // Simulate a database error
    jest.spyOn(MadeOrder, 'findByIdAndDelete').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .patch(`/api/rider-orders/${mockMadeOrder._id}/complete`)
      .send({ riderId: mockRiderId });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Internal server error');
  });
});
