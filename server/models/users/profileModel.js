// server/models/users/profileModel.js
const db = require('../../config/db');

const ProfileModel = {
    updateAvatar: async (userId, avatarUrl) => {
        try {
            const result = await db.query(
                `UPDATE users 
                SET avatar_url = $1, 
                    updated_at = CURRENT_TIMESTAMP 
                WHERE id = $2 
                RETURNING 
                    id,
                    full_name,
                    avatar_url`,
                [avatarUrl, userId]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    findProfileById: async (userId) => {
        try {
            const result = await db.query(
                `SELECT 
                    u.full_name,
                    u.avatar_url,
                    up.bio,
                    up.expertise_level,
                    up.years_of_experience,
                    up.specialties,
                    up.website_url,
                    up.instagram_handle,
                    up.twitter_handle,
                    up.updated_at
                FROM users u
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE u.id = $1`,
                [userId]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    updateProfile: async (userId, profileData) => {
        try {
            // Start transaction
            await db.query('BEGIN');
    
            // Update full_name in users table
            await db.query(
                'UPDATE users SET full_name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [profileData.full_name, userId]
            );
    
            // Check if profile exists
            const profileExists = await db.query(
                'SELECT id FROM user_profiles WHERE user_id = $1',
                [userId]
            );
    
            let result;
            if (profileExists.rows.length > 0) {
                // Update existing profile
                result = await db.query(
                    `UPDATE user_profiles 
                    SET 
                        bio = $1,
                        expertise_level = $2,
                        years_of_experience = $3,
                        specialties = $4,
                        website_url = $5,
                        instagram_handle = $6,
                        twitter_handle = $7,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = $8
                    RETURNING 
                        user_id,
                        bio,
                        expertise_level as "expertise_level",
                        years_of_experience as "years_of_experience",
                        specialties,
                        website_url as "website_url",
                        instagram_handle as "instagram_handle",
                        twitter_handle as "twitter_handle",
                        updated_at as "updated_at"`,
                    [
                        profileData.bio,
                        profileData.expertise_level,
                        profileData.years_of_experience,
                        profileData.specialties,
                        profileData.website_url,
                        profileData.instagram_handle,
                        profileData.twitter_handle,
                        userId
                    ]
                );
            } else {
                // Create new profile
                result = await db.query(
                    `INSERT INTO user_profiles (
                        user_id,
                        bio,
                        expertise_level,
                        years_of_experience,
                        specialties,
                        website_url,
                        instagram_handle,
                        twitter_handle
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING 
                        user_id,
                        bio,
                        expertise_level as "expertise_level",
                        years_of_experience as "years_of_experience",
                        specialties,
                        website_url as "website_url",
                        instagram_handle as "instagram_handle",
                        twitter_handle as "twitter_handle",
                        updated_at as "updated_at"`,
                    [
                        userId,
                        profileData.bio,
                        profileData.expertise_level,
                        profileData.years_of_experience,
                        profileData.specialties,
                        profileData.website_url,
                        profileData.instagram_handle,
                        profileData.twitter_handle
                    ]
                );
            }

            // Get the updated user name
            const userResult = await db.query(
                'SELECT full_name FROM users WHERE id = $1',
                [userId]
            );

            await db.query('COMMIT');
            
            // Combine user and profile data
            return {
                ...userResult.rows[0],
                ...result.rows[0]
            };
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    },

    findPublicProfileById: async (userId) => {
        try {
            const query = `
                SELECT 
                    u.id,
                    u.full_name,
                    u.username,
                    u.avatar_url,
                    u.recipe_count,
                    u.collections_count,
                    u.followers_count,
                    u.following_count,
                    up.bio,
                    up.expertise_level,
                    up.years_of_experience,
                    up.specialties,
                    up.website_url,
                    up.instagram_handle,
                    up.twitter_handle
                FROM users u
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE u.id = $1`;
            
            console.log('Executing query:', query);
            console.log('With userId:', userId);
            
            const result = await db.query(query, [userId]);
            
            console.log('Query result:', result.rows[0]);
            
            return result.rows[0];
        } catch (error) {
            console.error('Error in findPublicProfileById:', error);
            throw error;
        }
    },
};

module.exports = ProfileModel;
