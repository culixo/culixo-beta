// src/components/my-kitchen/cards/CollectionCard.tsx
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Lock, Unlock } from "lucide-react"
import { Collection } from "@/types/my-kitchen"

interface CollectionCardProps {
  collection: Collection
  onClick?: (id: string) => void
}

export default function CollectionCard({ collection, onClick }: CollectionCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={() => onClick?.(collection.id)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={collection.coverImage}
          alt={collection.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-white/90">
              {collection.recipeCount} recipes
            </span>
            {collection.isPrivate ? (
              <Badge variant="outline" className="border-white/30 text-white">
                <Lock className="mr-1 h-3 w-3" />
                Private
              </Badge>
            ) : (
              <Badge variant="outline" className="border-white/30 text-white">
                <Unlock className="mr-1 h-3 w-3" />
                Public
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          Last updated {collection.lastUpdated}
        </div>
      </div>
    </Card>
  )
}