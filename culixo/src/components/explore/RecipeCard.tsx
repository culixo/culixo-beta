"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Heart, Bookmark, Clock, Users, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import RecipeQuickView from './RecipeQuickView'
import type { Recipe } from '@/types/recipe'

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { theme } = useTheme()
  const [showQuickView, setShowQuickView] = useState(false)

  const handleAction = (action: 'save' | 'like') => {
    // Will implement later with authentication
    console.log(`${action} recipe`, recipe.id)
  }

  // Calculate total time with null checks
  const totalTime = (recipe?.prep_time || 0) + (recipe?.cook_time || 0)

  // If recipe is not loaded yet, return null or a skeleton
  if (!recipe) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "group rounded-xl border overflow-hidden",
          "transition-all duration-300 hover:-translate-y-1",
          theme === 'dark' 
            ? 'bg-black/20 border-white/10' 
            : 'bg-white border-zinc-200',
          "backdrop-blur-sm"
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <Link href={`/recipes/${recipe.id}`} className="block h-full">
            <div className="relative w-full h-full">
              <Image
                src={recipe.media?.mainImage || '/images/recipes/pizza.jpg'}
                alt={recipe.title || 'Recipe image'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>
          
          {/* Overlay */}
          <div className={cn(
            "absolute inset-0",
            "bg-gradient-to-t from-black/60 via-black/20 to-transparent",
            "transition-opacity duration-300",
            "group-hover:via-black/40"
          )} />

          {/* Quick Actions */}
          <div className={cn(
            "absolute top-4 right-4",
            "flex items-center gap-2",
            "transform",
            "transition-all duration-300",
            "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          )}>
            <button
              onClick={() => handleAction('like')}
              className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
            >
              <Heart size={18} />
            </button>
            <button
              onClick={() => handleAction('save')}
              className="p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
            >
              <Bookmark size={18} />
            </button>
          </div>

          {/* Quick View Button */}
          <button
            onClick={() => setShowQuickView(true)}
            className={cn(
              "absolute left-4 bottom-4",
              "flex items-center gap-2",
              "px-3 py-2 rounded-2xl",
              "text-sm font-medium text-white",
              "bg-black/45 backdrop-blur-sm",
              "transition-all duration-300",
              "hover:bg-black/70"
            )}
          >
            <Eye size={16} />
          </button>

          {/* Time Badge */}
          <div className={cn(
            "absolute bottom-4 right-4",
            "px-3 py-2 rounded-lg",
            "flex items-center gap-2",
            "text-sm font-medium text-white",
            "bg-black/50 backdrop-blur-sm"
          )}>
            <Clock size={16} />
            {totalTime} mins
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <Link href={`/recipes/${recipe.id}`}>
            <h3 className={cn(
              "font-medium text-lg mb-2 line-clamp-1 hover:underline",
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            )}>
              {recipe.title}
            </h3>
          </Link>

          <div className="flex items-center gap-4 mb-3">
            {recipe.author_name && (
              <div className={cn(
                "text-sm",
                theme === 'dark' ? 'text-white/70' : 'text-zinc-600'
              )}>
                by {recipe.author_name}
              </div>
            )}

            {recipe.servings && (
              <div className={cn(
                "flex items-center gap-1.5",
                theme === 'dark' ? 'text-white/70' : 'text-zinc-600'
              )}>
                <Users size={16} />
                <span>{recipe.servings} servings</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {recipe.cuisine_type && (
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-sm",
                  theme === 'dark'
                    ? 'bg-white/10 text-white'
                    : 'bg-zinc-100 text-zinc-700'
                )}
              >
                {recipe.cuisine_type}
              </span>
            )}
            {recipe.course_type && (
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-sm",
                  theme === 'dark'
                    ? 'bg-white/10 text-white'
                    : 'bg-zinc-100 text-zinc-700'
                )}
              >
                {recipe.course_type}
              </span>
            )}
            {recipe.diet_category && (
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-sm",
                  theme === 'dark'
                    ? 'bg-white/10 text-white'
                    : 'bg-zinc-100 text-zinc-700'
                )}
              >
                {recipe.diet_category}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {recipe && (
        <RecipeQuickView 
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
          recipe={recipe}
        />
      )}
    </>
  )
}