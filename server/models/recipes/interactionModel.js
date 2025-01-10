// server/model/recipes/interactionModel.js
const db = require('../../config/db');

const InteractionModel = {
    likeRecipe: async (userId, recipeId) => {
        try {
          const result = await db.query(
            `INSERT INTO recipe_likes (user_id, recipe_id)
             VALUES ($1, $2)
             RETURNING *`,
            [userId, recipeId]
          );
          return result.rows[0];
        } catch (error) {
          if (error.code === '23505') { // Unique violation
            throw new Error('Recipe already liked');
          }
          throw error;
        }
    },

    unlikeRecipe: async (userId, recipeId) => {
        try {
          const result = await db.query(
            `DELETE FROM recipe_likes 
             WHERE user_id = $1 AND recipe_id = $2
             RETURNING *`,
            [userId, recipeId]
          );
          return result.rows[0];
        } catch (error) {
          throw error;
        }
    },

    saveRecipe: async (userId, recipeId) => {
        try {
          const result = await db.query(
            `INSERT INTO recipe_saves (user_id, recipe_id)
             VALUES ($1, $2)
             RETURNING *`,
            [userId, recipeId]
          );
          return result.rows[0];
        } catch (error) {
          if (error.code === '23505') { // Unique violation
            throw new Error('Recipe already saved');
          }
          throw error;
        }
    },

    unsaveRecipe: async (userId, recipeId) => {
        try {
          const result = await db.query(
            `DELETE FROM recipe_saves 
             WHERE user_id = $1 AND recipe_id = $2
             RETURNING *`,
            [userId, recipeId]
          );
          return result.rows[0];
        } catch (error) {
          throw error;
        }
    },

    getSavedRecipes: async (userId, { page = 1, limit = 12 } = {}) => {
        try {
          const offset = (page - 1) * limit;
          
          const query = `
            SELECT 
              r.*,
              u.full_name as author_name,
              u.avatar_url as author_avatar,
              COUNT(*) OVER() as total_count,
              EXISTS(SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = $1) as has_liked,
              COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id), 0) as likes_count,
              COALESCE((SELECT COUNT(*) FROM recipe_saves WHERE recipe_id = r.id), 0) as saves_count
            FROM recipe_saves rs
            JOIN recipes r ON rs.recipe_id = r.id
            LEFT JOIN users u ON r.user_id = u.id
            WHERE rs.user_id = $1
            ORDER BY rs.created_at DESC
            LIMIT $2 OFFSET $3
          `;
      
          const result = await db.query(query, [userId, limit, offset]);
          
          const recipes = result.rows;
          const totalRecipes = recipes.length > 0 ? parseInt(recipes[0].total_count) : 0;
          const totalPages = Math.ceil(totalRecipes / limit);
      
          return {
            recipes: recipes.map(recipe => ({
              id: recipe.id,
              title: recipe.title,
              description: recipe.description,
              difficulty_level: recipe.difficulty_level,
              prep_time: recipe.prep_time,
              cook_time: recipe.cook_time,
              likes_count: parseInt(recipe.likes_count) || 0,
              saves_count: parseInt(recipe.saves_count) || 0,
              media: recipe.media,
              author: {
                id: recipe.user_id,
                full_name: recipe.author_name,
                avatar_url: recipe.author_avatar
              },
              created_at: recipe.created_at,
              has_liked: recipe.has_liked || false,
              has_saved: true,
            })),
            pagination: {
              currentPage: page,
              totalPages,
              totalRecipes,
              hasNextPage: page < totalPages,
              hasPreviousPage: page > 1
            }
          };
        } catch (error) {
          console.error('Error in getSavedRecipes:', error);
          throw error;
        }
    },

    getUserInteractions: async (userId, recipeId) => {
        try {
          // Validate UUID format
          if (!recipeId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
            return { has_liked: false, has_saved: false };
          }
    
          const result = await db.query(
            `SELECT 
               EXISTS(SELECT 1 FROM recipe_likes WHERE user_id = $1 AND recipe_id = $2) as has_liked,
               EXISTS(SELECT 1 FROM recipe_saves WHERE user_id = $1 AND recipe_id = $2) as has_saved`,
            [userId, recipeId]
          );
          return result.rows[0];
        } catch (error) {
          console.error('Error in getUserInteractions:', error);
          return { has_liked: false, has_saved: false };
        }
    },
};

module.exports = InteractionModel;