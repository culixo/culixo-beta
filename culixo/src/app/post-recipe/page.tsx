'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PostRecipeClientWrapper } from '@/components/post-recipe/PostRecipeClientWrapper';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

function PostRecipeContent() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }
    setIsVerifying(false);
  }, [isAuthenticated, router]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return <PostRecipeClientWrapper draftId={draftId} />;
}

export default function PostRecipePage() {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <PostRecipeContent />
    </Suspense>
  );
}