const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Properly encode the password if it contains special characters
const password = encodeURIComponent('Johnosiemo123');
const DB = `mongodb+srv://farmcolection:${password}@farm.odloyec.mongodb.net/?retryWrites=true&w=majority&appName=farm`;

// Connect to MongoDB
mongoose.connect(DB)
  .then(() => console.log('DB connection successful'))
  .catch(err => console.log('DB connection error:', err));

// Middleware
app.use(express.static('public'));
app.use(express.json()); // Important for parsing JSON request bodies
app.use(express.urlencoded({ extended: true })); // For parsing form data

// Routes
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', adminRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
