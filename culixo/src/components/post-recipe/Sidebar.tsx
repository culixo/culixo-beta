// src/components/post-recipe/Sidebar.tsx
'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  PenBox, 
  FileEdit, 
  FileText, 
  ImageIcon
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';


interface SidebarProps {
  setCurrentTab: (tab: string) => void;
  draftCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  setCurrentTab, 
  draftCount = 0,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    {
      title: 'Post Recipe',
      icon: PenBox,
      value: 'post-recipe',
      path: '/post-recipe',
      description: 'Create a new recipe'
    },
    {
      title: 'Drafts',
      icon: FileEdit,
      value: 'drafts',
      path: '/post-recipe/drafts',
      description: 'View saved drafts',
      badge: draftCount > 0 ? draftCount : undefined
    },
    {
      title: 'Templates',
      icon: FileText,
      value: 'templates',
      path: '/post-recipe/templates',
      description: 'Use recipe templates'
    },
    {
      title: 'Media Library',
      icon: ImageIcon,
      value: 'media',
      path: '/post-recipe/media-library',
      description: 'Manage your images'
    }
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold leading-none">Create Recipe</h2>
          <p className="text-sm text-muted-foreground">
            Share your culinary masterpiece with the community
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Tooltip key={item.value} delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant={pathname === item.path ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-11 px-4 relative",
                    pathname === item.path && "bg-secondary"
                  )}
                  onClick={() => {
                    setCurrentTab(item.value);
                    router.push(item.path);
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  {item.badge ? (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                      {item.badge}
                    </span>
                  ) : null}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        <div className="space-y-4">

          {/* Tips Section */}
          <div className="rounded-lg bg-primary/10 p-4">
            <h3 className="font-medium text-sm mb-2 text-primary">Tips for Great Recipes</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="shrink-0">•</span>
                <span>Use clear, step-by-step instructions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="shrink-0">•</span>
                <span>Add photos for each major step</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="shrink-0">•</span>
                <span>Include prep and cooking times</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="shrink-0">•</span>
                <span>Specify exact measurements</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;