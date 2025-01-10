// src/components/explore/ExploreRecipesLayout.tsx
"use client"

import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import { Filter, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import SearchBar from './SearchBar'
import FilterSidebar from './FilterSidebar'
import FilterTag from './FilterTag'
import { useFilters } from '@/contexts/FilterContext'
import type { FilterType } from '@/contexts/FilterContext'

interface ExploreRecipesLayoutProps {
  children: React.ReactNode
}

export function ExploreRecipesLayout({ children }: ExploreRecipesLayoutProps) {
  const { theme } = useTheme()
  const { activeFilters, setActiveFilters, removeFilter, clearFilters } = useFilters()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleFilterChange = (newFilters: FilterType[]) => {
    setActiveFilters(newFilters)
  }

  return (
    <div className="flex">
      {/* Fixed Sidebar - Desktop */}
      <aside className={cn(
        "w-64 hidden lg:block fixed inset-y-16 left-0",
        "border-r overflow-hidden",
        theme === 'dark' ? 'bg-background border-white/10' : 'bg-white border-zinc-200'
      )}>
        <div className="h-full overflow-y-auto">
          <FilterSidebar 
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Sticky Search Section */}
        <div className={cn(
          "sticky top-16 z-40",
          theme === 'dark' 
            ? 'bg-black/10 backdrop-blur-md border-b border-white/10' 
            : 'bg-white/70 backdrop-blur-md border-b border-zinc-200'
        )}>
          <div className="max-w-[2000px] mx-auto px-4">
            {/* Mobile Filters Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className={cn(
                  "w-full px-4 py-2 rounded-lg",
                  "flex items-center justify-center gap-2",
                  "text-sm font-medium",
                  theme === 'dark'
                    ? 'bg-[#1C1C1C] text-white hover:bg-[#252525]'
                    : 'bg-white text-zinc-700 hover:bg-zinc-50'
                )}
              >
                <Filter size={16} />
                Filters
              </button>
            </div>

            {/* Search Bar */}
            <SearchBar />

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-wrap gap-2 flex-1">
                    {activeFilters.map(filter => (
                      <FilterTag
                        key={filter.id}
                        filter={filter}
                        onRemove={() => removeFilter(filter.id)}
                      />
                    ))}
                  </div>
                  <button
                    onClick={clearFilters}
                    className={cn(
                      "text-sm whitespace-nowrap",
                      theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                    )}
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recipe Grid Content */}
        <div className="max-w-[2000px] mx-auto p-4">
          {children}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div 
            className={cn(
              "fixed inset-y-16 left-0 z-50 w-full max-w-xs",
              "animate-in slide-in-from-left",
              theme === 'dark' ? 'bg-[#0C0C0C]' : 'bg-white'
            )}
          >
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-zinc-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Filter size={20} className={theme === 'dark' ? 'text-white' : 'text-zinc-900'} />
                  <h2 className={cn(
                    "text-lg font-semibold",
                    theme === 'dark' ? 'text-white' : 'text-zinc-900'
                  )}>
                    Filters
                  </h2>
                </div>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className={cn(
                    "p-2 rounded-full",
                    theme === 'dark' 
                      ? 'text-white/70 hover:bg-white/10' 
                      : 'text-zinc-600 hover:bg-zinc-100'
                  )}
                >
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}