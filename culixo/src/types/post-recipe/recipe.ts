// src/types/post-recipe/recipe.ts
import { Dispatch, SetStateAction } from 'react';
import { ApiResponse } from '@/types/api';

// API Response Types
export interface DraftResponseData {
    id: string;
    ingredients: Ingredient[];
    title: string;
    description?: string;
    cuisine_type?: string;
    course_type?: string;
    difficulty_level?: string;
    prep_time?: number;
    cook_time?: number;
    servings?: number;
    diet_category?: string;
    completion_percentage: number;
    current_step: number;
    draft_data: RecipeFormData;
    instructions: InstructionStep[];
    created_at: string;
    updated_at: string;
    media: {  
        mainImage: string | null;
        additionalImages: string[];
        videoUrl?: string | null;
    };
    tags: string[]; // Add this field
    additional_info: {
        cookingTips: string[];
    };
    nutritional_info: {
        fat: number;
        carbs: number;
        fiber: number;
        protein: number;
        calories: number;
        minerals: {
            iron: number;
            zinc: number;
            calcium: number;
            magnesium: number;
        };
        servings: number;
        vitamins: {
            a: number;
            c: number;
            d: number;
            e: number;
            k: number;
            b6: number;
            b12: number;
        };
        last_calculated: string;
        ingredient_version: string;
    };

}

export type DraftResponseArray = ApiResponse<DraftResponseData[]>;
export type DraftResponse = ApiResponse<DraftResponseData>;

// Core Recipe Types
export type BasicRecipeInfo = {
    title: string;
    description?: string;
    cuisineType: string;
    courseType: string;
    dietCategories: string[];
    difficultyLevel: 'easy' | 'medium' | 'hard';
    prepTime: number;
    cookTime: number;
    totalTime?: number;
    servings: number;
};

export type Ingredient = {
    id: string;
    quantity: number | string;
    unit: string;
    name: string;
    notes?: string;
    groupName?: string;
    isOptional?: boolean;
};

export type InstructionStep = {
    id: string;
    stepNumber: number;
    instruction: string;
    timing?: number;
    mediaUrls: string[];
};

export type RecipeMedia = {
    mainImage: string | null;
    additionalImages: string[];
    videoUrl?: string | null;
};

export type AdditionalRecipeInfo = {
    cookingTips: string[];
};

export type RecipeFormData = {
    basicInfo: Partial<BasicRecipeInfo>;
    ingredients: Ingredient[];
    instructions: InstructionStep[];
    media: {
        mainImage?: string | null;
        additionalImages?: string[];
        videoUrl?: string | null;
    };
    tags: string[]; // Add this field
    additionalInfo: {
        cookingTips: string[];
    };
    isDraft?: boolean;
    lastSaved?: Date;
};

// Component Props Types
export interface StepComponentProps {
    formData: RecipeFormData;
    setFormData: Dispatch<SetStateAction<RecipeFormData>>;
    onNext: () => void;
    onPrevious: () => void;
    isFirst: boolean;
    isLast: boolean;
    draftId?: string;
}

export interface Step {
    number: number;
    title: string;
    component: React.ComponentType<StepComponentProps>;
}

// Utility Types
export interface IngredientSuggestion {
    name: string;
    category: string;
}

export type UnitOption = {
    value: string;
    label: string;
};

// Draft-related Types
export type DraftStatus = 'saving' | 'saved' | 'error' | 'offline';

export interface DraftProgress {
    basicInfo: boolean;
    ingredients: boolean;
    instructions: boolean;
    media: boolean;
    additionalInfo: boolean;
}

export interface DraftMetadata {
    createdAt: Date;
    modifiedAt: Date;
    completionPercentage: number;
}

export interface DraftState {
    id: string;
    status: DraftStatus;
    lastSaved: Date;
    data: RecipeFormData;
    progress: DraftProgress;
    metadata: DraftMetadata;
}

export interface AutoSaveConfig {
    debounceMs: number;
    minSaveInterval: number;
    maxRetries: number;
    backupToLocal: boolean;
}

// Helper Functions
export const calculateDraftProgress = (data: RecipeFormData): DraftProgress => ({
    basicInfo: Boolean(
        data.basicInfo?.title &&
        data.basicInfo?.cuisineType &&
        data.basicInfo?.courseType &&
        data.basicInfo?.prepTime &&
        data.basicInfo?.cookTime &&
        data.basicInfo?.servings
    ),
    ingredients: data.ingredients.length > 0,
    instructions: data.instructions.length > 0,
    media: Boolean(data.media?.mainImage),
    additionalInfo: Boolean(
        data.additionalInfo?.cookingTips?.length ||
        data.tags?.length 
    )
});

export const calculateCompletionPercentage = (progress: DraftProgress): number => {
    const sections = Object.values(progress);
    const completedSections = sections.filter(Boolean).length;
    return Math.round((completedSections / sections.length) * 100);
};

export const createInitialDraftState = (
    id: string,
    initialData?: Partial<RecipeFormData>
): DraftState => {
    const now = new Date();
    const emptyFormData: RecipeFormData = {
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
        lastSaved: now
    };

    const data = initialData ? { ...emptyFormData, ...initialData } : emptyFormData;
    const progress = calculateDraftProgress(data);

    return {
        id,
        status: 'saved',
        lastSaved: now,
        data,
        progress,
        metadata: {
            createdAt: now,
            modifiedAt: now,
            completionPercentage: calculateCompletionPercentage(progress)
        }
    };
};