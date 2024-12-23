'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  GripVertical,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { StepComponentProps, Ingredient } from '@/types/post-recipe/recipe';
import { useToast } from '@/components/ui/use-toast';

const commonUnits = [
  { value: 'g', label: 'Grams (g)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'ml', label: 'Milliliters (ml)' },
  { value: 'l', label: 'Liters (l)' },
  { value: 'cup', label: 'Cup' },
  { value: 'tbsp', label: 'Tablespoon' },
  { value: 'tsp', label: 'Teaspoon' },
  { value: 'whole', label: 'Whole' },
] as const;

const IngredientsSection: React.FC<StepComponentProps> = ({
  formData,
  setFormData,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) => {
  const { toast } = useToast();
  const [currentIngredient, setCurrentIngredient] = useState<Omit<Ingredient, 'id'>>({
    quantity: '',
    unit: '',
    name: '',
    notes: '',
    isOptional: false,
  });
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const handleInputChange = (field: keyof Omit<Ingredient, 'id'>, value: Omit<Ingredient, 'id'>[typeof field]) => {
    setCurrentIngredient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addIngredient = () => {
    if (!currentIngredient.name.trim() || !currentIngredient.quantity || !currentIngredient.unit) {
      toast({
        title: "Missing Information",
        description: "Please fill in the quantity, unit, and name fields",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicates
    if (formData.ingredients.some(ing => 
      ing.name.toLowerCase() === currentIngredient.name.toLowerCase())) {
      toast({
        title: "Duplicate Ingredient",
        description: "This ingredient is already in your recipe!",
        variant: "destructive"
      });
      return;
    }

    const newIngredient: Ingredient = {
      id: crypto.randomUUID(),
      ...currentIngredient
    };

    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient]
    }));

    // Reset the form
    setCurrentIngredient({
      quantity: '',
      unit: '',
      name: '',
      notes: '',
      isOptional: false,
    });
  };

  // Add validation before moving to next step
  const handleNextClick = () => {
    if (formData.ingredients.length === 0) {
      toast({
        title: "No Ingredients Added",
        description: "Please add at least one ingredient before proceeding",
        variant: "destructive"
      });
      return;
    }
    onNext();
  };

  const removeIngredient = (id: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing.id !== id)
    }));
  };

  const clearAllIngredients = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: []
    }));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedItemId && draggedItemId !== id) {
      const items = [...formData.ingredients];
      const draggedIdx = items.findIndex(item => item.id === draggedItemId);
      const hoverIdx = items.findIndex(item => item.id === id);
      
      const newItems = [...items];
      const [draggedItem] = newItems.splice(draggedIdx, 1);
      newItems.splice(hoverIdx, 0, draggedItem);
      
      setFormData(prev => ({
        ...prev,
        ingredients: newItems
      }));
    }
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500">
        <Card className="bg-card border-none shadow-lg dark:shadow-none">
          <CardHeader className="space-y-2 pb-6 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
                Ingredients
              </CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 px-4 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive flex items-center gap-2"
                    disabled={formData.ingredients.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="font-medium">Clear All</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all ingredients?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All ingredients will be
                      removed from your recipe.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={clearAllIngredients}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <CardDescription>
              Add the ingredients needed for your recipe. Be precise with
              measurements for best results.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Add Ingredient Form */}
            <div className="flex flex-wrap gap-3 items-start">
              <div className="w-24">
                <Input
                  type="number"
                  value={currentIngredient.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  placeholder="Qty"
                  className="h-12 text-lg" // Updated
                  min="0"
                  step="any"
                />
              </div>
              <div className="w-32">
                <Select
                  value={currentIngredient.unit}
                  onValueChange={(value) => handleInputChange("unit", value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonUnits.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <Input
                  value={currentIngredient.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter ingredient name"
                  className="h-12 text-lg" // Updated
                />
              </div>
              <div className="w-32">
                <Input
                  value={currentIngredient.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Notes"
                  className="h-12 text-lg"
                />
              </div>
              <Button
                onClick={addIngredient}
                className="h-12 px-5 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">Add</span>
              </Button>
            </div>

            {/* Ingredients List */}
            {formData.ingredients.length > 0 && (
              <div className="space-y-2 mt-6">
                <h3 className="text-sm font-medium text-foreground">
                  Added Ingredients
                </h3>
                <div className="space-y-2">
                  {formData.ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ingredient.id)}
                      onDragOver={(e) => handleDragOver(e, ingredient.id)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        "group flex items-center gap-3 p-3 rounded-lg border bg-background hover:bg-accent/5 transition-colors",
                        draggedItemId === ingredient.id && "opacity-50"
                      )}
                    >
                      <div className="cursor-move text-muted-foreground hover:text-foreground transition-colors">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <span className="font-medium text-foreground">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                        <span className="text-foreground">
                          {ingredient.name}
                        </span>
                        {ingredient.notes && (
                          <span className="text-muted-foreground/70">
                            ({ingredient.notes})
                          </span>
                        )}
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIngredient(ingredient.id)}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove ingredient</TooltipContent>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
              <Button
                variant="outline"
                onClick={onPrevious}
                className="w-full sm:w-auto h-12 min-w-[120px]"
                disabled={isFirst}
              >
                Previous
              </Button>
              <Button
                onClick={handleNextClick}
                className="w-full sm:w-auto h-12 min-w-[120px]"
                disabled={isLast}
              >
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default IngredientsSection;