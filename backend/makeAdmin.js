require('dotenv').config();
const mongoose = require('mongoose');
const { User, ROLES } = require('./src/models/User');

// Get email from command line
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  console.error('Usage: node makeAdmin.js your-email@example.com');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Update user to admin
async function makeAdmin() {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }
    
    user.isAdmin = true;
    user.role = 'admin';
    await user.save();
    
    console.log(`Success! User ${user.name} (${user.email}) is now an admin`);
    console.log('User details:', {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

makeAdmin();