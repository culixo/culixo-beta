// src/services/collectionService.ts
import { collectionApi } from '@/lib/api/collections'
import type { Collection, CollectionWithRecipes } from '@/lib/api/collections'

interface PaginationData {
  currentPage: number
  totalPages: number
  totalCollections: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  totalCollections: 0,
  hasNextPage: false,
  hasPreviousPage: false
}

export const collectionService = {
  getUserCollections: async (page: number = 1): Promise<{
    collections: Collection[];
    pagination: PaginationData;
  }> => {
    try {
      const response = await collectionApi.getUserCollections(page);
      
      if (!response.success) {
        return {
          collections: [],
          pagination: DEFAULT_PAGINATION
        };
      }

      return {
        collections: response.data?.collections ?? [],
        pagination: response.data?.pagination ?? DEFAULT_PAGINATION
      };
    } catch (error) {
      console.error('Error in getUserCollections:', error);
      return {
        collections: [],
        pagination: DEFAULT_PAGINATION
      };
    }
  },

  createCollection: async (data: { name: string; description?: string }): Promise<Collection | null> => {
    try {
      const response = await collectionApi.createCollection(data);
      if (!response.success || !response.data) {
        return null;
      }
      return response.data;
    } catch (error) {
      console.error('Error in createCollection:', error);
      return null;
    }
  },

  getCollection: async (id: string): Promise<CollectionWithRecipes | null> => {
    try {
      const response = await collectionApi.getCollection(id);
      if (!response.success || !response.data) {
        return null;
      }
      return response.data;
    } catch (error) {
      console.error('Error in getCollection:', error);
      return null;
    }
  },

  
  updateCollection: async (id: string, data: { name: string; description?: string }): Promise<Collection | null> => {
    try {
      const response = await collectionApi.updateCollection(id, data);
      if (!response.success || !response.data) {
        return null;
      }
      return response.data;
    } catch (error) {
      console.error('Error in updateCollection:', error);
      return null;
    }
  },

  deleteCollection: async (id: string): Promise<boolean> => {
    try {
      const response = await collectionApi.deleteCollection(id);
      return response.success;
    } catch (error) {
      console.error('Error in deleteCollection:', error);
      return false;
    }
  },

  addRecipeToCollection: async (collectionId: string, recipeId: string): Promise<boolean> => {
    try {
      const response = await collectionApi.addRecipeToCollection(collectionId, recipeId);
      return response.success;
    } catch (error) {
      console.error('Error in addRecipeToCollection:', error);
      return false;
    }
  },

  removeRecipeFromCollection: async (collectionId: string, recipeId: string): Promise<boolean> => {
    try {
      const response = await collectionApi.removeRecipeFromCollection(collectionId, recipeId);
      return response.success;
    } catch (error) {
      console.error('Error in removeRecipeFromCollection:', error);
      return false;
    }
  }
}