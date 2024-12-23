"use client"

import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import { Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterSections {
  [key: string]: string[];
}

interface FilterType {
  id: number;
  type: string;
  value: string;
}

interface FilterSidebarProps {
    activeFilters: FilterType[];
    onFilterChange: (filters: FilterType[]) => void;
}

const FILTER_SECTIONS: FilterSections = {
  'Cuisine Type': [
    'Italian',
    'Indian',
    'Chinese',
    'Japanese',
    'Mexican',
    'Thai',
    'Mediterranean',
    'French',
    'Korean',
    'Vietnamese',
    'American',
    'Greek'
  ],
  'Dietary': [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Keto',
    'Low-Carb',
    'Paleo',
    'Whole30',
    'Sugar-Free',
    'Nut-Free',
    'Kosher',
    'Halal'
  ],
  'Meal Type': [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
    'Dessert',
    'Appetizer',
    'Soup',
    'Salad',
    'Beverage',
    'Brunch'
  ],
  'Cooking Time': [
    'Under 15 mins',
    '15-30 mins',
    '30-45 mins',
    '45-60 mins',
    '1-2 hours',
    'Over 2 hours'
  ],
  'Difficulty': [
    'Easy',
    'Medium',
    'Hard',
    'Expert'
  ]
}

// Map section names to filter types
const SECTION_TO_TYPE: { [key: string]: string } = {
  'Cuisine Type': 'cuisine',
  'Dietary': 'diet',
  'Meal Type': 'mealType',
  'Cooking Time': 'cookingTime',
  'Difficulty': 'difficulty'
}

export default function FilterSidebar({ activeFilters, onFilterChange }: FilterSidebarProps) {
  const { theme } = useTheme()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const toggleFilter = (section: string, value: string) => {
    const type = SECTION_TO_TYPE[section]
    const existingFilter = activeFilters.find(f => f.value === value && f.type === type)
    
    if (existingFilter) {
      // Remove filter if it exists
      const newFilters = activeFilters.filter(f => f.id !== existingFilter.id)
      onFilterChange(newFilters)
    } else {
      // Add new filter
      const newFilter: FilterType = {
        id: Date.now(), // Use timestamp as unique ID
        type,
        value
      }
      onFilterChange([...activeFilters, newFilter])
    }
  }

  const isFilterActive = (section: string, value: string) => {
    const type = SECTION_TO_TYPE[section]
    return activeFilters.some(f => f.type === type && f.value === value)
  }

  const resetFilters = () => {
    onFilterChange([])
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed at top */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className={theme === 'dark' ? 'text-white' : 'text-zinc-900'} />
          <span className={cn(
            "font-medium",
            theme === 'dark' ? 'text-white' : 'text-zinc-900'
          )}>
            Filters
          </span>
        </div>
        <button
          onClick={resetFilters}
          className={cn(
            "text-sm px-2 py-1 rounded-lg transition-colors",
            theme === 'dark' 
              ? 'text-white/70 hover:text-white hover:bg-white/10' 
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          )}
        >
          Reset
        </button>
      </div>

      {/* Scrollable Filter Sections */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2 space-y-1">
        {Object.entries(FILTER_SECTIONS).map(([section, options]) => (
          <div key={section} className="select-none">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section)}
              className={cn(
                "w-full px-2 py-2.5",
                "flex items-center justify-between",
                "rounded-lg text-sm transition-colors",
                theme === 'dark'
                  ? 'text-white hover:bg-white/5'
                  : 'text-zinc-900 hover:bg-zinc-100',
              )}
            >
              <span className="font-medium">{section}</span>
              {expandedSections.has(section) 
                ? <ChevronUp size={16} className="opacity-60" />
                : <ChevronDown size={16} className="opacity-60" />
              }
            </button>

            {/* Options */}
            {expandedSections.has(section) && (
              <div className={cn(
                "mt-1 mb-2 px-2 space-y-1",
                "animate-in slide-in-from-top-2 duration-200"
              )}>
                {options.map((option) => (
                  <label
                    key={option}
                    className={cn(
                      "flex items-center gap-3 w-full px-2 py-1.5 rounded-lg",
                      "cursor-pointer transition-colors",
                      theme === 'dark'
                        ? 'text-white/70 hover:bg-white/5'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isFilterActive(section, option)}
                      onChange={() => toggleFilter(section, option)}
                      className={cn(
                        "h-4 w-4 rounded",
                        "border-2 transition-colors",
                        theme === 'dark' 
                          ? 'bg-transparent border-white/20 checked:border-white/70' 
                          : 'border-zinc-300 checked:border-zinc-700',
                        "focus:ring-0 focus:ring-offset-0"
                      )}
                    />
                    <span className="text-sm flex-1 truncate">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}