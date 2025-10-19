import axios from 'axios';
import { authService } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log(`API_URL: ${API_URL}, Request to: ${config.url}`);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Request with token: ${token.substring(0, 10)}...`);
    } else {
      console.warn(`No access token found for request to ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.code === 'ERR_CONNECTION_REFUSED') {
      console.error(`Network error: Cannot connect to ${API_URL}${originalRequest.url}`);
      throw new Error('Cannot connect to the server. Please check if the backend is running.');
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('401 error detected, attempting token refresh...');
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          console.warn('No refresh token available');
          throw new Error('No refresh token available');
        }
        const newAccessToken = await authService.refreshToken(refreshToken);
        console.log('Token refreshed successfully, retrying request...');
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError: any) {
        console.error('Token refresh failed:', refreshError.response?.data || refreshError.message);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        console.log('Tokens cleared, redirecting to /login');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    console.error(`API error for ${originalRequest?.url || 'unknown'}:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;