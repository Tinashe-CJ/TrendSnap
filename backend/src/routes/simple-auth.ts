import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Test endpoint
router.get('/test', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Testing mongoose connection...');
    console.log('Mongoose connection state:', mongoose.connection.readyState);
    console.log('Mongoose connection db:', !!mongoose.connection.db);
    
    if (!mongoose.connection.db) {
      return res.json({ success: false, error: 'Mongoose connection not ready' });
    }
    
    const user = await mongoose.connection.db.collection('users').findOne({ email: 'free@trendsnap.com' });
    
    return res.json({
      success: true,
      connectionReady: mongoose.connection.readyState === 1,
      hasDb: !!mongoose.connection.db,
      userFound: !!user,
      userEmail: user?.email
    });
    
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Simple login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔍 Simple login attempt for:', email);
    
    // Direct MongoDB query
    const user = await mongoose.connection.db?.collection('users').findOne({ email });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }
    
    console.log('✅ User found:', user.email);
    
    // Direct bcrypt comparison
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔐 Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Password invalid for:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }
    
    console.log('✅ Login successful for:', email);
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
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
    
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Simple get current user endpoint
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    const user = await mongoose.connection.db?.collection('users').findOne({ 
      _id: new mongoose.Types.ObjectId(decoded.userId) 
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
    
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

export default router; 