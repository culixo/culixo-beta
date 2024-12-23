// server/models/recipeModel.js
const db = require('../config/db');

const RecipeModel = {
  create: async (recipeData) => {
    const {
      user_id, title, description, cuisine_type, course_type, 
      difficulty_level, prep_time, cook_time, servings, diet_category,
      ingredients = [], instructions = [], 
      media = { mainImage: null, additionalImages: [] },
      tags = [],
      additional_info = { cookingTips: [] },
      nutritional_info = null
    } = recipeData;
    
    const query = `
      INSERT INTO recipes (
        user_id, title, description, cuisine_type, course_type, 
        difficulty_level, prep_time, cook_time, servings, diet_category,
        ingredients, instructions, media, additional_info, tags, nutritional_info
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`;
    
    const values = [
      user_id, title, description, cuisine_type, course_type,
      difficulty_level, prep_time, cook_time, servings, diet_category,
      JSON.stringify(ingredients), JSON.stringify(instructions),
      JSON.stringify(media),
      JSON.stringify({ cookingTips: additional_info.cookingTips || [] }), 
      tags,
      JSON.stringify(nutritional_info)
    ];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const result = await db.query('SELECT * FROM recipes WHERE id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  getByUserId: async (userId) => {
    try {
      const result = await db.query('SELECT * FROM recipes WHERE user_id = $1', [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  update: async (recipeId, userId, recipeData) => {
    const {
      title, description, cuisine_type, course_type, difficulty_level,
      prep_time, cook_time, servings, diet_category,
      ingredients = [], instructions = [],
      media = { mainImage: null, additionalImages: [] },
      tags = [],
      additional_info = { cookingTips: [] },
      nutritional_info = null
    } = recipeData;

    const query = `
      UPDATE recipes 
      SET title = $1, description = $2, cuisine_type = $3,
          course_type = $4, difficulty_level = $5, prep_time = $6,
          cook_time = $7, servings = $8, diet_category = $9,
          ingredients = $10, instructions = $11,
          media = $12, additional_info = $13, tags = $14,
          nutritional_info = $15,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $16 AND user_id = $17
      RETURNING *`;

    const values = [
      title, description, cuisine_type, course_type, difficulty_level,
      prep_time, cook_time, servings, diet_category,
      JSON.stringify(ingredients), JSON.stringify(instructions),
      JSON.stringify(media),
      JSON.stringify({ cookingTips: additional_info.cookingTips || [] }),
      tags,
      JSON.stringify(nutritional_info),
      recipeId, userId
    ];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

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

      console.log('Publishing with ingredients:', ingredients);

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

      console.log('Published with all data:', publishResult.rows[0]);

      return publishResult.rows[0];
    } catch (error) {
      console.error('Error in publishFromDraft:', error);
      throw error;
    }
},

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

  delete: async (recipeId, userId) => {
    try {
      const result = await db.query(
        'DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING *',
        [recipeId, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = RecipeModel;