const fs = require('fs');
const path = require('path');
const Product = require('../models/productModel');

const tempAddProduct = fs.readFileSync(path.join(__dirname, '..', 'templates', 'template-add-product.html'), 'utf-8');

exports.getAddProductForm = (req, res) => {
  res.status(200).send(tempAddProduct);
};

exports.addProduct = async (req, res) => {
  try {
    console.log('Received product data:', req.body);
    const newProduct = await Product.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        product: newProduct
      }
    });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};