// server/models/collections/baseModel.js
const db = require('../../config/db');

const CollectionBaseModel = {
    // Create new collection
    createCollection: async (userId, { name, description }) => {
        try {
            const result = await db.query(
                `INSERT INTO collections (user_id, name, description)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                [userId, name, description]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error in createCollection:', error);
            throw error;
        }
    },

    // Get a single collection with its details
    getCollectionById: async (collectionId, userId) => {
        try {
            const result = await db.query(
                `SELECT c.*, 
                    COUNT(cr.recipe_id) as recipe_count
                 FROM collections c
                 LEFT JOIN collection_recipes cr ON c.id = cr.collection_id
                 WHERE c.id = $1 AND c.user_id = $2
                 GROUP BY c.id`,
                [collectionId, userId]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error in getCollectionById:', error);
            throw error;
        }
    },

    // Update collection details
    updateCollection: async (collectionId, userId, { name, description }) => {
        try {
            const result = await db.query(
                `UPDATE collections
                 SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $3 AND user_id = $4
                 RETURNING *`,
                [name, description, collectionId, userId]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error in updateCollection:', error);
            throw error;
        }
    },

    // Delete collection
    deleteCollection: async (collectionId, userId) => {
        try {
            const result = await db.query(
                `DELETE FROM collections
                 WHERE id = $1 AND user_id = $2
                 RETURNING *`,
                [collectionId, userId]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error in deleteCollection:', error);
            throw error;
        }
    }
};

module.exports = CollectionBaseModel;