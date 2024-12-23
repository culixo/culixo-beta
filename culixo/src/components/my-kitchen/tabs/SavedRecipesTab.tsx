import { useMyKitchen } from "@/contexts/MyKitchenContext"
import RecipeCard from "../cards/RecipeCard"
import { Button } from "@/components/ui/button"
import { Grid, List, FolderOpen, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Mock saved recipes data
const mockSavedRecipes = [
  {
    id: "3",
    title: "Garlic Bread",
    image: "/images/recipes/garlic-bread.jpg",
    cookingTime: 30,
    rating: 4.7,
    views: 850,
    likes: 230,
    dietaryTags: ["Italian", "Lunch"],
    createdAt: "2024-03-12",
    updatedAt: "2024-03-12",
    userId: "user2"
  },
  {
    id: "4",
    title: "Chocolate Milkshake",
    image: "/images/recipes/chocolate-shake.jpg",
    cookingTime: 180,
    rating: 4.9,
    views: 1100,
    likes: 289,
    dietaryTags: ["French", "Dessert"],
    createdAt: "2024-03-08",
    updatedAt: "2024-03-08",
    userId: "user3"
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

interface SavedRecipesTabProps {
    onTabChange?: (value: string) => void;
  }

  export default function SavedRecipesTab({ onTabChange }: SavedRecipesTabProps) {
    const { state, dispatch } = useMyKitchen()

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header Section with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className={cn(
              "h-9 px-4",
              "flex items-center justify-center gap-2",
              "hover:bg-primary hover:text-primary-foreground"
            )}
            onClick={() => onTabChange?.("collections")}
          >
            <FolderOpen className="h-4 w-4" />
            <span>View Collections</span>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-9 w-9",
              "flex items-center justify-center",
              "hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: "SET_VIEW", payload: "grid" })}
            className={cn(
              "h-9 w-9",
              "flex items-center justify-center",
              state.view === "grid" 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted hover:text-foreground"
            )}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch({ type: "SET_VIEW", payload: "list" })}
            className={cn(
              "h-9 w-9",
              "flex items-center justify-center",
              state.view === "list" 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted hover:text-foreground"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Recipes Grid */}
      <motion.div 
        variants={container}
        className={cn(
          "grid gap-6",
          state.view === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        )}
      >
        {mockSavedRecipes.map((recipe) => (
          <motion.div key={recipe.id} variants={item}>
            <RecipeCard
              recipe={recipe}
              onShare={(id) => console.log("Share recipe:", id)}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Empty State */}
      {mockSavedRecipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <FolderOpen className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Saved Recipes Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Start exploring and save your favorite recipes to access them quickly later
          </p>
        </div>
      )}
    </motion.div>
  )
}