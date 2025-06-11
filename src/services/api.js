import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
  setup: (userData) => api.post('/auth/setup', userData),
};

// Events API
export const eventsAPI = {
  getPublic: () => api.get('/events/public'),
  getPublicEvent: (slug) => api.get(`/events/public/${slug}`),
  getAdmin: (params) => api.get('/events/admin', { params }),
  create: (data) => api.post('/events/admin', data),
  update: (id, data) => api.put(`/events/admin/${id}`, data),
  delete: (id) => api.delete(`/events/admin/${id}`),
  setMain: (id) => api.patch(`/events/admin/${id}/main`),
};

// Donations API
export const donationsAPI = {
  create: (data) => api.post('/donations/create', data),
  getPublic: (params) => api.get('/donations/public', { params }),
  getAdmin: (params) => api.get('/donations/admin', { params }),
  approve: (id, notes) => api.patch(`/donations/admin/${id}/approve`, { notes }),
  reject: (id, notes) => api.patch(`/donations/admin/${id}/reject`, { notes }),
  updatePayment: (id, data) => api.patch(`/donations/admin/${id}/payment`, data),
};

// Gallery API
export const galleryAPI = {
  getPublic: (params) => api.get('/gallery/public', { params }),
  getAdmin: (params) => api.get('/gallery/admin', { params }),
  create: (data) => api.post('/gallery/admin', data),
  update: (id, data) => api.put(`/gallery/admin/${id}`, data),
  delete: (id) => api.delete(`/gallery/admin/${id}`),
};

// Payments API
export const paymentsAPI = {
  createOrder: (donationId) => api.post('/payments/create-order', { donationId }),
  verify: (data) => api.post('/payments/verify', data),
};

// Analytics API
export const analyticsAPI = {
  getOverview: (period) => api.get('/analytics/overview', { params: { period } }),
  getEventAnalytics: (eventId) => api.get(`/analytics/events/${eventId}`),
};

export default api;