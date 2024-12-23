import React from 'react';
import RecipeView from '@/components/recipe-view/RecipeView';
import SearchBar from '@/components/recipe-view/SearchBar';

async function getRecipe(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error('API URL is not defined');
      return null;
    }

    const res = await fetch(`${apiUrl}/recipes/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch recipe');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

// Remove type definitions and let Next.js handle them
export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipeData = await getRecipe(params.id);

  if (!recipeData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground">Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16" />
      <div className="relative w-full py-4 px-4">
        <SearchBar className="z-10" />
      </div>
      <div className="flex-1">
        <RecipeView
          recipe={recipeData.data}
          author={recipeData.data.author}
        />
      </div>
    </div>
  );
}