// src/lib/axios.ts
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true 
});

api.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().getToken();
    console.log('Request URL:', config.url);
    console.log('Token present:', !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added Authorization header:', config.headers.Authorization);
    } else {
      console.log('No token available for request');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   (response) => {
//     // Return just the response data as before
//     return response.data;
//   },
//   (error) => {
//     if (error.response?.status === 401 &&
//     !error.config.url?.includes('/settings/account/password')) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       sessionStorage.removeItem('token');
//       sessionStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuth.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;