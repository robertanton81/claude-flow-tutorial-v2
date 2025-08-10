import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { logger } from './config/logger';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware, socketAuthMiddleware } from './middleware/auth';

// Services
import { CollaborationService } from './services/collaborationService';
import { DocumentService } from './services/documentService';
import { PresenceService } from './services/presenceService';
import { ConflictResolutionService } from './services/conflictResolution';

// Routes
import authRoutes from './routes/auth';
import documentRoutes from './routes/documents';
import userRoutes from './routes/users';
import roomRoutes from './routes/rooms';

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 8001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/collaboration';

// Redis clients for Socket.IO adapter
const pubClient = createClient({ url: REDIS_URL });
const subClient = pubClient.duplicate();

// Socket.IO server with Redis adapter
const io = new SocketIOServer(server, {
  cors: {
    origin: NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL!]
      : ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Initialize services
const documentService = new DocumentService();
const presenceService = new PresenceService(io);
const conflictResolutionService = new ConflictResolutionService();
const collaborationService = new CollaborationService(
  io, 
  documentService, 
  presenceService, 
  conflictResolutionService
);

// Middleware
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
app.use(rateLimiter);

// Health check
app.get('/health', async (req, res) => {
  try {
    // Check MongoDB
    const mongoState = mongoose.connection.readyState;
    
    // Check Redis
    await pubClient.ping();
    
    // Check Socket.IO
    const socketCount = io.engine.clientsCount;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      dependencies: {
        mongodb: mongoState === 1 ? 'connected' : 'disconnected',
        redis: 'connected',
        websockets: 'active'
      },
      metrics: {
        connectedClients: socketCount,
        activeRooms: io.sockets.adapter.rooms.size,
        memoryUsage: process.memoryUsage()
      }
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: 'Service dependencies unavailable'
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', authMiddleware, documentRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/rooms', authMiddleware, roomRoutes);

// Serve static files in production
if (NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
  });
}

// Error handling
app.use(errorHandler);

// Socket.IO authentication
io.use(socketAuthMiddleware);

// Socket.IO connection handling
io.on('connection', (socket) => {
  const user = (socket as any).user;
  logger.info(`Client connected: ${socket.id}, User: ${user.id}`);

  // Join user to their personal room
  socket.join(`user:${user.id}`);

  // Handle document collaboration
  socket.on('join:document', async (data) => {
    try {
      await collaborationService.handleJoinDocument(socket, data);
    } catch (error) {
      logger.error('Error joining document:', error);
      socket.emit('error', { message: 'Failed to join document' });
    }
  });

  socket.on('leave:document', async (data) => {
    try {
      await collaborationService.handleLeaveDocument(socket, data);
    } catch (error) {
      logger.error('Error leaving document:', error);
    }
  });

  // Handle real-time document operations
  socket.on('document:operation', async (data) => {
    try {
      await collaborationService.handleDocumentOperation(socket, data);
    } catch (error) {
      logger.error('Error processing document operation:', error);
      socket.emit('error', { message: 'Failed to process operation' });
    }
  });

  // Handle cursor and selection updates
  socket.on('cursor:update', async (data) => {
    try {
      await presenceService.handleCursorUpdate(socket, data);
    } catch (error) {
      logger.error('Error updating cursor:', error);
    }
  });

  // Handle voice/video signaling
  socket.on('rtc:offer', (data) => {
    socket.to(data.targetUserId).emit('rtc:offer', {
      ...data,
      fromUserId: user.id
    });
  });

  socket.on('rtc:answer', (data) => {
    socket.to(data.targetUserId).emit('rtc:answer', {
      ...data,
      fromUserId: user.id
    });
  });

  socket.on('rtc:ice-candidate', (data) => {
    socket.to(data.targetUserId).emit('rtc:ice-candidate', {
      ...data,
      fromUserId: user.id
    });
  });

  // Handle screen sharing
  socket.on('screen:start-sharing', async (data) => {
    try {
      await collaborationService.handleStartScreenSharing(socket, data);
    } catch (error) {
      logger.error('Error starting screen share:', error);
    }
  });

  socket.on('screen:stop-sharing', async (data) => {
    try {
      await collaborationService.handleStopScreenSharing(socket, data);
    } catch (error) {
      logger.error('Error stopping screen share:', error);
    }
  });

  // Handle drawing/whiteboard
  socket.on('drawing:start', (data) => {
    socket.to(data.roomId).emit('drawing:start', {
      ...data,
      userId: user.id,
      timestamp: Date.now()
    });
  });

  socket.on('drawing:draw', (data) => {
    socket.to(data.roomId).emit('drawing:draw', {
      ...data,
      userId: user.id,
      timestamp: Date.now()
    });
  });

  socket.on('drawing:end', (data) => {
    socket.to(data.roomId).emit('drawing:end', {
      ...data,
      userId: user.id,
      timestamp: Date.now()
    });
  });

  // Handle chat messages
  socket.on('chat:message', async (data) => {
    try {
      await collaborationService.handleChatMessage(socket, data);
    } catch (error) {
      logger.error('Error processing chat message:', error);
    }
  });

  // Handle file uploads
  socket.on('file:upload', async (data) => {
    try {
      await collaborationService.handleFileUpload(socket, data);
    } catch (error) {
      logger.error('Error processing file upload:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing:start', (data) => {
    socket.to(data.roomId).emit('typing:start', {
      userId: user.id,
      userName: user.name
    });
  });

  socket.on('typing:stop', (data) => {
    socket.to(data.roomId).emit('typing:stop', {
      userId: user.id
    });
  });

  socket.on('disconnect', async (reason) => {
    logger.info(`Client disconnected: ${socket.id}, Reason: ${reason}`);
    
    try {
      // Clean up user presence
      await presenceService.handleDisconnect(socket);
      
      // Clean up any active document sessions
      await collaborationService.handleDisconnect(socket);
    } catch (error) {
      logger.error('Error during disconnect cleanup:', error);
    }
  });

  // Handle connection errors
  socket.on('connect_error', (error) => {
    logger.error('Socket connection error:', error);
  });
});

// Initialize connections
async function initializeConnections() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URL);
    logger.info('✅ MongoDB connected successfully');

    // Connect Redis clients
    await pubClient.connect();
    await subClient.connect();
    
    // Set up Redis adapter for Socket.IO
    io.adapter(createAdapter(pubClient, subClient));
    logger.info('✅ Redis connected and Socket.IO adapter configured');

  } catch (error) {
    logger.error('❌ Failed to initialize connections:', error);
    process.exit(1);
  }
}

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Starting graceful shutdown...');
  
  // Close server
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  try {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
    
    // Disconnect Redis clients
    await pubClient.quit();
    await subClient.quit();
    logger.info('Redis disconnected');
    
  } catch (error) {
    logger.error('Error during shutdown:', error);
  }
  
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
initializeConnections().then(() => {
  server.listen(PORT, () => {
    logger.info(`🚀 Real-time collaboration server running on port ${PORT}`);
    logger.info(`Environment: ${NODE_ENV}`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
  });
});

export { app, server, io };