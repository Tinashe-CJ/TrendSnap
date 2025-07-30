const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const { findUserById, saveUser } = require('../utils/userStorage');

// Generate video
router.post('/generate', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const { script, quality = 'sd' } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = findUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (!script || script.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Script must be at least 10 characters long'
      });
    }

    // Check user credits
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

    // Deduct credit
    user.credits -= 1;
    saveUser(user);

    // Simulate video generation
    const generationTime = quality === 'hd' ? 30000 : 10000; // 30s for HD, 10s for SD
    
    console.log(`Starting video generation for user ${user.id}, quality: ${quality}`);

    // In a real implementation, this would trigger the AI video generation pipeline
    setTimeout(() => {
      console.log(`Video generation completed for user ${user.id}`);
    }, generationTime);

    res.json({
      success: true,
      message: 'Video generation started',
      data: {
        jobId: `job_${Date.now()}_${user.id}`,
        estimatedTime: generationTime / 1000,
        quality,
        remainingCredits: user.credits
      }
    });

  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start video generation'
    });
  }
});

// Get video status
router.get('/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Simulate video status check
    const isComplete = Math.random() > 0.5; // 50% chance of being complete

    res.json({
      success: true,
      data: {
        jobId,
        status: isComplete ? 'completed' : 'processing',
        progress: isComplete ? 100 : Math.floor(Math.random() * 90) + 10,
        videoUrl: isComplete ? `https://trendsnap-videos.s3.amazonaws.com/${jobId}.mp4` : null,
        thumbnailUrl: isComplete ? `https://trendsnap-thumbnails.s3.amazonaws.com/${jobId}.jpg` : null
      }
    });

  } catch (error) {
    console.error('Get video status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get video status'
    });
  }
});

// Get user videos
router.get('/list', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Simulate video list
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

    res.json({
      success: true,
      data: {
        videos,
        total: videos.length
      }
    });

  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get videos'
    });
  }
});

module.exports = router; 