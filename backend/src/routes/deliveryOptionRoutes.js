const express = require('express');
const router = express.Router();
const {
    getDeliveryOptions,
    getDeliveryOptionById,
    createDeliveryOption,
    updateDeliveryOption,
    deleteDeliveryOption
} = require('../controllers/deliveryOptionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getDeliveryOptions)
    .post(protect, admin, createDeliveryOption);

router.route('/:id')
    .get(getDeliveryOptionById)
    .put(protect, admin, updateDeliveryOption)
    .delete(protect, admin, deleteDeliveryOption);

module.exports = router; 