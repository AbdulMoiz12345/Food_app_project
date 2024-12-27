const request = require('supertest');
const app = require('../server'); // Assuming your Express app is in 'app.js'
const User = require('../models/User'); // Assuming you have a User model

jest.mock('../models/User'); // Mocking the User model

describe('POST /api/login', () => {
  it('should return a success message and user data when valid credentials are provided', async () => {
    // Mock a successful user lookup
    const mockUser = {
      _id: '12345',
      email: 'test@example.com',
      password: 'password123',
      role: 'buyer',
      address: '123 Street, City, Country',
    };
    
    User.findOne.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
        role: 'buyer',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.userId).toBe(mockUser._id);
    expect(response.body.userAddress).toBe(mockUser.address);
  });
});

it('should return an error when invalid credentials are provided', async () => {
    // Mock the User lookup to return null (no user found)
    User.findOne.mockResolvedValue(null);
  
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'wrong@example.com',
        password: 'wrongpassword',
        role: 'buyer',
      });
  
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return a 500 error when there is a server error', async () => {
    // Simulate a database error by throwing an error in the mock
    User.findOne.mockRejectedValue(new Error('Database connection error'));
  
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
        role: 'buyer',
      });
  
    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Internal server error');
  });
  
    