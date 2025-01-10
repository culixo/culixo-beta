// src/components/profile/SavedRecipes.tsx
"use client";

import { useState, useEffect } from "react";
import { RecipeGrid } from "./RecipeGrid";
import { recipeService } from "@/services/recipeService";
import type { Recipe } from "@/lib/api/recipes";
import { Button } from "@/components/ui/button";

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalRecipes: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function SavedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalRecipes: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  useEffect(() => {
    fetchSavedRecipes();
  }, [currentPage]);

  const fetchSavedRecipes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await recipeService.getSavedRecipes(currentPage);
      
      if (response.recipes) {
        setRecipes(response.recipes);
        setPagination(response.pagination);
      } else {
        console.warn('No recipes in response:', response);
        setError('No recipes found');
      }
    } catch (error) {
      console.error('Detailed error in component:', error);
      setError('Failed to load saved recipes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeRemoved = (recipeId: string) => {
    // Remove recipe from the list when unsaved
    setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    // Update total count
    setPagination(prev => ({
      ...prev,
      totalRecipes: prev.totalRecipes - 1
    }));

    // If this was the last recipe on the page, go to previous page
    if (recipes.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Add pagination handlers
  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
        <Button 
          onClick={() => fetchSavedRecipes()}
          variant="default"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Saved Recipes</h1>
        {pagination.totalRecipes > 0 && (
          <p className="text-sm text-gray-500">
            {pagination.totalRecipes} {pagination.totalRecipes === 1 ? 'Recipe' : 'Recipes'}
          </p>
        )}
      </div>

      <RecipeGrid
        recipes={recipes}
        isLoading={isLoading}
        emptyStateMessage="You haven't saved any recipes yet. When you find recipes you love, save them here to easily find them later."
        showAuthor={true}
        isSavedPage={true}
        onRecipeRemoved={handleRecipeRemoved}
      />

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={!pagination.hasPreviousPage || isLoading}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}