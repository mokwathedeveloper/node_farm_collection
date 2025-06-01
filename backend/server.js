const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // React app will run on port 3001
  credentials: true // Allow cookies to be sent
})); 
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies

// Set userId cookie if not present
app.use((req, res, next) => {
  if (!req.cookies.userId) {
    res.cookie('userId', uuidv4(), {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }
  next();
});

// MongoDB Connection
const password = encodeURIComponent('Johnosiemo123');
const DB = `mongodb+srv://farmcolection:${password}@farm.odloyec.mongodb.net/?retryWrites=true&w=majority&appName=farm`;

mongoose.connect(DB)
  .then(() => console.log('DB connection successful'))
  .catch(err => console.log('DB connection error:', err));

// Define product schema
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'A product must have a name'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price']
  },
  image: String,
  from: String,
  nutrients: String,
  quantity: String,
  description: String,
  organic: {
    type: Boolean,
    default: false
  }
});

const Product = mongoose.model('Product', productSchema);

// Import cart routes
const cartRoutes = require('./routes/cartRoutes');

// Routes
// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Get a single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Create a new product
app.post('/api/products', async (req, res) => {
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
});

// Use cart routes
app.use('/api/cart', cartRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
