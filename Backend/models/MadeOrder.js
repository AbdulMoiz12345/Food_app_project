const mongoose = require('mongoose');

const MadeOrderSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: String, required: true },
  price: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }, // Timestamp for when the order was completed
});

module.exports = mongoose.model('MadeOrder', MadeOrderSchema);
