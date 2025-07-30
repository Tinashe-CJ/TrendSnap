"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
router.post('/generate', async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        const { script, quality = 'sd' } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User ID required'
            });
        }
        if (!script || script.length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Script must be at least 10 characters long'
            });
        }
        const user = await User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        if (user.credits <= 0) {
            return res.status(402).json({
                success: false,
                error: 'Insufficient credits. Please upgrade your plan.',
                data: {
                    currentCredits: user.credits,
                    requiredCredits: 1
                }
            });
        }
        user.credits -= 1;
        await user.save();
        const generationTime = quality === 'hd' ? 30000 : 10000;
        logger_1.logger.info(`Starting video generation for user ${userId}, quality: ${quality}`);
        setTimeout(() => {
            logger_1.logger.info(`Video generation completed for user ${userId}`);
        }, generationTime);
        return res.json({
            success: true,
            message: 'Video generation started',
            data: {
                jobId: `job_${Date.now()}_${userId}`,
                estimatedTime: generationTime / 1000,
                quality,
                remainingCredits: user.credits
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Video generation error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to start video generation'
        });
    }
});
router.get('/status/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.headers['user-id'];
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User ID required'
            });
        }
        const isComplete = Math.random() > 0.5;
        return res.json({
            success: true,
            data: {
                jobId,
                status: isComplete ? 'completed' : 'processing',
                progress: isComplete ? 100 : Math.floor(Math.random() * 90) + 10,
                videoUrl: isComplete ? `https://trendsnap-videos.s3.amazonaws.com/${jobId}.mp4` : null,
                thumbnailUrl: isComplete ? `https://trendsnap-thumbnails.s3.amazonaws.com/${jobId}.jpg` : null
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Get video status error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get video status'
        });
    }
});
router.get('/list', async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User ID required'
            });
        }
        const videos = [
            {
                id: 'video_1',
                title: 'My First TrendSnap Video',
                status: 'completed',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                videoUrl: 'https://trendsnap-videos.s3.amazonaws.com/video_1.mp4',
                thumbnailUrl: 'https://trendsnap-thumbnails.s3.amazonaws.com/video_1.jpg',
                duration: 15,
                views: 1250
            },
            {
                id: 'video_2',
                title: 'Viral Content Creation',
                status: 'completed',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                videoUrl: 'https://trendsnap-videos.s3.amazonaws.com/video_2.mp4',
                thumbnailUrl: 'https://trendsnap-thumbnails.s3.amazonaws.com/video_2.jpg',
                duration: 12,
                views: 890
            }
        ];
        return res.json({
            success: true,
            data: {
                videos,
                total: videos.length
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Get videos error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get videos'
        });
    }
});
exports.default = router;
//# sourceMappingURL=video.js.map