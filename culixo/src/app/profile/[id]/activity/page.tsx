// src/app/profile/[id]/activity/page.tsx
import { notFound } from "next/navigation";
import { ActivityFeed } from "@/components/profile/ActivityFeed";
import type { Activity } from "@/types/profile/activity";

// This is a mock function - replace with your actual data fetching
async function getProfileActivity(userId: string): Promise<{ activities: Activity[] }> {
  // You would typically fetch this from your API
  return {
    activities: [
      {
        id: "1",
        type: "post_recipe",
        targetId: "recipe-1",
        targetTitle: "Butter Chicken",
        targetImage: "/placeholder-recipe.jpg",
        createdAt: new Date().toISOString(),
        user: {
          id: userId,
          name: "Harjot Singh",
          avatarUrl: "/placeholder-avatar.jpg"
        }
      },
      {
        id: "2",
        type: "like_recipe",
        targetId: "recipe-2",
        targetTitle: "Vegetable Biryani",
        targetImage: "/placeholder-recipe-2.jpg",
        createdAt: new Date().toISOString(),
        user: {
          id: userId,
          name: "Harjot Singh",
          avatarUrl: "/placeholder-avatar.jpg"
        }
      }
    ]
  };
}

export default async function ActivityPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const { activities } = await getProfileActivity(params.id);

    return (
      <div className="animate-fade-in-up">
        <ActivityFeed activities={activities} />
      </div>
    );
  } catch (error) {
    return notFound();
  }
}