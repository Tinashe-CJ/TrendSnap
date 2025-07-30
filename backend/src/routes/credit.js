const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const { findUserById, saveUser } = require('../utils/userStorage');

// Get user credits
router.get('/balance', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

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

    res.json({
      success: true,
      data: {
        credits: user.credits,
        tier: user.tier,
        hasCredits: user.credits > 0
      }
    });

  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get credit balance'
    });
  }
});

// Purchase credits
router.post('/purchase', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const { package: creditPackage } = req.body;

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

    // Credit package definitions
    const packages = {
      starter: { credits: 10, price: 9.99 },
      popular: { credits: 50, price: 39.99 },
      pro: { credits: 150, price: 99.99 },
      unlimited: { credits: -1, price: 29.99 } // -1 means unlimited
    };

    const selectedPackage = packages[creditPackage];
    if (!selectedPackage) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credit package'
      });
    }

    // In a real implementation, this would integrate with Stripe
    console.log(`Credit purchase initiated for user ${user.id}: ${creditPackage} package`);

    // Simulate successful purchase
    if (selectedPackage.credits === -1) {
      // Unlimited package
      user.tier = 'pro';
      user.credits = 999999; // Large number to simulate unlimited
    } else {
      user.credits += selectedPackage.credits;
    }

    saveUser(user);

    res.json({
      success: true,
      message: 'Credits purchased successfully',
      data: {
        package: creditPackage,
        creditsAdded: selectedPackage.credits,
        newBalance: user.credits,
        tier: user.tier
      }
    });

  } catch (error) {
    console.error('Purchase credits error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to purchase credits'
    });
  }
});

// Get available packages
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

    res.json({
      success: true,
      data: {
        packages
      }
    });

  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get packages'
    });
  }
});

module.exports = router; 