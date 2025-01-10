// server/controllers/users/socialController.js
const UserModel = require('../../models/users');

const SocialController = {
    followUser: async (req, res) => {
        try {
            const { id: userToFollowId } = req.params;
            const followerId = req.user.id;
        
            if (followerId === userToFollowId) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot follow yourself'
                });
            }
        
            const result = await UserModel.followUser(followerId, userToFollowId);
            
            res.json({
                success: true,
                message: 'User followed successfully',
                data: result
            });
        } catch (error) {
            console.error('Error following user:', error);
            if (error.message === 'Already following this user' || 
                error.message === 'Cannot follow yourself') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error following user',
                error: error.message
            });
        }
    },

    unfollowUser: async (req, res) => {
        try {
            const { id: userToUnfollowId } = req.params;
            const followerId = req.user.id;
        
            const result = await UserModel.unfollowUser(followerId, userToUnfollowId);
            
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Follow relationship not found'
                });
            }
        
            res.json({
                success: true,
                message: 'User unfollowed successfully'
            });
        } catch (error) {
            console.error('Error unfollowing user:', error);
            res.status(500).json({
                success: false,
                message: 'Error unfollowing user',
                error: error.message
            });
        }
    },

    getFollowers: async (req, res) => {
        try {
            const userId = req.params.id || req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
        
            const result = await UserModel.getFollowers(userId, page, limit);
            
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error getting followers:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting followers',
                error: error.message
            });
        }
    },

    getFollowing: async (req, res) => {
        try {
            const userId = req.params.id || req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
        
            const result = await UserModel.getFollowing(userId, page, limit);
            
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error getting following:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting following',
                error: error.message
            });
        }
    },

    getFollowStatus: async (req, res) => {
        try {
            const { id: targetUserId } = req.params;
            const userId = req.user.id;
        
            if (userId === targetUserId) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot check follow status for yourself'
                });
            }
        
            const isFollowing = await UserModel.getFollowStatus(userId, targetUserId);
            
            res.json({
                success: true,
                data: { isFollowing }
            });
        } catch (error) {
            console.error('Error getting follow status:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting follow status',
                error: error.message
            });
        }
    },
};

module.exports = SocialController;
