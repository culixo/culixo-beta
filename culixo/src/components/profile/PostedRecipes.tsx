"use client";

import { useEffect, useState, useRef } from "react";
import { type Recipe } from "@/lib/api/recipes";
import { recipeService } from "@/services/recipeService";
import { RecipeGrid } from "./RecipeGrid";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PostedRecipesProps {
  userId: string;
}

export function PostedRecipes({ userId }: PostedRecipesProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!userId || loadingRef.current) return;

    async function fetchRecipes() {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setIsLoading(true);

      try {
        console.log("Fetching recipes for userId:", userId);
        const userRecipes = await recipeService.getUserRecipes(userId);
        console.log("Received recipes:", userRecipes);

        if (Array.isArray(userRecipes)) {
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
  }, [userId]);

  const handleInteraction = async (recipeId: string, type: 'like' | 'save', newCount: number) => {
    // Update the recipes state with new counts
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

  const handleRetry = async () => {
    // Prevent retry if already loading
    if (loadingRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const userRecipes = await recipeService.getUserRecipes(userId);
      setRecipes(userRecipes);
    } catch (err) {
      console.error("Error reloading recipes:", err);
      setError("Failed to load recipes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}{" "}
          <button
            onClick={handleRetry}
            className="underline hover:no-underline ml-2"
            disabled={isLoading}
          >
            Try again
          </button>
        </AlertDescription>
      </Alert>
    );
  }

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
