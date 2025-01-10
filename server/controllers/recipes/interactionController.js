// server/controllers/recipes/interactionController.js
const RecipeModel = require('../../models/recipes/index');
const pool = require('../../config/db');

const InteractionController = {
    likeRecipe: async (req, res) => {
        try {
          const { id: recipeId } = req.params;
          const userId = req.user.id;
      
          const result = await RecipeModel.likeRecipe(userId, recipeId);
          
          res.json({
            success: true,
            message: 'Recipe liked successfully',
            data: result
          });
        } catch (error) {
          console.error('Error liking recipe:', error);
          if (error.message === 'Recipe already liked') {
            return res.status(400).json({
              success: false,
              message: error.message
            });
          }
          res.status(500).json({
            success: false,
            message: 'Error liking recipe',
            error: error.message
          });
        }
    },

    unlikeRecipe: async (req, res) => {
        try {
          const { id: recipeId } = req.params;
          const userId = req.user.id;
      
          const result = await RecipeModel.unlikeRecipe(userId, recipeId);
          
          if (!result) {
            return res.status(404).json({
              success: false,
              message: 'Like not found'
            });
          }
      
          res.json({
            success: true,
            message: 'Recipe unliked successfully'
          });
        } catch (error) {
          console.error('Error unliking recipe:', error);
          res.status(500).json({
            success: false,
            message: 'Error unliking recipe',
            error: error.message
          });
        }
    },

    saveRecipe: async (req, res) => {
        try {
          const { id: recipeId } = req.params;
          const userId = req.user.id;
      
          const result = await RecipeModel.saveRecipe(userId, recipeId);
          
          res.json({
            success: true,
            message: 'Recipe saved successfully',
            data: result
          });
        } catch (error) {
          console.error('Error saving recipe:', error);
          if (error.message === 'Recipe already saved') {
            return res.status(400).json({
              success: false,
              message: error.message
            });
          }
          res.status(500).json({
            success: false,
            message: 'Error saving recipe',
            error: error.message
          });
        }
    },

    unsaveRecipe: async (req, res) => {
        try {
          const { id: recipeId } = req.params;
          const userId = req.user.id;
      
          const result = await RecipeModel.unsaveRecipe(userId, recipeId);
          
          if (!result) {
            return res.status(404).json({
              success: false,
              message: 'Save not found'
            });
          }
      
          res.json({
            success: true,
            message: 'Recipe unsaved successfully'
          });
        } catch (error) {
          console.error('Error unsaving recipe:', error);
          res.status(500).json({
            success: false,
            message: 'Error unsaving recipe',
            error: error.message
          });
        }
    },

    getRecipeInteractions: async (req, res) => {
        try {
          const { id: recipeId } = req.params;
          const userId = req.user.id;
      
          const interactions = await RecipeModel.getUserInteractions(userId, recipeId);
          
          res.json({
            success: true,
            data: interactions
          });
        } catch (error) {
          console.error('Error getting recipe interactions:', error);
          res.json({
            success: true,
            data: { has_liked: false, has_saved: false }
          });
        }
    },

    getSavedRecipes: async (req, res) => {
        try {
          const page = parseInt(req.query.page) || 1;
          const userId = req.user.id;
          const limit = 12;
          const offset = (page - 1) * limit;
      
          // Get total count for pagination
          const countResult = await pool.query(
            `SELECT COUNT(*) FROM recipe_saves WHERE user_id = $1`,
            [userId]
          );
          const totalRecipes = parseInt(countResult.rows[0].count);
      
          // Main query
          const query = `
            SELECT 
              r.*,
              u.full_name as author_name,
              u.avatar_url as author_avatar,
              COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id), 0) as likes_count,
              COALESCE((SELECT COUNT(*) FROM recipe_saves WHERE recipe_id = r.id), 0) as saves_count
            FROM recipe_saves rs
            INNER JOIN recipes r ON rs.recipe_id = r.id
            LEFT JOIN users u ON r.user_id = u.id
            WHERE rs.user_id = $1
            ORDER BY rs.created_at DESC
            LIMIT $2 OFFSET $3`;
          
          const result = await pool.query(query, [userId, limit, offset]);
          
          // Format the response
          const recipes = result.rows.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            difficulty_level: recipe.difficulty_level,
            prep_time: recipe.prep_time,
            cook_time: recipe.cook_time,
            likes_count: parseInt(recipe.likes_count || 0),
            saves_count: parseInt(recipe.saves_count || 0),
            media: recipe.media,
            author: {
              id: recipe.user_id,
              full_name: recipe.author_name,
              avatar_url: recipe.author_avatar
            },
            created_at: recipe.created_at,
            has_liked: recipe.has_liked || false,
            has_saved: true,
          }));
      
          res.json({
            success: true,
            data: {
              recipes,
              pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalRecipes / limit),
                totalRecipes,
                hasNextPage: page < Math.ceil(totalRecipes / limit),
                hasPreviousPage: page > 1
              }
            }
          });
        } catch (error) {
          console.error('Error fetching saved recipes:', error);
          res.status(500).json({
            success: false,
            message: 'Error fetching saved recipes',
            error: error.message
          });
        }
    },
};

module.exports = InteractionController;

