const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// MongoDB Order Schema
const orderSchema = new mongoose.Schema({
  sellerId: String,
  buyerId: String,
  foodId: String,
  name: String,
  amount:String,
  quantity: Number,
  price: Number,
  orderedAt: Date,
});
const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;