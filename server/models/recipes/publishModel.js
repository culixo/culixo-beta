// server/models/recipes/publishModel.js
const db = require('../../config/db');

const PublishModel = {
    publishFromDraft: async (draftId, userId, nutritionalInfo = null) => {
        try {
          // First get the draft
          const result = await db.query(
            'SELECT * FROM recipe_drafts WHERE id = $1 AND user_id = $2',
            [draftId, userId]
          );
          
          const draft = result.rows[0];
          if (!draft) {
            throw new Error('Draft not found');
          }
    
          // Parse draft_data if it's a string
          const draftData = typeof draft.draft_data === 'string' 
            ? JSON.parse(draft.draft_data) 
            : draft.draft_data;
    
          // Get ingredients from either draft_data or root level, prioritize non-empty array
          const ingredients = (draftData.ingredients?.length > 0)
            ? draftData.ingredients
            : (draft.ingredients?.length > 0)
              ? draft.ingredients
              : [];
    
          const publishResult = await db.query(
            `WITH draft_deletion AS (
              DELETE FROM recipe_drafts WHERE id = $1 AND user_id = $2
            )
            INSERT INTO recipes (
              user_id, title, description, cuisine_type, course_type,
              difficulty_level, prep_time, cook_time, servings, diet_category,
              ingredients, instructions, media, additional_info, tags,
              nutritional_info
            )
            VALUES ($2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING *`,
            [
              draftId,
              userId,
              draft.title,
              draft.description,
              draft.cuisine_type,
              draft.course_type,
              draft.difficulty_level,
              draft.prep_time,
              draft.cook_time,
              draft.servings,
              draft.diet_category,
              JSON.stringify(ingredients), // Use combined ingredients
              JSON.stringify(draftData.instructions || []),
              JSON.stringify(draftData.media || { mainImage: null, additionalImages: [] }),
              JSON.stringify({ cookingTips: draftData.additionalInfo?.cookingTips || [] }),
              draftData.tags || [],
              JSON.stringify(nutritionalInfo)
            ]
          );
    
          return publishResult.rows[0];
        } catch (error) {
          console.error('Error in publishFromDraft:', error);
          throw error;
        }
    }, 
};

module.exports = PublishModel;