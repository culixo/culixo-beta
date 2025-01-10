// src/hooks/useAuth.ts
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
  avatar_url?: string;
}

interface PendingInteraction {
  type: 'like' | 'save';
  recipeId: string;
  returnTo: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | undefined;
  showAuthModal: boolean;
  pendingInteraction: PendingInteraction | null;
  setAuth: (user: User | null, token?: string) => void;
  getToken: () => string | undefined;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setShowAuthModal: (show: boolean) => void;
  setPendingInteraction: (interaction: PendingInteraction | null) => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  token: undefined,
  showAuthModal: false,
  pendingInteraction: null,
  
  setAuth: (user, token) => {
    if (token) {
      const expiryTime = 24 * 60 * 60;
      document.cookie = `token=${token}; path=/; max-age=${expiryTime}`;
      
      if (localStorage.getItem('user')) {
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiry', String(Date.now() + expiryTime * 1000));
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('tokenExpiry', String(Date.now() + expiryTime * 1000));
      }
    }
    
    if (user) {
      const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(user));
    }
    
    set({ isAuthenticated: !!user, user, token });
  },

  updateUser: (userData) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...userData,
    };

    const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(updatedUser));

    set({ user: updatedUser });
  },

  getToken: () => {
    const state = get();
    if (state.token) return state.token;
    
    const expiry = localStorage.getItem('tokenExpiry') || sessionStorage.getItem('tokenExpiry');
    if (expiry && Date.now() > Number(expiry)) {
      get().logout();
      return undefined;
    }
    
    return localStorage.getItem('token') || sessionStorage.getItem('token') || undefined;
  },

  logout: () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tokenExpiry');
    
    set({ 
      isAuthenticated: false, 
      user: null, 
      token: undefined,
      pendingInteraction: null,
      showAuthModal: false
    });
  },

  setShowAuthModal: (show) => set({ showAuthModal: show }),
  
  setPendingInteraction: (interaction) => {
    // Only set if different from current state
    const currentInteraction = get().pendingInteraction
    if (JSON.stringify(currentInteraction) !== JSON.stringify(interaction)) {
      set({ pendingInteraction: interaction })
    }
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