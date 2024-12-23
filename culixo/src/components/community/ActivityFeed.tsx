// src/components/community/ActivityFeed.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Trophy, UserPlus, Clock, ChefHat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockActivities, type Activity } from '@/types/community';

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'recipe':
      return ChefHat;
    case 'comment':
      return MessageSquare;
    case 'like':
      return Heart;
    case 'achievement':
      return Trophy;
    case 'follow':
      return UserPlus;
    default:
      return ChefHat;
  }
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

export default function ActivityFeed() {
  const [activities, setActivities] = useState(mockActivities);
  const [filter, setFilter] = useState<Activity['type'] | 'all'>('all');

  const filteredActivities = activities.filter(activity => 
    filter === 'all' ? true : activity.type === filter
  );

  const handleLike = (id: string) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === id) {
        return {
          ...activity,
          liked: !activity.liked,
          likes: activity.liked ? activity.likes - 1 : activity.likes + 1
        };
      }
      return activity;
    }));
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Activity Feed</h2>
          <p className="text-muted-foreground">See what&apos;s happening in the community</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'recipe', 'comment', 'achievement', 'follow'] as const).map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type)}
              className="capitalize"
            >
              {type === 'all' ? 'All' : type}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover-card-subtle">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar className="w-10 h-10">
                        <Image
                          src={activity.userImage}
                          alt={activity.userName}
                          width={40}
                          height={40}
                        />
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">
                              {activity.userName}
                              <span className="text-muted-foreground font-normal">
                                {activity.type === "follow"
                                  ? ` started following ${activity.targetUser}`
                                  : activity.type === "achievement"
                                  ? ` earned an achievement`
                                  : activity.type === "recipe"
                                  ? ` shared a recipe`
                                  : ` left a comment`}
                              </span>
                            </p>

                            <div className="flex items-center gap-2 mt-1">
                              <Icon className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">
                                {activity.content}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {getTimeAgo(activity.timestamp)}
                          </div>
                        </div>

                        {activity.recipeImage && (
                          <Image
                            src={activity.recipeImage}
                            alt={activity.content}
                            fill
                            className="rounded-md object-cover"
                          />
                        )}

                        {activity.achievement && (
                          <Badge variant="secondary" className="mt-2">
                            <Trophy className="w-3 h-3 mr-1" />
                            {activity.achievement}
                          </Badge>
                        )}

                        <div className="flex items-center gap-4 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => handleLike(activity.id)}
                          >
                            <Heart
                              className={`w-4 h-4 mr-1 ${
                                activity.liked
                                  ? "fill-primary text-primary"
                                  : ""
                              }`}
                            />
                            {activity.likes}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-primary"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {activity.comments}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}