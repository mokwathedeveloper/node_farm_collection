require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const { User, ROLES } = require('./src/models/User');

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

// Main menu
function showMenu() {
  console.log('\n===== Admin Management Tool =====');
  console.log('1. Make user an admin');
  console.log('2. List all users');
  console.log('3. Change user role');
  console.log('4. Exit');
  
  rl.question('\nSelect an option: ', (answer) => {
    switch(answer) {
      case '1':
        makeAdmin();
        break;
      case '2':
        listUsers();
        break;
      case '3':
        changeRole();
        break;
      case '4':
        console.log('Exiting...');
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('Invalid option');
        showMenu();
    }
  });
}

// Make user an admin
function makeAdmin() {
  rl.question('Enter user email or name: ', async (identifier) => {
    try {
      const user = await User.findOne({
        $or: [
          { email: identifier.toLowerCase() },
          { name: identifier }
        ]
      });
      
      if (!user) {
        console.error(`User with identifier ${identifier} not found`);
        return showMenu();
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
      
      showMenu();
    } catch (error) {
      console.error('Error:', error);
      showMenu();
    }
  });
}

// List all users
async function listUsers() {
  try {
    const users = await User.find({}).select('name email isAdmin role');
    
    console.log('\n===== User List =====');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Admin: ${user.isAdmin}, Role: ${user.role || 'none'}`);
    });
    
    showMenu();
  } catch (error) {
    console.error('Error:', error);
    showMenu();
  }
}

// Change user role
function changeRole() {
  rl.question('Enter user email or name: ', async (identifier) => {
    try {
      const user = await User.findOne({
        $or: [
          { email: identifier.toLowerCase() },
          { name: identifier }
        ]
      });
      
      if (!user) {
        console.error(`User with identifier ${identifier} not found`);
        return showMenu();
      }
      
      console.log(`Current role for ${user.name}: ${user.role || 'none'}, isAdmin: ${user.isAdmin}`);
      
      rl.question('Enter new role (user, client, admin, superadmin): ', async (role) => {
        if (!['user', 'client', 'admin', 'superadmin'].includes(role)) {
          console.error('Invalid role. Must be one of: user, client, admin, superadmin');
          return showMenu();
        }
        
        user.role = role;
        user.isAdmin = ['admin', 'superadmin'].includes(role);
        await user.save();
        
        console.log(`Success! User ${user.name} role updated to ${role}`);
        console.log('User details:', {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          role: user.role
        });
        
        showMenu();
      });
    } catch (error) {
      console.error('Error:', error);
      showMenu();
    }
  });
}

// Start the application
console.log('Starting Admin Management Tool...');
showMenu();

// Handle close
rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});