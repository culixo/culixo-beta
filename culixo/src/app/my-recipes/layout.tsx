'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export default function MyKitchenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? theme : systemTheme

  return (
    <div className={cn(
      "min-h-screen",
      currentTheme === "dark" ? "bg-background" : "bg-background"
    )}>
      <div className={cn(
        "fixed top-0 left-0 right-0 z-50",
        currentTheme === "dark" ? "bg-background" : "bg-background"
      )}>
      </div>
      <div className="pt-24">
        {mounted ? children : null}
      </div>
    </div>
  )
}