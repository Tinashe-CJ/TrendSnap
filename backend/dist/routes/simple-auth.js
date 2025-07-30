"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
router.get('/test', async (req, res) => {
    try {
        console.log('🔍 Testing mongoose connection...');
        console.log('Mongoose connection state:', mongoose_1.default.connection.readyState);
        console.log('Mongoose connection db:', !!mongoose_1.default.connection.db);
        if (!mongoose_1.default.connection.db) {
            return res.json({ success: false, error: 'Mongoose connection not ready' });
        }
        const user = await mongoose_1.default.connection.db.collection('users').findOne({ email: 'free@trendsnap.com' });
        return res.json({
            success: true,
            connectionReady: mongoose_1.default.connection.readyState === 1,
            hasDb: !!mongoose_1.default.connection.db,
            userFound: !!user,
            userEmail: user?.email
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔍 Simple login attempt for:', email);
        const user = await mongoose_1.default.connection.db?.collection('users').findOne({ email });
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password.'
            });
        }
        console.log('✅ User found:', user.email);
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        console.log('🔐 Password validation result:', isPasswordValid);
        if (!isPasswordValid) {
            console.log('❌ Password invalid for:', email);
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password.'
            });
        }
        console.log('✅ Login successful for:', email);
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
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
        console.error('❌ Login error:', error);
        return res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }
        const token = authHeader.substring(7);
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await mongoose_1.default.connection.db?.collection('users').findOne({
            _id: new mongoose_1.default.Types.ObjectId(decoded.userId)
        });
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
                    id: user._id.toString(),
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
        return res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
});
exports.default = router;
//# sourceMappingURL=simple-auth.js.map