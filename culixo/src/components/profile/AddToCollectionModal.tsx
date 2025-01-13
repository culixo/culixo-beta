// src/components/profile/AddToCollectionModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Recipe } from "@/lib/api/recipes";
import { recipeService } from "@/services/recipeService";
import { collectionService } from "@/services/collectionService";
import Image from "next/image";
import { ChefHat } from "lucide-react";

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId: string;
  onSuccess: () => void;
  existingRecipeIds: string[];
}

export function AddToCollectionModal({
  isOpen,
  onClose,
  collectionId,
  onSuccess,
  existingRecipeIds
}: AddToCollectionModalProps) {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSavedRecipes();
    }
  }, [isOpen]);

  const fetchSavedRecipes = async () => {
    setIsLoading(true);
    try {
      const result = await recipeService.getSavedRecipes(1);
      // Filter out recipes that are already in the collection
      const availableRecipes = result.recipes.filter(
        recipe => !existingRecipeIds.includes(recipe.id)
      );
      setSavedRecipes(availableRecipes);
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedRecipes.length === 0) return;

    setIsSubmitting(true);
    try {
      // Add recipes one by one
      for (const recipeId of selectedRecipes) {
        await collectionService.addRecipeToCollection(collectionId, recipeId);
      }
      onSuccess();
      onClose();
      setSelectedRecipes([]);
    } catch (error) {
      console.error("Error adding recipes to collection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Recipes to Collection</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : savedRecipes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No saved recipes available to add</p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[60vh]">
              <div className="grid grid-cols-1 gap-4 pr-4">
                {savedRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
                  >
                    <Checkbox
                      checked={selectedRecipes.includes(recipe.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedRecipes([...selectedRecipes, recipe.id]);
                        } else {
                          setSelectedRecipes(selectedRecipes.filter(id => id !== recipe.id));
                        }
                      }}
                    />
                    
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      {recipe.media?.mainImage ? (
                        <Image
                          src={recipe.media.mainImage}
                          alt={recipe.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <ChefHat className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <h4 className="font-medium">{recipe.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {recipe.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedRecipes.length === 0 || isSubmitting}
              >
                Add Selected ({selectedRecipes.length})
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}