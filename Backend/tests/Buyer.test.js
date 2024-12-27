const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust the path to where your Express app is located
const FoodItem = require('../models/FoodItem'); // Adjust the path to your FoodItem model

describe('GET /api/get-foods', () => {
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

  it('should fetch food items and return them', async () => {
    // Arrange: Add some mock food items to the database with the required 'category' field
    const mockFoods = [
      { name: 'Pizza', description: 'Delicious pizza', imageUrl: 'pizza.jpg', options: [], sellerId: 'seller1', category: 'Italian' },
      { name: 'Burger', description: 'Beef burger', imageUrl: 'burger.jpg', options: [], sellerId: 'seller2', category: 'Fast Food' },
    ];
    await FoodItem.insertMany(mockFoods);

    // Act: Make a GET request to the /api/get-foods endpoint
    const response = await request(app).get('/api/get-foods');

    // Assert: Verify that the response status is 200 and contains the mock data
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe('Pizza');
    expect(response.body[1].name).toBe('Burger');
  });

  it('should return a 500 status code when there is a server error', async () => {
    // Simulate an error by mocking the FoodItem.find() method to throw an error
    jest.spyOn(FoodItem, 'find').mockRejectedValueOnce(new Error('Database error'));

    // Act: Make a GET request to the /api/get-foods endpoint
    const response = await request(app).get('/api/get-foods');

    // Assert: Verify that the response status is 500 and contains the appropriate error message
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to fetch food items');
  });
});
