// src/components/ui/loading-spinner.tsx
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: number
}

export default function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 
        className={cn("animate-spin text-muted-foreground", className)} 
        size={size} 
      />
    </div>
  )
}