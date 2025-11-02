import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Events API
export interface CreateEventData {
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay?: boolean;
  color?: string;
  location?: string;
  recurrence?: {
    freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | null;
    interval?: number;
    byWeekday?: number[];
    count?: number;
    until?: string;
  };
}

export const eventsApi = {
  getEvents: async (start: string, end: string) => {
    const response = await api.get('/events', {
      params: { start, end },
    });
    return response.data;
  },

  getEventById: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (data: CreateEventData) => {
    const response = await api.post('/events', data);
    return response.data;
  },

  updateEvent: async (id: string, data: Partial<CreateEventData>) => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  checkConflicts: async (start: string, end: string, excludeEventId?: string) => {
    const response = await api.post('/events/conflicts', {
      start,
      end,
      excludeEventId,
    });
    return response.data;
  },
};
