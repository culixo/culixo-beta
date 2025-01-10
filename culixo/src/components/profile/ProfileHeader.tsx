// src/components/profile/ProfileHeader.tsx
"use client"

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChefHat, Users, Edit, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfile } from '@/services/profileService'
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface ProfileHeaderProps {
  userId: string
}

export function ProfileHeader({ userId }: ProfileHeaderProps) {
  const { profile, toggleFollow } = useProfile()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const getInitials = (name: string | undefined) => {
    if (!name) return ""
    return name
      .split(" ")
      .map(word => word?.[0] || "")
      .join("")
      .toUpperCase()
  }

  const handleFollowToggle = async () => {
    if (!profile) return
    
    setIsLoading(true)
    try {
      await toggleFollow(userId)
      toast({
        title: profile.isFollowing ? "Unfollowed successfully" : "Followed successfully",
        description: profile.isFollowing 
          ? `You have unfollowed ${profile.name}`
          : `You are now following ${profile.name}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!profile) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
          <div className="flex-1 min-w-0 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-full max-w-2xl" />
            <div className="flex gap-4 mt-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="h-px bg-zinc-200 dark:bg-[#1d1e30]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Top Section with Avatar and Actions */}
      <div className="flex flex-col md:flex-row gap-6 md:items-start">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 bg-white dark:bg-[#070810] border-zinc-200 dark:border-[#1d1e30] ring-2 ring-white/20 dark:ring-black/20">
          <AvatarImage
            src={profile.avatarUrl}
            alt={profile.name || 'User avatar'}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] dark:bg-[#8B5CF6]/20">
            {getInitials(profile.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                {profile.name || 'Anonymous User'}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4" />
                  <span>{profile.expertise || 'Beginner'}</span>
                </div>
                <span>•</span>
                <span>{profile.yearsOfExperience || '0'} years of experience</span>
              </div>
            </div>

            {profile.isOwnProfile ? (
              <Button
                className="md:w-auto bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors"
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <Button
                className={cn(
                  "md:w-auto transition-colors",
                  profile.isFollowing
                    ? "bg-white dark:bg-[#070810] border-zinc-200 dark:border-[#1d1e30] hover:bg-zinc-50 dark:hover:bg-[#0A0B14]"
                    : "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                )}
                size="sm"
                onClick={handleFollowToggle}
                disabled={isLoading}
              >
                {profile.isFollowing ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Following
                  </>
                ) : (
                  "Follow"
                )}
              </Button>
            )}
          </div>

          {/* Bio */}
          <p className="mt-4 text-muted-foreground max-w-2xl">
            {profile.bio || 'No bio available'}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">
                  {profile.stats?.recipesCount || 0}
                </span>
                <span className="text-muted-foreground">recipes</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">
                    {profile.stats?.followersCount || 0}
                  </span>
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">
                    {profile.stats?.followingCount || 0}
                  </span>
                  <span className="text-muted-foreground">following</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-200 dark:bg-[#1d1e30]" />
    </div>
  )
}