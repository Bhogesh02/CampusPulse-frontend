/**
 * API Service - Centralized API calls
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
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

// Authentication API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData)
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`)
};

// Hostels API
export const hostelsAPI = {
  getAll: () => api.get('/hostels'),
  getById: (id) => api.get(`/hostels/${id}`),
  create: (hostelData) => api.post('/hostels', hostelData),
  update: (id, hostelData) => api.put(`/hostels/${id}`, hostelData)
};

// Rooms API
export const roomsAPI = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`)
};

// Complaints API
export const complaintsAPI = {
  getAll: () => api.get('/complaints'),
  create: (complaintData) => api.post('/complaints', complaintData),
  update: (id, complaintData) => api.put(`/complaints/${id}`, complaintData),
  createAnonymous: (complaintData) => axios.post(`${API_BASE_URL}/complaints/anonymous`, complaintData) // No auth required
};

// Fees API
export const feesAPI = {
  getAll: () => api.get('/fees'),
  create: (feeData) => api.post('/fees', feeData),
  update: (id, feeData) => api.put(`/fees/${id}`, feeData)
};

// Attendance API
export const attendanceAPI = {
  getAll: () => api.get('/attendance')
};

// Analytics API
export const analyticsAPI = {
  getStats: () => api.get('/analytics')
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: (message) => api.post('/chatbot', { message })
};

export default api;
