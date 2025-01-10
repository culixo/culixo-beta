// src/app/explore-recipes/layout.tsx
"use client"

import { FilterProvider } from '@/contexts/FilterContext'
import { AuthModal } from '@/components/auth/AuthModal'
import { ExploreRecipesLayout } from '@/components/explore/ExploreRecipesLayout'

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FilterProvider>
      <div className="min-h-screen pt-16">
        <ExploreRecipesLayout>
          {children}
        </ExploreRecipesLayout>
        <AuthModal />
      </div>
    </FilterProvider>
  )
}