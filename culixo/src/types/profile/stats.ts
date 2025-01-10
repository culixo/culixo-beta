// src/types/profile/stats.ts
export interface CookingStats {
    totalRecipes: number;
    totalLikes: number;
    totalSaves: number;
    cuisineDistribution: {
      cuisine: string;
      count: number;
    }[];
    difficultyDistribution: {
      difficulty: string;
      count: number;
    }[];
    cookingTimeDistribution: {
      range: string;
      count: number;
    }[];
  }