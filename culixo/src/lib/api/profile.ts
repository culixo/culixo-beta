import api from '../axios'
import { ApiResponse } from './user'

export interface ProfileDetails {
  id: string
  name: string
  username: string
  expertise: string
  yearsOfExperience: string
  bio: string
  avatarUrl?: string
  isOwnProfile: boolean
  isFollowing?: boolean
  stats: {
    recipesCount: number
    collectionsCount: number
    followersCount: number
    followingCount: number
  }
  website_url?: string | null
  instagram_handle?: string | null
  twitter_handle?: string | null
  specialties: string
}

export const profileApi = {
  getProfile: async (userId: string): Promise<ApiResponse<ProfileDetails>> => {
    try {
      const response = await api.get(`/users/${userId}/profile`)
      
      // Add debug logging
      console.log('Raw API Response:', response)

      // Remember that our axios interceptor already returns response.data
      if (!response.data) {
        throw new Error('No data in API response')
      }

      // Transform backend data to match our interface
      const data = {
        id: response.data.id,
        name: response.data.name,
        username: response.data.username,
        expertise: response.data.expertise || 'Beginner',
        yearsOfExperience: response.data.yearsOfExperience || '0',
        bio: response.data.bio || '',
        avatarUrl: response.data.avatarUrl,
        isOwnProfile: response.data.isOwnProfile || false,
        isFollowing: response.data.isFollowing || false,
        specialties: response.data.specialties || '',
        stats: {
          recipesCount: Number(response.data.stats?.recipesCount) || 0,
          collectionsCount: Number(response.data.stats?.collectionsCount) || 0,
          followersCount: Number(response.data.stats?.followersCount) || 0,
          followingCount: Number(response.data.stats?.followingCount) || 0
        },
        website_url: response.data.website_url || null,
        instagram_handle: response.data.instagram_handle || null,
        twitter_handle: response.data.twitter_handle || null
      }

      return {
        success: true,
        data: data
      }
    } catch (error: any) {
      console.error('Profile API Error:', error)
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch profile')
    }
  },

  followUser: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await api.post(`/users/${userId}/follow`)
      // response is already transformed by axios interceptor
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      console.error('Error following user:', error)
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to follow user'
      }
    }
  },

  unfollowUser: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/users/${userId}/follow`)
      // response is already transformed by axios interceptor
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      console.error('Error unfollowing user:', error)
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to unfollow user'
      }
    }
  }
}