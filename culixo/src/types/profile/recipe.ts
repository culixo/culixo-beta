// src/types/profile/recipe.ts
export interface Recipe {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    cookingTime: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    cuisine: string;
    likes: number;
    saves: number;
    createdAt: string;
    author: {
      id: string;
      name: string;
      avatarUrl?: string;
    };
  }
  
  export interface RecipeGridProps {
    recipes: Recipe[];
    isLoading?: boolean;
    emptyStateMessage?: string;
    showAuthor?: boolean;
  }