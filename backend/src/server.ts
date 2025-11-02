import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { initializeSocket } from './socket';
import authRoutes from './routes/auth';
import eventsRoutes from './routes/events';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
export const io = initializeSocket(httpServer);

// Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('✓ Connected to MongoDB');
    
    // Start server
    httpServer.listen(config.port, () => {
      console.log(`✓ Server running on port ${config.port}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
    });
  })
  .catch((err) => {
    console.error('✗ MongoDB connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  httpServer.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});
