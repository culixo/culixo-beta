// src/components/profile/RecipeGrid.tsx
"use client";

import { type Recipe } from "@/lib/api/recipes";
import { RecipeCard } from "../shared/RecipeCard";
import { ChefHat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCallback } from 'react';

interface RecipeGridProps {
  recipes: Recipe[];
  isLoading: boolean;
  emptyStateMessage?: string;
  showAuthor?: boolean;
  isSavedPage?: boolean;
  onRecipeRemoved?: (recipeId: string) => void;
  onInteraction?: (recipeId: string, type: 'like' | 'save', newCount: number) => void;
}

export function RecipeGrid({ 
  recipes, // Using prop directly
  isLoading, 
  emptyStateMessage = "No recipes found", 
  showAuthor = false,
  isSavedPage = false,
  onRecipeRemoved,
  onInteraction
}: RecipeGridProps) {

  // Handle recipe interactions
  const handleInteraction = useCallback((recipeId: string, type: 'like' | 'save', newCount: number) => {
    if (isSavedPage && type === 'save' && newCount === 0) {
      onRecipeRemoved?.(recipeId);
    }

    // Pass the interaction up to parent
    if (onInteraction) {
      onInteraction(recipeId, type, newCount);
    }
  }, [isSavedPage, onRecipeRemoved, onInteraction]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card 
            key={i} 
            className="animate-pulse bg-background-inset border-border-primary"
          >
            <div className="aspect-video bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-background-elevated rounded-full p-6 mb-6">
          <ChefHat className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Recipes Yet</h3>
        <p className="text-muted-foreground max-w-md">
          {emptyStateMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          showAuthor={showAuthor}
          isSavedPage={isSavedPage}
          onInteraction={(type, count) => handleInteraction(recipe.id, type, count)}
        />
      ))}
    </div>
  );
}