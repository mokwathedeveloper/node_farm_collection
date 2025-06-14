const express = require('express');
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  createUser
} = require('../controllers/userController');
const {
  getProfile,
  updateProfile,
  updatePassword
} = require('../controllers/authController');
const { protect, admin, checkRole } = require('../middleware/authMiddleware');

// Client routes
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.route('/profile/password')
  .put(protect, updatePassword);

router.route('/profile/addresses')
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route('/profile/addresses/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

// Admin routes
router.use(protect, checkRole('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Superadmin-only routes
router.get('/analytics/all', checkRole('superadmin'), (req, res) => {
  // Placeholder for superadmin analytics
  res.json({ message: 'Superadmin analytics' });
});

module.exports = router;
