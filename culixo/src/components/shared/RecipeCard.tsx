// src/components/shared/RecipeCard.tsx

import React from 'react';
import { Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Recipe } from '@/types';
import Image from 'next/image';

interface RecipeCardProps {
  recipe: Recipe;
  theme: string | undefined;
}

export const RecipeCard = ({ recipe, theme }: RecipeCardProps) => {
  return (
    <div className="group relative h-full">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Difficulty Badge */}
        <div className="mb-3">
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full",
              theme === "dark" ? "bg-zinc-700" : "bg-zinc-100",
              theme === "dark" ? "text-zinc-300" : "text-zinc-700"
            )}
          >
            {recipe.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            "text-lg font-semibold mb-2",
            theme === "dark" ? "text-white" : "text-zinc-900"
          )}
        >
          {recipe.title}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex items-center gap-1.5",
              theme === "dark" ? "text-zinc-400" : "text-zinc-600"
            )}
          >
            <Clock size={16} />
            <span className="text-sm">{recipe.time}</span>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5",
              theme === "dark" ? "text-zinc-400" : "text-zinc-600"
            )}
          >
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm">{recipe.rating}</span>
          </div>
        </div>

        {/* Chef Info */}
        <div
          className={cn(
            "mt-4 flex items-center gap-2",
            theme === "dark" ? "text-zinc-400" : "text-zinc-600"
          )}
        >
          <div className="w-6 h-6 rounded-full bg-zinc-200" />
          <span className="text-sm">{recipe.chef}</span>
        </div>
      </div>
    </div>
  );
};