// src/app/post-recipe/drafts/page.tsx
'use client';

import { useState, useEffect,useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DraftState } from '@/types/post-recipe/recipe';
import { DraftsList } from '@/components/drafts/DraftsList';
import { Button } from '@/components/ui/button';
import { draftApi } from '@/lib/api/draft';
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
} from "@/components/ui/alert-dialog";
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<DraftState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const loadDrafts = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedDrafts = await draftApi.getAllDrafts();
      setDrafts(loadedDrafts);
    } catch (error) {
      console.error('Error loading drafts:', error);
      toast({
        title: "Error loading drafts",
        description: "There was a problem loading your drafts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const handleSelectDraft = (draftId: string) => {
    router.push(`/post-recipe?draftId=${draftId}`);
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      await draftApi.deleteDraft(draftId);
      await loadDrafts(); // Refresh the drafts list
      toast({
        title: "Draft deleted",
        description: "Your draft has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error deleting draft",
        description: typeof error === 'string' ? error : "There was a problem deleting your draft",
        variant: "destructive"
      });
    }
  };

  const handleClearAllDrafts = async () => {
    try {
      await Promise.all(drafts.map(draft => draftApi.deleteDraft(draft.id)));
      await loadDrafts();
      toast({
        title: "All drafts cleared",
        description: "All your drafts have been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error clearing drafts",
        description: typeof error === 'string' ? error : "There was a problem clearing your drafts",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-muted-foreground">Loading drafts...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recipe Drafts</h1>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                disabled={drafts.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all drafts?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your draft recipes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAllDrafts}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            onClick={() => router.push('/post-recipe')}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Recipe
          </Button>
        </div>
      </div>
      
      <DraftsList
        drafts={drafts}
        onSelectDraft={handleSelectDraft}
        onDeleteDraft={handleDeleteDraft}
        onDuplicateDraft={() => {}} // We'll implement this later
      />
      
      {drafts.length === 0 && (
        <div className="text-center mt-12 text-muted-foreground">
          <p>No drafts found. Start creating a new recipe!</p>
        </div>
      )}
    </div>
  );
}