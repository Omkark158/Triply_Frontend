import api from './api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/v1/auth/register/', data);
      if (response.data.tokens) {
        const { access, refresh } = response.data.tokens;
        if (!access || !refresh) {
          throw new Error('Invalid token response: missing access or refresh token');
        }
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        console.log('Stored tokens (register):', {
          access: access.substring(0, 10) + '...',
          refresh: refresh.substring(0, 10) + '...',
        });
      } else {
        throw new Error('No tokens in register response');
      }
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/api/v1/auth/login/', credentials);
      const access = response.data.access || response.data.tokens?.access;
      const refresh = response.data.refresh || response.data.tokens?.refresh;
      if (!access || !refresh) {
        throw new Error('Invalid token response: missing access or refresh token');
      }
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      console.log('Stored tokens (login):', {
        access: access.substring(0, 10) + '...',
        refresh: refresh.substring(0, 10) + '...',
      });
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    console.log('Logged out, tokens cleared');
  },

  getProfile: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/api/v1/auth/profile/');
      console.log('Profile fetch succeeded:', response.data); // Debug log
      return response.data;
    } catch (error: any) {
      console.error('Get profile error:', error.response?.data || error.message);
      throw error;
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    try {
      const response = await api.put<User>('/api/v1/auth/profile/', data);
      return response.data;
    } catch (error: any) {
      console.error('Update profile error:', error.response?.data || error.message);
      throw error;
    }
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    try {
      await api.post('/api/v1/auth/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
    } catch (error: any) {
      console.error('Change password error:', error.response?.data || error.message);
      throw error;
    }
  },

  refreshToken: async (refreshToken: string): Promise<string> => {
    try {
      console.log('Attempting token refresh with:', refreshToken.substring(0, 10) + '...');
      const response = await api.post<{ access: string }>('/api/v1/auth/token/refresh/', {
        refresh: refreshToken,
      });
      const { access } = response.data;
      if (!access) {
        throw new Error('No access token in refresh response');
      }
      localStorage.setItem('access_token', access);
      console.log('New access token:', access.substring(0, 10) + '...');
      return access;
    } catch (error: any) {
      console.error('Token refresh error:', error.response?.data || error.message);
      throw error;
    }
  },

  debugTokens: () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    console.log('Current tokens in localStorage:', {
      access_token: accessToken ? accessToken.substring(0, 10) + '...' : null,
      refresh_token: refreshToken ? refreshToken.substring(0, 10) + '...' : null,
    });
  },
};