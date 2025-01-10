// src/services/recipeService.ts
import { recipeApi } from '@/lib/api/recipes'
import type { Recipe, RecipesResponse } from '@/lib/api/recipes'

interface PaginationData {
    currentPage: number
    totalPages: number
    totalRecipes: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  
const DEFAULT_PAGINATION = {
    currentPage: 1,
    totalPages: 1,
    totalRecipes: 0,
    hasNextPage: false,
    hasPreviousPage: false
  }

export const recipeService = {
//   getFeaturedRecipes: async (): Promise<Recipe[]> => {
//     try {
//       const response = await recipeApi.getFeaturedRecipes()
//       if (!response.success || !response.data) {
//         throw new Error(response.message || 'Failed to fetch featured recipes')
//       }
//       return response.data
//     } catch (error) {
//       console.error('Error in recipeService.getFeaturedRecipes:', error)
//       throw error
//     }
//   },

    getUserRecipes: async (userId: string): Promise<Recipe[]> => {
        try {
            const response = await recipeApi.getUserRecipes(userId)
            
            if (!response.success || !response.data) {
                return []
            }
            
            return response.data
        } catch (error) {
            console.error('Error in getUserRecipes:', error)
            return []
        }
    },

    getAllRecipes: async (
      page: number = 1,
      sortBy: string = 'Newest First'
  ): Promise<{ 
      recipes: Recipe[]
      pagination: PaginationData 
  }> => {
      try {
          const response = await recipeApi.fetchAllRecipes(page, sortBy);
          console.log('Service response:', response);
  
          if (!response.success || !response.data) {
              return {
                  recipes: [],
                  pagination: { ...DEFAULT_PAGINATION, currentPage: page }
              };
          }
  
          return {
              recipes: response.data.recipes.map(recipe => ({
                  ...recipe,
                  has_liked: !!recipe.has_liked,
                  has_saved: !!recipe.has_saved
              })),
              pagination: response.data.pagination
          };
      } catch (error) {
          console.error('Error in getAllRecipes:', error);
          return {
              recipes: [],
              pagination: { ...DEFAULT_PAGINATION, currentPage: page }
          };
      }
    },

//   searchRecipes: async (
//     query: string,
//     page: number = 1
//   ): Promise<RecipesResponse> => {
//     try {
//       const response = await recipeApi.searchRecipes(query, page)
//       return response
//     } catch (error) {
//       console.error('Error in recipeService.searchRecipes:', error)
//       throw error
//     }
//   },

//   getFilteredRecipes: async (
//     filters: FilterType[],
//     page: number = 1,
//     sortBy: string = 'Newest First'
//   ): Promise<RecipesResponse> => {
//     try {
//       const response = await recipeApi.fetchFilteredRecipes(filters, page, sortBy)
//       return response
//     } catch (error) {
//       console.error('Error in recipeService.getFilteredRecipes:', error)
//       throw error
//     }
//   },

//   getRecipeById: async (id: string): Promise<Recipe> => {
//     try {
//       const response = await recipeApi.getRecipeById(id)
//       return response
//     } catch (error) {
//       console.error('Error in recipeService.getRecipeById:', error)
//       throw error
//     }
//   },

  // Recipe interactions
  likeRecipe: async (id: string): Promise<void> => {
    try {
      const response = await recipeApi.likeRecipe(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to like recipe')
      }
    } catch (error: any) {
      console.error('Error in recipeService.likeRecipe:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to like recipe'
      )
    }
  },

  unlikeRecipe: async (id: string): Promise<void> => {
    try {
      const response = await recipeApi.unlikeRecipe(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to unlike recipe')
      }
    } catch (error: any) {
      console.error('Error in recipeService.unlikeRecipe:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to unlike recipe'
      )
    }
  },

  saveRecipe: async (id: string): Promise<void> => {
    try {
      const response = await recipeApi.saveRecipe(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to save recipe')
      }
    } catch (error: any) {
      console.error('Error in recipeService.saveRecipe:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to save recipe'
      )
    }
  },

  unsaveRecipe: async (id: string): Promise<void> => {
    try {
      const response = await recipeApi.unsaveRecipe(id)
      if (!response.success) {
        throw new Error(response.message || 'Failed to unsave recipe')
      }
    } catch (error: any) {
      console.error('Error in recipeService.unsaveRecipe:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to unsave recipe'
      )
    }
  },

  getSavedRecipes: async (page: number = 1): Promise<{
    recipes: Recipe[];
    pagination: PaginationData;
  }> => {
    try {
      console.log('Fetching saved recipes, page:', page);
      const response = await recipeApi.getSavedRecipes(page);
      
      console.log('Service response:', response); // Add this to debug
  
      if (!response.success) {
        return {
          recipes: [],
          pagination: DEFAULT_PAGINATION
        };
      }
  
      // Since axios interceptor transforms response.data
      // and backend sends { success: true, data: { recipes, pagination } }
      return {
        recipes: response.data?.recipes || [],
        pagination: response.data?.pagination || DEFAULT_PAGINATION
      };
    } catch (error) {
      console.error('Error in getSavedRecipes:', error);
      return {
        recipes: [],
        pagination: DEFAULT_PAGINATION
      };
    }
  },

  getRecipeInteractions: async (id: string): Promise<{
    has_liked: boolean
    has_saved: boolean
  }> => {
    try {
      const response = await recipeApi.getRecipeInteractions(id)
      if (!response.success || !response.data) {
        return { has_liked: false, has_saved: false }
      }
      return response.data
    } catch (error: any) {
      console.error('Error in recipeService.getRecipeInteractions:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to get recipe interactions'
      )
    }
  }
}