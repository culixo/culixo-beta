// src/components/my-kitchen/cards/CreateRecipeCard.tsx
import Link from "next/link"
import { Plus } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function CreateRecipeCard() {
  return (
    <Link href="/create-recipe">
      <Card className="group relative flex h-full min-h-[320px] cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed p-6 transition-colors hover:border-primary hover:bg-accent">
        <div className="rounded-full bg-secondary p-4 transition-colors group-hover:bg-primary">
          <Plus className="h-8 w-8 text-secondary-foreground transition-colors group-hover:text-primary-foreground" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold">Create New Recipe</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your culinary creations with the world
          </p>
        </div>
      </Card>
    </Link>
  )
}