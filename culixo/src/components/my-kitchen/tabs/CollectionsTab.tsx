// src/components/my-kitchen/tabs/CollectionsTab.tsx
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import CollectionCard from "../cards/CollectionCard"

// Mock collections data
const mockCollections = [
  {
    id: "1",
    name: "Italian Favorites",
    coverImage: "/api/placeholder/600/400",
    recipeCount: 12,
    lastUpdated: "2 days ago",
    isPrivate: false,
    userId: "user1"
  },
  {
    id: "2",
    name: "Quick Weeknight Meals",
    coverImage: "/api/placeholder/600/400",
    recipeCount: 8,
    lastUpdated: "1 week ago",
    isPrivate: true,
    userId: "user1"
  }
]

export default function CollectionsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Collection
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockCollections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            onClick={(id) => console.log("Open collection:", id)}
          />
        ))}
      </div>
    </div>
  )
}