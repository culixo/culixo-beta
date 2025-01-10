// src/app/profile/[id]/collections/page.tsx
import { notFound } from "next/navigation";
import { Collections } from "@/components/profile/Collections";
import type { Collection } from "@/types/profile/collection";

// This is a mock function - replace with your actual data fetching
async function getProfileCollections(userId: string): Promise<{ collections: Collection[] }> {
  // You would typically fetch this from your API
  return {
    collections: [
      {
        id: "1",
        name: "Indian Favorites",
        description: "My collection of favorite Indian recipes",
        coverImage: "/placeholder-collection.jpg",
        recipeCount: 12,
        isPrivate: false,
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Quick Meals",
        description: "30-minute recipes for busy days",
        coverImage: "/placeholder-collection-2.jpg",
        recipeCount: 8,
        isPrivate: false,
        createdAt: new Date().toISOString()
      }
    ]
  };
}

export default async function CollectionsPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const { collections } = await getProfileCollections(params.id);

    return (
      <div className="animate-fade-in-up">
        <Collections collections={collections} />
      </div>
    );
  } catch (error) {
    return notFound();
  }
}