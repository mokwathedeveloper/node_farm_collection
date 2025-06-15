const express = require('express');
const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'New auth routes are working!' });
});

// Setup superadmin route
router.post('/setup-superadmin', (req, res) => {
  res.json({ 
    message: 'New setup superadmin route is working!',
    receivedData: req.body 
  });
});

module.exports = router;