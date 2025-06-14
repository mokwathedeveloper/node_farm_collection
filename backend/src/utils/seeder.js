const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const { User } = require('../models/User');
const connectDB = require('../config/db');
const seedDeliveryOptions = require('../seeders/deliveryOptions');

dotenv.config();

const products = [
  {
    name: "iPhone 13 Pro",
    description: "Latest iPhone with A15 Bionic chip and Pro camera system",
    price: 999.99,
    category: "Electronics",
    stock: 50,
    seller: "Apple Inc.",
    images: [{
      url: "https://example.com/iphone13pro.jpg"
    }]
  },
  {
    name: "MacBook Pro 14",
    description: "14-inch MacBook Pro with M1 Pro chip",
    price: 1999.99,
    category: "Laptops",
    stock: 30,
    seller: "Apple Inc.",
    images: [{
      url: "https://example.com/macbookpro14.jpg"
    }]
  },
  {
    name: "Sony WH-1000XM4",
    description: "Premium noise-cancelling headphones",
    price: 349.99,
    category: "Headphones",
    stock: 100,
    seller: "Sony Electronics",
    images: [{
      url: "https://example.com/sonywh1000xm4.jpg"
    }]
  },
  {
    name: "iPad Air",
    description: "Powerful iPad with M1 chip",
    price: 599.99,
    category: "Electronics",
    stock: 75,
    seller: "Apple Inc.",
    images: [{
      url: "https://example.com/ipadair.jpg"
    }]
  },
  {
    name: "Samsung Galaxy S21",
    description: "5G smartphone with pro-grade camera",
    price: 799.99,
    category: "Electronics",
    stock: 60,
    seller: "Samsung Electronics",
    images: [{
      url: "https://example.com/galaxys21.jpg"
    }]
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Create admin user if not exists
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created');
    }
    
    // Delete existing products
    await Product.deleteMany();
    console.log('Products deleted');

    // Add admin user reference to products
    const productsWithUser = products.map(product => ({
      ...product,
      user: adminUser._id
    }));

    // Insert new products
    await Product.insertMany(productsWithUser);
    console.log('Products inserted');

    // Seed delivery options
    await seedDeliveryOptions();
    console.log('All seeding completed');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts(); 