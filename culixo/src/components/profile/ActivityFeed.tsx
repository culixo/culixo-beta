// src/components/profile/ActivityFeed.tsx
"use client";

import { Activity } from "@/types/profile/activity";
import { Card } from "@/components/ui/card";
import { ChefHat, Heart, BookmarkPlus, Users, MessageSquare, Timer } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";

interface ActivityFeedProps {
  activities: Activity[];
  isLoading?: boolean;
}

const ActivityIcon = ({ type }: { type: Activity["type"] }) => {
  const icons = {
    post_recipe: ChefHat,
    like_recipe: Heart,
    save_recipe: BookmarkPlus,
    follow_user: Users,
    comment: MessageSquare,
  };
  
  const Icon = icons[type];
  return <Icon className="w-5 h-5" />;
};

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card
            key={i}
            className="animate-pulse p-4 bg-background-elevated border-border-primary"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <Timer className="w-12 h-12 mb-4" />
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card
          key={activity.id}
          className="p-4 bg-background-elevated border-border-primary hover:shadow-md transition-all"
        >
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ActivityIcon type={activity.type} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <Link 
                  href={`/profile/${activity.user.id}`}
                  className="font-medium hover:text-primary"
                >
                  {activity.user.name}
                </Link>{' '}
                {getActivityText(activity.type)}{' '}
                <Link 
                  href={getActivityLink(activity)}
                  className="font-medium hover:text-primary"
                >
                  {activity.targetTitle}
                </Link>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {/* {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })} */}Created At:
              </p>
            </div>
            {activity.targetImage && (
              <div className="flex-shrink-0">
                <div className="w-16 h-16 relative rounded-md overflow-hidden">
                  <Image
                    src={activity.targetImage}
                    alt={activity.targetTitle}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

// Helper functions
const getActivityText = (type: Activity["type"]) => {
  const texts = {
    post_recipe: "posted a new recipe:",
    like_recipe: "liked the recipe:",
    save_recipe: "saved the recipe:",
    follow_user: "started following",
    comment: "commented on",
  };
  return texts[type];
};

const getActivityLink = (activity: Activity) => {
  switch (activity.type) {
    case "follow_user":
      return `/profile/${activity.targetId}`;
    default:
      return `/recipes/${activity.targetId}`;
  }
};