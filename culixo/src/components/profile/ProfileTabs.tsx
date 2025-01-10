// src/components/profile/ProfileTabs.tsx
"use client";

import { cn } from "@/lib/utils";
import { BookMarked, ChefHat, ClipboardList, LineChart, Timer } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProfileTabsProps {
  userId: string;
}

export function ProfileTabs({ userId }: { userId: string }) {
  const pathname = usePathname();
  const currentTab = pathname.split('/').pop();

  const tabItems = [
    {
      id: 'posts',
      label: 'Posted Recipes',
      icon: ChefHat,
      href: `/profile/${userId}`
    },
    {
      id: 'saved',
      label: 'Saved Recipes',
      icon: BookMarked,
      href: `/profile/${userId}/saved`
    },
    {
      id: 'collections',
      label: 'Collections',
      icon: ClipboardList,
      href: `/profile/${userId}/collections`
    },
    {
      id: 'activity',
      label: 'Activity',
      icon: Timer,
      href: `/profile/${userId}/activity`
    },
    {
      id: 'stats',
      label: 'Cooking Stats',
      icon: LineChart,
      href: `/profile/${userId}/stats`
    }
  ];

  return (
    <div className="border-b border-border-primary">
      {/* Desktop Tabs */}
      <div className="hidden md:flex">
        {tabItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === 'posts' 
          ? pathname === `/profile/${userId}`
          : currentTab === tab.id;
          
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
                "hover:text-foreground",
                isActive ? (
                  "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#8B5CF6]"
                ) : (
                  "text-muted-foreground"
                )
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Mobile Dropdown */}
      <div className="md:hidden flex overflow-x-auto scrollbar-thin">
        {tabItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === 'posts' 
          ? pathname === `/profile/${userId}`
          : currentTab === tab.id;
          
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium whitespace-nowrap",
                "hover:text-foreground",
                isActive ? (
                  "text-foreground border-b-2 border-primary"
                ) : (
                  "text-muted-foreground"
                )
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};