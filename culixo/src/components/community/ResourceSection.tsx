// src/components/community/ResourceSection.tsx
"use client"

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  Clock,
  Heart,
  Eye,
  Calendar,
  BookCopy,
  Video,
  HelpCircle,
  Lightbulb,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockResources, type Resource } from '@/types/community';

const typeIcons = {
  guide: BookCopy,
  tutorial: Video,
  tips: Lightbulb,
  faq: HelpCircle
};

const typeColors = {
  guide: 'text-blue-500 bg-blue-500/10 dark:bg-blue-500/20',
  tutorial: 'text-green-500 bg-green-500/10 dark:bg-green-500/20',
  tips: 'text-yellow-500 bg-yellow-500/10 dark:bg-yellow-500/20',
  faq: 'text-purple-500 bg-purple-500/10 dark:bg-purple-500/20'
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default function ResourceSection() {
  const [selectedType, setSelectedType] = useState<Resource['type'] | 'all'>('all');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const filteredResources = mockResources.filter(
    resource => selectedType === 'all' || resource.type === selectedType
  );

  const toggleBookmark = (id: string) => {
    setBookmarked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Resources
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="all" onValueChange={(value) => setSelectedType(value as Resource['type'] | 'all')}>
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="guide">Guides</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorials</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin pr-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {filteredResources.map((resource) => {
                const TypeIcon = typeIcons[resource.type];
                return (
                  <motion.div key={resource.id} layout className="group">
                    <Card className="hover-card-subtle overflow-hidden">
                      <CardContent className="p-4">
                        {resource.featured && resource.coverImage && (
                          <div className="relative h-32 -mt-4 -mx-4 mb-4">
                            <Image
                              src={resource.coverImage}
                              alt={resource.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                          </div>
                        )}

                        <div className="flex items-start gap-4">
                          <div
                            className={`p-2 rounded-lg ${
                              typeColors[resource.type]
                            }`}
                          >
                            <TypeIcon className="w-4 h-4" />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                  {resource.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {resource.description}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => toggleBookmark(resource.id)}
                              >
                                <Bookmark
                                  className={`w-4 h-4 ${
                                    bookmarked.has(resource.id)
                                      ? "fill-primary text-primary"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              </Button>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Avatar className="w-4 h-4">
                                  <Image
                                    src={resource.authorImage}
                                    alt={resource.author}
                                    width={16}
                                    height={16}
                                  />
                                </Avatar>
                                {resource.author}
                              </div>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {resource.estimatedReadTime} min read
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {resource.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {resource.reads}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(resource.datePublished)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}