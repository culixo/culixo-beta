// server/models/users/index.js
const AccountModel = require('./accountModel');
const ProfileModel = require('./profileModel');
const SocialModel = require('./socialModel');

const UserModel = {
    // Account operations
    ...AccountModel,
    
    // Profile operations
    ...ProfileModel,
    
    // Social operations
    ...SocialModel
};

module.exports = UserModel;
