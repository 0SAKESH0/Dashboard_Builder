// src/services/api.js
// Centralized Axios API service for all backend calls

import axios from 'axios';

// Base API instance
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ============================
// Order API
// ============================
export const orderAPI = {
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  delete: (id) => api.delete(`/orders/${id}`),
};

// ============================
// Dashboard API
// ============================
export const dashboardAPI = {
  load: () => api.get('/dashboard'),
  save: (data) => api.post('/dashboard', data),
};

// ============================
// Widget Data API
// ============================
export const widgetAPI = {
  getKPI: (params) => api.get('/widgets/kpi', { params }),
  getChart: (params) => api.get('/widgets/chart', { params }),
  getPie: (params) => api.get('/widgets/pie', { params }),
  getTable: (params) => api.get('/widgets/table', { params }),
};

export default api;
