// src/lib/api/draft.ts
import api from '../axios';
import { RecipeFormData } from '@/types/post-recipe/recipe';
import { Ingredient, InstructionStep, DraftResponse } from '@/types/post-recipe/recipe';
import { draftService } from '@/services/draftService';
import { mediaService } from '@/services/mediaService';



export const draftApi = {
  // Core draft operations now use draftService
  saveDraft: (formData: RecipeFormData) => 
    draftService.saveDraft(formData),
    
  getAllDrafts: () => 
    draftService.getAllDrafts(),
    
  getDraft: (draftId: string) => 
    draftService.getDraft(draftId),
    
  updateDraft: (draftId: string, formData: RecipeFormData) => 
    draftService.updateDraft(draftId, formData),
    
  deleteDraft: (draftId: string) => 
    draftService.deleteDraft(draftId),

  updateDraftIngredients: async (draftId: string, ingredients: Ingredient[]): Promise<DraftResponse> => {
    try {
      const response = await api.put(`/drafts/${draftId}/ingredients`, {
        ingredients: ingredients
      });
      return response.data;
    } catch (error) {
      console.error('Error updating draft ingredients:', error);
      throw error;
    }
  },

  getDraftIngredients: async (draftId: string): Promise<Ingredient[]> => {
    try {
      const response = await api.get(`/drafts/${draftId}/ingredients`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching draft ingredients:', error);
      throw error;
    }
  },

  updateDraftInstructions: async (draftId: string, instructions: InstructionStep[]): Promise<DraftResponse> => {
    try {
      const response = await api.put(`/drafts/${draftId}/instructions`, {
        instructions: instructions
      });
      return response.data;
    } catch (error) {
      console.error('Error updating draft instructions:', error);
      throw error;
    }
  },

  uploadInstructionImage: (file: File) => 
    mediaService.uploadInstructionImage(file),
    
  uploadMainImage: (file: File, draftId?: string) => 
    mediaService.uploadMainImage(file, draftId),
  
  uploadAdditionalImages: (files: File[], draftId?: string) => 
    mediaService.uploadAdditionalImages(files, draftId),

  updateDraftTags: async (draftId: string, tags: string[]): Promise<DraftResponse> => {
    try {
      const response = await api.put(`/drafts/${draftId}/tags`, { tags });
      return response.data;
    } catch (error) {
      console.error('Error updating draft tags:', error);
      throw error;
    }
  },

  updateDraftCookingTips: async (draftId: string, cookingTips: string[]): Promise<DraftResponse> => {
    try {
      const response = await api.put(`/drafts/${draftId}/cooking-tips`, { cookingTips });
      return response.data;
    } catch (error) {
      console.error('Error updating cooking tips:', error);
      throw error;
    }
  },

}

// Helper function to calculate completion percentage
export const calculateCompletionPercentage = (formData: RecipeFormData): number => {
  let completedSections = 0;
  const totalSections = 5; // Basic, Ingredients, Instructions, Media, Additional Info

  // Check Basic Info
  if (formData.basicInfo?.title &&
      formData.basicInfo?.cuisineType &&
      formData.basicInfo?.courseType &&
      formData.basicInfo?.prepTime &&
      formData.basicInfo?.cookTime &&
      formData.basicInfo?.servings) {
    completedSections++;
  }

  // Check Ingredients
  if (formData.ingredients.length > 0) {
    completedSections++;
  }

  // Check Instructions
  if (formData.instructions.length > 0) {
    completedSections++;
  }

  // Check Media
  if (formData.media?.mainImage) {
    completedSections++;
  }

  // Check Additional Info
  if (formData.additionalInfo?.cookingTips?.length > 0 || formData.tags?.length > 0) {
    completedSections++;
  }

  return Math.round((completedSections / totalSections) * 100);
};