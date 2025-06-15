const mongoose = require('mongoose');

const deliveryOptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    estimatedDays: {
        min: {
            type: Number,
            required: true,
            min: 0
        },
        max: {
            type: Number,
            required: true,
            min: 0
        }
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    provider: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
deliveryOptionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('DeliveryOption', deliveryOptionSchema); 