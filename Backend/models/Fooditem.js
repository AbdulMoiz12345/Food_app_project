const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  options: [
    {
      type: { type: String, required: true }, // e.g., 'Full', 'Half', etc.
      price: { type: Number, required: true }, // e.g., 500, 400, etc.
    },
  ],
  description: { type: String, required: true },
  sellerId: { type: String, required: true },
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
