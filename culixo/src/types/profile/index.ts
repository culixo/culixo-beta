// src/types/profile/index.ts
export interface UserProfile {
    id: string;
    username: string;
    name: string;
    email: string;
    bio: string;
    expertise: ExpertiseLevel;
    yearsOfExperience: number;
    avatarUrl?: string;
    isPrivate: boolean;
    stats: ProfileStats;
    isOwnProfile: boolean;
    isFollowing?: boolean;
  }
  
  export interface ProfileStats {
    recipesCount: number;
    followersCount: number;
    followingCount: number;
  }
  
  export type ExpertiseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional' | 'Master Chef';
  
  export type ProfileTab = 'recipes' | 'saved' | 'collections' | 'activity' | 'stats';