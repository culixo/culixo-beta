// src/types/profile/activity.ts
export interface Activity {
    id: string;
    type: 'post_recipe' | 'like_recipe' | 'save_recipe' | 'follow_user' | 'comment';
    targetId: string;
    targetTitle: string;
    targetImage?: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      avatarUrl?: string;
    };
  }