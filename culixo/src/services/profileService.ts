import { create } from 'zustand'
import { profileApi, ProfileDetails } from '@/lib/api/profile'

interface ProfileState {
  profile: ProfileDetails | null
  isLoading: boolean
  error: string | null
}

interface ProfileActions {
  fetchProfile: (userId: string) => Promise<void>
  toggleFollow: (userId: string) => Promise<void>
  updateFollowStats: (increment: boolean) => void
  reset: () => void
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null
}

export const useProfile = create<ProfileState & ProfileActions>((set, get) => ({
  ...initialState,

  fetchProfile: async (userId: string) => {
    try {
      set({ isLoading: true, error: null })
      console.log('Fetching profile for userId:', userId)
      const response = await profileApi.getProfile(userId)
      
      console.log('Profile API Response:', response)

      if (!response.data) {
        throw new Error('No profile data received')
      }

      set({ profile: response.data, isLoading: false })
    } catch (error: any) {
      console.error('Profile fetch error:', {
        error,
        message: error.message,
        stack: error.stack
      })
      set({ 
        error: error.message || 'Failed to fetch profile',
        isLoading: false,
        profile: null
      })
      throw error // Re-throw to allow handling in components
    }
  },

  toggleFollow: async (userId: string) => {
    const { profile } = get()
    if (!profile) return

    const previousState = { ...profile }

    try {
      set({
        profile: {
          ...profile,
          isFollowing: !profile.isFollowing,
          stats: {
            ...profile.stats,
            followersCount: profile.stats.followersCount + (profile.isFollowing ? -1 : 1)
          }
        }
      })

      const response = await (profile.isFollowing 
        ? profileApi.unfollowUser(userId)
        : profileApi.followUser(userId))

      if (!response.success) {
        throw new Error(response.message)
      }
    } catch (error) {
      // Revert to previous state on error
      set({ profile: previousState })
      throw error
    }
  },

  updateFollowStats: (increment: boolean) => {
    const { profile } = get()
    if (!profile) return

    set({
      profile: {
        ...profile,
        stats: {
          ...profile.stats,
          followersCount: profile.stats.followersCount + (increment ? 1 : -1)
        }
      }
    })
  },

  reset: () => set(initialState)
}))