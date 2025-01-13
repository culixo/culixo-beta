// src/components/profile/CollectionDetail.tsx
"use client";

import { useState, useEffect } from "react";
import { type CollectionWithRecipes } from "@/lib/api/collections";
import { type Recipe } from "@/lib/api/recipes";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "../shared/RecipeCard";
import { AddToCollectionModal } from "./AddToCollectionModal";
import { collectionService } from "@/services/collectionService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Trash2, ChefHat } from "lucide-react";

interface CollectionDetailProps {
  collectionId: string;
  collectionName: string;
  onBackClick: () => void;
}

const RemoveButton = ({ 
  onRemove 
}: { 
  onRemove: () => void;
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white/80 hover:text-red-400 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Remove from collection</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function CollectionDetail({ collectionId, collectionName, onBackClick }: CollectionDetailProps) {
  const [collection, setCollection] = useState<CollectionWithRecipes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCollection = async () => {
    setIsLoading(true);
    try {
      const result = await collectionService.getCollection(collectionId);
      setCollection(result);
    } catch (error) {
      console.error("Error fetching collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [collectionId]);

  const handleRemoveRecipe = async (recipeId: string) => {
    try {
      await collectionService.removeRecipeFromCollection(collectionId, recipeId);
      fetchCollection(); // Refresh the collection
    } catch (error) {
      console.error("Error removing recipe from collection:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/3 bg-muted rounded"></div>
        <div className="h-[200px] bg-muted rounded"></div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Collection not found</p>
        <Button variant="ghost" onClick={onBackClick} className="mt-4">
          Back to Collections
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <button
            onClick={onBackClick}
            className="hover:text-accent-foreground transition-colors"
          >
            Collections
          </button>
          <span className="text-muted-foreground">&gt;</span>
          <span>{collectionName}</span>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          + Add Recipes
        </Button>
      </div>

      {/* Recipes Grid */}
      {collection.recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ChefHat className="w-12 h-12 mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No recipes in this collection yet</p>
          <Button onClick={() => setShowAddModal(true)}>
            Add Recipes
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collection.recipes.map((recipe) => (
            <div key={recipe.id} className="relative group">
              <RecipeCard 
                recipe={recipe} 
                showAuthor={true}
                onInteraction={() => fetchCollection()}
                hideInteractions={true}
              />
              <RemoveButton 
                onRemove={() => handleRemoveRecipe(recipe.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Recipe Modal */}
      <AddToCollectionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        collectionId={collectionId}
        onSuccess={fetchCollection}
        existingRecipeIds={collection.recipes.map(recipe => recipe.id)}
      />
    </div>
  );
}