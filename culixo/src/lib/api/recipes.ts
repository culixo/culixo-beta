// src/lib/api/recipes.ts
import { FilterType } from '@/contexts/FilterContext'
import type { Recipe } from '@/types/recipe'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface PaginationData {
  currentPage: number
  totalPages: number
  totalRecipes: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface RecipeApiResponse {
  success: boolean
  data: {
    recipes: Recipe[]
    pagination: PaginationData
  }
  message?: string
}

export const recipeApi = {
  fetchAllRecipes: async (
    page: number = 1,
    sortBy: string = 'Newest First'
  ): Promise<RecipeApiResponse> => {
    try {
      const response = await fetch(
        `${API_URL}/recipes/explore?page=${page}&sortBy=${encodeURIComponent(sortBy)}`,
        {
          credentials: 'include'
        }
      )
      if (!response.ok) throw new Error('Failed to fetch recipes')
      return await response.json()
    } catch (error) {
      console.error('Error fetching recipes:', error)
      throw error
    }
  },

  searchRecipes: async (
    query: string,
    page: number = 1
  ): Promise<RecipeApiResponse> => {
    try {
      const response = await fetch(
        `${API_URL}/recipes/explore/search?query=${encodeURIComponent(query)}&page=${page}`,
        {
          credentials: 'include'
        }
      )
      if (!response.ok) throw new Error('Failed to search recipes')
      return await response.json()
    } catch (error) {
      console.error('Error searching recipes:', error)
      throw error
    }
  },

  fetchFilteredRecipes: async (
    filters: FilterType[],
    page: number = 1,
    sortBy: string = 'Newest First'
  ): Promise<RecipeApiResponse> => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        sortBy,
        filters: JSON.stringify(filters)
      })

      const response = await fetch(
        `${API_URL}/recipes/explore/filter?${queryParams}`,
        {
          credentials: 'include'
        }
      )
      if (!response.ok) throw new Error('Failed to fetch filtered recipes')
      return await response.json()
    } catch (error) {
      console.error('Error fetching filtered recipes:', error)
      throw error
    }
  },

  getRecipeById: async (id: string): Promise<Recipe> => {
    try {
      const response = await fetch(`${API_URL}/recipes/${id}`, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch recipe')
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error fetching recipe:', error)
      throw error
    }
  }
}