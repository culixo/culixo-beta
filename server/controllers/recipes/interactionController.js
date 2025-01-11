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
          
          // Use the model's implementation which has the correct query
          const result = await RecipeModel.getSavedRecipes(userId, { page });
          
          res.json({
              success: true,
              data: result  // The model already returns { recipes, pagination }
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

