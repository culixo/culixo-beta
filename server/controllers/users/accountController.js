// server/controllers/users/accountController.js
const UserModel = require('../../models/users');
const bcrypt = require('bcrypt');
const { hashPassword } = require('../../utils/passwordUtils');
const pool = require('../../config/db');

const AccountController = {
    getAccountDetails: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await UserModel.findById(userId);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Remove sensitive information
            const { password_hash, ...userDetails } = user;

            res.json({
                success: true,
                data: userDetails
            });
        } catch (error) {
            console.error('Error fetching account details:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching account details',
                error: error.message
            });
        }
    },

    updateUsername: async (req, res) => {
        try {
            const userId = req.user.id;
            const { username } = req.body;

            if (!username) {
                return res.status(400).json({
                    success: false,
                    message: 'Username is required'
                });
            }

            const updatedUser = await UserModel.updateAccountDetails(userId, { username });

            res.json({
                success: true,
                data: updatedUser,
                message: 'Username updated successfully'
            });
        } catch (error) {
            console.error('Error updating username:', error);
            
            if (error.message === 'Username already taken') {
                return res.status(400).json({
                    success: false,
                    message: 'Username already taken'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error updating username',
                error: error.message
            });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password and new password are required'
                });
            }

            // Get complete user data including password_hash
            const result = await pool.query(
                'SELECT id, email, password_hash FROM users WHERE id = $1',
                [userId]
            );

            const user = result.rows[0];
            
            if (!user || !user.password_hash) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found or password not set'
                });
            }

            // Verify current password
            const validPassword = await bcrypt.compare(currentPassword, user.password_hash);

            if (!validPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Hash new password
            const newPasswordHash = await hashPassword(newPassword);

            // Update password in transaction
            await pool.query('BEGIN');
            try {
                await pool.query(
                    `UPDATE users 
                    SET password_hash = $1, 
                        updated_at = CURRENT_TIMESTAMP 
                    WHERE id = $2
                    RETURNING id`,
                    [newPasswordHash, userId]
                );
                
                await pool.query('COMMIT');

                res.json({
                    success: true,
                    message: 'Password updated successfully'
                });
            } catch (err) {
                await pool.query('ROLLBACK');
                throw err;
            }
        } catch (error) {
            console.error('Error updating password:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating password',
                error: error.message
            });
        }
    },

    deleteAccount: async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await UserModel.deleteAccount(userId);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'Account deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting account:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting account',
                error: error.message
            });
        }
    },
};

module.exports = AccountController;
