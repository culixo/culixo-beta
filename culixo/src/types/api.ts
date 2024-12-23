// src/types/api.ts

// User related types
export interface User {
  id: number;
  full_name: string;
  email: string;
  auth_provider?: string;
  is_email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Media upload response types
export interface ImageUploadResponse {
  url: string;
}

export interface MultipleImageUploadResponse {
  urls: string[];
}

// Authentication response type
export interface AuthResponse {
  user: User;
  token: string;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Note: DraftResponse has been removed since it's recipe/draft related
// and should be using types from recipe.ts