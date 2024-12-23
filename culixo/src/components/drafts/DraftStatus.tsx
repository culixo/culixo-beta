// src/components/drafts/DraftStatus.tsx
import { DraftStatus as DraftStatusType } from '@/types/post-recipe/draft'
import { Check, CloudOff, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DraftStatusProps {
  status: DraftStatusType
  className?: string
}

export function DraftStatus({ status, className }: DraftStatusProps) {
  const statusConfig = {
    saving: {
      icon: Loader2,
      text: 'Saving...',
      className: 'text-yellow-500 dark:text-yellow-400 animate-spin'
    },
    saved: {
      icon: Check,
      text: 'Saved',
      className: 'text-green-500 dark:text-green-400'
    },
    error: {
      icon: AlertCircle,
      text: 'Error saving',
      className: 'text-red-500 dark:text-red-400'
    },
    offline: {
      icon: CloudOff,
      text: 'Offline',
      className: 'text-gray-500 dark:text-gray-400'
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={cn('flex items-center gap-1.5 text-sm', className)}>
      <Icon className={cn('h-4 w-4', config.className)} />
      <span className={config.className}>{config.text}</span>
    </div>
  )
}