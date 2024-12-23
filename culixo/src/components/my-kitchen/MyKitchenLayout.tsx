"use client";

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MyKitchenHeader from './MyKitchenHeader'
import MyKitchenSidebar from './MyKitchenSidebar'
import MyRecipesTab from './tabs/MyRecipesTab'
import SavedRecipesTab from './tabs/SavedRecipesTab'
import CollectionsTab from './tabs/CollectionsTab'
import ActivityTab from './tabs/ActivityTab'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const sidebarVariants = {
  open: {
    x: 0,
    width: 320,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: -320,
    width: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const mainContentVariants = {
  open: {
    marginLeft: 320,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    marginLeft: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

export default function MyKitchenLayout() {
  const [activeTab, setActiveTab] = useState('my-recipes')
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen w-full bg-background pt-16"> {/* pt-16 accounts for fixed navbar */}
      {/* Sidebar */}
      <motion.aside
        initial="open"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed left-0 top-16 bottom-0 bg-background z-30 overflow-hidden border-r border-border"
      >
        {/* Sidebar Content */}
        <div className="h-full w-80">
          <MyKitchenSidebar />
        </div>
      </motion.aside>

      {/* Toggle Button */}
      <div
        className={cn(
          "fixed z-40 top-1/2 -translate-y-1/2",
          "transition-all duration-300",
          isSidebarOpen ? "left-[320px]" : "left-0"
        )}
      >
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className={cn(
            "absolute -left-5 top-1/2 -translate-y-1/2",
            "h-10 w-10 rounded-full",
            "bg-background border shadow-md",
            "flex items-center justify-center",
            "hover:bg-accent transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary"
          )}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <motion.main
        className="flex-1 min-h-screen"
        initial="open"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={mainContentVariants}
      >
        <div className={cn(
          "max-w-[1400px] mx-auto p-4 md:p-8",
          "min-h-screen flex flex-col gap-6"
        )}>
          {/* Header */}
          <MyKitchenHeader />

          {/* Tabs Section */}
          <div className="flex-1">
            <Tabs
              defaultValue="my-recipes"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full mb-6 p-1 bg-card border rounded-xl">
                <div className="grid w-full grid-cols-4 gap-1">
                  <TabsTrigger
                    value="my-recipes"
                    className={cn(
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                      "data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground",
                      "rounded-lg transition-all duration-200",
                      "flex items-center gap-2 py-2.5",
                      "font-medium"
                    )}
                  >
                    My Recipes
                  </TabsTrigger>
                  <TabsTrigger
                    value="saved"
                    className={cn(
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                      "data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground",
                      "rounded-lg transition-all duration-200",
                      "flex items-center gap-2 py-2.5",
                      "font-medium"
                    )}
                  >
                    Saved Recipes
                  </TabsTrigger>
                  <TabsTrigger
                    value="collections"
                    className={cn(
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                      "data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground",
                      "rounded-lg transition-all duration-200",
                      "flex items-center gap-2 py-2.5",
                      "font-medium"
                    )}
                  >
                    Collections
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className={cn(
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                      "data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground",
                      "rounded-lg transition-all duration-200",
                      "flex items-center gap-2 py-2.5",
                      "font-medium"
                    )}
                  >
                    Activity
                  </TabsTrigger>
                </div>
              </TabsList>

              <TabsContent value="my-recipes" className="mt-0 border-none outline-none">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MyRecipesTab />
                </motion.div>
              </TabsContent>

              <TabsContent value="saved" className="mt-0 border-none outline-none">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SavedRecipesTab onTabChange={setActiveTab} />
                </motion.div>
              </TabsContent>

              <TabsContent value="collections" className="mt-0 border-none outline-none">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CollectionsTab />
                </motion.div>
              </TabsContent>

              <TabsContent value="activity" className="mt-0 border-none outline-none">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ActivityTab />
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.main>
    </div>
  );
}