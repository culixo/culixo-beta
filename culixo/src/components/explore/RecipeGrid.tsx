"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { ArrowUpDown, ChefHat } from 'lucide-react'
import { RecipeCard } from '@/components/shared/RecipeCard'
import { useFilters } from '@/contexts/FilterContext'
import { recipeService } from '@/services/recipeService'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Recipe } from '@/lib/api/recipes'

// Types
interface PaginationState {
  totalPages: number
  totalRecipes: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Constants
const SORT_OPTIONS = [
  'Newest First',
  'Cooking Time',
  'Quick Recipes',
  'Difficulty Level'
] as const

const DEFAULT_PAGINATION: PaginationState = {
  totalPages: 1,
  totalRecipes: 0,
  hasNextPage: false,
  hasPreviousPage: false
}

// Components
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <Card 
        key={i}
        className="animate-pulse bg-background-inset border-border-primary"
      >
        <div className="aspect-video bg-muted" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-full" />
        </div>
      </Card>
    ))}
  </div>
)

const EmptyState = ({ hasFilters }: { hasFilters: boolean }) => (
  <div className="text-center py-12">
    <div className="inline-block p-4 rounded-full bg-background-elevated mb-4">
      <ChefHat className="w-8 h-8 text-muted-foreground" />
    </div>
    <p className="text-muted-foreground">
      {hasFilters 
        ? 'No recipes match your filters. Try adjusting your criteria.'
        : 'No recipes available at the moment.'}
    </p>
  </div>
)

export function RecipeGrid() {
  const { theme } = useTheme()
  const { activeFilters } = useFilters()
  const [sortBy, setSortBy] = useState<typeof SORT_OPTIONS[number]>(SORT_OPTIONS[0])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION)

  const handleRecipeInteraction = useCallback((recipeId: string, type: 'like' | 'save', newCount: number) => {
    setRecipes(prevRecipes => 
        prevRecipes.map(recipe => {
            if (recipe.id === recipeId) {
                console.log('Updating recipe state:', {
                    id: recipe.id,
                    type,
                    oldState: type === 'like' ? recipe.has_liked : recipe.has_saved,
                    newCount
                });
                
                return {
                    ...recipe,
                    ...(type === 'like' ? {
                        likes_count: newCount,
                        has_liked: !recipe.has_liked
                    } : {
                        saves_count: newCount,
                        has_saved: !recipe.has_saved
                    })
                };
            }
            return recipe;
        })
    );
  }, []);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await recipeService.getAllRecipes(currentPage, sortBy)
      console.log('Fetched recipes:', response.recipes); // Log the fetched recipes
      setRecipes(response.recipes)
      setPagination(response.pagination)
    } catch (err) {
      setError('Failed to load recipes. Please try again.')
      setRecipes([])
      setPagination(DEFAULT_PAGINATION)
    } finally {
      setLoading(false)
    }
  }, [currentPage, sortBy])

  // Initial load and refresh on dependencies change
  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  // Reset to first page when filters or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilters, sortBy])

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-block p-4 rounded-full bg-background-elevated mb-4">
          <ChefHat className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button
          onClick={fetchRecipes}
          className={cn(
            "inline-flex items-center justify-center rounded-md text-sm font-medium",
            "ring-offset-background transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            "bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          )}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with sorting */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {pagination.totalRecipes > 0 
            ? `Showing ${recipes.length} of ${pagination.totalRecipes} recipes`
            : 'No recipes found'}
        </p>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof SORT_OPTIONS[number])}
            className={cn(
              "bg-transparent text-sm py-1.5 pl-2 pr-8 rounded-lg",
              "border border-input hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {SORT_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {recipes.length === 0 ? (
        <EmptyState hasFilters={activeFilters.length > 0} />
      ) : (
        <>
          {/* Recipe Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                showAuthor={true}
                onInteraction={(type, count) => handleRecipeInteraction(recipe.id, type, count)}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={!pagination.hasPreviousPage}
                className={cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium",
                  "ring-offset-background transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                )}
              >
                Previous
              </button>
              <span className="flex items-center px-4">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={!pagination.hasNextPage}
                className={cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium",
                  "ring-offset-background transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                )}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}