// src/components/profile/Collections.tsx
"use client";

import { Collection } from "@/types/profile/collection";
import { Card } from "@/components/ui/card";
import { FolderPlus, Lock, ChefHat } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CollectionsProps {
  collections: Collection[];
  isLoading?: boolean;
}

export function Collections({ collections, isLoading }: CollectionsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className="animate-pulse bg-background-inset border-border-primary h-[200px]"
          />
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <FolderPlus className="w-12 h-12 mb-4" />
        <p>No collections created yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <Link key={collection.id} href={`/collections/${collection.id}`}>
          <Card className="group relative overflow-hidden h-[200px] bg-background-elevated border-border-primary hover:shadow-lg transition-all">
            {collection.coverImage ? (
              <Image
                src={collection.coverImage}
                alt={collection.name}
                fill
                className="object-cover brightness-[0.7] group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 bg-background-inset flex items-center justify-center">
                <ChefHat className="w-12 h-12 text-muted-foreground" />
              </div>
            )}

            <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent">
              <div className="flex items-center justify-between text-white gap-2">
                <div>
                  <h3 className="font-semibold text-lg">{collection.name}</h3>
                  <p className="text-sm text-white/80">{collection.recipeCount} recipes</p>
                </div>
                {collection.isPrivate && (
                  <Lock className="w-4 h-4 text-white/80" />
                )}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}