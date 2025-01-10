// src/types/profile/collection.ts
export interface Collection {
    id: string;
    name: string;
    description: string;
    coverImage?: string;
    recipeCount: number;
    isPrivate: boolean;
    createdAt: string;
  }