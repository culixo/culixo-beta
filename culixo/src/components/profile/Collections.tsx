// src/components/profile/Collections.tsx
"use client";

import { useState, useEffect } from "react";
import { type Collection, type CollectionWithRecipes } from "@/lib/api/collections";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderPlus, ChefHat } from "lucide-react";
import { CreateCollectionModal } from "./CreateCollectionModal";
import { collectionService } from "@/services/collectionService";
import { CollectionDetail } from "./CollectionDetail";
import Image from "next/image";

// Reusable header component
const HeaderSection = ({ title, buttonText, onButtonClick }: { 
  title: string; 
  buttonText: string; 
  onButtonClick: () => void; 
}) => (
  <div className="flex justify-between items-center">
    <h2 className="text-2xl font-semibold">{title}</h2>
    <Button onClick={onButtonClick}>
      {buttonText}
    </Button>
  </div>
);

interface CollectionsProps {
  userId: string;
}

export function Collections({ userId }: CollectionsProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const result = await collectionService.getUserCollections();
      setCollections(result.collections);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCollectionClick = (collection: Collection) => {
    setSelectedCollection(collection);
  };

  const handleBackToCollections = () => {
    setSelectedCollection(null);
  };

  if (selectedCollection) {
    return (
      <CollectionDetail 
        collectionId={selectedCollection.id}
        collectionName={selectedCollection.name}
        onBackClick={handleBackToCollections}
      />
    );
  }

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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FolderPlus className="w-12 h-12 mb-4 text-muted-foreground" />
        <p className="text-muted-foreground mb-4">No collections created yet</p>
        <Button onClick={() => setShowCreateModal(true)}>
          Create Collection
        </Button>
        <CreateCollectionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchCollections}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HeaderSection 
        title="Collections"
        buttonText="Create Collection"
        onButtonClick={() => setShowCreateModal(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <div
            key={collection.id}
            onClick={() => handleCollectionClick(collection)}
            className="cursor-pointer"
          >
            <Card className="group relative overflow-hidden h-[200px] bg-background-elevated border-border-primary hover:shadow-lg transition-all">
              {collection.cover_image ? (
                <Image
                  src={collection.cover_image}
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
                    <p className="text-sm text-white/80">{collection.recipe_count} recipes</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchCollections}
      />
    </div>
  );
}