// server/models/users/socialModel.js
const db = require('../../config/db');

const SocialModel = {
    followUser: async (followerId, followingId) => {
        try {
        const result = await db.query(
            `INSERT INTO user_follows (follower_id, following_id)
            VALUES ($1, $2)
            RETURNING *`,
            [followerId, followingId]
        );
        return result.rows[0];
        } catch (error) {
        if (error.code === '23505') { // Unique violation
            throw new Error('Already following this user');
        }
        if (error.code === '23514') { // Check constraint violation
            throw new Error('Cannot follow yourself');
        }
        throw error;
        }
    },

    unfollowUser: async (followerId, followingId) => {
        try {
        const result = await db.query(
            `DELETE FROM user_follows 
            WHERE follower_id = $1 AND following_id = $2
            RETURNING *`,
            [followerId, followingId]
        );
        return result.rows[0];
        } catch (error) {
        throw error;
        }
    },

    getFollowStatus: async (followerId, followingId) => {
        try {
        const result = await db.query(
            `SELECT EXISTS(
            SELECT 1 FROM user_follows 
            WHERE follower_id = $1 AND following_id = $2
            ) as is_following`,
            [followerId, followingId]
        );
        return result.rows[0].is_following;
        } catch (error) {
        throw error;
        }
    },

    getFollowers: async (userId, page = 1, limit = 10) => {
        try {
        const offset = (page - 1) * limit;
        const result = await db.query(
            `SELECT 
            u.id, u.full_name, u.username, u.avatar_url,
            COUNT(*) OVER() as total_count
            FROM user_follows f
            JOIN users u ON f.follower_id = u.id
            WHERE f.following_id = $1
            ORDER BY f.created_at DESC
            LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );
        
        const followers = result.rows;
        const totalCount = followers.length > 0 ? parseInt(followers[0].total_count) : 0;
        
        return {
            followers: followers.map(f => ({
            id: f.id,
            full_name: f.full_name,
            username: f.username,
            avatar_url: f.avatar_url
            })),
            pagination: {
            total: totalCount,
            pageCount: Math.ceil(totalCount / limit),
            currentPage: page,
            perPage: limit
            }
        };
        } catch (error) {
        throw error;
        }
    },

    getFollowing: async (userId, page = 1, limit = 10) => {
        try {
        const offset = (page - 1) * limit;
        const result = await db.query(
            `SELECT 
            u.id, u.full_name, u.username, u.avatar_url,
            COUNT(*) OVER() as total_count
            FROM user_follows f
            JOIN users u ON f.following_id = u.id
            WHERE f.follower_id = $1
            ORDER BY f.created_at DESC
            LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );
        
        const following = result.rows;
        const totalCount = following.length > 0 ? parseInt(following[0].total_count) : 0;
        
        return {
            following: following.map(f => ({
            id: f.id,
            full_name: f.full_name,
            username: f.username,
            avatar_url: f.avatar_url
            })),
            pagination: {
            total: totalCount,
            pageCount: Math.ceil(totalCount / limit),
            currentPage: page,
            perPage: limit
            }
        };
        } catch (error) {
        throw error;
        }
    },  
};

module.exports = SocialModel;