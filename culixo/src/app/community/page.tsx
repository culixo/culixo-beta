// src/app/community/page.tsx

import { Suspense } from 'react';
import HeroSection from '@/components/community/HeroSection';
import FeaturedMembers from '@/components/community/FeaturedMembers';
import ActivityFeed from '@/components/community/ActivityFeed';
import CommunitySection from '@/components/community/CommunitySection';
import DiscussionForums from '@/components/community/DiscussionForums';
import Achievements from '@/components/community/Achievements';
import ResourceSection from '@/components/community/ResourceSection';
import InteractiveElements from '@/components/community/InteractiveElements';
import { Separator } from '@/components/ui/separator';

export default function CommunityPage() {
  return (
    <main className="min-h-screen w-full">
      <HeroSection />
      <Separator className="my-8" />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <Suspense 
              fallback={
                <div className="w-full h-[400px] animate-pulse bg-muted rounded-lg" />
              }
            >
              <FeaturedMembers />
            </Suspense>
            
            <Separator />
            
            <Suspense 
              fallback={
                <div className="w-full h-[600px] animate-pulse bg-muted rounded-lg" />
              }
            >
              <ActivityFeed />
            </Suspense>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <Suspense 
              fallback={
                <div className="w-full h-[300px] animate-pulse bg-muted rounded-lg" />
              }
            >
              <CommunitySection />
            </Suspense>
            
            <Separator />
            
            <Suspense 
              fallback={
                <div className="w-full h-[400px] animate-pulse bg-muted rounded-lg" />
              }
            >
              <DiscussionForums />
            </Suspense>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Suspense 
            fallback={
              <div className="w-full h-[300px] animate-pulse bg-muted rounded-lg" />
            }
          >
            <Achievements />
          </Suspense>
          
          <Suspense 
            fallback={
              <div className="w-full h-[300px] animate-pulse bg-muted rounded-lg" />
            }
          >
            <ResourceSection />
          </Suspense>
          
          <Suspense 
            fallback={
              <div className="w-full h-[300px] animate-pulse bg-muted rounded-lg" />
            }
          >
            <InteractiveElements />
          </Suspense>
        </div>
      </div>
    </main>
  );
}