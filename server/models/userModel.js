const db = require('../config/db');

const UserModel = {
    findById: async (id) => {
        try {
            const result = await db.query(
                'SELECT id, full_name, email, is_email_verified, auth_provider, created_at, updated_at, last_login FROM users WHERE id = $1',
                [id]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    findByEmail: async (email) => {
        try {
            const result = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    updateLastLogin: async (userId) => {
        try {
            const result = await db.query(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
                [userId]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    updateProfile: async (userId, updateData) => {
        const { full_name, email } = updateData;
        try {
            const result = await db.query(
                'UPDATE users SET full_name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
                [full_name, email, userId]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
};

module.exports = UserModel;