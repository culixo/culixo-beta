// server/models/collections/interactionModel.js
const db = require('../../config/db');

const CollectionInteractionModel = {
    // Add recipe to collection
    addRecipeToCollection: async (collectionId, recipeId) => {
        try {
            const result = await db.query(
                `INSERT INTO collection_recipes (collection_id, recipe_id)
                 VALUES ($1, $2)
                 RETURNING *`,
                [collectionId, recipeId]
            );
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error('Recipe already in collection');
            }
            throw error;
        }
    },

    // Remove recipe from collection
    removeRecipeFromCollection: async (collectionId, recipeId) => {
        try {
            const result = await db.query(
                `DELETE FROM collection_recipes
                 WHERE collection_id = $1 AND recipe_id = $2
                 RETURNING *`,
                [collectionId, recipeId]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error in removeRecipeFromCollection:', error);
            throw error;
        }
    },

    // Get recipes in a collection
    getCollectionRecipes: async (collectionId, { page = 1, limit = 12 } = {}) => {
        try {
            const offset = (page - 1) * limit;
            const result = await db.query(
                `SELECT 
                    r.*,
                    u.id as author_id,
                    u.full_name as author_name,
                    u.avatar_url as author_avatar,
                    cr.added_at,
                    EXISTS(SELECT 1 FROM recipe_likes rl WHERE rl.recipe_id = r.id AND rl.user_id = c.user_id) as has_liked,
                    EXISTS(SELECT 1 FROM recipe_saves rs WHERE rs.recipe_id = r.id AND rs.user_id = c.user_id) as has_saved
                 FROM collections c
                 JOIN collection_recipes cr ON c.id = cr.collection_id
                 JOIN recipes r ON cr.recipe_id = r.id
                 LEFT JOIN users u ON r.user_id = u.id
                 WHERE c.id = $1
                 ORDER BY cr.added_at DESC
                 LIMIT $2 OFFSET $3`,
                [collectionId, limit, offset]
            );
    
            // Transform the data to match the expected format
            const transformedRows = result.rows.map(row => ({
                ...row,
                author: {
                    id: row.author_id,
                    full_name: row.author_name,
                    avatar_url: row.author_avatar
                },
                // Remove the individual fields
                author_id: undefined,
                author_name: undefined,
                author_avatar: undefined
            }));
    
            return transformedRows;
        } catch (error) {
            console.error('Error in getCollectionRecipes:', error);
            throw error;
        }
    },
};

module.exports = CollectionInteractionModel;