"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Clock, Users, ChefHat, X, Heart, Bookmark } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Recipe } from '@/types/recipe'

interface RecipeQuickViewProps {
  isOpen: boolean
  onClose: () => void
  recipe: Recipe
}

export default function RecipeQuickView({
  isOpen,
  onClose,
  recipe
}: RecipeQuickViewProps) {
  const { theme } = useTheme()
  
  if (!isOpen) return null

  const handleAction = (action: 'save' | 'like') => {
    // Will implement later with authentication
    console.log(`${action} recipe`, recipe.id)
  }

  // Calculate total time
  const totalTime = recipe.prep_time + recipe.cook_time

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={cn(
        "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        "w-full max-w-2xl p-6 z-50",
        "rounded-2xl",
        theme === 'dark'
          ? 'bg-[#1C1C1C] border border-white/10'
          : 'bg-white border border-zinc-200',
        "shadow-xl"
      )}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4",
            "p-2 rounded-full",
            "transition-colors",
            theme === 'dark'
              ? 'text-white/70 hover:bg-white/10'
              : 'text-zinc-600 hover:bg-zinc-100'
          )}
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Section */}
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <div className="relative w-full h-full">
                <Image
                  src={recipe.media.mainImage || '/placeholder-recipe.jpg'}
                  alt={recipe.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority // Load this image first
                />
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => handleAction('like')}
                className={cn(
                  "p-2 rounded-full backdrop-blur-sm transition-colors",
                  theme === 'dark'
                    ? 'bg-black/40 text-white hover:bg-black/60'
                    : 'bg-white/40 text-zinc-700 hover:bg-white/60'
                )}
              >
                <Heart size={18} />
              </button>
              <button
                onClick={() => handleAction('save')}
                className={cn(
                  "p-2 rounded-full backdrop-blur-sm transition-colors",
                  theme === 'dark'
                    ? 'bg-black/40 text-white hover:bg-black/60'
                    : 'bg-white/40 text-zinc-700 hover:bg-white/60'
                )}
              >
                <Bookmark size={18} />
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1">
            <h2 className={cn(
              "text-2xl font-semibold mb-2",
              theme === 'dark' ? 'text-white' : 'text-zinc-900'
            )}>
              {recipe.title}
            </h2>

            <div className="flex items-center flex-wrap gap-2 mb-4">
              {recipe.author_name && (
                <>
                  <div className={cn(
                    "flex items-center gap-1.5 text-sm",
                    theme === 'dark' ? 'text-white/70' : 'text-zinc-600'
                  )}>
                    <ChefHat size={16} />
                    <span>{recipe.author_name}</span>
                  </div>
                  <span className={theme === 'dark' ? 'text-white/30' : 'text-zinc-300'}>•</span>
                </>
              )}
              <div className={cn(
                "flex items-center gap-1.5 text-sm",
                theme === 'dark' ? 'text-white/70' : 'text-zinc-600'
              )}>
                <Clock size={16} />
                <span>{totalTime} mins total</span>
              </div>
              <span className={theme === 'dark' ? 'text-white/30' : 'text-zinc-300'}>•</span>
              <div className={cn(
                "flex items-center gap-1.5 text-sm",
                theme === 'dark' ? 'text-white/70' : 'text-zinc-600'
              )}>
                <Users size={16} />
                <span>{recipe.servings} servings</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
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
              {recipe.tags?.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-sm",
                    theme === 'dark'
                      ? 'bg-white/10 text-white'
                      : 'bg-zinc-100 text-zinc-700'
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>

            {recipe.description && (
              <p className={cn(
                "text-sm mb-4",
                theme === 'dark' ? 'text-white/70' : 'text-zinc-600'
              )}>
                {recipe.description}
              </p>
            )}

            {recipe.additional_info?.cookingTips?.length > 0 && (
              <div className={cn(
                "rounded-lg p-4 mb-4",
                theme === 'dark' ? 'bg-white/5' : 'bg-zinc-50'
              )}>
                <h3 className={cn(
                  "text-sm font-medium mb-2",
                  theme === 'dark' ? 'text-white' : 'text-zinc-900'
                )}>
                  Quick Tips
                </h3>
                <ul className={cn(
                  "text-sm space-y-1",
                  theme === 'dark' ? 'text-white/70' : 'text-zinc-600'
                )}>
                  {recipe.additional_info.cookingTips.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <Link 
              href={`/recipes/${recipe.id}`}
              className={cn(
                "w-full py-2.5 rounded-lg",
                "text-sm font-medium text-center block",
                "transition-colors",
                theme === 'dark'
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              )}
            >
              View Full Recipe
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}