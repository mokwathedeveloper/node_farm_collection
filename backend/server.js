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
