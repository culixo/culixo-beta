// server/controllers/recipes/publishController.js
const RecipeModel = require('../../models/recipes/index');
const pool = require('../../config/db');
const RecipeDraftModel = require('../../models/recipeDraftModel');
const NutritionService = require('../../services/nutritionService');
const mediaCleanupService = require('../../services/mediaCleanupService');

const PublishController = {
    updateIngredients: async (req, res) => {
        const { id } = req.params;
        const { ingredients } = req.body;
        const userId = req.user.id;
      
        try {
          const result = await pool.query(
            `UPDATE recipe_drafts 
             SET ingredients = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND user_id = $3
             RETURNING *`,
            [JSON.stringify(ingredients), id, userId]
          );
      
          if (result.rows.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'Draft not found or unauthorized'
            });
          }
      
          res.status(200).json({
            success: true,
            data: result.rows[0],
            message: 'Ingredients updated successfully'
          });
        } catch (error) {
          console.error('Error updating ingredients:', error);
          res.status(500).json({
            success: false,
            message: 'Error updating ingredients',
            error: error.message
          });
        }
    },

    getIngredients: async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;
      
        try {
          const result = await pool.query(
            'SELECT ingredients FROM recipe_drafts WHERE id = $1 AND user_id = $2',
            [id, userId]
          );
      
          if (result.rows.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'Draft not found or unauthorized'
            });
          }
      
          res.status(200).json({
            success: true,
            data: result.rows[0].ingredients
          });
        } catch (error) {
          console.error('Error fetching ingredients:', error);
          res.status(500).json({
            success: false,
            message: 'Error fetching ingredients'
          });
        }
    },

    updateInstructions: async (req, res) => {
        const { id } = req.params;
        const { instructions } = req.body;
        const userId = req.user.id;
      
        try {
          const result = await pool.query(
            `UPDATE recipe_drafts 
             SET instructions = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND user_id = $3
             RETURNING *`,
            [JSON.stringify(instructions), id, userId]
          );
      
          if (result.rows.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'Draft not found or unauthorized'
            });
          }
      
          res.status(200).json({
            success: true,
            data: result.rows[0],
            message: 'Instructions updated successfully'
          });
        } catch (error) {
          console.error('Error updating instructions:', error);
          res.status(500).json({
            success: false,
            message: 'Error updating instructions',
            error: error.message
          });
        }
    },

    updateTags: async (req, res) => {
        const { id } = req.params;
        const { tags } = req.body;
        const userId = req.user.id;
      
        try {
          const result = await pool.query(
            `UPDATE recipe_drafts 
             SET tags = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND user_id = $3
             RETURNING *`,
            [tags, id, userId]
          );
      
          if (result.rows.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'Draft not found or unauthorized'
            });
          }
      
          res.status(200).json({
            success: true,
            data: result.rows[0],
            message: 'Tags updated successfully'
          });
        } catch (error) {
          console.error('Error updating tags:', error);
          res.status(500).json({
            success: false,
            message: 'Error updating tags',
            error: error.message
          });
        }
    },

    updateCookingTips: async (req, res) => {
        const { id } = req.params;
        const { cookingTips } = req.body;
        const userId = req.user.id;
      
        try {
          const result = await pool.query(
            `UPDATE recipe_drafts 
             SET additional_info = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND user_id = $3
             RETURNING *`,
            [JSON.stringify({ cookingTips }), id, userId]
          );
      
          if (result.rows.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'Draft not found or unauthorized'
            });
          }
      
          res.status(200).json({
            success: true,
            data: result.rows[0],
            message: 'Cooking tips updated successfully'
          });
        } catch (error) {
          console.error('Error updating cooking tips:', error);
          res.status(500).json({
            success: false,
            message: 'Error updating cooking tips',
            error: error.message
          });
        }
    },

    publishRecipe: async (req, res) => {
        const { draftId } = req.params;
        const userId = req.user.id;
      
        try {
          const client = await pool.connect();
          
          try {
            await client.query('BEGIN');
      
            const draft = await RecipeDraftModel.getDraftById(draftId, userId);
            if (!draft) {
              throw new Error('Draft not found or unauthorized');
            }
    
            const formattedIngredients = draft.ingredients.map(ing => ({
              quantity: ing.quantity,
              unit: ing.unit,
              name: ing.name
            }));
      
            const nutritionalInfo = await NutritionService.calculateNutrition(formattedIngredients);
            const updatedMedia = await mediaCleanupService.moveMediaToPermanentStorage(draft.media);
            
            const draftDataForPublishing = {
              ...draft,
              ingredients: typeof draft.ingredients === 'string' 
                ? JSON.parse(draft.ingredients) 
                : draft.ingredients,
              instructions: typeof draft.instructions === 'string'
                ? JSON.parse(draft.instructions)
                : draft.instructions || [],
              media: updatedMedia,
              additional_info: typeof draft.additional_info === 'string'
                ? JSON.parse(draft.additional_info)
                : draft.additional_info || { cookingTips: [] },
              tags: draft.tags || []
            };
    
            const publishedRecipe = await RecipeModel.publishFromDraft(
              draftId, 
              userId, 
              nutritionalInfo,
              draftDataForPublishing
            );
    
            if (!publishedRecipe) {
              throw new Error('Failed to publish recipe');
            }
      
            await client.query('COMMIT');
      
            res.status(200).json({
              success: true,
              data: {
                  ...publishedRecipe,
                  redirectUrl: `/recipes/${publishedRecipe.id}`
              },
              message: 'Recipe published successfully'
            });
          } catch (error) {
            await client.query('ROLLBACK');
            throw error;
          } finally {
            client.release();
          }
        } catch (error) {
          console.error('Error publishing recipe:', error);
          res.status(500).json({
            success: false,
            message: error.message || 'Error publishing recipe',
            error: error.message
          });
        }
    },
    
}

module.exports = PublishController;

