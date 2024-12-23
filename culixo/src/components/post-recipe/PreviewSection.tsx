"use client";

import React, { useState } from "react";
import Image from 'next/image';
import {
  Clock,
  Users,
  ChefHat,
  Printer,
  Share2,
  Download,
  Edit2,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import type { StepComponentProps, RecipeFormData } from "@/types/post-recipe/recipe";
import SuccessModal from "./modal/SuccessModal";
import Cookies from 'js-cookie';

interface MetricCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number | undefined;
  className?: string;
}

// Helper Components
const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  title,
  value,
  className,
}) => (
  <Card className={className}>
    <CardContent className="p-4 flex items-center space-x-3">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-xl font-bold">{value ?? "-"}</p>
      </div>
    </CardContent>
  </Card>
);
const PreviewSection: React.FC<StepComponentProps> = ({
  formData,
  onNext,
  onPrevious,
  draftId
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedRecipeId, setPublishedRecipeId] = useState<string>("");
  const [publishError, setPublishError] = useState<string | null>(null);


  const formatRecipeData = (data: RecipeFormData) => {
    // Ensure ingredients are properly formatted
    const formattedIngredients = data.ingredients.map(ing => ({
      quantity: parseFloat(ing.quantity.toString()), // Ensure quantity is a number
      unit: ing.unit.trim(),
      name: ing.name.trim(),
      notes: ing.notes?.trim() || '',
      groupName: ing.groupName?.trim() || '',
      isOptional: ing.isOptional || false
    }));

    return {
      title: data.basicInfo.title,
      description: data.basicInfo.description,
      cuisine_type: data.basicInfo.cuisineType,
      course_type: data.basicInfo.courseType,
      difficulty_level: data.basicInfo.difficultyLevel,
      prep_time: data.basicInfo.prepTime,
      cook_time: data.basicInfo.cookTime,
      servings: data.basicInfo.servings,
      diet_category: data.basicInfo.dietCategories?.[0],
      ingredients: formattedIngredients, // Use formatted ingredients
      instructions: data.instructions.map(inst => ({
        id: inst.id,
        stepNumber: inst.stepNumber,
        instruction: inst.instruction,
        timing: inst.timing || null,
        mediaUrls: inst.mediaUrls || []
      })),
      media: {
        mainImage: data.media.mainImage || null,
        additionalImages: data.media.additionalImages || [],
        videoUrl: data.media.videoUrl || null
      },
      tags: data.tags || [],
      additional_info: {
        cookingTips: data.additionalInfo?.cookingTips || []
      }
    };
};

const handlePublish = async () => {
  try {
    setIsPublishing(true);
    setPublishError(null);

    const token = Cookies.get('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const endpoint = draftId 
      ? `${process.env.NEXT_PUBLIC_API_URL}/recipes/drafts/${draftId}/publish`
      : `${process.env.NEXT_PUBLIC_API_URL}/recipes`;

    // Format the current form data regardless of draft status
    const formattedData = formatRecipeData(formData);

    if (draftId) {
      console.log('Publishing from draft:', { 
        draftId,
        formData: formattedData
      });
    } else {
      console.log('Direct publishing');
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formattedData)
    });

    // Enhanced logging
    console.log('Publish response:', {
      status: response.status,
      statusText: response.statusText,
      endpoint,
      isDraft: Boolean(draftId)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to publish recipe: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      console.log('Recipe published successfully:', {
        newRecipeId: result.data.id,
        wasDraft: Boolean(draftId),
        publishedData: result.data
      });
      
      setPublishedRecipeId(result.data.id);
      setShowSuccessModal(true);
    } else {
      throw new Error(result.message || 'Failed to publish recipe');
    }
  } catch (error) {
    console.error("Error publishing recipe:", error);
    setPublishError(error instanceof Error ? error.message : 'Failed to publish recipe');
  } finally {
    setIsPublishing(false);  // Changed from setIsSaving to setIsPublishing
  }
};

  const handleModalClose = () => {
    setShowSuccessModal(false);
    onNext();
  };

  return (
    <TooltipProvider>
      <div className="max-w-[900px] mx-auto space-y-6 px-0">
        {/* Header with Action Buttons */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Preview Your Recipe</h2>
            <p className="text-muted-foreground">
              Review your recipe before publishing
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print Recipe</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share Recipe</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download Recipe</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Main Recipe Card */}
        <Card>
          {/* Hero Image */}
          <div className="aspect-video relative rounded-t-lg overflow-hidden">
            {formData.media.mainImage ? (
              <Image
                src={formData.media.mainImage}
                alt={formData.basicInfo.title ?? "Recipe preview"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No image uploaded</p>
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 opacity-90 hover:opacity-100 z-10"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Photo
            </Button>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Recipe Title and Description */}
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {formData.basicInfo.title}
              </h1>
              <p className="text-muted-foreground">
                {formData.basicInfo.description}
              </p>
            </div>

            {/* Recipe Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                icon={Clock}
                title="Prep Time"
                value={
                  formData.basicInfo.prepTime
                    ? `${formData.basicInfo.prepTime} min`
                    : "-"
                }
              />
              <MetricCard
                icon={Clock}
                title="Cook Time"
                value={
                  formData.basicInfo.cookTime
                    ? `${formData.basicInfo.cookTime} min`
                    : "-"
                }
              />
              <MetricCard
                icon={Users}
                title="Servings"
                value={formData.basicInfo.servings ?? "-"}
              />
              <MetricCard
                icon={ChefHat}
                title="Difficulty"
                value={formData.basicInfo.difficultyLevel ?? "-"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recipe Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cuisine Type</span>
                  <span className="font-medium capitalize">
                    {formData.basicInfo.cuisineType || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Course Type</span>
                  <span className="font-medium capitalize">
                    {formData.basicInfo.courseType || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Diet Category</span>
                  <span className="font-medium capitalize">
                    {/* {formData.basicInfo.dietCategory || "-"} */}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags & Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.tags && formData.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {formData.additionalInfo.cookingTips?.length > 0 && (
                <div className="pt-4">
                  <h4 className="font-medium mb-2">Cooking Tips</h4>
                  <ul className="space-y-2">
                    {formData.additionalInfo.cookingTips.map(
                      (tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Instructions Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Instructions</CardTitle>
            <Button variant="ghost" size="sm">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.instructions.map((step, index) => (
              <div key={index} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {step.stepNumber}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="break-words">{step.instruction}</p>
                    {step.timing && (
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {step.timing} minutes
                      </p>
                    )}
                  </div>
                </div>
                {step.mediaUrls && step.mediaUrls.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-12">
                    {step.mediaUrls.map((url, imgIndex) =>
                      url ? (
                        <div
                          key={imgIndex}
                          className="relative w-full aspect-video"
                        >
                          <Image
                            src={url}
                            alt={`Step ${step.stepNumber} photo ${
                              imgIndex + 1
                            }`}
                            fill
                            className="rounded-lg object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                          />
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Error Display */}
        {publishError && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
            {publishError}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="min-w-[120px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="default"
            onClick={handlePublish}
            disabled={isPublishing}
            className="min-w-[120px]"
          >
            {isPublishing ? (
              "Publishing..."
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Publish Recipe
              </>
            )}
          </Button>
        </div>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleModalClose}
          recipeId={publishedRecipeId}
          recipeTitle={formData.basicInfo.title || ""}
        />
      </div>
    </TooltipProvider>
  );
};

export default PreviewSection;