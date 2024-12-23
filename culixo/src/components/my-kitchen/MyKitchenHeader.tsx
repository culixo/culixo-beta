// src/components/my-kitchen/MyKitchenHeader.tsx
import { 
    Search, 
    Grid, 
    List, 
    SlidersHorizontal,
    BookOpen,
    Bookmark,
    Users,
    UserPlus,
    Clock,
    TrendingUp,
    AlignLeft
  } from "lucide-react"
  import { Input } from "@/components/ui/input"
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
  } from "@/components/ui/dropdown-menu"
  import { useMyKitchen } from "@/contexts/MyKitchenContext"
  import { cn } from "@/lib/utils"
  import { motion } from "framer-motion"
  import { Separator } from "@/components/ui/separator"
  
  export default function MyKitchenHeader() {
    const { state, dispatch } = useMyKitchen()
  
    const stats = [
      { 
        label: "Total Recipes", 
        value: 28, 
        icon: BookOpen,
        color: "text-blue-500",
      },
      { 
        label: "Saved Recipes", 
        value: 156, 
        icon: Bookmark,
        color: "text-purple-500",
      },
      { 
        label: "Following", 
        value: 234, 
        icon: Users,
        color: "text-green-500",
      },
      { 
        label: "Followers", 
        value: 892, 
        icon: UserPlus,
        color: "text-pink-500",
      },
    ]
  
    return (
      <div className="space-y-6">
        {/*Header Title*/}
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-28 pt-4">
          <div className="relative">
            <h1 className="text-2xl font-semibold tracking-tight">
              John&apos;s Kitchen
            </h1>
            <p className="text-sm text-muted-foreground/80 mt-0.5">
              Your personal cooking space
            </p>
          </div>
        </div>

        {/* Stats with centered content and separators */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.02 }}
              className="group rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    "mb-3 rounded-lg p-2.5 transition-colors group-hover:bg-background",
                    stat.color
                  )}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <Separator className="my-2 w-8" />
                <p className="flex flex-col items-center">
                  <span className="text-3xl font-semibold tracking-tight">
                    {stat.value.toLocaleString()}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters with better alignment */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg bg-card p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search in My Kitchen..."
              className="pl-10 bg-background"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => dispatch({ type: "SET_VIEW", payload: "grid" })}
              className={cn(
                "h-10 w-10 transition-colors flex items-center justify-center",
                state.view === "grid"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-accent"
              )}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => dispatch({ type: "SET_VIEW", payload: "list" })}
              className={cn(
                "h-10 w-10 transition-colors flex items-center justify-center",
                state.view === "list"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-accent"
              )}
            >
              <List className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 flex items-center justify-center gap-2 px-4"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() =>
                    dispatch({ type: "SET_SORT", payload: "recent" })
                  }
                  className="flex items-center"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Recently Added</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    dispatch({ type: "SET_SORT", payload: "popular" })
                  }
                  className="flex items-center"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <span>Most Popular</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    dispatch({ type: "SET_SORT", payload: "alphabetical" })
                  }
                  className="flex items-center"
                >
                  <AlignLeft className="mr-2 h-4 w-4" />
                  <span>Alphabetical</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    dispatch({ type: "SET_SORT", payload: "cookingTime" })
                  }
                  className="flex items-center"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Cooking Time</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  }