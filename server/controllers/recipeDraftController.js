// server/controllers/recipeDraftController.js
const pool = require('../config/db');
const s3Service = require('../services/s3Service');

const recipeDraftController = {
  // Create or update draft
  saveDraft: async (req, res) => {
    const userId = req.user.id;
    const {
      // Basic Info (keeping as separate columns)
      title,
      description,
      cuisine_type,
      course_type,
      difficulty_level,
      prep_time,
      cook_time,
      servings,
      diet_category,
      completion_percentage,
      current_step,
      draft_data,
      // JSONB and array fields
      ingredients = [],
      instructions = [],
      media = { mainImage: null, additionalImages: [] },
      tags = [], // Now as VARCHAR[]
      additional_info = { cookingTips: [] } // Only cookingTips now
    } = req.body;

    try {
      const existingDraft = await pool.query(
        'SELECT id FROM recipe_drafts WHERE user_id = $1 AND title = $2',
        [userId, title]
      );

      let result;
      if (existingDraft.rows.length > 0) {
        // Update existing draft
        result = await pool.query(
          `UPDATE recipe_drafts 
           SET title = $1, description = $2, cuisine_type = $3,
               course_type = $4, difficulty_level = $5, prep_time = $6,
               cook_time = $7, servings = $8, diet_category = $9,
               completion_percentage = $10, current_step = $11,
               draft_data = $12, ingredients = $13, instructions = $14,
               media = $15, additional_info = $16, tags = $17, 
               updated_at = CURRENT_TIMESTAMP
           WHERE user_id = $18 AND id = $19
           RETURNING *`,
          [
            title, description, cuisine_type, course_type,
            difficulty_level, prep_time, cook_time, servings,
            diet_category, completion_percentage, current_step,
            draft_data, 
            JSON.stringify(ingredients),
            JSON.stringify(instructions),
            JSON.stringify(media),
            JSON.stringify({ cookingTips: additional_info.cookingTips || [] }), // Only cookingTips
            tags, // Direct array, no JSON.stringify
            userId, existingDraft.rows[0].id
          ]
        );
      } else {
        // Create new draft
        result = await pool.query(
          `INSERT INTO recipe_drafts 
           (user_id, title, description, cuisine_type, course_type,
            difficulty_level, prep_time, cook_time, servings,
            diet_category, completion_percentage, current_step, draft_data,
            ingredients, instructions, media, additional_info, tags)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 
                   $14, $15, $16, $17, $18)
           RETURNING *`,
          [
            userId, title, description, cuisine_type, course_type,
            difficulty_level, prep_time, cook_time, servings,
            diet_category, completion_percentage, current_step, draft_data,
            JSON.stringify(ingredients),
            JSON.stringify(instructions),
            JSON.stringify(media),
            JSON.stringify({ cookingTips: additional_info.cookingTips || [] }), // Only cookingTips
            tags // Direct array, no JSON.stringify
          ]
        );
      }

      res.status(200).json({
        success: true,
        data: result.rows[0],
        message: existingDraft.rows.length > 0 ? 'Draft updated' : 'Draft created'
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      res.status(500).json({
        success: false,
        message: 'Error saving draft',
        error: error.message
      });
    }
  },

  // Get all drafts for a user
  getAllDrafts: async (req, res) => {
    const userId = req.user.id;

    try {
      const result = await pool.query(
        'SELECT * FROM recipe_drafts WHERE user_id = $1 ORDER BY updated_at DESC',
        [userId]
      );

      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      console.error('Error fetching drafts:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching drafts'
      });
    }
  },

  // Get a specific draft
  getDraft: async (req, res) => {
    const userId = req.user.id;
    const draftId = req.params.id;

    try {
      const result = await pool.query(
        'SELECT * FROM recipe_drafts WHERE id = $1 AND user_id = $2',
        [draftId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Draft not found'
        });
      }

      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Error fetching draft:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching draft'
      });
    }
  },

  // Enhanced deleteDraft method with media cleanup
  deleteDraft: async (req, res) => {
    const userId = req.user.id;
    const draftId = req.params.id;

    console.log('Delete draft request:', { userId, draftId }); // Debug log

    try {
      // First get the draft to find its images
      const draft = await pool.query(
        'SELECT * FROM recipe_drafts WHERE id = $1 AND user_id = $2',
        [draftId, userId]
      );

      if (draft.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Draft not found'
        });
      }

      // Collect all media URLs
      const draftData = draft.rows[0];
      const mediaUrls = [
        draftData.media?.mainImage,
        ...(draftData.media?.additionalImages || []),
        ...(draftData.instructions?.flatMap(instruction => instruction.mediaUrls) || [])
      ].filter(Boolean);

      // Delete images from S3 if any exist
      if (mediaUrls.length > 0) {
        try {
          const keys = mediaUrls.map(url => url.split('.com/')[1]);
          await s3Service.deleteMultipleObjects(keys);
        } catch (s3Error) {
          console.error('Error deleting S3 objects:', s3Error);
          // Continue with draft deletion even if S3 deletion fails
        }
      }

      // Delete the draft from database
      await pool.query(
        'DELETE FROM recipe_drafts WHERE id = $1 AND user_id = $2',
        [draftId, userId]
      );

      res.status(200).json({
        success: true,
        message: 'Draft and associated media deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting draft:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting draft',
        error: error.message
      });
    }
  }
};

module.exports = recipeDraftController;