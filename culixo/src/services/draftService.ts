// src/services/draftService.ts
import api from '@/lib/axios';
import { 
  RecipeFormData,
  DraftState,
  DraftResponse, 
  DraftResponseData    
} from '@/types/post-recipe/recipe';

interface APIError {
  message?: string;
  response?: {
    status?: number;
    data?: unknown;
  };
  config?: unknown;
}

export const draftService = {
  saveDraft: async (formData: RecipeFormData): Promise<DraftResponse> => {
    try {
      const draftData = {
        title: formData.basicInfo.title,
        description: formData.basicInfo.description,
        cuisine_type: formData.basicInfo.cuisineType,
        course_type: formData.basicInfo.courseType,
        difficulty_level: formData.basicInfo.difficultyLevel,
        prep_time: formData.basicInfo.prepTime,
        cook_time: formData.basicInfo.cookTime,
        servings: formData.basicInfo.servings,
        diet_category: formData.basicInfo.dietCategories?.[0],
        completion_percentage: calculateCompletionPercentage(formData),
        current_step: 1,
        draft_data: formData
      };

      return api.post('/drafts', draftData);
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  },

  getAllDrafts: async (): Promise<DraftState[]> => {
    try {
      const response = await api.get<DraftResponseData[]>('/drafts');  // Changed type here
      
      // Now response.data is directly the array we want to map
      return response.data.map((draft: DraftResponseData) => ({
        id: draft.id,
        status: 'saved' as const,
        lastSaved: new Date(draft.updated_at),
        data: draft.draft_data,
        metadata: {
          createdAt: new Date(draft.created_at),
          modifiedAt: new Date(draft.updated_at),
          completionPercentage: draft.completion_percentage
        },
        progress: {
          basicInfo: !!draft.draft_data.basicInfo?.title,
          ingredients: draft.draft_data.ingredients?.length > 0,
          instructions: draft.draft_data.instructions?.length > 0,
          media: !!draft.draft_data.media?.mainImage,
          additionalInfo: !!(
            draft.draft_data.additionalInfo?.cookingTips?.length ||
            draft.draft_data.additionalInfo?.equipmentNeeded?.length ||
            draft.draft_data.additionalInfo?.keywords?.length
          )
        }
      }));
    } catch (error) {
      console.error('Error fetching drafts:', error);
      throw error;
    }
  },

  getDraft: async (draftId: string): Promise<DraftState> => {
    try {
      const response = await api.get(`/drafts/${draftId}`);
      const draft = response.data;
      
      return {
        id: draft.id,
        status: 'saved' as const,
        lastSaved: new Date(draft.updated_at),
        data: draft.draft_data,
        metadata: {
          createdAt: new Date(draft.created_at),
          modifiedAt: new Date(draft.updated_at),
          completionPercentage: draft.completion_percentage
        },
        progress: {
          basicInfo: !!draft.draft_data.basicInfo?.title,
          ingredients: draft.draft_data.ingredients?.length > 0,
          instructions: draft.draft_data.instructions?.length > 0,
          media: !!draft.draft_data.media?.mainImage,
          additionalInfo: !!(
            draft.draft_data.additionalInfo?.cookingTips?.length ||
            draft.draft_data.additionalInfo?.equipmentNeeded?.length ||
            draft.draft_data.additionalInfo?.keywords?.length
          )
        }
      };
    } catch (error) {
      console.error('Error fetching draft:', error);
      throw error;
    }
  },

  updateDraft: async (draftId: string, formData: RecipeFormData): Promise<DraftState> => {
    try {
      const draftData = {
        title: formData.basicInfo.title,
        description: formData.basicInfo.description,
        cuisine_type: formData.basicInfo.cuisineType,
        course_type: formData.basicInfo.courseType,
        difficulty_level: formData.basicInfo.difficultyLevel,
        prep_time: formData.basicInfo.prepTime,
        cook_time: formData.basicInfo.cookTime,
        servings: formData.basicInfo.servings,
        diet_category: formData.basicInfo.dietCategories?.[0],
        completion_percentage: calculateCompletionPercentage(formData),
        current_step: 1,
        draft_data: formData
      };

      const response = await api.put(`/drafts/${draftId}`, draftData);
      return response;
    } catch (error) {
      console.error('Error updating draft:', error);
      throw error;
    }
  },

  deleteDraft: async (draftId: string): Promise<void> => {
    try {
      console.log('Deleting draft with ID:', draftId); // Debug log
      await api.delete(`/drafts/${draftId}`);
    } catch (error: unknown) {
      const apiError = error as APIError;
      console.error('Error deleting draft:', {
        message: apiError.message,
        status: apiError.response?.status,
        data: apiError.response?.data,
        config: apiError.config
      });
      throw error;
    }
  },
};

// Move the helper function here as well
const calculateCompletionPercentage = (formData: RecipeFormData): number => {
  let completedSections = 0;
  const totalSections = 5;

  if (formData.basicInfo?.title &&
      formData.basicInfo?.cuisineType &&
      formData.basicInfo?.courseType &&
      formData.basicInfo?.prepTime &&
      formData.basicInfo?.cookTime &&
      formData.basicInfo?.servings) {
    completedSections++;
  }

  if (formData.ingredients.length > 0) {
    completedSections++;
  }

  if (formData.instructions.length > 0) {
    completedSections++;
  }

  if (formData.media?.mainImage) {
    completedSections++;
  }

  if (formData.additionalInfo?.cookingTips?.length > 0 || formData.tags?.length > 0) {
    completedSections++;
  } 

  return Math.round((completedSections / totalSections) * 100);
};