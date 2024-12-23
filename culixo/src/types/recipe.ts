// src/types/recipe.ts

export interface NutritionalInfo {
  fat: number;
  carbs: number;
  fiber: number;
  protein: number;
  calories: number;
  minerals: {
    iron: number;
    zinc: number;
    calcium: number;
    magnesium: number;
  };
  servings: number;
  vitamins: {
    a: number;
    c: number;
    d: number;
    e: number;
    k: number;
    b6: number;
    b12: number;
  };
  last_calculated: string;
  ingredient_version: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string;
  cuisine_type: string;
  course_type: string;
  difficulty_level: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  diet_category: string;
  ingredients: Array<{
    id: string;
    quantity: number | string;
    unit: string;
    name: string;
    notes?: string;
    groupName?: string;
    isOptional?: boolean;
  }>;
  instructions: Array<{
    id: string;
    stepNumber: number;
    instruction: string;
    timing?: number;
    mediaUrls: string[];
  }>;
  media: {
    mainImage: string | null;
    additionalImages: string[];
    videoUrl?: string | null;
  };
  tags: string[];
  additional_info: {
    cookingTips: string[];
  };
  nutritional_info: NutritionalInfo;
  created_at: string;
  updated_at: string;
  author_name?: string;
  total_time?: number;
}

export interface RecipeCardProps {
  recipe: Recipe;
}