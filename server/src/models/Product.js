const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    default: 0,
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
