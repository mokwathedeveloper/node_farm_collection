const { faker } = require('@faker-js/faker');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../../src/models/User');
const Product = require('../../src/models/Product');
const mongoose = require('mongoose');

// Generate test user data
const generateUserData = (overrides = {}) => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: 'password123',
  role: 'user',
  ...overrides
});

// Valid product categories from the model
const validCategories = [
  'Electronics',
  'Cameras',
  'Laptops',
  'Accessories',
  'Headphones',
  'Food',
  'Books',
  'Clothes/Shoes',
  'Beauty/Health',
  'Sports',
  'Outdoor',
  'Home'
];

// Generate test product data
const generateProductData = (overrides = {}) => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price()),
  category: faker.helpers.arrayElement(validCategories),
  seller: faker.company.name(),
  stock: faker.number.int({ min: 0, max: 100 }),
  images: [{ url: faker.image.url() }],
  ...overrides
});

// Create test user in database
const createTestUser = async (userData = {}) => {
  const user = new User(generateUserData(userData));
  await user.save();
  return user;
};

// Create test admin user
const createTestAdmin = async (userData = {}) => {
  return createTestUser({
    role: 'admin',
    ...userData
  });
};

// Create test superadmin user
const createTestSuperAdmin = async (userData = {}) => {
  return createTestUser({
    role: 'superadmin',
    ...userData
  });
};

// Create test product in database
const createTestProduct = async (productData = {}) => {
  // Create a user if not provided (products require a user)
  let user = productData.user;
  if (!user) {
    user = await createTestUser();
    productData.user = user._id;
  }

  const product = new Product(generateProductData(productData));
  await product.save();
  return product;
};

// Generate JWT token for user
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'testsecret', {
    expiresIn: '30d'
  });
};

// Get auth headers for requests
const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`
});

// Create authenticated user and return user + token
const createAuthenticatedUser = async (userData = {}) => {
  const user = await createTestUser(userData);
  const token = generateToken(user._id);
  return { user, token, headers: getAuthHeaders(token) };
};

// Create authenticated admin and return user + token
const createAuthenticatedAdmin = async (userData = {}) => {
  const user = await createTestAdmin(userData);
  const token = generateToken(user._id);
  return { user, token, headers: getAuthHeaders(token) };
};

// Create authenticated superadmin and return user + token
const createAuthenticatedSuperAdmin = async (userData = {}) => {
  const user = await createTestSuperAdmin(userData);
  const token = generateToken(user._id);
  return { user, token, headers: getAuthHeaders(token) };
};

// Wait for a specified time (for async operations)
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Clean all collections
const cleanDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

module.exports = {
  generateUserData,
  generateProductData,
  createTestUser,
  createTestAdmin,
  createTestSuperAdmin,
  createTestProduct,
  generateToken,
  getAuthHeaders,
  createAuthenticatedUser,
  createAuthenticatedAdmin,
  createAuthenticatedSuperAdmin,
  wait,
  cleanDatabase
};
