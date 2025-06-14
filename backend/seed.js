const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User, ROLES } = require('./src/models/User');
const Product = require('./src/models/Product');

dotenv.config();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB for seeding'));

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
  },
];

const products = [
  {
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    category: 'electronics',
    stock: 10,
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'T-Shirt',
    description: 'Comfortable cotton t-shirt',
    price: 19.99,
    category: 'clothing',
    stock: 50,
    image: 'https://via.placeholder.com/150',
  },
];

const seedDB = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await User.insertMany(users);
    await Product.insertMany(products);
    console.log('Database seeded successfully');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();