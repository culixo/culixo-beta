import Image from "next/image"
import React from "react"
import { Clock, Heart, Eye, Edit2, Share2, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Recipe } from "@/types/my-kitchen"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface RecipeCardProps {
  recipe: Recipe
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onShare?: (id: string) => void
}

export default function RecipeCard({ 
  recipe, 
  onEdit, 
  onDelete, 
  onShare 
}: RecipeCardProps) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

  const { theme, systemTheme } = useTheme()
  const currentTheme = mounted ? theme : systemTheme
  const isDark = currentTheme === "dark"

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
      {/* Quick Actions Overlay */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
        <TooltipProvider>
          {onEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "h-8 w-8 p-0",
                    "flex items-center justify-center",
                    isDark 
                      ? "bg-zinc-800/90 hover:bg-zinc-800 border-zinc-700"
                      : "bg-white/90 hover:bg-white border-zinc-200",
                    "backdrop-blur-sm"
                  )}
                  onClick={() => onEdit(recipe.id)}
                >
                  <Edit2 className={cn(
                    "h-3.5 w-3.5",
                    isDark ? "text-emerald-400" : "text-emerald-500"
                  )} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Edit Recipe</TooltipContent>
            </Tooltip>
          )}
          
          {onShare && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "h-8 w-8 p-0",
                    "flex items-center justify-center",
                    isDark 
                      ? "bg-zinc-800/90 hover:bg-zinc-800 border-zinc-700"
                      : "bg-white/90 hover:bg-white border-zinc-200",
                    "backdrop-blur-sm"
                  )}
                  onClick={() => onShare(recipe.id)}
                >
                  <Share2 className={cn(
                    "h-3.5 w-3.5",
                    isDark ? "text-blue-400" : "text-blue-500"
                  )} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Share Recipe</TooltipContent>
            </Tooltip>
          )}

          {onDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className={cn(
                    "h-8 w-8 p-0",
                    "flex items-center justify-center",
                    isDark 
                      ? "bg-zinc-800/90 hover:bg-zinc-800 border-zinc-700"
                      : "bg-white/90 hover:bg-white border-zinc-200",
                    "backdrop-blur-sm"
                  )}
                  onClick={() => onDelete(recipe.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Delete Recipe</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>

      {/* Gradient Overlay for better icon visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Recipe Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardContent className={cn(
        "p-4",
        isDark ? "bg-card" : "bg-white"
      )}>
        <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">
          {recipe.title}
        </h3>
        
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-red-500" />
            <span>{recipe.likes}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            <span>{recipe.views}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {recipe.dietaryTags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary"
              className={cn(
                "bg-secondary/50 hover:bg-secondary/70",
                isDark && "bg-secondary/30"
              )}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className={cn(
        "p-4 pt-0",
        isDark ? "bg-card" : "bg-white"
      )}>
        <div className="flex items-center text-sm">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-4 w-4 ${
                    star <= recipe.rating 
                      ? "text-yellow-400" 
                      : isDark ? "text-zinc-700" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-muted-foreground">
              {recipe.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}