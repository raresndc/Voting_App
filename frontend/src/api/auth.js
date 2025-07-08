// src/api/auth.js
import axios from 'axios';

// 1️⃣ Public client: no interceptor
const PUBLIC = axios.create({ baseURL: '/api/auth' });
export const register      = (data) => PUBLIC.post('/register', data);

// 2️⃣ Private client: automatically adds Authorization
export const API = axios.create({ baseURL: '/api/auth' });
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
export const login         = (data) => API.post('/login', data);
export const loginSuper    = (data) => API.post('/login-super-user', data);
