// src/app/post-recipe/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/post-recipe/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { draftApi } from '@/lib/api/draft';

export default function PostRecipeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [draftCount, setDraftCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Give the auth state a moment to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      if (!isAuthenticated) {
        const currentPath = window.location.pathname;
        router.push(`/login?from=${currentPath}`);
        return;
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const updateDraftCount = async () => {
      try {
        const drafts = await draftApi.getAllDrafts();
        setDraftCount(drafts.length);
      } catch (error) {
        console.error('Error fetching drafts:', error);
      }
    };

    updateDraftCount();
    const interval = setInterval(updateDraftCount, 2000);

    return () => clearInterval(interval);
  }, [pathname, isAuthenticated]);

  // Show nothing while checking auth state
  if (isLoading) {
    return null;
  }

  // If not authenticated after loading, show nothing
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-1 pt-16">
      <div className="w-64 border-r bg-card flex-shrink-0 h-[calc(100vh-4rem)]">
        <Sidebar 
          setCurrentTab={(tab: string) => router.push(`/post-recipe/${tab === 'post-recipe' ? '' : tab}`)}
          draftCount={draftCount}
        />
      </div>
      <div className="flex-1 overflow-auto h-[calc(100vh-4rem)]">
        <div className="container mx-auto py-6">
          {children}
        </div>
      </div>
    </div>
  );
}