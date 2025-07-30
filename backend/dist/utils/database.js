"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInMemoryDB = exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./logger");
let inMemoryDB = null;
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trendsnap';
        if (process.env.NODE_ENV === 'development') {
            try {
                await mongoose_1.default.connect(mongoURI, {
                    maxPoolSize: 10,
                    serverSelectionTimeoutMS: 5000,
                    socketTimeoutMS: 45000,
                });
                logger_1.logger.info('✅ MongoDB connected successfully');
            }
            catch (mongoError) {
                logger_1.logger.warn('MongoDB not available, using in-memory database for development');
                inMemoryDB = {
                    users: new Map(),
                    videos: new Map(),
                    credits: new Map()
                };
                logger_1.logger.info('✅ In-memory database initialized');
            }
        }
        else {
            await mongoose_1.default.connect(mongoURI, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            logger_1.logger.info('✅ MongoDB connected successfully');
        }
        mongoose_1.default.connection.on('error', (err) => {
            logger_1.logger.error('MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.logger.warn('MongoDB disconnected');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            logger_1.logger.info('MongoDB reconnected');
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to connect to database:', error);
        if (process.env.NODE_ENV !== 'development') {
            process.exit(1);
        }
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        if (mongoose_1.default.connection.readyState !== 0) {
            await mongoose_1.default.disconnect();
            logger_1.logger.info('MongoDB disconnected');
        }
    }
    catch (error) {
        logger_1.logger.error('Error disconnecting from MongoDB:', error);
    }
};
exports.disconnectDB = disconnectDB;
const getInMemoryDB = () => inMemoryDB;
exports.getInMemoryDB = getInMemoryDB;
//# sourceMappingURL=database.js.map