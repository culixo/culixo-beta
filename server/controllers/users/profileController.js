// server/controllers/users/profileController.js
const UserModel = require('../../models/users');
const s3Service = require('../../services/s3Service');
const mediaCleanupService = require('../../services/mediaCleanupService');

const ProfileController = {
    uploadAvatar: async (req, res) => {
        try {
            const userId = req.user.id;
            const file = req.file;
    
            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded'
                });
            }
    
            // Get current user to check for existing avatar
            const currentUser = await UserModel.findById(userId);
            if (currentUser?.avatar_url) {
                // Cleanup old avatar if exists
                await mediaCleanupService.cleanupProfilePicture(currentUser.avatar_url);
            }
    
            // Upload new avatar
            const avatarUrl = await s3Service.uploadProfilePicture(file, userId);
            
            // Update user record with new avatar URL
            const updatedUser = await UserModel.updateAvatar(userId, avatarUrl);
            
            // Get complete profile data
            const profile = await UserModel.findProfileById(userId);
    
            res.json({
                success: true,
                message: 'Avatar uploaded successfully',
                data: profile
            });
        } catch (error) {
            console.error('Error uploading avatar:', error);
            res.status(500).json({
                success: false,
                message: 'Error uploading avatar',
                error: error.message
            });
        }
    },

    deleteAvatar: async (req, res) => {
        try {
            const userId = req.user.id;
            
            // Get current user to check for existing avatar
            const currentUser = await UserModel.findById(userId);
            if (currentUser?.avatar_url) {
                // Cleanup existing avatar
                await mediaCleanupService.cleanupProfilePicture(currentUser.avatar_url);
            }
    
            // Update user record to remove avatar URL
            await UserModel.updateAvatar(userId, null);
            
            // Get complete profile data
            const profile = await UserModel.findProfileById(userId);
    
            res.json({
                success: true,
                message: 'Avatar deleted successfully',
                data: profile
            });
        } catch (error) {
            console.error('Error deleting avatar:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting avatar',
                error: error.message
            });
        }
    },

    getProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            const profile = await UserModel.findProfileById(userId);
            
            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: 'Profile not found'
                });
            }

            res.json({
                success: true,
                data: profile
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching profile',
                error: error.message
            });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            const {
                full_name,
                bio,
                expertise_level,
                years_of_experience,
                specialties,
                website_url,
                instagram_handle,
                twitter_handle
            } = req.body;
    
            const updatedProfile = await UserModel.updateProfile(userId, {
                full_name, 
                bio,
                expertise_level,
                years_of_experience,
                specialties,
                website_url,
                instagram_handle,
                twitter_handle
            });
    
            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedProfile
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating profile',
                error: error.message
            });
        }
    },

    getUserProfile: async (req, res) => {
        try {
            const targetUserId = req.params.id;
            const authenticatedUserId = req.user?.id;

            const profile = await UserModel.findPublicProfileById(targetUserId);
            
            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: 'Profile not found'
                });
            }

            // Check if this is the user's own profile
            const isOwnProfile = authenticatedUserId === targetUserId;

            // Get follow status only if authenticated and not own profile
            let isFollowing = false;
            if (authenticatedUserId && !isOwnProfile) {
                isFollowing = await UserModel.getFollowStatus(authenticatedUserId, targetUserId);
            }

            const formattedProfile = {
                id: profile.id,
                name: profile.full_name,
                username: profile.username,
                expertise: profile.expertise_level || 'Beginner',
                yearsOfExperience: profile.years_of_experience || '0',
                bio: profile.bio || '',
                specialties: profile.specialties || '',
                avatarUrl: profile.avatar_url,
                stats: {
                    recipesCount: profile.recipe_count || 0,
                    collectionsCount: profile.collections_count || 0,
                    followersCount: profile.followers_count || 0,
                    followingCount: profile.following_count || 0
                },
                isOwnProfile,
                isFollowing,
                website_url: profile.website_url,
                instagram_handle: profile.instagram_handle,
                twitter_handle: profile.twitter_handle
            };

            res.json({
                success: true,
                data: formattedProfile
            });
        } catch (error) {
            console.error('Error in getUserProfile:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching user profile',
                error: error.message
            });
        }
    },
};

module.exports = ProfileController;
