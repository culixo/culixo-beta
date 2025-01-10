// server/controllers/recipes/nutritionController.js
const RecipeModel = require('../../models/recipes/index');
const NutritionService = require('../../services/nutritionService');

const NutritionController = {
    getNutritionalInfo: async (req, res) => {
        try {
          const recipeId = req.params.id;
          const recipe = await RecipeModel.getById(recipeId);
      
          if (!recipe) {
            return res.status(404).json({
              success: false,
              message: 'Recipe not found'
            });
          }
      
          // Check if we need to recalculate
          if (NutritionService.shouldRecalculateNutrition(recipe)) {
            const nutritionalInfo = await NutritionService.calculateNutrition(recipe.ingredients);
            await RecipeModel.updateNutritionalInfo(recipeId, recipe.user_id, nutritionalInfo);
            recipe.nutritional_info = nutritionalInfo;
          }
      
          res.json({
            success: true,
            data: recipe.nutritional_info
          });
        } catch (error) {
          console.error('Error getting nutritional info:', error);
          res.status(500).json({
            success: false,
            message: 'Error getting nutritional information',
            error: error.message
          });
        }
    },
};

module.exports = NutritionController;
