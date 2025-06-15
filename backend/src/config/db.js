const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Log the URI being used (with password masked)
    const maskedUri = process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@');
    logger.info(`Attempting to connect with URI: ${maskedUri}`);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    console.error(`Error: ${error.message}`);
    // Log more error details
    if (error.name === 'MongooseError') {
      logger.error('Mongoose connection error details:', error);
    }
    process.exit(1);
  }
};

module.exports = connectDB;
