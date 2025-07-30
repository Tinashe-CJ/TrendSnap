"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
const DISPOSABLE_EMAIL_DOMAINS = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com', 'throwawamail.com',
    'temp-mail.org', 'sharklasers.com', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me',
    'bccto.me', 'chacuo.net', 'dispostable.com', 'fakeinbox.com', 'getairmail.com',
    'mailnesia.com', 'mintemail.com', 'mohmal.com', 'nwldx.com', 'yopmail.com',
    'getnada.com', 'maildrop.cc', 'mailinator.net', 'tempr.email', 'trashmail.com'
];
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
};
router.post('/signup', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email address'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('deviceFingerprint')
        .notEmpty()
        .withMessage('Device fingerprint is required')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: errors.array()[0].msg
            });
        }
        const { email, password, name, deviceFingerprint } = req.body;
        const domain = email.split('@')[1]?.toLowerCase();
        if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
            return res.status(400).json({
                success: false,
                error: 'Disposable email addresses are not allowed. Please use a permanent email address.'
            });
        }
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'An account with this email already exists.'
            });
        }
        const existingDevice = await User_1.User.findOne({ deviceFingerprint });
        let credits = 3;
        if (existingDevice) {
            credits = 0;
        }
        const user = new User_1.User({
            email,
            password,
            name,
            deviceFingerprint,
            credits,
            isVerified: true
        });
        await user.save();
        const token = generateToken(user._id.toString());
        logger_1.logger.info(`New user registered: ${email}`);
        return res.status(201).json({
            success: true,
            message: 'Account created successfully! You have 3 free credits to get started.',
            data: {
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    tier: user.tier,
                    credits: user.credits,
                    isVerified: user.isVerified
                },
                token
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Signup error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create account'
        });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔍 Login attempt for:', email);
        console.log('🔍 Looking for user with email:', email);
        const user = await User_1.User.findOne({ email });
        console.log('🔍 User.findOne result:', user ? 'User found' : 'User not found');
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password.'
            });
        }
        console.log('✅ User found:', user.email, 'Tier:', user.tier);
        console.log('🔍 User object keys:', Object.keys(user));
        console.log('🔍 About to call user.comparePassword');
        const isPasswordValid = await user.comparePassword(password);
        console.log('🔐 Password validation result:', isPasswordValid);
        if (!isPasswordValid) {
            console.log('❌ Password invalid for:', email);
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password.'
            });
        }
        user.lastLogin = new Date();
        await user.save();
        const token = generateToken(user._id.toString());
        logger_1.logger.info(`User logged in: ${email}`);
        return res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    tier: user.tier,
                    credits: user.credits,
                    isVerified: user.isVerified
                },
                token
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Login error:', error);
        return res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});
router.get('/test', async (req, res) => {
    try {
        const user = await User_1.User.findOne({ email: 'free@trendsnap.com' });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        const isValid = await user.comparePassword('TestPass123!');
        return res.json({
            success: true,
            user: {
                email: user.email,
                tier: user.tier,
                credits: user.credits
            },
            passwordValid: isValid
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User_1.User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }
        return res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    tier: user.tier,
                    credits: user.credits,
                    isVerified: user.isVerified
                }
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Get user error:', error);
        return res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map