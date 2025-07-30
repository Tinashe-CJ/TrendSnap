import express from 'express';
import { User } from '../models/User';
import { logger } from '../utils/logger';

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // This would be protected by auth middleware in production
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          tier: user.tier,
          credits: user.credits,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.headers['user-id'] as string;
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
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

  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

export default router; 