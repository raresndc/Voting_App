// src/api/auth.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_AUTH_API_BASE,
  withCredentials: true,                // <-- send & receive cookies
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('JWT_TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const registerUser    = data => API.post('/api/auth/register', data);
export const registerCand    = data => API.post('/api/auth/register-candidate', data);
export const loginUser       = data => API.post('/api/auth/login', data);
export const loginSU         = data => API.post('/api/auth/login-super-user', data);
export const loginSA         = data => API.post('/api/auth/login-super-admin', data);
export const login2FA        = data => API.post('/api/auth/login/2fa', data);
export const setup2FA        = data => API.post('/api/auth/2fa/setup', null, { params: data });
export const confirm2FA      = data => API.post('/api/auth/2fa/confirm', data);
export const refreshToken    = ()   => API.post('/api/auth/refresh-token');
export const logoutUser      = ()   => API.post('/api/auth/logout');

// Protected
export const getProfile      = ()   => API.get('/api/auth/profile');
export const getByUsername   = username => API.get(`/api/auth/${username}`);

// Export the instance in case you need interceptors
export default API;
