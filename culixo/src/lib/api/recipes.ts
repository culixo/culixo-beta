// src/lib/api/recipes.ts
import { FilterType } from '@/contexts/FilterContext'
import api from '../axios'
import { ApiResponse } from './user'

// Types and Interfaces
export interface RecipeAuthor {
  id: string
  full_name: string
  avatar_url: string | null
}

export interface Recipe {
  id: string
  title: string
  description: string
  difficulty_level: string
  prep_time: number
  cook_time: number
  likes_count: number
  saves_count: number
  media: {
    mainImage: string | null
    additionalImages: string[]
  }
  author: RecipeAuthor
  created_at: string
  has_liked: boolean;
  has_saved: boolean;
}

interface PaginationData {
  currentPage: number
  totalPages: number
  totalRecipes: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface RecipesResponse {
  recipes: Recipe[]
  pagination: PaginationData
}

export interface SavedRecipesResponse {
  recipes: Recipe[]
  pagination: PaginationData
}

// Default values
const DEFAULT_PAGINATION: PaginationData = {
  currentPage: 1,
  totalPages: 1,
  totalRecipes: 0,
  hasNextPage: false,
  hasPreviousPage: false
}

// API Methods
export const recipeApi = {
  getMyRecipes: async (): Promise<ApiResponse<Recipe[]>> => {
    try {
      console.log('recipeApi - Calling getMyRecipes');
      const response = await api.get('/recipes/my-recipes');
      console.log('recipeApi - Response received:', response);
      return {
        success: true,
        data: response.data || []
      }
    } catch (error) {
      console.error('Error fetching my recipes:', error);
      return { success: false, data: [] }
    }
  },

  getPublicUserRecipes: async (userId: string): Promise<ApiResponse<Recipe[]>> => {
    try {
      const response = await api.get(`/recipes/user/${userId}/recipes`);
      return {
        success: true,
        data: response.data || []
      }
    } catch (error) {
      console.error('Error fetching user recipes:', error);
      return { success: false, data: [] }
    }
  },

  fetchAllRecipes: async (
    page: number = 1,
    sortBy: string = 'Newest First'
): Promise<ApiResponse<RecipesResponse>> => {
    try {
        const response = await api.get(
            `/recipes/explore?page=${page}&sortBy=${encodeURIComponent(sortBy)}&_t=${Date.now()}`
        );
        console.log('Raw API Response:', response);
        
        return {
            success: true,
            data: {
                recipes: response.data?.recipes || [], // Just use data directly since interceptor already handled it
                pagination: response.data?.pagination || { ...DEFAULT_PAGINATION, currentPage: page }
            }
        };
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return {
            success: false,
            data: {
                recipes: [],
                pagination: { ...DEFAULT_PAGINATION, currentPage: page }
            }
        };
    }
  },

  searchRecipes: async (
    query: string,
    page: number = 1
  ): Promise<ApiResponse<RecipesResponse>> => {
    try {
      const response = await api.get(
        `/recipes/explore/search?query=${encodeURIComponent(query)}&page=${page}`
      )
      return {
        success: true,
        data: response.data || { recipes: [], pagination: DEFAULT_PAGINATION }
      }
    } catch (error) {
      console.error('Error searching recipes:', error)
      return {
        success: false,
        data: { recipes: [], pagination: DEFAULT_PAGINATION }
      }
    }
  },

  fetchFilteredRecipes: async (
    filters: FilterType[],
    page: number = 1,
    sortBy: string = 'Newest First'
  ): Promise<ApiResponse<RecipesResponse>> => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        sortBy,
        filters: JSON.stringify(filters)
      })

      const response = await api.get(`/recipes/explore/filter?${queryParams}`)
      return {
        success: true,
        data: response.data || { recipes: [], pagination: DEFAULT_PAGINATION }
      }
    } catch (error) {
      console.error('Error fetching filtered recipes:', error)
      return {
        success: false,
        data: { recipes: [], pagination: DEFAULT_PAGINATION }
      }
    }
  },

  getRecipeById: async (id: string): Promise<ApiResponse<Recipe | null>> => {
    try {
      const response = await api.get(`/recipes/${id}`)
      return {
        success: true,
        data: response.data?.data || null
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
      return { success: false, data: null }
    }
  },

  // Recipe interactions
  likeRecipe: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await api.post(`/recipes/${id}/like`)
      return { success: true }
    } catch (error) {
      console.error('Error liking recipe:', error)
      return { success: false, message: 'Failed to like recipe' }
    }
  },

  unlikeRecipe: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/recipes/${id}/like`)
      return { success: true }
    } catch (error) {
      console.error('Error unliking recipe:', error)
      return { success: false, message: 'Failed to unlike recipe' }
    }
  },

  saveRecipe: async (id: string): Promise<ApiResponse<void>> => {
    try {
        const response = await api.post(`/recipes/${id}/save`);
        if (response.data?.message === 'Recipe already saved') {
            throw new Error('Recipe already saved');
        }
        return { success: true };
    } catch (error: any) {
        if (error.response?.data?.message === 'Recipe already saved') {
            throw new Error('Recipe already saved');
        }
        console.error('Error saving recipe:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to save recipe' 
        };
    }
  },

  unsaveRecipe: async (id: string): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/recipes/${id}/save`)
      return { success: true }
    } catch (error) {
      console.error('Error unsaving recipe:', error)
      return { success: false, message: 'Failed to unsave recipe' }
    }
  },

  getSavedRecipes: async (page: number = 1): Promise<ApiResponse<RecipesResponse>> => {
    try {
      const response = await api.get(`/recipes/saved?page=${page}`);
      console.log('API Response:', response); // Add this for debugging
      
      // The backend response structure is { success: true, data: { recipes: [], pagination: {} } }
      return {
        success: true,
        data: {
          recipes: response.data?.recipes || [], // Changed from data.data.recipes
          pagination: response.data?.pagination || DEFAULT_PAGINATION
        }
      };
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error fetching saved recipes:', error);
      return {
        success: false,
        data: { recipes: [], pagination: DEFAULT_PAGINATION },
        message: error.message || 'Error fetching saved recipes'
      };
    }
  },

  getRecipeInteractions: async (id: string): Promise<ApiResponse<{
    has_liked: boolean
    has_saved: boolean
  }>> => {
    try {
      const response = await api.get(`/recipes/${id}/interactions`)
      return {
        success: true,
        data: response.data?.data || { has_liked: false, has_saved: false }
      }
    } catch (error) {
      console.error('Error getting recipe interactions:', error)
      return {
        success: false,
        data: { has_liked: false, has_saved: false }
      }
    }
  }
}