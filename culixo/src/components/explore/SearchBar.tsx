"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SearchBar() {
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

  const handleClear = () => {
    setSearchQuery('')
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <div className={cn(
      "relative flex items-center w-full",
      "rounded-full transition-all duration-200",
      isFocused
        ? theme === 'dark'
          ? 'bg-white/10'
          : 'bg-zinc-100'
        : theme === 'dark'
          ? 'bg-white/5'
          : 'bg-zinc-100/50',
      "hover:bg-white/10 dark:hover:bg-white/10"
    )}>
      <div className={cn(
        "absolute left-3",
        theme === 'dark' ? 'text-white/50' : 'text-zinc-400'
      )}>
        <Search size={16} />
      </div>
        
      <input 
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder="Search recipes, ingredients, or cuisines..."
        className={cn(
          "w-full py-2 pl-9 pr-9",
          "bg-transparent rounded-full",
          "text-sm placeholder:text-sm",
          "focus:outline-none focus:ring-0",
          theme === 'dark' 
            ? 'text-white placeholder:text-white/50'
            : 'text-zinc-900 placeholder:text-zinc-400'
        )}
      />

        {searchQuery && (
          <button
            onClick={handleClear}
            className={cn(
              "absolute right-4",
              "p-1 rounded-full",
              "transition-colors duration-200",
              theme === 'dark'
                ? 'text-white/50 hover:text-white hover:bg-white/10'
                : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100'
            )}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search suggestions dropdown */}
      {isFocused && searchQuery && (
        <div className={cn(
          "absolute left-0 right-0 mt-2 py-2",
          "rounded-xl shadow-lg",
          "z-50",
          "animate-in fade-in-0 slide-in-from-top-2 duration-200",
          theme === 'dark'
            ? 'bg-[#1C1C1C] border border-white/10'
            : 'bg-white border border-zinc-200'
        )}>
          {/* Recent searches */}
          <div className="px-2">
            <div className={cn(
              "px-2 py-1.5 text-xs font-medium",
              theme === 'dark' ? 'text-white/50' : 'text-zinc-500'
            )}>
              Recent searches
            </div>
            {['Italian pasta', 'Vegetarian recipes', 'Quick dinner'].map((item) => (
              <button
                key={item}
                className={cn(
                  "flex items-center gap-3 w-full px-2 py-2",
                  "text-sm rounded-lg",
                  "transition-colors duration-200",
                  theme === 'dark'
                    ? 'text-white hover:bg-white/5'
                    : 'text-zinc-900 hover:bg-zinc-50'
                )}
              >
                <Search size={14} className="opacity-50" />
                {item}
              </button>
            ))}
          </div>

          {/* Popular searches */}
          <div className="px-2 mt-2 pt-2 border-t dark:border-white/5">
            <div className={cn(
              "px-2 py-1.5 text-xs font-medium",
              theme === 'dark' ? 'text-white/50' : 'text-zinc-500'
            )}>
              Popular searches
            </div>
            {['Chicken recipes', 'Healthy meals', 'Desserts'].map((item) => (
              <button
                key={item}
                className={cn(
                  "flex items-center gap-3 w-full px-2 py-2",
                  "text-sm rounded-lg",
                  "transition-colors duration-200",
                  theme === 'dark'
                    ? 'text-white hover:bg-white/5'
                    : 'text-zinc-900 hover:bg-zinc-50'
                )}
              >
                <Search size={14} className="opacity-50" />
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}