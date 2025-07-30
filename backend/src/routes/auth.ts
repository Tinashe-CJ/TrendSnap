import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { User, IUser } from '../models/User';
import { logger } from '../utils/logger';

const router = express.Router();

// Disposable email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com', 'throwawamail.com',
  'temp-mail.org', 'sharklasers.com', 'guerrillamailblock.com', 'pokemail.net', 'spam4.me',
  'bccto.me', 'chacuo.net', 'dispostable.com', 'fakeinbox.com', 'getairmail.com',
  'mailnesia.com', 'mintemail.com', 'mohmal.com', 'nwldx.com', 'yopmail.com',
  'getnada.com', 'maildrop.cc', 'mailinator.net', 'tempr.email', 'trashmail.com'
];

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Signup route
router.post('/signup', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('deviceFingerprint')
    .notEmpty()
    .withMessage('Device fingerprint is required')
], async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { email, password, name, deviceFingerprint } = req.body;

    // Check for disposable email
    const domain = email.split('@')[1]?.toLowerCase();
    if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      return res.status(400).json({
        success: false,
        error: 'Disposable email addresses are not allowed. Please use a permanent email address.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists.'
      });
    }

    // Check if device has been used before (anti-abuse)
    const existingDevice = await User.findOne({ deviceFingerprint });
    let credits = 3; // Default free credits
    if (existingDevice) {
      credits = 0; // No additional credits for same device
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      deviceFingerprint,
      credits,
      isVerified: true // For demo purposes, skip email verification
    });

    await user.save();

    // Generate token
    const token = generateToken((user as IUser)._id.toString());

    logger.info(`New user registered: ${email}`);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! You have 3 free credits to get started.',
      data: {
        user: {
          id: (user as IUser)._id,
          email: user.email,
          name: user.name,
          tier: user.tier,
          credits: user.credits,
          isVerified: user.isVerified
        },
        token
      }
    });

  } catch (error) {
    logger.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create account'
    });
  }
});

// Login route
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken((user as IUser)._id.toString());

    logger.info(`User logged in: ${email}`);

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: (user as IUser)._id,
          email: user.email,
          name: user.name,
          tier: user.tier,
          credits: user.credits,
          isVerified: user.isVerified
        },
        token
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const user = await User.findById(decoded.userId);

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

  } catch (error) {
    logger.error('Get user error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

export default router; 