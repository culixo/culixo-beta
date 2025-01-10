// src/hooks/useAuthRedirect.ts
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { recipeService } from '@/services/recipeService'

export const useAuthRedirect = () => {
  const router = useRouter()
  const { isAuthenticated, setShowAuthModal, setPendingInteraction } = useAuth()

  const handleProtectedAction = (
    action: 'like' | 'save' | 'post',
    recipeId?: string
  ) => {
    if (!isAuthenticated) {
      if (action === 'post') {
        router.push('/login?from=/post-recipe');
        return;
      }

      if (recipeId) {
        setPendingInteraction({
          type: action,
          recipeId,
          returnTo: window.location.pathname
        });
        setShowAuthModal(true);
      }
      return;
    }

    // If authenticated, continue with the action
    return true;
  };

  const handleAuthSuccess = (pendingAction: { type: string; recipeId: string; returnTo: string } | null) => {
    if (pendingAction) {
      switch (pendingAction.type) {
        case 'like':
          recipeService.likeRecipe(pendingAction.recipeId);
          break;
        case 'save':
          recipeService.saveRecipe(pendingAction.recipeId);
          break;
      }
      router.push(pendingAction.returnTo);
    }
  };

  return {
    handleProtectedAction,
    handleAuthSuccess
  }
}