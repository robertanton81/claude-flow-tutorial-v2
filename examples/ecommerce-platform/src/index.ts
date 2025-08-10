import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import { logger } from './config/logger';
import { database } from './config/database';
import { redis } from './config/redis';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Route imports
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payments';
import inventoryRoutes from './routes/inventory';
import analyticsRoutes from './routes/analytics';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: NODE_ENV === 'production' ? undefined : false
}));

app.use(cors({
  origin: NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL!]
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await database.raw('SELECT 1');
    
    // Check Redis connection
    await redis.ping();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      dependencies: {
        database: 'connected',
        cache: 'connected',
        stripe: 'available'
      },
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: 'Service dependencies unavailable'
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);
app.use('/api/inventory', authMiddleware, inventoryRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);

// Socket.IO for real-time features
io.use((socket, next) => {
  // Socket authentication
  const token = socket.handshake.auth.token;
  if (token) {
    // Verify JWT token
    authMiddleware(socket.handshake as any, {} as any, next);
  } else {
    next(new Error('Authentication required'));
  }
});

io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  // Join user-specific room
  const userId = (socket.handshake as any).user?.id;
  if (userId) {
    socket.join(`user:${userId}`);
  }
  
  // Real-time inventory updates
  socket.on('subscribe:inventory', (productId: string) => {
    socket.join(`inventory:${productId}`);
  });
  
  // Real-time order tracking
  socket.on('subscribe:orders', (userId: string) => {
    socket.join(`orders:${userId}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  try {
    await database.destroy();
    logger.info('Database connections closed');
  } catch (error) {
    logger.error('Error closing database:', error);
  }
  
  try {
    await redis.quit();
    logger.info('Redis connection closed');
  } catch (error) {
    logger.error('Error closing Redis:', error);
  }
  
  process.exit(0);
});

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 E-commerce platform running on port ${PORT}`);
  logger.info(`Environment: ${NODE_ENV}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

export { app, server, io };