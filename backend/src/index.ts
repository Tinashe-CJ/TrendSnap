import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import passport from 'passport';
import { logger } from './utils/logger';

// Import Passport configuration
import './config/passport';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TrendSnap Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Initialize Passport
app.use(passport.initialize());

// Import routes
import authRoutes from './routes/auth';
import socialAuthRoutes from './routes/social-auth';
import userRoutes from './routes/user';
import videoRoutes from './routes/video';
import creditRoutes from './routes/credit';

console.log('Routes loaded:', {
  auth: !!authRoutes,
  socialAuth: !!socialAuthRoutes,
  user: !!userRoutes,
  video: !!videoRoutes,
  credit: !!creditRoutes
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/social', socialAuthRoutes);
app.use('/api/user', userRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/credit', creditRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 TrendSnap Backend server running on port ${PORT}`);
  logger.info(`📊 Health check available at http://localhost:${PORT}/health`);
  logger.info(`🔗 API base URL: http://localhost:${PORT}/api`);
});

export default app; 