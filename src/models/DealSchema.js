const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true, // Discount percentage, e.g. 20 means 20% off
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',  // Referencing a specific product if it's a product-based deal
    default: null,
  },
  
  isActive: {
    type: Boolean,
    default: true, // Whether the deal is currently active or not
  },
});

module.exports = mongoose.model('Deal', dealSchema);
