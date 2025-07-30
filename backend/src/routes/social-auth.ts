import express, { Request, Response } from 'express';

const router = express.Router();

// Test route to verify social auth is working
router.get('/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Social auth routes are working',
    availableProviders: ['google', 'facebook', 'apple']
  });
});

// Simple Google OAuth route
router.get('/google', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Google OAuth endpoint ready',
    note: 'OAuth configuration required'
  });
});

// Simple Facebook OAuth route
router.get('/facebook', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Facebook OAuth endpoint ready',
    note: 'OAuth configuration required'
  });
});

// Simple Apple OAuth route
router.get('/apple', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Apple OAuth endpoint ready',
    note: 'OAuth configuration required'
  });
});

export default router; 