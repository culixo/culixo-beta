const axios = require('axios');
const db = require('../config/db');

const NutritionService = {
  calculateNutrition: async (ingredients) => {
    try {
      // Debug logs
      console.log('Received ingredients:', ingredients);
      console.log('Is Array?', Array.isArray(ingredients));
      console.log('Ingredients Length:', ingredients.length);
      
      // Validate ingredients
      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        console.log('Validation failed:', { 
          isArray: Array.isArray(ingredients), 
          length: ingredients?.length,
          ingredients 
        });
        throw new Error('Invalid ingredients format: Must be a non-empty array');
      }

      // Format ingredients
      const formattedIngredients = ingredients.map(ing => {
        console.log('Processing ingredient:', ing);
        if (!ing.quantity || !ing.unit || !ing.name) {
          throw new Error('Invalid ingredient format: missing required fields');
        }
        return `${ing.quantity} ${ing.unit} ${ing.name}`;
      });

      const response = await axios.post(
        `https://api.edamam.com/api/nutrition-details?app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}`,
        {
          ingr: formattedIngredients
        }
      );

      const data = response.data;
      
      return {
        calories: Math.round(data.calories || 0),
        protein: Math.round(data.totalNutrients.PROCNT?.quantity || 0),
        carbs: Math.round(data.totalNutrients.CHOCDF?.quantity || 0),
        fat: Math.round(data.totalNutrients.FAT?.quantity || 0),
        fiber: Math.round(data.totalNutrients.FIBTG?.quantity || 0),
        vitamins: {
          a: Math.round(data.totalNutrients.VITA_RAE?.quantity || 0),
          c: Math.round(data.totalNutrients.VITC?.quantity || 0),
          d: Math.round(data.totalNutrients.VITD?.quantity || 0),
          e: Math.round(data.totalNutrients.TOCPHA?.quantity || 0),
          k: Math.round(data.totalNutrients.VITK1?.quantity || 0),
          b6: Math.round(data.totalNutrients.VITB6A?.quantity || 0),
          b12: Math.round(data.totalNutrients.VITB12?.quantity || 0)
        },
        minerals: {
          calcium: Math.round(data.totalNutrients.CA?.quantity || 0),
          iron: Math.round(data.totalNutrients.FE?.quantity || 0),
          magnesium: Math.round(data.totalNutrients.MG?.quantity || 0),
          zinc: Math.round(data.totalNutrients.ZN?.quantity || 0)
        },
        last_calculated: new Date().toISOString(),
        ingredient_version: formattedIngredients.sort().join('|'),
        servings: data.yield || 1
      };
    } catch (error) {
      if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      console.error('Nutrition calculation error:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Failed to calculate nutrition information');
    }
  },

  updateRecipeNutrition: async (recipeId, userId, nutritionalInfo) => {
    try {
      const result = await db.query(
        `UPDATE recipes 
         SET nutritional_info = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND user_id = $3
         RETURNING *`,
        [JSON.stringify(nutritionalInfo), recipeId, userId]
      );

      if (!result.rows[0]) {
        throw new Error('Recipe not found or unauthorized');
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // New method to check if nutrition needs recalculation
  shouldRecalculateNutrition: (recipe) => {
    if (!recipe.nutritional_info) return true;

    const currentVersion = recipe.ingredients
      .map(ing => `${ing.quantity} ${ing.unit} ${ing.name}`)
      .sort()
      .join('|');

    return currentVersion !== recipe.nutritional_info.ingredient_version;
  },

  // New method to handle nutrition calculation during publishing
  calculateAndUpdateNutrition: async (recipeData, userId) => {
    try {
      const nutritionalInfo = await NutritionService.calculateNutrition(recipeData.ingredients);
      
      // If this is a new recipe, just return the nutritional info
      if (!recipeData.id) {
        return nutritionalInfo;
      }

      // Otherwise, update the existing recipe
      return await NutritionService.updateRecipeNutrition(
        recipeData.id,
        userId,
        nutritionalInfo
      );
    } catch (error) {
      throw error;
    }
  }
};

module.exports = NutritionService;