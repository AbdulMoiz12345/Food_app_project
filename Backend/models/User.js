const mongoose = require('mongoose');

// Define schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true, enum: ['buyer', 'seller','rider'] }, // Enum ensures only 'buyer' or 'seller' is allowed
});

// Create model
const User = mongoose.model('User', userSchema);

module.exports = User;
