const Product = require('../models/productModel');
const fs = require('fs');
const path = require('path');

const tempOverview = fs.readFileSync(path.join(__dirname, '..', 'templates', 'template-overview.html'), 'utf-8');
const tempCard = fs.readFileSync(path.join(__dirname, '..', 'templates', 'template-card.html'), 'utf-8');
const tempProduct = fs.readFileSync(path.join(__dirname, '..', 'templates', 'template-product.html'), 'utf-8');

const replaceTemplate = (template, product) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product._id.toString());
  output = output.replace(/{%NOT_ORGANIC%}/g, product.organic ? '' : 'not-organic');
  return output;
};

exports.getOverview = async (req, res) => {
  try {
    const products = await Product.find();
    const cardsHtml = products.map(prod => replaceTemplate(tempCard, prod)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.status(200).send(output);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getProduct = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).send('Product ID missing');
    const product = await Product.findById(id);
    if (!product) return res.status(404).send('Product not found');

    const output = replaceTemplate(tempProduct, product);
    res.status(200).send(output);
  } catch (err) {
    res.status(500).send('Server error');
  }
};