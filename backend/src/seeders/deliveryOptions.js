const DeliveryOption = require('../models/deliveryOption');
const mongoose = require('mongoose');

const deliveryOptions = [
  {
    name: 'Standard Shipping',
    description: 'Regular delivery service with standard handling',
    price: 5.99,
    estimatedDays: {
      min: 5,
      max: 7
    },
    provider: 'Standard Post',
    isAvailable: true
  },
  {
    name: 'Express Shipping',
    description: 'Fast delivery service with priority handling',
    price: 12.99,
    estimatedDays: {
      min: 2,
      max: 3
    },
    provider: 'Express Courier',
    isAvailable: true
  },
  {
    name: 'Next Day Delivery',
    description: 'Premium next-day delivery service',
    price: 19.99,
    estimatedDays: {
      min: 1,
      max: 1
    },
    provider: 'Premium Express',
    isAvailable: true
  },
  {
    name: 'Economy Shipping',
    description: 'Cost-effective shipping option for non-urgent deliveries',
    price: 3.99,
    estimatedDays: {
      min: 7,
      max: 10
    },
    provider: 'Economy Post',
    isAvailable: true
  }
];

const seedDeliveryOptions = async () => {
  try {
    // Clear existing delivery options
    await DeliveryOption.deleteMany({});
    
    // Insert new delivery options
    await DeliveryOption.insertMany(deliveryOptions);
    
    console.log('Delivery options seeded successfully');
  } catch (error) {
    console.error('Error seeding delivery options:', error);
  }
};

module.exports = seedDeliveryOptions; 