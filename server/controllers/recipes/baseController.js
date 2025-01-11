// server/controllers/recipes/baseController.js
const RecipeModel = require('../../models/recipes/index');
const pool = require('../../config/db');

const BaseController = { 
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
          // const query = `
          //   SELECT 
          //     r.*,
          //     u.id as author_id,
          //     u.full_name as author_name,
          //     u.email as author_email
          //   FROM recipes r
          //   LEFT JOIN users u ON r.user_id = u.id
          //   WHERE r.id = $1
          // `;
          
          // const result = await pool.query(query, [req.params.id]);
          const query = `
          SELECT 
            r.*,
            u.id as author_id,
            u.full_name as author_name,
            u.email as author_email,
            COALESCE((SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = r.id), 0) as likes_count,
            COALESCE((SELECT COUNT(*) FROM recipe_saves WHERE recipe_id = r.id), 0) as saves_count,
            ${req.user ? `
              EXISTS(SELECT 1 FROM recipe_likes WHERE recipe_id = r.id AND user_id = $2) as has_liked,
              EXISTS(SELECT 1 FROM recipe_saves WHERE recipe_id = r.id AND user_id = $2) as has_saved
            ` : 'false as has_liked, false as has_saved'}
          FROM recipes r
          LEFT JOIN users u ON r.user_id = u.id
          WHERE r.id = $1
        `;
        
        const result = await pool.query(
          query, 
          req.user ? [req.params.id, req.user.id] : [req.params.id]
        );
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

    getMyRecipes: async (req, res) => {
      try {
          // Pass the user's own ID as both userId and currentUserId
          const recipes = await RecipeModel.getMyRecipes(req.user.id, req.user.id);
          
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

    getPublicUserRecipes: async (req, res) => {
      try {
          const { userId } = req.params;
          // Pass the current user's ID if they're logged in
          const currentUserId = req.user?.id || null;
          
          const recipes = await RecipeModel.getPublicUserRecipes(userId, currentUserId);
          
          res.json({
              success: true,
              data: recipes,
              message: recipes.length ? 'Recipes fetched successfully' : 'No recipes found'
          });
      } catch (error) {
          console.error('Error in getPublicUserRecipes:', error);
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
};

module.exports = BaseController;
