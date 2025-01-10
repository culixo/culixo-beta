// src/lib/api/user.ts
import api from "../axios";

export interface AccountDetails {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}

export interface ProfileData {
  full_name: string;
  bio: string | null;
  expertise_level: string; 
  years_of_experience: string; 
  specialties: string | null;
  website_url: string | null; 
  instagram_handle: string | null; 
  twitter_handle: string | null; 
  avatar_url?: string;
}

export interface ProfileResponse {
  full_name: string;
  bio: string | null;
  expertise_level: string;
  years_of_experience: string; 
  specialties: string | null;
  website_url: string | null; 
  instagram_handle: string | null;
  twitter_handle: string | null; 
  updated_at: string;
  avatar_url?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const userApi = {
  // Account Tab endpoints
  getAccountDetails: async (): Promise<ApiResponse<AccountDetails>> => {
    try {
      return await api.get("/users/settings/account");
    } catch (error) {
      console.error("Error fetching account details:", error);
      throw error;
    }
  },

  updateUsername: async (
    username: string
  ): Promise<ApiResponse<AccountDetails>> => {
    try {
      return await api.put("/users/settings/account/username", { username });
    } catch (error) {
      console.error("Error updating username:", error);
      throw error;
    }
  },

  updatePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> => {
    try {
      return await api.put("/users/settings/account/password", passwordData);
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  },

  deleteAccount: async (): Promise<ApiResponse<void>> => {
    try {
      return await api.delete("/users/settings/account");
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  },

  // Profile Tab endpoints
  uploadAvatar: async (file: File): Promise<ApiResponse<ProfileResponse>> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      return await api.post("/users/settings/profile/avatar", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
  },

  deleteAvatar: async (): Promise<ApiResponse<ProfileResponse>> => {
    try {
      return await api.delete("/users/settings/profile/avatar");
    } catch (error) {
      console.error("Error deleting avatar:", error);
      throw error;
    }
  },

  getProfile: async (): Promise<ApiResponse<ProfileResponse>> => {
    try {
      return await api.get("/users/settings/profile");
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  updateProfile: async (
    profileData: ProfileData
  ): Promise<ApiResponse<ProfileResponse>> => {
    try {
      return await api.put("/users/settings/profile", profileData);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  followUser: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      return await api.post(`/users/${userId}/follow`);
    } catch (error) {
      console.error("Error following user:", error);
      throw error;
    }
  },

  unfollowUser: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      return await api.delete(`/users/${userId}/follow`);
    } catch (error) {
      console.error("Error unfollowing user:", error);
      throw error;
    }
  },
};