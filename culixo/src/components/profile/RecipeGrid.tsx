"use client";

import { type Recipe } from "@/lib/api/recipes";
import { RecipeCard } from "../shared/RecipeCard";
import { ChefHat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from 'react';

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
  recipes: initialRecipes, 
  isLoading, 
  emptyStateMessage = "No recipes found", 
  showAuthor = false,
  isSavedPage = false,
  onRecipeRemoved,
  onInteraction
}: RecipeGridProps) {
  const [recipes, setRecipes] = useState(initialRecipes);

  // Handle recipe interactions
  const handleInteraction = (recipeId: string, type: 'like' | 'save', newCount: number) => {
    if (isSavedPage && type === 'save' && newCount === 0) {
      // If we're on the saved page and a recipe was unsaved
      onRecipeRemoved?.(recipeId);
    }

    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe.id === recipeId
          ? {
              ...recipe,
              likes_count: type === 'like' ? newCount : recipe.likes_count,
              saves_count: type === 'save' ? newCount : recipe.saves_count,
              has_liked: type === 'like' ? newCount > recipe.likes_count : recipe.has_liked,
              has_saved: type === 'save' ? newCount > recipe.saves_count : recipe.has_saved
            }
          : recipe
      )
    );
  };

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
        onInteraction={(type, count) => {
            if (onInteraction) {
              onInteraction(recipe.id, type, count);
            }
          }}
        />
      ))}
    </div>
  );
}