// server/models/users/accountModel.js
const db = require('../../config/db');

const AccountModel = {
    createUser: async ({fullName, email, passwordHash}) => {
        try {
            const result = await db.query(
                `INSERT INTO users (
                    full_name, 
                    email, 
                    password_hash, 
                    username,
                    is_email_verified,
                    created_at,
                    updated_at
                ) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
                RETURNING id, full_name, email, username`,
                [fullName, email, passwordHash, email, false]
            );
            return result.rows[0];
        } catch (error) {
            // Check for unique constraint violation
            if (error.code === '23505') { // PostgreSQL unique violation code
                if (error.constraint === 'users_email_key') {
                    throw new Error('Email already registered');
                }
                if (error.constraint === 'users_username_key') {
                    throw new Error('Username already taken');
                }
            }
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const result = await db.query(
                'SELECT id, full_name, email, username, is_email_verified, auth_provider, created_at, updated_at, last_login FROM users WHERE id = $1',
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

    isUsernameUnique: async (username, userId) => {
        try {
            // Check if username exists for any other user
            const result = await db.query(
                'SELECT id FROM users WHERE username = $1 AND id != $2',
                [username, userId]
            );
            return result.rows.length === 0;
        } catch (error) {
            throw error;
        }
    },

    updateAccountDetails: async (userId, { username }) => {
        try {
            // First check if username is unique
            const isUnique = await UserModel.isUsernameUnique(username, userId);
            if (!isUnique) {
                throw new Error('Username already taken');
            }

            const result = await db.query(
                `UPDATE users 
                SET username = $1, 
                    updated_at = CURRENT_TIMESTAMP 
                WHERE id = $2 
                RETURNING id, username, email, full_name`,
                [username, userId]
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

    updatePassword: async (userId, passwordHash) => {
        try {
            const result = await db.query(
                `UPDATE users 
                SET password_hash = $1, 
                    updated_at = CURRENT_TIMESTAMP 
                WHERE id = $2 
                RETURNING id`,
                [passwordHash, userId]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    deleteAccount: async (userId) => {
        try {
            // Start a transaction
            await db.query('BEGIN');

            // Delete user data from related tables (based on ON DELETE CASCADE)
            const result = await db.query(
                'DELETE FROM users WHERE id = $1 RETURNING id',
                [userId]
            );

            await db.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    },
};

module.exports = AccountModel;
