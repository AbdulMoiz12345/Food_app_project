const request = require('supertest');
const app = require('../server'); // Your express app
const FoodItem = require('../models/FoodItem'); // The FoodItem model

jest.mock('../models/FoodItem'); // Mock the FoodItem model

describe('GET /api/seller-foods/:sellerId', () => {
  it('should return food items for a given sellerId', async () => {
    // Sample mock data
    const sellerId = '123';
    const mockFoodItems = [
      { _id: '1', name: 'Pizza', price: 20, sellerId },
      { _id: '2', name: 'Burger', price: 15, sellerId }
    ];

    // Mock the database call
    FoodItem.find.mockResolvedValue(mockFoodItems);

    const response = await request(app).get(`/api/seller-foods/${sellerId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockFoodItems); // Check if response body matches the mock data
    expect(FoodItem.find).toHaveBeenCalledWith({ sellerId }); // Ensure the database call was made with the correct parameters
  });

  it('should return 500 if there is an error fetching food items', async () => {
    const sellerId = '123';
    // Simulate a database error
    FoodItem.find.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get(`/api/seller-foods/${sellerId}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to fetch food items');
  });
});
describe('DELETE /api/delete-food/:id', () => {
    it('should delete a food item by id and return success message', async () => {
      const foodItemId = '1';
      const mockDeletedFoodItem = { _id: foodItemId, name: 'Pizza', price: 20 };
  
      // Mock the database call
      FoodItem.findByIdAndDelete.mockResolvedValue(mockDeletedFoodItem);
  
      const response = await request(app).delete(`/api/delete-food/${foodItemId}`);
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Food item deleted successfully');
      expect(FoodItem.findByIdAndDelete).toHaveBeenCalledWith(foodItemId); // Ensure correct database call
    });
  
    it('should return 404 if the food item is not found', async () => {
      const foodItemId = '1';
  
      // Mock the database call to return null, simulating item not found
      FoodItem.findByIdAndDelete.mockResolvedValue(null);
  
      const response = await request(app).delete(`/api/delete-food/${foodItemId}`);
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Food item not found');
    });
  
    it('should return 500 if there is an error deleting the food item', async () => {
      const foodItemId = '1';
  
      // Simulate a database error
      FoodItem.findByIdAndDelete.mockRejectedValue(new Error('Database error'));
  
      const response = await request(app).delete(`/api/delete-food/${foodItemId}`);
  
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to delete food item');
    });
  });
  