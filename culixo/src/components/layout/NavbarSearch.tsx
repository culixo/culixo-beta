"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Search, Command } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function NavbarSearch() {
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={searchRef} className="relative w-[380px]">
      <div className={cn(
        "relative flex items-center w-full",
        "h-8 rounded-xl transition-all duration-200",
        theme === 'dark'
          ? 'bg-zinc-800/50'
          : 'bg-zinc-100/70',
        "ring-1",
        isFocused
          ? theme === 'dark'
            ? 'ring-zinc-600 bg-zinc-800/80'
            : 'ring-zinc-300 bg-zinc-100'
          : theme === 'dark'
            ? 'ring-zinc-700'
            : 'ring-zinc-200',
        "hover:ring-2",
        theme === 'dark'
          ? 'hover:ring-zinc-600'
          : 'hover:ring-zinc-300'
      )}>
        <div className={cn(
          "absolute left-3",
          theme === 'dark'
            ? 'text-zinc-400'
            : 'text-zinc-500'
        )}>
          <Search size={16} />
        </div>
        
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search recipes..."
          className={cn(
            "w-full h-full pl-9 pr-24",
            "bg-transparent rounded-xl",
            "text-[15px]",
            "focus:outline-none focus:ring-0",
            theme === 'dark'
              ? 'text-zinc-200 placeholder:text-zinc-500'
              : 'text-zinc-800 placeholder:text-zinc-400',
            "selection:bg-zinc-200 dark:selection:bg-zinc-700"
          )}
        />
      </div>

      {/* Suggestions dropdown */}
      {isFocused && (
        <div className={cn(
          "absolute left-0 right-0 mt-2 py-3",
          "rounded-xl shadow-lg",
          "ring-1",
          "backdrop-blur-xl",
          "z-50",
          "animate-in fade-in-0 slide-in-from-top-2 duration-200",
          theme === 'dark'
            ? 'bg-zinc-800/90 ring-zinc-700'
            : 'bg-white/90 ring-zinc-200'
        )}>
          {/* Recent Searches */}
          {!searchQuery && (
            <div className="px-2">
              <div className={cn(
                "px-3 mb-2 text-xs font-medium",
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
              )}>
                Recent searches
              </div>
              {['Homemade Pizza', 'Chocolate Cake', 'Pasta Carbonara'].map((item) => (
                <button
                  key={item}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-1.5",
                    "text-sm rounded-md",
                    "transition-colors duration-200",
                    theme === 'dark'
                      ? 'text-zinc-300 hover:bg-zinc-700/50'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  )}
                >
                  <Command size={14} className="opacity-50" />
                  {item}
                </button>
              ))}
            </div>
          )}

          {/* Search Results */}
          {searchQuery && (
            <div className="px-2">
              <div className={cn(
                "px-3 mb-2 text-xs font-medium",
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
              )}>
                Suggested recipes
              </div>
              {['Italian Pasta', 'Creamy Pasta', 'Pasta Salad'].map((item) => (
                <button
                  key={item}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2",
                    "text-sm rounded-md group",
                    "transition-colors duration-200",
                    theme === 'dark'
                      ? 'text-zinc-300 hover:bg-zinc-700/50'
                      : 'text-zinc-600 hover:bg-zinc-100'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Search size={14} className="opacity-50" />
                    {item}
                  </div>
                  <span className={cn(
                    "text-xs opacity-0 group-hover:opacity-100 transition-opacity",
                    theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'
                  )}>
                    View recipe →
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Categories */}
          <div className="mt-2 pt-2 px-2 border-t dark:border-zinc-700/50 border-zinc-200">
            <div className={cn(
              "px-3 mb-2 text-xs font-medium",
              theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
            )}>
              Quick categories
            </div>
            <div className="flex flex-wrap gap-2 px-3">
              {['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Vegan'].map((tag) => (
                <button
                  key={tag}
                  className={cn(
                    "px-2.5 py-1 text-xs rounded-md",
                    "transition-colors duration-200",
                    theme === 'dark'
                      ? 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}