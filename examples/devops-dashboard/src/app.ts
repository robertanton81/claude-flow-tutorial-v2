import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cron from 'node-cron';
import dotenv from 'dotenv';

import { logger } from './config/logger';
import { database } from './config/database';
import { redis } from './config/redis';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Services
import { MetricsCollector } from './services/metricsCollector';
import { AlertManager } from './services/alertManager';
import { DeploymentManager } from './services/deploymentManager';
import { InfrastructureMonitor } from './services/infrastructureMonitor';
import { LogAggregator } from './services/logAggregator';
import { PerformanceAnalyzer } from './services/performanceAnalyzer';
import { SecurityScanner } from './services/securityScanner';

// Routes
import authRoutes from './routes/auth';
import metricsRoutes from './routes/metrics';
import alertsRoutes from './routes/alerts';
import deploymentsRoutes from './routes/deployments';
import infrastructureRoutes from './routes/infrastructure';
import logsRoutes from './routes/logs';
import dashboardRoutes from './routes/dashboard';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8002;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize services
const metricsCollector = new MetricsCollector();
const alertManager = new AlertManager(io);
const deploymentManager = new DeploymentManager(io);
const infrastructureMonitor = new InfrastructureMonitor(io);
const logAggregator = new LogAggregator();
const performanceAnalyzer = new PerformanceAnalyzer();
const securityScanner = new SecurityScanner();

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

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await metricsCollector.getPrometheusMetrics();
    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  } catch (error) {
    logger.error('Error generating metrics:', error);
    res.status(500).send('Error generating metrics');
  }
});

// Health check with comprehensive system status
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await database.raw('SELECT 1');
    
    // Check Redis connection
    await redis.ping();
    
    // Get system metrics
    const systemMetrics = await metricsCollector.getSystemMetrics();
    const serviceStatuses = await infrastructureMonitor.getServiceStatuses();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      dependencies: {
        database: 'connected',
        cache: 'connected',
        monitoring: 'active'
      },
      system: {
        memory: systemMetrics.memory,
        cpu: systemMetrics.cpu,
        disk: systemMetrics.disk,
        network: systemMetrics.network
      },
      services: serviceStatuses,
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/metrics', authMiddleware, metricsRoutes);
app.use('/api/alerts', authMiddleware, alertsRoutes);
app.use('/api/deployments', authMiddleware, deploymentsRoutes);
app.use('/api/infrastructure', authMiddleware, infrastructureRoutes);
app.use('/api/logs', authMiddleware, logsRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Socket.IO for real-time updates
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    authMiddleware(socket.handshake as any, {} as any, next);
  } else {
    next(new Error('Authentication required'));
  }
});

io.on('connection', (socket) => {
  const user = (socket as any).user;
  logger.info(`DevOps dashboard client connected: ${socket.id}, User: ${user.id}`);
  
  // Join user to their dashboard room
  socket.join(`user:${user.id}`);
  socket.join('dashboard:all');
  
  // Subscribe to specific metric channels
  socket.on('subscribe:metrics', (data) => {
    const { services, environments } = data;
    
    services.forEach((service: string) => {
      socket.join(`metrics:${service}`);
    });
    
    environments.forEach((env: string) => {
      socket.join(`env:${env}`);
    });
  });
  
  // Subscribe to alert channels
  socket.on('subscribe:alerts', (data) => {
    const { severity, services } = data;
    
    if (severity) {
      socket.join(`alerts:${severity}`);
    }
    
    if (services) {
      services.forEach((service: string) => {
        socket.join(`alerts:service:${service}`);
      });
    }
  });
  
  // Subscribe to deployment updates
  socket.on('subscribe:deployments', (data) => {
    const { projects, environments } = data;
    
    projects.forEach((project: string) => {
      socket.join(`deployments:${project}`);
    });
    
    environments.forEach((env: string) => {
      socket.join(`deployments:env:${env}`);
    });
  });
  
  // Handle deployment trigger
  socket.on('trigger:deployment', async (data) => {
    try {
      const result = await deploymentManager.triggerDeployment(data, user.id);
      socket.emit('deployment:triggered', result);
    } catch (error) {
      logger.error('Error triggering deployment:', error);
      socket.emit('deployment:error', { error: error.message });
    }
  });
  
  // Handle infrastructure scaling
  socket.on('trigger:scale', async (data) => {
    try {
      const result = await infrastructureMonitor.scaleService(data, user.id);
      socket.emit('scaling:triggered', result);
    } catch (error) {
      logger.error('Error scaling service:', error);
      socket.emit('scaling:error', { error: error.message });
    }
  });
  
  // Handle alert acknowledgment
  socket.on('alert:acknowledge', async (data) => {
    try {
      await alertManager.acknowledgeAlert(data.alertId, user.id);
      io.to('dashboard:all').emit('alert:acknowledged', {
        alertId: data.alertId,
        acknowledgedBy: user.id,
        timestamp: new Date()
      });
    } catch (error) {
      logger.error('Error acknowledging alert:', error);
    }
  });
  
  socket.on('disconnect', () => {
    logger.info(`DevOps dashboard client disconnected: ${socket.id}`);
  });
});

