// server/models/recipeDraftModel.js
const db = require('../config/db');

class RecipeDraftModel {
  // Create a new draft
  static async createDraft(userId, draftData) {
    try {
      const { rows } = await db.query(
        `INSERT INTO recipe_drafts 
        (user_id, title, description, cuisine_type, course_type, 
         difficulty_level, prep_time, cook_time, servings, 
         diet_category, draft_data, current_step, status,
         ingredients, instructions, media, additional_info, tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *`,
        [
          userId,
          draftData.basicInfo?.title || null,
          draftData.basicInfo?.description || null,
          draftData.basicInfo?.cuisineType?.toLowerCase() || null,
          draftData.basicInfo?.courseType?.toLowerCase() || null,
          draftData.basicInfo?.difficultyLevel?.toLowerCase() || null,
          draftData.basicInfo?.prepTime || null,
          draftData.basicInfo?.cookTime || null,
          draftData.basicInfo?.servings || null,
          draftData.basicInfo?.dietCategories?.[0]?.toLowerCase() || null,
          JSON.stringify(draftData),
          1,
          'draft',
          JSON.stringify(draftData.ingredients || []),
          JSON.stringify(draftData.instructions || []),
          JSON.stringify(draftData.media || { mainImage: null, additionalImages: [] }),
          JSON.stringify({ cookingTips: draftData.additionalInfo?.cookingTips || [] }), // Only cookingTips
          draftData.tags || [] // Tags as VARCHAR[]
        ]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error creating draft: ${error.message}`);
    }
  }

  // Update an existing draft
  static async updateDraft(draftId, userId, draftData) {
    try {
      const { rows } = await db.query(
        `UPDATE recipe_drafts 
         SET title = $1,
             description = $2,
             cuisine_type = $3,
             course_type = $4,
             difficulty_level = $5,
             prep_time = $6,
             cook_time = $7,
             servings = $8,
             diet_category = $9,
             draft_data = $10,
             current_step = $11,
             completion_percentage = $12,
             status = $13,
             ingredients = $14,
             instructions = $15,
             media = $16,
             additional_info = $17,
             tags = $18,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $19 AND user_id = $20
         RETURNING *`,
        [
          draftData.basicInfo?.title || null,
          draftData.basicInfo?.description || null,
          draftData.basicInfo?.cuisineType?.toLowerCase() || null,
          draftData.basicInfo?.courseType?.toLowerCase() || null,
          draftData.basicInfo?.difficultyLevel?.toLowerCase() || null,
          draftData.basicInfo?.prepTime || null,
          draftData.basicInfo?.cookTime || null,
          draftData.basicInfo?.servings || null,
          draftData.basicInfo?.dietCategories?.[0]?.toLowerCase() || null,
          JSON.stringify(draftData),
          draftData.currentStep || 1,
          draftData.completionPercentage || 0,
          draftData.status || 'draft',
          JSON.stringify(draftData.ingredients || []),
          JSON.stringify(draftData.instructions || []),
          JSON.stringify(draftData.media || { mainImage: null, additionalImages: [] }),
          JSON.stringify({ cookingTips: draftData.additionalInfo?.cookingTips || [] }), // Only cookingTips
          draftData.tags || [], // Tags as VARCHAR[]
          draftId,
          userId
        ]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error updating draft: ${error.message}`);
    }
  }

  // Get all drafts for a user
  static async getDraftsByUser(userId) {
    try {
      const { rows } = await db.query(
        `SELECT * FROM recipe_drafts 
         WHERE user_id = $1 AND status = 'draft'
         ORDER BY updated_at DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching drafts: ${error.message}`);
    }
  }

  // Get a specific draft
  static async getDraftById(draftId, userId) {
    try {
      const { rows } = await db.query(
        `SELECT * FROM recipe_drafts 
         WHERE id = $1 AND user_id = $2`,
        [draftId, userId]
      );
      
      if (rows[0]) {
        // First, try to parse ingredients directly from the draft_data column
        if (rows[0].draft_data) {
          const draftData = typeof rows[0].draft_data === 'string' 
            ? JSON.parse(rows[0].draft_data) 
            : rows[0].draft_data;
          
          // Prioritize ingredients from draft_data
          if (draftData.ingredients && draftData.ingredients.length > 0) {
            rows[0].ingredients = draftData.ingredients;
          } 
          // Fallback to parsing ingredients column if draft_data doesn't have ingredients
          else if (rows[0].ingredients) {
            rows[0].ingredients = typeof rows[0].ingredients === 'string'
              ? JSON.parse(rows[0].ingredients)
              : rows[0].ingredients;
          }
        }
      }
      
      return rows[0];
    } catch (error) {
      throw new Error(`Error fetching draft: ${error.message}`);
    }
  }

  // Delete a draft
  static async deleteDraft(draftId, userId) {
    try {
      const { rows } = await db.query(
        `DELETE FROM recipe_drafts 
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [draftId, userId]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error deleting draft: ${error.message}`);
    }
  }
}

module.exports = RecipeDraftModel;