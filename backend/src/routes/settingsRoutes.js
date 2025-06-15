const express = require('express');
const router = express.Router();
const { 
  getSettings, 
  updateSettings,
  getPermissionsList
} = require('../controllers/settingsController');
const { 
  protect, 
  requirePermission 
} = require('../middleware/authMiddleware');

// All settings routes require authentication and manage_settings permission
router.use(protect);
router.use(requirePermission('manage_settings'));

router.get('/', getSettings);
router.put('/', updateSettings);
router.get('/permissions', getPermissionsList);

module.exports = router;