const request = require('supertest');
const app = require('../server'); // Import your app
const mockFs = require('mock-fs');
const FoodItem = require('../models/FoodItem'); // Import your FoodItem model

// Mocking Multer to simulate file upload without actually creating files
jest.mock('multer', () => {
  return jest.fn(() => ({
    single: jest.fn().mockImplementation(() => (req, res, next) => next()), // Mock single file upload handler
    diskStorage: jest.fn().mockReturnValue({
      destination: (req, file, cb) => cb(null, 'uploads/'),
      filename: (req, file, cb) => cb(null, 'mocked-filename.jpg'),
    }),
  }));
});

// Create a mock FoodItem model to simulate database interaction
jest.mock('../models/FoodItem', () => {
  return jest.fn().mockImplementation(() => {
    return {
      save: jest.fn(),
    };
  });
});

describe('POST /api/add-food', () => {
  beforeAll(() => {
    // Mock filesystem
    mockFs({
      uploads: {},
    });
  });

  afterAll(() => {
    // Restore the filesystem mock
    mockFs.restore();
  });

  it('should successfully add a new food item with an image', async () => {
    const foodData = {
      category: 'Rice/Biryani',
      name: 'Biryani',
      options: JSON.stringify([{ option: 'Full', price: 20 }]),
      description: 'Delicious biryani',
      sellerId: '12345',
    };

    // Simulate file upload using supertest and form-data
    const response = await request(app)
      .post('/api/add-food')
      .field('category', foodData.category)
      .field('name', foodData.name)
      .field('options', foodData.options)
      .field('description', foodData.description)
      .field('sellerId', foodData.sellerId)
      .attach('image', Buffer.from('dummy image'), 'mocked-filename.jpg'); // Mock the file as a buffer

    // Check that the FoodItem model's save method was called
    expect(FoodItem.prototype.save).toHaveBeenCalled();

    // Check for the response
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Food item added successfully!');
  });

  it('should fail to add a food item if required fields are missing', async () => {
    const foodData = {
      category: '',
      name: '',
      options: '',
      description: '',
      sellerId: '',
    };

    const response = await request(app)
      .post('/api/add-food')
      .field('category', foodData.category)
      .field('name', foodData.name)
      .field('options', foodData.options)
      .field('description', foodData.description)
      .field('sellerId', foodData.sellerId)
      .attach('image', Buffer.from('dummy image'), 'mocked-filename.jpg');

    expect(response.status).toBe(400); // Assuming validation for required fields
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Failed to add food item.');
  });

  it('should fail if there is an error during food item saving', async () => {
    // Simulate an error in saving the food item
    FoodItem.prototype.save.mockRejectedValueOnce(new Error('Database error'));

    const foodData = {
      category: 'Rice/Biryani',
      name: 'Biryani',
      options: JSON.stringify([{ option: 'Full', price: 20 }]),
      description: 'Delicious biryani',
      sellerId: '12345',
    };

    const response = await request(app)
      .post('/api/add-food')
      .field('category', foodData.category)
      .field('name', foodData.name)
      .field('options', foodData.options)
      .field('description', foodData.description)
      .field('sellerId', foodData.sellerId)
      .attach('image', Buffer.from('dummy image'), 'mocked-filename.jpg');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Failed to add food item.');
  });
});
