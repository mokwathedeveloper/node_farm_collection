require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, ROLES } = require('./src/models/User');
const readline = require('readline');

// Create interface for command line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Create admin user
async function createAdmin() {
  try {
    rl.question('Enter admin name: ', (name) => {
      rl.question('Enter admin email: ', (email) => {
        rl.question('Enter admin password: ', async (password) => {
          // Check if email is already in use
          const userExists = await User.findOne({ email: email.toLowerCase() });
          if (userExists) {
            console.error(`User with email ${email} already exists`);
            rl.close();
            process.exit(1);
          }
          
          // Hash password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          
          // Create admin user
          const user = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            isAdmin: true,
            role: 'admin'
          });
          
          await user.save();
          
          console.log(`Success! Admin user ${user.name} (${user.email}) created`);
          console.log('User details:', {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            role: user.role
          });
          
          rl.close();
          process.exit(0);
        });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    rl.close();
    process.exit(1);
  }
}

createAdmin();