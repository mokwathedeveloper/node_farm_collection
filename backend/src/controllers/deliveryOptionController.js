const DeliveryOption = require('../models/deliveryOption');
const asyncHandler = require('express-async-handler');

// @desc    Get all delivery options
// @route   GET /api/delivery-options
// @access  Public
const getDeliveryOptions = asyncHandler(async (req, res) => {
    const deliveryOptions = await DeliveryOption.find({ isAvailable: true });
    res.json(deliveryOptions);
});

// @desc    Get delivery option by ID
// @route   GET /api/delivery-options/:id
// @access  Public
const getDeliveryOptionById = asyncHandler(async (req, res) => {
    const deliveryOption = await DeliveryOption.findById(req.params.id);
    if (deliveryOption) {
        res.json(deliveryOption);
    } else {
        res.status(404);
        throw new Error('Delivery option not found');
    }
});

// @desc    Create delivery option
// @route   POST /api/delivery-options
// @access  Private/Admin
const createDeliveryOption = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        estimatedDays,
        provider,
        isAvailable
    } = req.body;

    const deliveryOption = new DeliveryOption({
        name,
        description,
        price,
        estimatedDays,
        provider,
        isAvailable: isAvailable || true
    });

    const createdDeliveryOption = await deliveryOption.save();
    res.status(201).json(createdDeliveryOption);
});

// @desc    Update delivery option
// @route   PUT /api/delivery-options/:id
// @access  Private/Admin
const updateDeliveryOption = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        estimatedDays,
        provider,
        isAvailable
    } = req.body;

    const deliveryOption = await DeliveryOption.findById(req.params.id);

    if (deliveryOption) {
        deliveryOption.name = name || deliveryOption.name;
        deliveryOption.description = description || deliveryOption.description;
        deliveryOption.price = price || deliveryOption.price;
        deliveryOption.estimatedDays = estimatedDays || deliveryOption.estimatedDays;
        deliveryOption.provider = provider || deliveryOption.provider;
        deliveryOption.isAvailable = isAvailable !== undefined ? isAvailable : deliveryOption.isAvailable;

        const updatedDeliveryOption = await deliveryOption.save();
        res.json(updatedDeliveryOption);
    } else {
        res.status(404);
        throw new Error('Delivery option not found');
    }
});

// @desc    Delete delivery option
// @route   DELETE /api/delivery-options/:id
// @access  Private/Admin
const deleteDeliveryOption = asyncHandler(async (req, res) => {
    const deliveryOption = await DeliveryOption.findById(req.params.id);

    if (deliveryOption) {
        await deliveryOption.remove();
        res.json({ message: 'Delivery option removed' });
    } else {
        res.status(404);
        throw new Error('Delivery option not found');
    }
});

module.exports = {
    getDeliveryOptions,
    getDeliveryOptionById,
    createDeliveryOption,
    updateDeliveryOption,
    deleteDeliveryOption
}; 