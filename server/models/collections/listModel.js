// server/models/collections/listModel.js
const db = require('../../config/db');

const CollectionListModel = {
    // Get all collections for a user
    getUserCollections: async (userId, { page = 1, limit = 12 } = {}) => {
        try {
            const offset = (page - 1) * limit;
            const query = `
                SELECT 
                    c.*,
                    COALESCE(COUNT(cr.recipe_id), 0)::int as recipe_count
                FROM collections c
                LEFT JOIN collection_recipes cr ON c.id = cr.collection_id
                WHERE c.user_id = $1
                GROUP BY c.id
                ORDER BY c.updated_at DESC
                LIMIT $2 OFFSET $3`;

            const countQuery = `
                SELECT COUNT(*) 
                FROM collections 
                WHERE user_id = $1`;

            const [collections, countResult] = await Promise.all([
                db.query(query, [userId, limit, offset]),
                db.query(countQuery, [userId])
            ]);

            const totalCollections = parseInt(countResult.rows[0].count);
            const totalPages = Math.ceil(totalCollections / limit);

            return {
                collections: collections.rows,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalCollections,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1
                }
            };
        } catch (error) {
            console.error('Error in getUserCollections:', error);
            throw error;
        }
    }
};

module.exports = CollectionListModel;