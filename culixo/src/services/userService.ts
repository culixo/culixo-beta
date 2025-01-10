// src/services/userService.ts
import { userApi } from "@/lib/api/user";
import type {
  AccountDetails,
  ProfileData,
  ProfileResponse,
  ApiResponse,
} from "@/lib/api/user";

interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  // For Account Tab
  getAccountDetails: async (): Promise<AccountDetails> => {
    try {
      const response = await userApi.getAccountDetails();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch account details");
      }
      return response.data;
    } catch (error) {
      console.error("Error in userService.getAccountDetails:", error);
      throw error;
    }
  },

  updateUsername: async (username: string): Promise<AccountDetails> => {
    try {
      const response = await userApi.updateUsername(username);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update username");
      }
      return response.data;
    } catch (error) {
      console.error("Error in userService.updateUsername:", error);
      throw error;
    }
  },

  updatePassword: async (data: UpdatePasswordData): Promise<void> => {
    try {
      const response = await userApi.updatePassword(data);
      if (!response.success) {
        throw new Error(response.message || "Failed to update password");
      }
    } catch (error: any) {
      console.error("Error in userService.updatePassword:", error);
      // Throw a more user-friendly error message
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update password"
      );
    }
  },

  deleteAccount: async (): Promise<void> => {
    try {
      const response = await userApi.deleteAccount();
      if (!response.success) {
        throw new Error(response.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error in userService.deleteAccount:", error);
      throw error;
    }
  },

  // For Profile Tab
  uploadAvatar: async (file: File): Promise<ProfileResponse> => {
    try {
      const response = await userApi.uploadAvatar(file);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to upload avatar");
      }
      return response.data;
    } catch (error: any) {
      console.error("Error in userService.uploadAvatar:", error);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to upload avatar"
      );
    }
  },

  deleteAvatar: async (): Promise<ProfileResponse> => {
    try {
      const response = await userApi.deleteAvatar();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to delete avatar");
      }
      return response.data;
    } catch (error: any) {
      console.error("Error in userService.deleteAvatar:", error);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to delete avatar"
      );
    }
  }, 

  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const response = await userApi.getProfile();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to fetch profile");
      }
      return response.data;
    } catch (error) {
      console.error("Error in userService.getProfile:", error);
      throw error;
    }
  },

  updateProfile: async (data: ProfileData): Promise<ProfileResponse> => {
    try {
      const response = await userApi.updateProfile(data);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to update profile");
      }
      return response.data;
    } catch (error: any) {
      console.error("Error in userService.updateProfile:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    }
  },
};