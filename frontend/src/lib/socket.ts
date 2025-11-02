import { io, Socket } from 'socket.io-client';
import { QueryClient } from '@tanstack/react-query';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

let socket: Socket | null = null;

export function initializeSocket(queryClient: QueryClient): Socket {
  if (socket) {
    return socket;
  }

  const token = localStorage.getItem('token');

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✓ Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('✗ Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  // Event listeners
  socket.on('event:created', (event) => {
    console.log('Event created via socket:', event);
    queryClient.invalidateQueries({ queryKey: ['events'] });
  });

  socket.on('event:updated', (event) => {
    console.log('Event updated via socket:', event);
    queryClient.invalidateQueries({ queryKey: ['events'] });
  });

  socket.on('event:deleted', ({ eventId }) => {
    console.log('Event deleted via socket:', eventId);
    queryClient.invalidateQueries({ queryKey: ['events'] });
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

export function reconnectSocket() {
  if (socket && !socket.connected) {
    const token = localStorage.getItem('token');
    socket.auth = { token };
    socket.connect();
  }
}