"use client"

import React from 'react'
import { useTheme } from 'next-themes'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterTagProps {
  filter: {
    id: number
    type: string
    value: string
  }
  onRemove: () => void
}

export default function FilterTag({ filter, onRemove }: FilterTagProps) {
  const { theme } = useTheme()

  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full text-sm",
        theme === 'dark'
          ? 'bg-white/10 text-white'
          : 'bg-zinc-100 text-zinc-700'
      )}
    >
      <span className="text-xs opacity-70">
        {filter.type}:
      </span>
      {filter.value}
      <button
        onClick={onRemove}
        className={cn(
          "ml-1 p-0.5 rounded-full hover:bg-black/20",
          theme === 'dark' ? 'hover:bg-white/20' : 'hover:bg-zinc-200'
        )}
      >
        <X size={14} />
      </button>
    </div>
  )
}