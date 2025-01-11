// src/components/profile/PostedRecipes.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { type Recipe } from "@/lib/api/recipes";
import { recipeService } from "@/services/recipeService";
import { RecipeGrid } from "./RecipeGrid";
import { useAuth } from "@/hooks/useAuth";

interface PostedRecipesProps {
  userId: string;
}

export function PostedRecipes({ userId }: PostedRecipesProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!userId || loadingRef.current) return;

    async function fetchRecipes() {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setIsLoading(true);

      try {
        console.log('PostedRecipes - Current userId:', userId);
        console.log('PostedRecipes - Logged in user id:', user?.id);

        // Check if viewing own profile
        const isOwnProfile = user?.id?.toString() === userId.toString();
        console.log('PostedRecipes - Is own profile?', isOwnProfile);

        const userRecipes = isOwnProfile 
        ? await recipeService.getMyRecipes()
        : await recipeService.getPublicUserRecipes(userId);

        if (Array.isArray(userRecipes)) {
          console.log('PostedRecipes - Setting recipes state:', userRecipes);
          setRecipes(userRecipes);
        } else {
          console.error("Expected array of recipes but got:", userRecipes);
          setRecipes([]);
        }
      } catch (err) {
        console.error("Recipe fetch error:", err);
        setError("Failed to load recipes");
        setRecipes([]);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    }

    fetchRecipes();
  }, [userId, user?.id]);

  const handleInteraction = async (recipeId: string, type: 'like' | 'save', newCount: number) => {
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe.id === recipeId
          ? {
              ...recipe,
              likes_count: type === 'like' ? newCount : recipe.likes_count,
              saves_count: type === 'save' ? newCount : recipe.saves_count,
              has_liked: type === 'like' ? !recipe.has_liked : recipe.has_liked,
              has_saved: type === 'save' ? !recipe.has_saved : recipe.has_saved
            }
          : recipe
      )
    );
  };

  return (
    <RecipeGrid
      recipes={recipes}
      isLoading={isLoading}
      emptyStateMessage="Ready to share your culinary creations? Start by posting your first recipe!"
      showAuthor={false}
      onInteraction={handleInteraction}
    />
  );
}
