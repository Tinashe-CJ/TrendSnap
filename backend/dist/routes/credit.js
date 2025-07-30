"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
router.get('/balance', async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User ID required'
            });
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        return res.json({
            success: true,
            data: {
                credits: user.credits,
                tier: user.tier,
                hasCredits: user.credits > 0
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Get credits error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get credit balance'
        });
    }
});
router.post('/purchase', async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        const { package: creditPackage } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User ID required'
            });
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        const packages = {
            starter: { credits: 10, price: 9.99 },
            popular: { credits: 50, price: 39.99 },
            pro: { credits: 150, price: 99.99 },
            unlimited: { credits: -1, price: 29.99 }
        };
        const selectedPackage = packages[creditPackage];
        if (!selectedPackage) {
            return res.status(400).json({
                success: false,
                error: 'Invalid credit package'
            });
        }
        logger_1.logger.info(`Credit purchase initiated for user ${userId}: ${creditPackage} package`);
        if (selectedPackage.credits === -1) {
            user.tier = 'pro';
            user.credits = 999999;
        }
        else {
            user.credits += selectedPackage.credits;
        }
        await user.save();
        return res.json({
            success: true,
            message: 'Credits purchased successfully',
            data: {
                package: creditPackage,
                creditsAdded: selectedPackage.credits,
                newBalance: user.credits,
                tier: user.tier
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Purchase credits error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to purchase credits'
        });
    }
});
router.get('/packages', async (req, res) => {
    try {
        const packages = [
            {
                id: 'starter',
                name: 'Starter Pack',
                credits: 10,
                price: 9.99,
                popular: false,
                description: 'Perfect for trying out TrendSnap'
            },
            {
                id: 'popular',
                name: 'Popular Pack',
                credits: 50,
                price: 39.99,
                popular: true,
                description: 'Most popular choice for content creators'
            },
            {
                id: 'pro',
                name: 'Pro Pack',
                credits: 150,
                price: 99.99,
                popular: false,
                description: 'Best value for serious creators'
            },
            {
                id: 'unlimited',
                name: 'Unlimited',
                credits: -1,
                price: 29.99,
                popular: false,
                description: 'Unlimited videos per month'
            }
        ];
        return res.json({
            success: true,
            data: {
                packages
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Get packages error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get packages'
        });
    }
});
exports.default = router;
//# sourceMappingURL=credit.js.map