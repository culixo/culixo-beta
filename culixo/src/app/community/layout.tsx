// src/app/community/layout.tsx

import { ReactNode } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Heart,
  Medal,
  MessageSquare,
  ChefHat,
  History,
  Bookmark,
  Settings
} from 'lucide-react';
import MotionWrapper from "@/components/community/MotionWrapper";

interface CommunityLayoutProps {
  children: ReactNode;
}

interface SidebarItem {
  icon: typeof Users;
  label: string;
  value: string;
  count?: number;
}

const sidebarItems: SidebarItem[] = [
  { icon: Users, label: 'All Activity', value: 'all', count: 124 },
  { icon: Heart, label: 'Popular', value: 'popular', count: 45 },
  { icon: Medal, label: 'Featured', value: 'featured', count: 12 },
  { icon: MessageSquare, label: 'Discussions', value: 'discussions', count: 67 },
  { icon: ChefHat, label: 'Recipes', value: 'recipes', count: 89 },
  { icon: History, label: 'Recent', value: 'recent' },
  { icon: Bookmark, label: 'Saved', value: 'saved' },
  { icon: Settings, label: 'Preferences', value: 'preferences' }
];

export const metadata = {
    title: 'Community | Culixo',
    description: 'Join the Culixo cooking community to share recipes, tips, and connect with fellow food lovers.'
  };

export default function CommunityLayout({ children }: CommunityLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-16 bottom-0 border-r">
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="space-y-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">Community</h2>
              <div className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.value}
                    className={`
                      w-full flex items-center justify-between px-4 py-2 rounded-md
                      text-sm font-medium transition-colors hover:bg-accent
                      hover:text-accent-foreground
                    `}
                  >
                    <span className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </span>
                    {item.count && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Community Stats */}
            <div className="px-3 py-2">
              <h3 className="mb-2 px-4 text-sm font-medium">Community Stats</h3>
              <div className="space-y-2 px-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-medium">12,345</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recipes</span>
                  <span className="font-medium">5,678</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Now</span>
                  <span className="font-medium">234</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Quick Links */}
            <div className="px-3 py-2">
              <h3 className="mb-2 px-4 text-sm font-medium">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2 px-4">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Guidelines
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <MotionWrapper>{children}</MotionWrapper>
      </main>
    </div>
  );
}
