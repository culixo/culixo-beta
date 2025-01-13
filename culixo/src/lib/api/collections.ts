// src/lib/api/collections.ts
import api from '../axios'
import type { Recipe } from './recipes'
import { ApiResponse } from './user'

// Types and Interfaces
export interface Collection {
  id: string;
  name: string;
  description: string | null;
  recipe_count: number;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface CollectionWithRecipes extends Collection {
  recipes: Recipe[]
}

interface PaginationData {
  currentPage: number
  totalPages: number
  totalCollections: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface CollectionsResponse {
  collections: Collection[]
  pagination: PaginationData
}

// Default values
const DEFAULT_PAGINATION: PaginationData = {
  currentPage: 1,
  totalPages: 1,
  totalCollections: 0,
  hasNextPage: false,
  hasPreviousPage: false
}

// API Methods
export const collectionApi = {
  getUserCollections: async (page: number = 1): Promise<ApiResponse<CollectionsResponse>> => {
    try {
      const response = await api.get(`/collections?page=${page}`);
      return {
        success: true,
        data: response.data || { collections: [], pagination: DEFAULT_PAGINATION }
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      return {
        success: false,
        data: { collections: [], pagination: DEFAULT_PAGINATION }
      }
    }
  },

  createCollection: async (data: { name: string; description?: string }): Promise<ApiResponse<Collection>> => {
    try {
      const response = await api.post('/collections', data);
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      return { success: false, data: undefined }  // Changed from null to undefined
    }
  },

  getCollection: async (id: string): Promise<ApiResponse<CollectionWithRecipes>> => {
    try {
      const response = await api.get(`/collections/${id}/recipes`);
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching collection:', error);
      return { success: false, data: undefined }  // Changed from null to undefined
    }
  },

  updateCollection: async (id: string, data: { name: string; description?: string }): Promise<ApiResponse<Collection>> => {
    try {
      const response = await api.put(`/collections/${id}`, data);
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      return { success: false, data: undefined }  // Changed from null to undefined
    }
  },

  deleteCollection: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/collections/${id}`);
      return { success: true }
    } catch (error) {
      console.error('Error deleting collection:', error);
      return { success: false }
    }
  },

  addRecipeToCollection: async (collectionId: string, recipeId: string): Promise<ApiResponse<void>> => {
    try {
      await api.post(`/collections/${collectionId}/recipes`, { recipeId });
      return { success: true }
    } catch (error: any) {
      console.error('Error adding recipe to collection:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add recipe to collection'
      }
    }
  },

  removeRecipeFromCollection: async (collectionId: string, recipeId: string): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/collections/${collectionId}/recipes/${recipeId}`);
      return { success: true }
    } catch (error) {
      console.error('Error removing recipe from collection:', error);
      return { success: false }
    }
  }
}