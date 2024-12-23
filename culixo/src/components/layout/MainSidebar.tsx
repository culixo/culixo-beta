"use client"

import React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { 
  ChefHat,
  PlusCircle,
  Utensils,
  Users,
  Info,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import FilterSidebar from '@/components/explore/FilterSidebar'
import { useFilters } from '@/contexts/FilterContext'
import type { FilterType } from '@/contexts/FilterContext'

const NAV_ITEMS = [
  { icon: PlusCircle, label: 'Post Recipe', href: '/post-recipe' },
  { icon: Utensils, label: 'My Kitchen', href: '/my-kitchen' },
  { icon: Users, label: 'Community', href: '/community' },
  { icon: BookOpen, label: 'Cookbook', href: '/cookbook' },
  { icon: Info, label: 'About', href: '/about' }
]

export default function MainSidebar() {
  const { theme } = useTheme()
  const { activeFilters, setActiveFilters } = useFilters()
  const handleFilterChange = (newFilters: FilterType[]) => {
    setActiveFilters(newFilters)
  }

  return (
    <div className={cn(
      "h-full flex flex-col",
      theme === 'dark' ? 'bg-[#0C0C0C]' : 'bg-zinc-50'
    )}>
      {/* Logo Section */}
      <Link 
        href="/"
        className={cn(
          "flex items-center gap-2 px-6 py-8",
          "transition-colors hover:bg-white/5"
        )}
      >
        <ChefHat className="h-8 w-8 text-white" />
        <span className="text-xl font-semibold text-white">Culixo</span>
      </Link>

      {/* Main Navigation */}
      <nav className="px-3 mb-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg",
              "text-sm transition-colors",
              theme === 'dark'
                ? 'text-white/70 hover:text-white hover:bg-white/5'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            )}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="px-6 mb-6">
        <div className={cn(
          "h-px w-full",
          theme === 'dark' ? 'bg-white/10' : 'bg-zinc-200'
        )} />
      </div>

      {/* Filters Section */}
      <div className="flex-1 overflow-hidden">
        <FilterSidebar 
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  )
}