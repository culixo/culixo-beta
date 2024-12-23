"use client"

import { useEffect } from 'react'
import { useFilters } from '@/contexts/FilterContext'

function ExploreRecipesClient({ children }: { children: React.ReactNode }) {
  const { clearFilters } = useFilters()

  useEffect(() => {
    clearFilters()
  }, [clearFilters]) // Now safe to include clearFilters because it's memoized

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-16">
        {children}
      </div>
    </div>
  )
}

export default function ExploreRecipesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <ExploreRecipesClient>
        {children}
      </ExploreRecipesClient>
    </div>
  )
}