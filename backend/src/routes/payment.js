const express = require('express');
const router = express.Router();

// Process payment
router.post('/process', (req, res) => {
  res.json({ message: 'Process payment endpoint' });
});

module.exports = router;