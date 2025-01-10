// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Debug route for development
if (process.env.NODE_ENV !== 'production') {
    router.use((req, res, next) => {
        console.log('User route request:', {
            method: req.method,
            url: req.originalUrl,
            params: req.params,
            body: req.body
        });
        next();
    });
}

// Protected routes
router.use(authMiddleware);

// Settings routes (specific paths first)
router.get('/settings/account', UserController.getAccountDetails);
router.put('/settings/account/username', UserController.updateUsername);
router.put('/settings/account/password', UserController.updatePassword);
router.delete('/settings/account', UserController.deleteAccount);
router.get('/settings/profile', UserController.getProfile);
router.put('/settings/profile', UserController.updateProfile);
router.post('/settings/profile/avatar', upload.single('avatar'), UserController.uploadAvatar);
router.delete('/settings/profile/avatar', UserController.deleteAvatar);

// Public profile routes (parameterized routes last)
router.get('/:id/profile', UserController.getUserProfile);
router.post('/:id/follow', UserController.followUser);
router.delete('/:id/follow', UserController.unfollowUser);
router.get('/:id/followers', UserController.getFollowers);
router.get('/:id/following', UserController.getFollowing);
router.get('/:id/follow-status', UserController.getFollowStatus);

module.exports = router;