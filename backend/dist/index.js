"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const logger_1 = require("./utils/logger");
const database_1 = require("./utils/database");
require("./config/passport");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:3004'
    ],
    credentials: true,
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api/', limiter);
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'TrendSnap Backend is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
app.use(passport_1.default.initialize());
const auth_1 = __importDefault(require("./routes/auth"));
const simple_auth_1 = __importDefault(require("./routes/simple-auth"));
const social_auth_1 = __importDefault(require("./routes/social-auth"));
const user_1 = __importDefault(require("./routes/user"));
const video_1 = __importDefault(require("./routes/video"));
const credit_1 = __importDefault(require("./routes/credit"));
const content_extraction_1 = __importDefault(require("./routes/content-extraction"));
console.log('Routes loaded:', {
    auth: !!auth_1.default,
    simpleAuth: !!simple_auth_1.default,
    socialAuth: !!social_auth_1.default,
    user: !!user_1.default,
    video: !!video_1.default,
    credit: !!credit_1.default,
    contentExtraction: !!content_extraction_1.default
});
app.use('/api/auth', auth_1.default);
app.use('/api/simple-auth', simple_auth_1.default);
app.use('/api/auth/social', social_auth_1.default);
app.use('/api/user', user_1.default);
app.use('/api/video', video_1.default);
app.use('/api/credit', credit_1.default);
app.use('/api', content_extraction_1.default);
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});
app.use((err, req, res, next) => {
    logger_1.logger.error('Unhandled error:', err);
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        app.listen(PORT, () => {
            logger_1.logger.info(`🚀 TrendSnap Backend server running on port ${PORT}`);
            logger_1.logger.info(`📊 Health check available at http://localhost:${PORT}/health`);
            logger_1.logger.info(`🔗 API base URL: http://localhost:${PORT}/api`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map