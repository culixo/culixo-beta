"use client"

import React, { createContext, useContext, useState, useCallback, Dispatch, SetStateAction } from 'react'

export type FilterType = {
  id: number
  type: string
  value: string
}

interface FilterContextType {
  activeFilters: FilterType[]
  setActiveFilters: Dispatch<SetStateAction<FilterType[]>>
  removeFilter: (filterId: number) => void
  clearFilters: () => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([])

  const removeFilter = useCallback((filterId: number) => {
    setActiveFilters(filters => filters.filter(f => f.id !== filterId))
  }, [])

  const clearFilters = useCallback(() => {
    setActiveFilters([])
  }, [])

  const value = {
    activeFilters,
    setActiveFilters,
    removeFilter,
    clearFilters
  }

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters(): FilterContextType {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider')
  }
  return context
}