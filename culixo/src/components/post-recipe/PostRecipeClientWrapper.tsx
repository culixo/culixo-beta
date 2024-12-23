'use client';

import { useState, useEffect, useCallback } from 'react';
import PostRecipeForm from './PostRecipeForm';
import { Loader2 } from 'lucide-react';
import type { RecipeFormData } from '@/types/post-recipe/recipe';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth, api } from '@/hooks/useAuth';
import { draftApi } from '@/lib/api/draft';

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

interface PostRecipeClientWrapperProps {
  draftId?: string | null;
}

export function PostRecipeClientWrapper({ draftId }: PostRecipeClientWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [draftData, setDraftData] = useState<RecipeFormData | null>(null);
  const [lastDraftId, setLastDraftId] = useState<string | undefined>(draftId || undefined);
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated) {
        router.replace('/');
        return;
      }

      try {
        await api.request('/auth/verify');
      } catch{
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive"
        });
        logout();
        router.replace('/');
      }
    };

    verifyAuth();
  }, [isAuthenticated, router, logout, toast]);

  useEffect(() => {
    const loadDraft = async () => {
      try {
        if (draftId) {
          setIsLoading(true);
          const draft = await draftApi.getDraft(draftId);
          if (draft) {
            setDraftData(draft.data);
            setLastDraftId(draftId);
          } else {
            toast({
              title: "Draft not found",
              description: "The requested draft could not be found",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('Error loading draft:', error);
        toast({
          title: "Error loading draft",
          description: error instanceof Error 
            ? error.message 
            : "There was a problem loading your draft",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [draftId, toast]);

  const handleSaveDraft = useCallback(async (formData: RecipeFormData) => {
    try {
      await api.request('/auth/verify');
      
      const draft = await draftApi.saveDraft(formData);
      if (!draft) {
        return false;
      }
      
      setLastDraftId(draft.data.id);
      return true;
    } catch (error) {
      if (error instanceof Error && error.message === 'Session expired') {
        toast({
          title: "Session Expired",
          description: "Please log in again to save your draft.",
          variant: "destructive"
        });
        logout();
        router.replace('/login?from=/post-recipe');
      }
      console.error('Error saving draft:', error);
      throw error;
    }
  }, [ logout, router, toast]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (draftData && draftData !== initialFormData) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [draftData]);

  if (!isAuthenticated) {
    router.replace('/');
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading recipe editor...</p>
        </div>
      </div>
    );
  }

  return (
    <PostRecipeForm 
      initialData={draftData}
      onSaveDraft={handleSaveDraft}
      draftId={lastDraftId}
    />
  );
}