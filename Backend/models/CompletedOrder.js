const mongoose = require('mongoose');

const CompletedOrderSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: String, required: true },
  price: { type: Number, required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deliveredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CompletedOrder', CompletedOrderSchema);
