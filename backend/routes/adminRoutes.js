const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/add-product', adminController.getAddProductForm);
router.post('/add-product', adminController.addProduct);

module.exports = router;