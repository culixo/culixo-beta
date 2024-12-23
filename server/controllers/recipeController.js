// server/controllers/recipeController.js
const RecipeModel = require('../models/recipeModel');
const pool = require('../config/db'); 
const mediaCleanupService = require('../services/mediaCleanupService');
const NutritionService = require('../services/nutritionService');
const RecipeDraftModel = require('../models/recipeDraftModel');
const s3Client = require('../config/s3Config');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

const RecipeController = {
  createRecipe: async (req, res) => {
    try {
      const {
        title,
        description,
        cuisine_type,
        course_type,
        difficulty_level,
        prep_time,
        cook_time,
        servings,
        diet_category,
        ingredients = [],
        instructions = [],
        media = { mainImage: null, additionalImages: [] },
        tags = [],
        additional_info = { cookingTips: [] }
      } = req.body;

      // Single API call to calculate nutrition
      let nutritional_info = null;
      try {
        // This makes one call to Edamam API via NutritionService
        nutritional_info = await NutritionService.calculateNutrition(ingredients);
        console.log('Calculated nutritional info:', nutritional_info);
      } catch (nutritionError) {
        console.error('Error calculating nutrition:', nutritionError);
      }

      // Create recipe with the calculated nutrition info
      const recipeData = {
        user_id: req.user.id,
        title,
        description,
        cuisine_type,
        course_type,
        difficulty_level,
        prep_time,
        cook_time,
        servings,
        diet_category,
        ingredients,
        instructions,
        media,
        tags,
        additional_info: { cookingTips: additional_info.cookingTips || [] },
        nutritional_info  // Include the calculated info
      };
      
      // Single database call to create recipe
      const recipe = await RecipeModel.create(recipeData);
      
      res.status(201).json({
        success: true,
        data: recipe,
        message: 'Recipe created successfully'
      });
    } catch (error) {
      console.error('Error creating recipe:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating recipe',
        error: error.message
      });
    }
  },

  getRecipe: async (req, res) => {
    try {
      // Get recipe with joined user data
      const query = `
        SELECT 
          r.*,
          u.id as author_id,
          u.full_name as author_name,
          u.email as author_email
        FROM recipes r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.id = $1
      `;
      
      const result = await pool.query(query, [req.params.id]);
      const recipe = result.rows[0];
  
      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        });
      }
  
      // Format the response to separate recipe and author data
      const formattedResponse = {
        ...recipe,
        author: {
          id: recipe.author_id,
          name: recipe.author_name,
          email: recipe.author_email,
          image: recipe.author_image
        }
      };
  
      // Remove the duplicate author fields from the root level
      delete formattedResponse.author_id;
      delete formattedResponse.author_name;
      delete formattedResponse.author_email;
      delete formattedResponse.author_image;
  
      res.json({
        success: true,
        data: formattedResponse
      });
    } catch (error) {
      console.error('Error fetching recipe:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching recipe',
        error: error.message
      });
    }
  },

  getUserRecipes: async (req, res) => {
    try {
      const recipes = await RecipeModel.getByUserId(req.user.id);
      res.json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Error fetching user recipes:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user recipes',
        error: error.message
      });
    }
  },

  updateRecipe: async (req, res) => {
    try {
      const recipeId = req.params.id;
      const userId = req.user.id;
      
      const {
        title,
        description,
        cuisine_type,
        course_type,
        difficulty_level,
        prep_time,
        cook_time,
        servings,
        diet_category,
        ingredients = [],
        instructions = [],
        media = { mainImage: null, additionalImages: [] },
        tags = [],
        additional_info = { cookingTips: [] }
      } = req.body;

      const recipeData = {
        title,
        description,
        cuisine_type,
        course_type,
        difficulty_level,
        prep_time,
        cook_time,
        servings,
        diet_category,
        ingredients,
        instructions,
        media,
        tags,
        additional_info: { cookingTips: additional_info.cookingTips || [] }
      };

      const updatedRecipe = await RecipeModel.update(recipeId, userId, recipeData);
      
      if (!updatedRecipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found or you do not have permission to update it'
        });
      }

      res.json({
        success: true,
        data: updatedRecipe,
        message: 'Recipe updated successfully'
      });
    } catch (error) {
      console.error('Error updating recipe:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating recipe',
        error: error.message
      });
    }
  },

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

  // Instruction Section Backend
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

  uploadInstructionImage: async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Generate a unique filename
        const fileName = `instructions/${Date.now()}-${req.file.originalname}`;
        
        // Upload to S3
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        });

        await s3Client.send(command);

        // Generate the URL for the uploaded image
        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        res.status(200).json({
            success: true,
            data: { url: fileUrl },
            message: 'File uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        });
    }
  },

  //Media Section Backend
  uploadMainImageNoUser: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
          data: null
        });
      }
  
      // Note the different path for non-draft uploads
      const fileName = `media/temp/${Date.now()}-${req.file.originalname}`;
      
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      });
  
      await s3Client.send(command);
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  
      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          url: fileUrl
        }
      });
    } catch (error) {
      console.error('Error uploading main image:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  uploadAdditionalImagesNoUser: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }
  
      const uploadPromises = req.files.map(async (file) => {
        const fileName = `media/temp/additional/${Date.now()}-${file.originalname}`;
        
        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype
        });
  
        await s3Client.send(command);
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      });
  
      const urls = await Promise.all(uploadPromises);
  
      res.status(200).json({
        success: true,
        data: { urls },
        message: 'Additional images uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading additional images:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading files',
        error: error.message
      });
    }
  },

  uploadMainImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
          data: null
        });
      }
  
      const fileName = `drafts/${req.params.id}/media/main/${Date.now()}-${req.file.originalname}`;
      
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      });
  
      await s3Client.send(command);
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  
      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          url: fileUrl
        }
      });
    } catch (error) {
      console.error('Error uploading main image:', error);
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  uploadAdditionalImages: async (req, res) => {
    try {
      const { id: draftId } = req.params;
      const userId = req.user.id;
  
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }
  
      const uploadPromises = req.files.map(async (file) => {
        const fileName = `drafts/${draftId}/media/additional/${Date.now()}-${file.originalname}`;
        
        const command = new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype
        });
  
        await s3Client.send(command);
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      });
  
      const urls = await Promise.all(uploadPromises);
  
      // Update the draft in database with the new additional image URLs
      const result = await pool.query(
        `UPDATE recipe_drafts 
         SET media = jsonb_set(
           COALESCE(media, '{}'::jsonb),
           '{additionalImages}',
           (media->>'additionalImages')::jsonb || $1::jsonb
         ),
         updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND user_id = $3
         RETURNING *`,
        [JSON.stringify(urls), draftId, userId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Draft not found or unauthorized'
        });
      }
  
      res.status(200).json({
        success: true,
        data: { urls },
        message: 'Additional images uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading additional images:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading files',
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
      // Start a database transaction
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
  
        // 1. Get the draft
        const draft = await RecipeDraftModel.getDraftById(draftId, userId);
        if (!draft) {
          throw new Error('Draft not found or unauthorized');
        }

        console.log('Original draft data:', {
          ingredients: draft.ingredients,
          instructions: draft.instructions,
          media: draft.media,
          additional_info: draft.additional_info,
          tags: draft.tags
        });

        // 2. Format ingredients and calculate nutrition
        const formattedIngredients = draft.ingredients.map(ing => ({
          quantity: ing.quantity,
          unit: ing.unit,
          name: ing.name
        }));
        console.log('Formatted ingredients:', formattedIngredients);
  
        // Calculate nutrition information using formatted ingredients
        const nutritionalInfo = await NutritionService.calculateNutrition(formattedIngredients);
  
        // 3. Move media files from temp to permanent storage
        const updatedMedia = await mediaCleanupService.moveMediaToPermanentStorage(draft.media);
        console.log('Updated media:', updatedMedia);
        
        // 4. Create draft data with all required fields properly formatted
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

        // Debug log before publishing
        console.log('Draft data prepared for publishing:', draftDataForPublishing);

        // 5. Publish recipe with all data
        const publishedRecipe = await RecipeModel.publishFromDraft(
          draftId, 
          userId, 
          nutritionalInfo,
          draftDataForPublishing
        );

        console.log('Published recipe result:', publishedRecipe);

        if (!publishedRecipe) {
          throw new Error('Failed to publish recipe');
        }
  
        await client.query('COMMIT');
  
        res.status(200).json({
          success: true,
          data: publishedRecipe,
          message: 'Recipe published successfully'
        });
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction error:', error);
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

  //For Explore Recipes Page
  getAllRecipes: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 12;
      const offset = (page - 1) * limit;
      const sortBy = req.query.sortBy || 'created_at';
      const sortOrder = req.query.sortOrder || 'DESC';

      // Construct the base query
      let query = `
        SELECT 
          r.*,
          u.full_name as author_name,
          (r.prep_time + r.cook_time) as total_time,
          COUNT(*) OVER() as total_count
        FROM recipes r
        LEFT JOIN users u ON r.user_id = u.id
      `;

      // Add sorting
      const validSortFields = {
        'Newest First': 'r.created_at',
        'Cooking Time': '(r.prep_time + r.cook_time)',
        'Quick Recipes': '(r.prep_time + r.cook_time)',
        'Difficulty Level': 'r.difficulty_level'
      };

      const sortField = validSortFields[sortBy] || 'r.created_at';
      query += ` ORDER BY ${sortField} ${sortOrder}`;

      // Add pagination
      query += ` LIMIT $1 OFFSET $2`;

      const result = await pool.query(query, [limit, offset]);
      
      const recipes = result.rows;
      const totalRecipes = recipes.length > 0 ? parseInt(recipes[0].total_count) : 0;
      const totalPages = Math.ceil(totalRecipes / limit);

      res.json({
        success: true,
        data: {
          recipes: recipes.map(recipe => ({
            ...recipe,
            total_count: undefined // Remove this from individual recipes
          })),
          pagination: {
            currentPage: page,
            totalPages,
            totalRecipes,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching recipes',
        error: error.message
      });
    }
  },

  getFilteredRecipes: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 12;
      const offset = (page - 1) * limit;
      const filters = req.query.filters ? JSON.parse(req.query.filters) : [];

      let query = `
        SELECT 
          r.*,
          u.full_name as author_name,
          (r.prep_time + r.cook_time) as total_time,
          COUNT(*) OVER() as total_count
        FROM recipes r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE 1=1
      `;

      const queryParams = [];
      let paramCounter = 1;

      // Apply filters
      filters.forEach(filter => {
        switch (filter.type) {
          case 'cuisine':
            query += ` AND r.cuisine_type = $${paramCounter}`;
            queryParams.push(filter.value);
            paramCounter++;
            break;
          case 'diet':
            query += ` AND r.diet_category = $${paramCounter}`;
            queryParams.push(filter.value);
            paramCounter++;
            break;
          case 'mealType':
            query += ` AND r.course_type = $${paramCounter}`;
            queryParams.push(filter.value);
            paramCounter++;
            break;
          case 'cookingTime':
            // Handle total cooking time ranges (prep_time + cook_time)
            const timeRanges = {
              'Under 15 mins': [0, 15],
              '15-30 mins': [15, 30],
              '30-45 mins': [30, 45],
              '45-60 mins': [45, 60],
              '1-2 hours': [60, 120],
              'Over 2 hours': [120, 999999]
            };
            const [min, max] = timeRanges[filter.value];
            query += ` AND (r.prep_time + r.cook_time) BETWEEN $${paramCounter} AND $${paramCounter + 1}`;
            queryParams.push(min, max);
            paramCounter += 2;
            break;
          case 'difficulty':
            query += ` AND r.difficulty_level = $${paramCounter}`;
            queryParams.push(filter.value);
            paramCounter++;
            break;
        }
      });

      // Add search if provided
      if (req.query.search) {
        query += ` AND (
          r.title ILIKE $${paramCounter} OR
          r.description ILIKE $${paramCounter} OR
          r.cuisine_type ILIKE $${paramCounter}
        )`;
        queryParams.push(`%${req.query.search}%`);
        paramCounter++;
      }

      // Add sorting
      const sortBy = req.query.sortBy || 'created_at';
      const sortOrder = req.query.sortOrder || 'DESC';
      
      const validSortFields = {
        'Newest First': 'r.created_at',
        'Cooking Time': '(r.prep_time + r.cook_time)',
        'Quick Recipes': '(r.prep_time + r.cook_time)',
        'Difficulty Level': 'r.difficulty_level'
      };

      const sortField = validSortFields[sortBy] || 'r.created_at';
      query += ` ORDER BY ${sortField} ${sortOrder}`;

      // Add pagination
      query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
      queryParams.push(limit, offset);

      const result = await pool.query(query, queryParams);
      
      const recipes = result.rows;
      const totalRecipes = recipes.length > 0 ? parseInt(recipes[0].total_count) : 0;
      const totalPages = Math.ceil(totalRecipes / limit);

      res.json({
        success: true,
        data: {
          recipes: recipes.map(recipe => ({
            ...recipe,
            total_count: undefined
          })),
          pagination: {
            currentPage: page,
            totalPages,
            totalRecipes,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Error fetching filtered recipes:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching filtered recipes',
        error: error.message
      });
    }
  },

  searchRecipes: async (req, res) => {
    try {
      const { query } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = 12;
      const offset = (page - 1) * limit;

      const searchQuery = `
        SELECT 
          r.*,
          u.full_name as author_name,
          (r.prep_time + r.cook_time) as total_time,
          COUNT(*) OVER() as total_count,
          ts_rank(
            to_tsvector('english', 
              r.title || ' ' || 
              COALESCE(r.description, '') || ' ' || 
              r.cuisine_type || ' ' || 
              r.course_type
            ),
            plainto_tsquery('english', $1)
          ) as rank
        FROM recipes r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE 
          to_tsvector('english', 
            r.title || ' ' || 
            COALESCE(r.description, '') || ' ' || 
            r.cuisine_type || ' ' || 
            r.course_type
          ) @@ plainto_tsquery('english', $1)
        ORDER BY rank DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await pool.query(searchQuery, [query, limit, offset]);
      
      const recipes = result.rows;
      const totalRecipes = recipes.length > 0 ? parseInt(recipes[0].total_count) : 0;
      const totalPages = Math.ceil(totalRecipes / limit);

      res.json({
        success: true,
        data: {
          recipes: recipes.map(recipe => ({
            ...recipe,
            total_count: undefined,
            rank: undefined
          })),
          pagination: {
            currentPage: page,
            totalPages,
            totalRecipes,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Error searching recipes:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching recipes',
        error: error.message
      });
    }
  }
};

module.exports = RecipeController;