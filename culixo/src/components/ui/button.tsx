import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  asChild?: boolean
}

export function buttonVariants({
  variant = 'default',
  size = 'md',
  className = '',
}: Partial<ButtonProps> = {}) {
  return cn(
    "rounded-md transition-all duration-200 font-medium flex items-center justify-center",
    // Variants
    {
      'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm': 
        variant === 'default',
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/90': 
        variant === 'outline',
      'hover:bg-accent/80 hover:text-accent-foreground active:bg-accent/90': 
        variant === 'ghost',
      'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 shadow-sm': 
        variant === 'destructive',
      'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90': 
        variant === 'secondary',
    },
    // Sizes
    {
      'h-9 px-3 text-sm': size === 'sm',
      'h-10 px-4': size === 'md',
      'h-11 px-8 text-lg': size === 'lg',
      'h-10 w-10 p-0': size === 'icon',
    },
    className
  )
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}