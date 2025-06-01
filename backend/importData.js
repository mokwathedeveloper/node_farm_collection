const mongoose = require('mongoose');
const data = require('./data/data.json');
const Product = require('./models/productModel');

// Properly encode the password if it contains special characters
const password = encodeURIComponent('Johnosiemo123');
const DB = `mongodb+srv://farmcolection:${password}@farm.odloyec.mongodb.net/?retryWrites=true&w=majority&appName=farm`;

// Remove deprecated options
mongoose.connect(DB)
  .then(async () => {
    console.log('DB connected');
    await Product.deleteMany();
    await Product.insertMany(data);
    console.log('Data imported');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
