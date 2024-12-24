// models/Cart.js
import mongoose from 'mongoose';

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  selectedSize: {
    type: String,
    required: true
  },
  selectedColor: {
    type: String
  },
  image: {
    type: String
  },
  
    title: { type: String },
    price: { type: Number },
  
}, { timestamps: true });

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ecommerce',  // Reference to the User model
    required: true
  },
  items: [cartItemSchema]  // Array of cart items
}, { timestamps: true });

export const Cart = mongoose.model('ShoppingCart', cartSchema);