// Scheduled tasks
// Collect metrics every 30 seconds
cron.schedule('*/30 * * * * *', async () => {
  try {
    const metrics = await metricsCollector.collectAllMetrics();
    
    // Emit real-time metrics to connected clients
    io.to('dashboard:all').emit('metrics:update', {
      timestamp: new Date(),
      metrics
    });
    
    // Store metrics in database
    await database('metrics').insert({
      timestamp: new Date(),
      data: JSON.stringify(metrics),
      created_at: new Date()
    });
    
  } catch (error) {
    logger.error('Error in metrics collection task:', error);
  }
});

// Check for alerts every minute
cron.schedule('0 * * * * *', async () => {
  try {
    const alerts = await alertManager.checkForAlerts();
    
    if (alerts.length > 0) {
      alerts.forEach(alert => {
        // Emit to specific channels based on alert properties
        io.to(`alerts:${alert.severity}`).emit('alert:new', alert);
        io.to(`alerts:service:${alert.service}`).emit('alert:new', alert);
        io.to('dashboard:all').emit('alert:new', alert);
      });
    }
    
  } catch (error) {
    logger.error('Error in alert checking task:', error);
  }
});

// Infrastructure health check every 2 minutes
cron.schedule('0 */2 * * * *', async () => {
  try {
    const healthData = await infrastructureMonitor.performHealthChecks();
    
    // Emit health updates
    io.to('dashboard:all').emit('infrastructure:health', {
      timestamp: new Date(),
      data: healthData
    });
    
    // Store health data
    await database('infrastructure_health').insert({
      timestamp: new Date(),
      data: JSON.stringify(healthData),
      created_at: new Date()
    });
    
  } catch (error) {
    logger.error('Error in infrastructure health check:', error);
  }
});

// Performance analysis every 5 minutes
cron.schedule('0 */5 * * * *', async () => {
  try {
    const performanceData = await performanceAnalyzer.analyzePerformance();
    
    // Emit performance insights
    io.to('dashboard:all').emit('performance:analysis', {
      timestamp: new Date(),
      analysis: performanceData
    });
    
  } catch (error) {
    logger.error('Error in performance analysis task:', error);
  }
});

// Security scan every hour
cron.schedule('0 0 * * * *', async () => {
  try {
    const securityReport = await securityScanner.runSecurityScan();
    
    // Emit security alerts if issues found
    if (securityReport.issues.length > 0) {
      io.to('dashboard:all').emit('security:issues', {
        timestamp: new Date(),
        report: securityReport
      });
    }
    
    // Store security scan results
    await database('security_scans').insert({
      timestamp: new Date(),
      report: JSON.stringify(securityReport),
      issues_count: securityReport.issues.length,
      created_at: new Date()
    });
    
  } catch (error) {
    logger.error('Error in security scan task:', error);
  }
});

// Log aggregation every 10 minutes
cron.schedule('0 */10 * * * *', async () => {
  try {
    const logSummary = await logAggregator.aggregateLogs();
    
    // Store log summary
    await database('log_summaries').insert({
      timestamp: new Date(),
      summary: JSON.stringify(logSummary),
      created_at: new Date()
    });
    
  } catch (error) {
    logger.error('Error in log aggregation task:', error);
  }
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
const gracefulShutdown = async () => {
  logger.info('Starting graceful shutdown...');
  
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  try {
    await database.destroy();
    logger.info('Database connections closed');
    
    await redis.quit();
    logger.info('Redis connection closed');
    
  } catch (error) {
    logger.error('Error during shutdown:', error);
  }
  
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 DevOps dashboard running on port ${PORT}`);
  logger.info(`Environment: ${NODE_ENV}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`Metrics endpoint: http://localhost:${PORT}/metrics`);
});

export { app, server, io, metricsCollector, alertManager };