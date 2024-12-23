// src/components/recipe-view/RecipeView.tsx

"use client";

import React from "react";
import Image from 'next/image';
import {
  Clock,
  ChefHat,
  Camera,
  Info,
  Search,
  Bookmark,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { DraftResponseData } from "@/types/post-recipe/recipe";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import NutritionCard from "./NutritionCard";

interface RecipeViewProps {
  recipe: DraftResponseData;
  author: {
    id: string;
    name: string;
    image?: string;
  };
}

const RecipeView = ({ recipe, author }: RecipeViewProps) => {

  // Combine all recipe images
  const allImages = [
    recipe.media?.mainImage,
    ...(recipe.media?.additionalImages || []),
    ...(recipe.instructions?.flatMap((i) => i.mediaUrls) || []),
  ].filter(Boolean) as string[];

  return (
    <>
      {/* Full-width Hero Section */}
      <div className="w-full">
        <div className="relative h-[60vh] overflow-hidden">
          <Image
            src={recipe.media?.mainImage ?? "/api/placeholder/1200/800"}
            alt={recipe.title}
            width={1200}
            height={800}
            className="w-full h-full object-cover"
            priority // Add priority since it's above the fold
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

          {/* Save Recipe Button - Top Right */}
          <div className="absolute top-6 right-6">
            <Button
              variant="outline"
              className="bg-black/20 hover:bg-black/40 text-white border-white/30"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Save Recipe
            </Button>
          </div>

          {/* Content Container */}
          <div className="absolute inset-x-0 bottom-0 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Recipe Title */}
              <h1
                className="font-serif text-4xl md:text-5xl text-white leading-tight max-w-4xl"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 300,
                }}
              >
                {recipe.title}
              </h1>

              {/* Description */}
              <p
                className="text-xl text-gray-200 leading-relaxed max-w-3xl"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                }}
              >
                {recipe.description}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-white/30">
                  <AvatarImage src={author?.image} alt={author?.name} />
                  <AvatarFallback>
                    {(author?.name || "U")?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-white">
                  <p className="text-sm font-medium">
                    {author?.name || "Unknown Chef"}
                  </p>
                  <p className="text-xs text-gray-300">Chef</p>
                </div>
              </div>

              {/* Posted Date */}
              <p className="text-sm text-gray-300">
                Posted on{" "}
                {new Date(recipe.created_at).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {recipe.tags?.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-white/10 hover:bg-white/20 text-white text-xs border-none"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contained Content Section */}
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metric Cards Section with spacing */}
        <div className="py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Prep Time
                    </p>
                    <p className="text-2xl font-bold">{recipe.prep_time} Min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Cook Time
                    </p>
                    <p className="text-2xl font-bold">{recipe.cook_time} Min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Servings
                    </p>
                    <p className="text-2xl font-bold">{recipe.servings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Difficulty
                    </p>
                    <p className="text-2xl font-bold">
                      {recipe.difficulty_level}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Ingredients & Instructions */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="ingredients" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                </TabsList>

                <TabsContent value="ingredients" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ingredients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm">{index + 1}</span>
                            </div>
                            <span>
                              <span className="font-medium">
                                {ingredient.quantity} {ingredient.unit}
                              </span>{" "}
                              {ingredient.name}
                              {ingredient.notes && (
                                <span className="text-muted-foreground ml-1">
                                  ({ingredient.notes})
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="instructions" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Instructions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {recipe.instructions.map((step, index) => (
                        <div key={index} className="space-y-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-medium">
                                {step.stepNumber}
                              </span>
                            </div>
                            <div className="space-y-2">
                              <p className="text-base">{step.instruction}</p>
                              {step.timing && (
                                <p className="text-sm text-muted-foreground flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {step.timing} minutes
                                </p>
                              )}
                            </div>
                          </div>
                          {step.mediaUrls && step.mediaUrls.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 ml-12">
                              {step.mediaUrls.map((url, imgIndex) => (
                                <Dialog key={imgIndex}>
                                  <DialogTrigger>
                                    <div className="relative group cursor-pointer">
                                      <Image
                                        src={url}
                                        alt={`Step ${step.stepNumber} photo ${
                                          imgIndex + 1
                                        }`}
                                        width={800}
                                        height={450}
                                        className="rounded-lg w-full aspect-video object-cover transition-transform group-hover:scale-105"
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                        <Search className="h-6 w-6 text-white" />
                                      </div>
                                    </div>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <Image
                                      src={url}
                                      alt={`Step ${step.stepNumber} photo ${
                                        imgIndex + 1
                                      }`}
                                      width={1200}
                                      height={800}
                                      className="w-full rounded-lg"
                                    />
                                  </DialogContent>
                                </Dialog>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Nutrition & Gallery */}
            <div className="space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Nutrition Card */}
                <NutritionCard nutritionalInfo={recipe.nutritional_info} />

                {/* Recipe Gallery */}
                {allImages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Recipe Gallery
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="w-full whitespace-nowrap rounded-md">
                        <div className="flex w-max space-x-4 p-4">
                          {allImages.map((image, index) => (
                            <Dialog key={index}>
                              <DialogTrigger>
                                <div className="relative group cursor-pointer">
                                  <Image
                                    src={image}
                                    alt={`Recipe image ${index + 1}`}
                                    width={160}
                                    height={160}
                                    className="h-40 w-40 rounded-md object-cover transition-transform group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                    <Search className="h-6 w-6 text-white" />
                                  </div>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <Image
                                  src={image}
                                  alt={`Recipe image ${index + 1}`}
                                  width={1200}
                                  height={800}
                                  className="w-full rounded-lg"
                                />
                              </DialogContent>
                            </Dialog>
                          ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}

                {/* Cooking Tips */}
                {recipe.additional_info?.cookingTips &&
                  recipe.additional_info.cookingTips.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ChefHat className="h-5 w-5" />
                          Cooking Tips
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {recipe.additional_info.cookingTips.map(
                            (tip, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <Info className="h-5 w-5 text-muted-foreground mt-1" />
                                <span>{tip}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeView;
