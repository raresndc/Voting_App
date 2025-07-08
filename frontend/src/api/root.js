// src/api/root.js
import axios from 'axios';

export const API_ROOT = axios.create({ baseURL: '/api' });
API_ROOT.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});