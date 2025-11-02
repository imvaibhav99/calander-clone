import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from './config';

export function initializeSocket(httpServer: HTTPServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: config.corsOrigin,
      credentials: true,
    },
  });

  // Authentication middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.data.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.data.userId}`);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.userId}`);
    });
  });

  return io;
}

// Event emitter functions
export function emitEventCreated(io: Server, userId: string, event: any) {
  io.to(`user:${userId}`).emit('event:created', event);
}

export function emitEventUpdated(io: Server, userId: string, event: any) {
  io.to(`user:${userId}`).emit('event:updated', event);
}

export function emitEventDeleted(io: Server, userId: string, eventId: string) {
  io.to(`user:${userId}`).emit('event:deleted', { eventId });
}
