// src/components/post-recipe/PostRecipeForm.tsx
'use client';

import { useState, useCallback, useMemo, type SetStateAction, type Dispatch } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, 
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import BasicInformation from './BasicInformation';
import IngredientsSection from './IngredientsSection';
import InstructionsSection from './InstructionsSection';
import MediaSection from './MediaSection';
import AdditionalInformation from './AdditionalInformation';
import PreviewSection from './PreviewSection';
import type { RecipeFormData } from '@/types/post-recipe/recipe';
import { draftApi } from '@/lib/api/draft';

interface APIError {
  response?: {
    status?: number;
  };
  message?: string;
}

interface PostRecipeFormProps {
  initialData: RecipeFormData | null;
  onSaveDraft: (formData: RecipeFormData, override?: boolean) => Promise<boolean>;
  draftId?: string;
}

const initialFormData: RecipeFormData = {
  basicInfo: {},
  ingredients: [],
  instructions: [],
  media: {
    additionalImages: [],
    mainImage: '',
  },
  tags: [],
  additionalInfo: {
    cookingTips: [],
  },
  isDraft: true,
  lastSaved: new Date(),
};

const PostRecipeForm: React.FC<PostRecipeFormProps> = ({ 
  initialData, 
  draftId 
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<RecipeFormData>(
    initialData || initialFormData
  );
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleFormUpdate: Dispatch<SetStateAction<RecipeFormData>> = useCallback((value) => {
    setFormData(prev => {
      const newData = typeof value === 'function' ? value(prev) : value;
      return {
        ...newData,
        isDraft: true,
        lastSaved: new Date()
      };
    });
  }, []);

  const handleStepChange = useCallback((newStep: number) => {
    setActiveStep(newStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSaveDraft = async (override: boolean = false) => {
    if (!formData.basicInfo?.title?.trim()) {
      toast({
        title: "Missing title",
        description: "Please add a title for your recipe before saving",
        variant: "destructive"
      });
      return;
    }
  
    setIsSaving(true);
    try {
      await draftApi.saveDraft(formData);
      
      toast({
        title: "Draft saved",
        description: "Your recipe has been saved as a draft",
      });
  
      return true; // Return true to indicate success
    } catch (error: unknown) {

      const apiError = error as APIError;
      // Check if it's a duplicate title error
      if (apiError?.response?.status === 409 && !override) {
        setShowOverrideDialog(true);
        return false;
      }
  
      toast({
        title: "Error saving draft",
        description: error instanceof Error ? error.message : "There was a problem saving your draft",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Memoize the steps array
  const steps = useMemo(() => [
    { number: 1, title: 'Basic Information', component: BasicInformation },
    { number: 2, title: 'Ingredients', component: IngredientsSection },
    { number: 3, title: 'Instructions', component: InstructionsSection },
    { number: 4, title: 'Media', component: MediaSection },
    { number: 5, title: 'Additional Info', component: AdditionalInformation },
    { number: 6, title: 'Preview', component: PreviewSection }
  ], []); // Empty dependency array since steps never change

  const calculateStepCompletion = useCallback((step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(
          formData.basicInfo?.title &&
          formData.basicInfo?.cuisineType &&
          formData.basicInfo?.courseType &&
          formData.basicInfo?.prepTime &&
          formData.basicInfo?.cookTime &&
          formData.basicInfo?.servings
        );
      case 2:
        return formData.ingredients.length > 0;
      case 3:
        return formData.instructions.length > 0;
      case 4:
        return Boolean(formData.media?.mainImage);
      case 5:
        return Boolean(
          formData.additionalInfo?.cookingTips?.length ||
          formData.tags?.length > 0
        );
      default:
        return false;
    }
  }, [formData]);

  const calculateOverallProgress = useCallback((): number => {
    const completedSteps = steps
      .slice(0, -1)
      .filter(step => calculateStepCompletion(step.number))
      .length;
    return Math.round((completedSteps / (steps.length - 1)) * 100);
  }, [calculateStepCompletion, steps]);

  const handleNext = useCallback(() => {
    if (activeStep < steps.length) {
      handleStepChange(activeStep + 1);
    }
  }, [activeStep, steps.length, handleStepChange]);

  const handlePrevious = useCallback(() => {
    if (activeStep > 1) {
      handleStepChange(activeStep - 1);
    }
  }, [activeStep, handleStepChange]);

  return (
    <div className="w-full animate-fade-in-up">
      <Card className="rounded-xl shadow-lg bg-card">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              {formData.basicInfo?.title || 'Create New Recipe'}
            </h1>
            <Button
              onClick={() => handleSaveDraft(false)}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
          </div>
          
          <div className="w-full mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step) => {
                const isComplete = calculateStepCompletion(step.number);
                return (
                  <div
                    key={step.number}
                    className={`flex flex-col items-center ${
                      step.number <= activeStep ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                      ${
                        isComplete
                          ? 'bg-primary text-primary-foreground'
                          : step.number === activeStep
                          ? 'bg-primary/20 text-primary border-2 border-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {step.number}
                    </div>
                    <span className="hidden md:block text-sm">{step.title}</span>
                  </div>
                );
              })}
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className={activeStep === step.number ? 'block animate-scale-in' : 'hidden'}
              >
                <step.component
                  formData={formData}
                  setFormData={handleFormUpdate}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  isFirst={step.number === 1}
                  isLast={step.number === steps.length}
                  draftId={draftId}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center text-sm text-muted-foreground">
            <span>Overall Progress: {calculateOverallProgress()}%</span>
            <span>Step {activeStep} of {steps.length}</span>
          </div>
        </div>
      </Card>

      <AlertDialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Draft already exists</AlertDialogTitle>
            <AlertDialogDescription>
              A draft with the title &quot;{formData.basicInfo?.title}&quot; already exists. 
              Would you like to override it or create a new draft?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowOverrideDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowOverrideDialog(false);
                handleSaveDraft(true);
              }}
            >
              Override
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => {
                setShowOverrideDialog(false);
                handleSaveDraft(false);
              }}
            >
              Create New
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PostRecipeForm;