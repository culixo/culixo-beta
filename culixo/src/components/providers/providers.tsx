"use client"

import { FilterProvider } from "@/contexts/FilterContext"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FilterProvider>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </FilterProvider>
  )
}