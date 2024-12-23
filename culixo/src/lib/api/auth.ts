// src/lib/api/auth.ts
import api from '../axios';
import type { User } from '@/hooks/useAuth';

interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export const authApi = {
  login: async (credentials: { 
    email: string; 
    password: string; 
  }): Promise<AuthResponse> => {
    return api.post('/auth/login', credentials);
  },

  signup: async (userData: { 
    fullName: string;
    email: string; 
    password: string; 
  }): Promise<AuthResponse> => {
    return api.post('/auth/signup', {
      ...userData,
      full_name: userData.fullName // Convert to match backend
    });
  },

  logout: async () => {
    return api.post('/auth/logout');
  }
};