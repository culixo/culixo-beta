// server/models/recipes/baseModel.js
const db = require('../../config/db');

const BaseModel = {
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

    // getById: async (id) => {
    //     try {
    //       const result = await db.query('SELECT * FROM recipes WHERE id = $1', [id]);
    //       return result.rows[0];
    //     } catch (error) {
    //       throw error;
    //     }
    // },
    getById: async (id, userId = null) => {
      try {
        const query = `
          SELECT 
            r.*,
            u.full_name as author_name,
            u.avatar_url as author_avatar,
            COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id), 0) as likes_count,
            COALESCE((SELECT COUNT(*) FROM recipe_saves WHERE recipe_id = r.id), 0) as saves_count,
            ${userId ? `
              EXISTS(SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = $2) as has_liked,
              EXISTS(SELECT 1 FROM recipe_saves WHERE recipe_id = r.id AND user_id = $2) as has_saved
            ` : 'false as has_liked, false as has_saved'}
          FROM recipes r
          LEFT JOIN users u ON r.user_id = u.id
          WHERE r.id = $1`;
  
        const result = await db.query(query, userId ? [id, userId] : [id]);
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
    },
};

module.exports = BaseModel;