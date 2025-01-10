// server/controllers/users/index.js
const AccountController = require('./accountController');
const ProfileController = require('./profileController');
const SocialController = require('./socialController');

const UserController = {
    // Account operations
    ...AccountController,
    
    // Profile operations
    ...ProfileController,
    
    // Social operations
    ...SocialController
};

module.exports = UserController;