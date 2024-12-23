const NutritionService = require('../services/nutritionService');

const NutritionController = {
  calculateAndSaveNutrition: async (req, res) => {
    try {
      const { recipeId, ingredients } = req.body;
      const userId = req.user.id;

      // Calculate nutrition
      const nutritionalInfo = await NutritionService.calculateNutrition(ingredients);

      // Update recipe with new nutrition info
      const updatedRecipe = await NutritionService.updateRecipeNutrition(
        recipeId,
        userId,
        nutritionalInfo
      );

      if (!updatedRecipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found or unauthorized'
        });
      }

      res.json({
        success: true,
        data: {
          nutritional_info: nutritionalInfo
        },
        message: 'Nutrition information updated successfully'
      });
    } catch (error) {
      console.error('Error in calculateAndSaveNutrition:', error);
      res.status(500).json({
        success: false,
        message: 'Error calculating nutrition information',
        error: error.message
      });
    }
  },

  getNutritionInfo: async (req, res) => {
    try {
      const { id: recipeId } = req.params;
      const userId = req.user.id;

      const result = await db.query(
        'SELECT nutritional_info FROM recipes WHERE id = $1 AND user_id = $2',
        [recipeId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found or unauthorized'
        });
      }

      res.json({
        success: true,
        data: result.rows[0].nutritional_info
      });
    } catch (error) {
      console.error('Error fetching nutrition info:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching nutrition information',
        error: error.message
      });
    }
  }
};

module.exports = NutritionController;