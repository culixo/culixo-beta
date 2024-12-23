// src/components/community/DiscussionForums.tsx
"use client"

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Pin, 
  Search,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { mockDiscussions, type Discussion } from '@/types/community';

const categoryColors: Record<Discussion['category'], string> = {
  'Recipe Help': 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20',
  'Technique': 'bg-green-500/10 text-green-500 dark:bg-green-500/20',
  'Equipment': 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20',
  'General': 'bg-gray-500/10 text-gray-500 dark:bg-gray-500/20',
  'Ingredients': 'bg-orange-500/10 text-orange-500 dark:bg-orange-500/20'
};

const getTimeAgo = (timestamp: string) => {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function DiscussionForums() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Discussion['category'] | 'All'>('All');

  const filteredDiscussions = mockDiscussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.preview?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || discussion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(mockDiscussions.map(d => d.category))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Discussions</span>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New Topic
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className={`cursor-pointer hover:opacity-80 transition-opacity ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      category as Discussion["category"] | "All"
                    )
                  }
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Discussions List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {filteredDiscussions.map((discussion) => (
                <motion.div key={discussion.id} layout className="group">
                  <Card className="hover-card-subtle">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-4 h-4 sm:hidden">
                          <Image
                            src={discussion.authorImage}
                            alt={discussion.author}
                            width={16}
                            height={16}
                          />
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold group-hover:text-primary transition-colors flex items-center gap-2">
                                {discussion.title}
                                {discussion.solved && (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                )}
                                {discussion.pinned && (
                                  <Pin className="w-4 h-4 text-blue-500" />
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {discussion.preview}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <Badge
                              variant="secondary"
                              className={categoryColors[discussion.category]}
                            >
                              {discussion.category}
                            </Badge>
                            {discussion.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Avatar className="w-4 h-4 sm:hidden">
                                <Image
                                  src={discussion.authorImage}
                                  alt={discussion.author}
                                  width={16}
                                  height={16}
                                />
                              </Avatar>
                              {discussion.author}
                              {discussion.authorBadge && (
                                <Badge variant="secondary" className="text-xs">
                                  {discussion.authorBadge}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="flex items-center">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                {discussion.replies}
                              </span>
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {discussion.views}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {getTimeAgo(discussion.lastActivity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredDiscussions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  No discussions found for your search.
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}