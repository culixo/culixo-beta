import { create } from 'zustand';

export interface User {
  id: number;
  full_name: string;
  email: string;
  auth_provider?: string | null;
  auth_provider_id?: string | null;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | undefined;
  setAuth: (user: User | null, token?: string) => void;
  getToken: () => string | undefined;
  logout: () => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  token: undefined,
  setAuth: (user, token) => {
    if (token) {
        const expiryTime = 24 * 60 * 60; // 24 hours in seconds
        
        // Set token in cookie for middleware
        document.cookie = `token=${token}; path=/; max-age=${expiryTime}`; 
        
        // Store token based on storage preference
        if (localStorage.getItem('user')) {
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpiry', String(Date.now() + expiryTime * 1000));
        } else {
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('tokenExpiry', String(Date.now() + expiryTime * 1000));
        }
    }
    set({ isAuthenticated: !!user, user, token });
  },
  getToken: () => {
    const state = get();
    if (state.token) return state.token;
    
    // Check token expiry
    const expiry = localStorage.getItem('tokenExpiry') || sessionStorage.getItem('tokenExpiry');
    if (expiry && Date.now() > Number(expiry)) {
        get().logout();
        return undefined;
    }
    
    return localStorage.getItem('token') || sessionStorage.getItem('token') || undefined;
  },
  logout: () => {
    // Clear cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Clear storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    
    set({ isAuthenticated: false, user: null, token: undefined });
  },
}));

// Initialize auth state from storage
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (storedUser && storedToken) {
    useAuth.getState().setAuth(JSON.parse(storedUser), storedToken);
  }
}

// API utility for authenticated requests
export const api = {
  getAuthHeaders: (): HeadersInit => {
    const token = useAuth.getState().getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  request: async (endpoint: string, options: RequestInit = {}) => {
    const headers = api.getAuthHeaders();
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    };

    try {
      const response = await fetch(`${baseURL}${endpoint}`, config);
      
      if (response.status === 401) {
        useAuth.getState().logout();
        throw new Error('Session expired');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
};