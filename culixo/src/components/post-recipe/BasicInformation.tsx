'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import type { StepComponentProps, BasicRecipeInfo } from '@/types/post-recipe/recipe';

const cuisineTypes = [
  'Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 'French', 'Mediterranean', 'American', 'Korean', 'Greek', 'Vietnamese', 'Other'
] as const;

const courseTypes = [
  'Breakfast', 'Lunch', 'Dinner', 'Appetizer', 'Dessert', 'Snack', 'Beverage', 'Soup', 'Salad', 'Brunch'
] as const;

const dietCategories = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Low-Carb', 'Whole30', 'Sugar-Free', 'Nut-Free', 'Kosher', 'Halal'
] as const;

const difficultyLevels = [
  'Easy', 'Medium', 'Hard', 'Expert'
] as const;

const BasicInformation: React.FC<StepComponentProps> = ({ 
    formData, 
    setFormData, 
    onNext,
  }) => {
    const handleChange = (field: keyof BasicRecipeInfo, value: BasicRecipeInfo[typeof field]) => {
      setFormData(prev => ({
        ...prev,
        basicInfo: {
          ...prev.basicInfo,
          [field]: value
        }
      }));
    };

  // Custom dropdown content component with scrolling for long lists
  const DropdownContent = ({ items }: { items: readonly string[] }) => (
    <SelectContent>
      <ScrollArea className="h-[200px]">
        {items.map((item) => (
          <SelectItem key={item} value={item.toLowerCase()}>
            {item}
          </SelectItem>
        ))}
      </ScrollArea>
    </SelectContent>
  );

  // Simple dropdown content for short lists
  const SimpleDropdownContent = ({ items }: { items: readonly string[] }) => (
    <SelectContent>
      {items.map((item) => (
        <SelectItem key={item} value={item.toLowerCase()}>
          {item}
        </SelectItem>
      ))}
    </SelectContent>
  );

  return (
    <Card className="w-full">
      <CardContent className="space-y-8 pt-6 animate-fade-in-up">
        <div className="grid gap-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              Recipe Title<span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter your recipe title"
              className="h-12 text-lg"
              value={formData.basicInfo.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description/Story
              <span className="text-sm text-gray-500 ml-2">(Optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Share the story behind your recipe or add some helpful tips..."
              className="min-h-[120px] resize-none"
              value={formData.basicInfo.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Cuisine, Course, Diet Types, and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cuisine" className="text-base font-medium">
                Cuisine Type<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.basicInfo.cuisineType || ""}
                onValueChange={(value) => handleChange("cuisineType", value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select cuisine type" />
                </SelectTrigger>
                <DropdownContent items={cuisineTypes} />
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course" className="text-base font-medium">
                Course Type<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.basicInfo.courseType || ""}
                onValueChange={(value) => handleChange("courseType", value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select course type" />
                </SelectTrigger>
                <DropdownContent items={courseTypes} />
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietCategories" className="text-base font-medium">
                Dietary Categories
                <span className="text-sm text-gray-500 ml-2">(Optional)</span>
              </Label>
              <Select
                value={formData.basicInfo.dietCategories?.[0] || ""}
                onValueChange={(value) =>
                  handleChange("dietCategories", [value])
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select dietary category" />
                </SelectTrigger>
                <DropdownContent items={dietCategories} />
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-base font-medium">
                Difficulty Level<span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.basicInfo.difficultyLevel || ""}
                onValueChange={(value) => handleChange("difficultyLevel", value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SimpleDropdownContent items={difficultyLevels} />
              </Select>
            </div>
          </div>

          {/* Time and Servings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="prepTime" className="text-base font-medium">
                Prep Time<span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 ml-2">(minutes)</span>
              </Label>
              <Input
                id="prepTime"
                type="number"
                min="0"
                className="h-12"
                value={formData.basicInfo.prepTime || ""}
                onChange={(e) =>
                  handleChange("prepTime", parseInt(e.target.value, 10))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cookTime" className="text-base font-medium">
                Cook Time<span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 ml-2">(minutes)</span>
              </Label>
              <Input
                id="cookTime"
                type="number"
                min="0"
                className="h-12"
                value={formData.basicInfo.cookTime || ""}
                onChange={(e) =>
                  handleChange("cookTime", parseInt(e.target.value, 10))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servings" className="text-base font-medium">
                Servings<span className="text-red-500">*</span>
              </Label>
              <Input
                id="servings"
                type="number"
                min="1"
                className="h-12"
                value={formData.basicInfo.servings || ""}
                onChange={(e) =>
                  handleChange("servings", parseInt(e.target.value, 10))
                }
                required
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            variant="default"
            size="lg"
            onClick={onNext}
            className="min-w-[120px] h-12"
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInformation;
