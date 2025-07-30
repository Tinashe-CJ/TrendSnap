import mongoose from 'mongoose';
import { logger } from './logger';

// In-memory database for development
let inMemoryDB: any = null;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendsnap';
    
    // For development, use in-memory database if MongoDB is not available
    if (process.env.NODE_ENV === 'development') {
      try {
        await mongoose.connect(mongoURI, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        });
        logger.info('✅ MongoDB connected successfully');
      } catch (mongoError) {
        logger.warn('MongoDB not available, using in-memory database for development');
        // Create in-memory database
        inMemoryDB = {
          users: new Map(),
          videos: new Map(),
          credits: new Map()
        };
        logger.info('✅ In-memory database initialized');
      }
    } else {
      await mongoose.connect(mongoURI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      logger.info('✅ MongoDB connected successfully');
    }
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

  } catch (error) {
    logger.error('Failed to connect to database:', error);
    // Don't exit in development, use in-memory database
    if (process.env.NODE_ENV !== 'development') {
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info('MongoDB disconnected');
    }
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
  }
};

// Export in-memory database for testing
export const getInMemoryDB = () => inMemoryDB; 