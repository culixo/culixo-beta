// src/types/my-kitchen.ts
export interface Recipe {
    id: string
    title: string
    image: string
    cookingTime: number
    rating: number
    views: number
    likes: number
    dietaryTags: string[]
    createdAt: string
    updatedAt: string
    userId: string
  }
  
  export interface Collection {
    id: string
    name: string
    coverImage: string
    recipeCount: number
    lastUpdated: string
    isPrivate: boolean
    userId: string
  }
  
  export interface UserStats {
    totalRecipes: number
    savedRecipes: number
    following: number
    followers: number
    streak: number
    favoriteCuisines: string[]
    mostCookedRecipes: {
      id: string
      title: string
      count: number
    }[]
  }
  
  export interface RecentActivity {
    id: string
    type: 'comment' | 'like' | 'follow'
    userId: string
    userImage: string
    userName: string
    recipeId?: string
    recipeName?: string
    timestamp: string
  }