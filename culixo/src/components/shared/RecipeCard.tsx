"use client";
import { Card } from "@/components/ui/card";
import { type Recipe } from "@/lib/api/recipes";
import { recipeService } from "@/services/recipeService";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from 'next/navigation';
import { Clock, BookmarkPlus, ChefHat, Heart, BookmarkCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RecipeCardProps {
  recipe: Recipe;
  showAuthor?: boolean;
  onInteraction?: (type: 'like' | 'save', count: number) => void;
  isSavedPage?: boolean;
}

const getDifficultyStyles = (difficulty: string) => {
  const level = difficulty.toLowerCase();
  switch (level) {
    case "easy":
      return {
        bg: "bg-[#E6F4EA] dark:bg-[rgba(30,125,54,0.2)]",
        text: "text-[#1E7D36] dark:text-[#4ADE80]",
      };
    case "medium":
      return {
        bg: "bg-[#FFF5E6] dark:bg-[rgba(234,179,8,0.2)]",
        text: "text-[#B95000] dark:text-[#FBBF24]",
      };
    case "hard":
      return {
        bg: "bg-[#FCE7E7] dark:bg-[rgba(220,38,38,0.2)]",
        text: "text-[#DC2626] dark:text-[#F87171]",
      };
    case "expert":
      return {
        bg: "bg-[#EDE9FE] dark:bg-[rgba(124,58,237,0.2)]",
        text: "text-[#7C3AED] dark:text-[#A78BFA]",
      };
    default:
      return {
        bg: "bg-[#E6F4EA] dark:bg-[rgba(30,125,54,0.2)]",
        text: "text-[#1E7D36] dark:text-[#4ADE80]",
      };
  }
};

export function RecipeCard({ recipe, showAuthor = false, onInteraction, isSavedPage = false }: RecipeCardProps) {
  // Initialize states with the values from recipe prop
  const [isLiked, setIsLiked] = useState(recipe.has_liked);
  const [isSaved, setIsSaved] = useState(isSavedPage || recipe.has_saved);
  const [likesCount, setLikesCount] = useState(recipe.likes_count);
  const [savesCount, setSavesCount] = useState(recipe.saves_count);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, setShowAuthModal, setPendingInteraction } = useAuth(); 

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  const mainImage = recipe.media?.mainImage || null;
  const author = recipe.author || {
    full_name: "Unknown Chef",
    avatar_url: null,
  };

  const difficultyStyles = getDifficultyStyles(
    recipe.difficulty_level || "easy"
  );
  const capitalizedDifficulty =
    (recipe.difficulty_level || "Easy").charAt(0).toUpperCase() +
    (recipe.difficulty_level || "Easy").slice(1).toLowerCase();

    useEffect(() => {
      // Only update if these values actually changed
      if (recipe.has_liked !== isLiked) {
          setIsLiked(!!recipe.has_liked);
      }
      if (recipe.has_saved !== isSaved) {
          setIsSaved(!!recipe.has_saved || isSavedPage);
      }
      setLikesCount(recipe.likes_count);
      setSavesCount(recipe.saves_count);
  }, [recipe.id, recipe.has_liked, recipe.has_saved, recipe.likes_count, recipe.saves_count, isSavedPage]);

  // Handle like interaction
  const handleLike = async () => {
    if (isLoading) return;
  
    if (!isAuthenticated) {
      setPendingInteraction({
        type: 'like',
        recipeId: recipe.id,
        returnTo: pathname
      });
      setShowAuthModal(true);
      return;
    }
    
    setIsLoading(true);
    try {
      if (!isLiked) {
        await recipeService.likeRecipe(recipe.id);
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      } else {
        await recipeService.unlikeRecipe(recipe.id);
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      }
      onInteraction?.('like', !isLiked ? likesCount + 1 : likesCount - 1);
    } catch (error: any) {
      if (error.message === 'Recipe already liked') {
        setIsLiked(true);
      } else {
        console.error('Error toggling like:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save interaction
  const handleSave = async () => {
    if (isLoading) return;
  
    if (!isAuthenticated) {
        setPendingInteraction({
            type: 'save',
            recipeId: recipe.id,
            returnTo: pathname
        });
        setShowAuthModal(true);
        return;
    }
    
    setIsLoading(true);
    try {
        if (!isSaved) {
            await recipeService.saveRecipe(recipe.id);
            setIsSaved(true);
            setSavesCount(prev => prev + 1);
        } else {
            await recipeService.unsaveRecipe(recipe.id);
            setIsSaved(false);
            setSavesCount(prev => prev - 1);
        }
        onInteraction?.('save', !isSaved ? savesCount + 1 : savesCount - 1);
    } catch (error: any) {
        // Reset to previous state on error
        if (error.message === 'Recipe already saved') {
            setIsSaved(true);
        } else if (error.message === 'Save not found') {
            setIsSaved(false);
            setSavesCount(prev => prev - 1);
        } else {
            // Reset to previous state
            setIsSaved(!isSaved);
            setSavesCount(isSaved ? savesCount - 1 : savesCount + 1);
            console.error('Error toggling save:', error);
        }
    } finally {
        setIsLoading(false);
    }
};

  return (
    <Card className="bg-white dark:bg-[#0A0B14] border-gray-200 dark:border-[#1d1e30] rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Image Container with Overlays */}
      <div className="relative aspect-[4/3] rounded-t-lg overflow-hidden group/image">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={recipe.title}
            fill
            className="object-cover group-hover/image:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-[#070810] flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-gray-400 dark:text-gray-600" />
          </div>
        )}

        {/* Cooking Time Overlay */}
        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-[#070810]/90 text-gray-700 dark:text-gray-300 rounded-full px-2.5 py-1 text-sm flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{totalTime}m</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Top Row: Difficulty Level and Engagement Actions */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyStyles.bg} ${difficultyStyles.text}`}
          >
            {capitalizedDifficulty}
          </span>

          <div className="flex items-center gap-4">
            <button
              className="group/like flex items-center gap-1.5"
              onClick={handleLike}
              disabled={isLoading}
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-200 ${
                  isLiked 
                    ? 'text-red-500 dark:text-red-400 fill-current' 
                    : 'text-gray-600 dark:text-gray-400 group-hover/like:text-red-500 dark:group-hover/like:text-red-400'
                }`}
              />
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  isLiked
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400 group-hover/like:text-red-500 dark:group-hover/like:text-red-400'
                }`}
              >
                {likesCount}
              </span>
            </button>

            <button
              className="group/save flex items-center gap-1.5"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isSaved ? (
                <BookmarkCheck
                  className="w-5 h-5 text-purple-500 dark:text-purple-400 fill-current"
                />
              ) : (
                <BookmarkPlus
                  className="w-5 h-5 text-gray-600 dark:text-gray-400 
                    group-hover/save:text-purple-500 dark:group-hover/save:text-purple-400 
                    transition-colors duration-200"
                />
              )}
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  isSaved
                    ? 'text-purple-500 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 group-hover/save:text-purple-500 dark:group-hover/save:text-purple-400'
                }`}
              >
                {savesCount}
              </span>
            </button>
          </div>
        </div>

        {/* Recipe Title - Clickable with gradient underline effect */}
        <Link
          href={`/recipes/${recipe.id}`}
          className="relative inline-block font-medium text-base text-gray-900 dark:text-gray-100 
              group/title"
        >
          <span className="relative">
            {recipe.title}
            <span
              className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#8B5CF6]/40 via-[#8B5CF6] to-[#8B5CF6]/40 
                opacity-0 group-hover/title:opacity-100 blur-[2px] transition-opacity duration-300"
            />
            <span
              className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-[#8B5CF6]/40 via-[#8B5CF6] to-[#8B5CF6]/40 
                opacity-0 group-hover/title:opacity-100 transition-opacity duration-300"
            />
          </span>
        </Link>

        {/* Recipe Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
          {recipe.description || "No description available"}
        </p>

        {/* Author Section */}
        {showAuthor && (
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
              {author.avatar_url ? (
                <Image
                  src={author.avatar_url}
                  alt={author.full_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-[#070810] flex items-center justify-center text-xs">
                  {author.full_name[0]}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {author.full_name}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
