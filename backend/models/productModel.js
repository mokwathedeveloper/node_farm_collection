const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'A product must have a name']
  },
  image: String,
  from: String,
  nutrients: String,
  quantity: String,
  price: {
    type: Number,
    required: [true, 'A product must have a price']
  },
  organic: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: [true, 'A product must have a description']
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
