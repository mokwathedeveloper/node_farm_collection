require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const { verifyToken, isAdmin } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

// Import models
const Product = require('./models/productModel');

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
})); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set userId cookie if not present
app.use((req, res, next) => {
  if (!req.cookies.userId) {
    res.cookie('userId', uuidv4(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only in production
      sameSite: 'lax', // Helps prevent CSRF
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
  }
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('DB connection successful'))
  .catch(err => console.log('DB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Remove the inline product route since we've moved it to its own file
// app.get('/api/products', async (req, res) => { ... });

// Create a new product (admin only)
app.post('/api/products', verifyToken, isAdmin, async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: { product: newProduct }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
