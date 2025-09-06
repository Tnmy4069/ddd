import axios from 'axios';
import { getFromLocalStorage } from './utils';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getFromLocalStorage('token');
    console.log('Axios interceptor - token check:', { 
      hasToken: !!token, 
      tokenLength: token?.length,
      url: config.url,
      method: config.method 
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Axios interceptor - Authorization header set');
    } else {
      console.log('Axios interceptor - No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Just log the error, don't auto-logout or redirect
      console.warn('Authentication failed - token may be expired');
      // Only clear storage if we're not already on a login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/')) {
        // Don't auto-redirect, just clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
