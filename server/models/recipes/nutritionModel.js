// server/models/nutritionModel.js
const db = require('../../config/db');

const NutritionModel = {
    updateNutritionalInfo: async (recipeId, userId, nutritionalInfo) => {
        try {
          const result = await db.query(
            `UPDATE recipes 
             SET nutritional_info = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND user_id = $3
             RETURNING *`,
            [JSON.stringify(nutritionalInfo), recipeId, userId]
          );
          return result.rows[0];
        } catch (error) {
          throw error;
        }
    },
};

module.exports = NutritionModel;