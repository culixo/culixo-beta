"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import RecipeCard from './RecipeCard'
import { useFilters } from '@/contexts/FilterContext'
import { recipeApi } from '@/lib/api/recipes'
import type { Recipe } from '@/types/recipe'

const SORT_OPTIONS = [
  'Newest First',
  'Cooking Time',
  'Quick Recipes',
  'Difficulty Level'
]

export default function RecipeGrid() {
  const { theme } = useTheme()
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { activeFilters } = useFilters()

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      let response;
      if (activeFilters.length > 0) {
        response = await recipeApi.fetchFilteredRecipes(activeFilters, currentPage, sortBy)
      } else {
        response = await recipeApi.fetchAllRecipes(currentPage, sortBy)
      }
  
      if (response.success) {
        setRecipes(response.data.recipes)
        setTotalPages(response.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
      setError('Failed to load recipes. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, sortBy, activeFilters]) 

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className={cn(
              "rounded-xl border overflow-hidden",
              "animate-pulse",
              theme === 'dark' 
                ? 'bg-white/5 border-white/10' 
                : 'bg-zinc-100 border-zinc-200'
            )}
          >
            <div className="aspect-[4/3]" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-current opacity-10 rounded" />
              <div className="h-4 w-24 bg-current opacity-10 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className={theme === 'dark' ? 'text-white/70' : 'text-zinc-600'}>
          {error}
        </p>
        <button
          onClick={fetchRecipes}
          className={cn(
            "mt-4 px-4 py-2 rounded-lg text-sm",
            theme === 'dark'
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-zinc-900 text-white hover:bg-zinc-800'
          )}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1">
      {/* Header with sorting */}
      <div className="flex items-center justify-between mb-6">
        <p className={cn(
          "text-sm",
          theme === 'dark' ? 'text-white/70' : 'text-zinc-600'
        )}>
          Showing {recipes.length} recipes
        </p>

        <div className="flex items-center gap-2 relative">
          <ArrowUpDown size={16} className={theme === 'dark' ? 'text-white/50' : 'text-zinc-400'} />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={cn(
              "appearance-none",
              "text-sm py-1.5 pl-2 pr-8",
              "rounded-lg border",
              "bg-transparent backdrop-blur-sm",
              "focus:outline-none focus:ring-0",
              "transition-colors duration-200",
              theme === 'dark' 
                ? 'text-white border-white/10 bg-white/5 hover:bg-white/10'
                : 'text-zinc-900 border-zinc-200 bg-white/50 hover:bg-white/80'
            )}
          >
            {SORT_OPTIONS.map(option => (
              <option 
                key={option} 
                value={option}
                className={theme === 'dark' ? 'bg-zinc-900' : 'bg-white'}
              >
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={cn(
              "px-4 py-2 rounded-lg text-sm",
              "transition-colors duration-200",
              theme === 'dark'
                ? 'bg-white/10 text-white hover:bg-white/20 disabled:bg-white/5 disabled:text-white/50'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:bg-zinc-50 disabled:text-zinc-400'
            )}
          >
            Previous
          </button>
          <span className={cn(
            "px-4 py-2",
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          )}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={cn(
              "px-4 py-2 rounded-lg text-sm",
              "transition-colors duration-200",
              theme === 'dark'
                ? 'bg-white/10 text-white hover:bg-white/20 disabled:bg-white/5 disabled:text-white/50'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:bg-zinc-50 disabled:text-zinc-400'
            )}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}