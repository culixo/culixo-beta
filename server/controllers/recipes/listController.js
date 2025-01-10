// server/controllers/recipes/listController.js
const RecipeModel = require('../../models/recipes/index');
const pool = require('../../config/db');
const jwt = require('jsonwebtoken')

const ListController = {
    getAllRecipes: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 12;
            const sortBy = req.query.sortBy || 'Newest First';
            
            let userId = null;
            const authHeader = req.headers.authorization;
            
            if (authHeader?.startsWith('Bearer ')) {
                try {
                    const token = authHeader.split(' ')[1];
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    userId = decoded.userId;
                    console.log('Authenticated request with userId:', userId);
                } catch (error) {
                    console.log('Invalid token, continuing without auth');
                }
            }
      
            const result = await RecipeModel.getAllRecipes({
                page,
                limit,
                sortBy,
                userId
            });
            
            // Log only once for debugging
            console.log('Sending response with interaction states:', {
                userId,
                recipeCount: result.recipes.length,
                // Log only first recipe for brevity
                sampleRecipe: result.recipes[0] ? {
                    id: result.recipes[0].id,
                    has_liked: result.recipes[0].has_liked,
                    has_saved: result.recipes[0].has_saved
                } : null
            });
      
            res.status(200).json({
                success: true,
                data: result
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
            const filters = req.query.filters ? JSON.parse(req.query.filters) : [];
            
            const result = await RecipeModel.getFilteredRecipes({
                filters,
                page,
                limit: 12,
                userId: req.user?.id
            });

            res.json({
                success: true,
                data: {
                    recipes: result.recipes.map(recipe => ({
                        id: recipe.id,
                        title: recipe.title,
                        description: recipe.description,
                        difficulty_level: recipe.difficulty_level,
                        prep_time: recipe.prep_time,
                        cook_time: recipe.cook_time,
                        likes_count: parseInt(recipe.likes_count || 0),
                        saves_count: parseInt(recipe.saves_count || 0),
                        has_liked: recipe.has_liked || false,
                        has_saved: recipe.has_saved || false,
                        media: recipe.media,
                        author: {
                            id: recipe.user_id,
                            full_name: recipe.author_name,
                            avatar_url: recipe.author_avatar
                        },
                        created_at: recipe.created_at
                    })),
                    pagination: result.pagination
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
            const page = parseInt(req.query.page) || 1;
            const { query: searchQuery } = req.query;

            const result = await RecipeModel.searchRecipes({
                searchQuery,
                page,
                limit: 12,
                userId: req.user?.id
            });

            res.json({
                success: true,
                data: {
                    recipes: result.recipes.map(recipe => ({
                        id: recipe.id,
                        title: recipe.title,
                        description: recipe.description,
                        difficulty_level: recipe.difficulty_level,
                        prep_time: recipe.prep_time,
                        cook_time: recipe.cook_time,
                        likes_count: parseInt(recipe.likes_count || 0),
                        saves_count: parseInt(recipe.saves_count || 0),
                        has_liked: recipe.has_liked || false,
                        has_saved: recipe.has_saved || false,
                        media: recipe.media,
                        author: {
                            id: recipe.user_id,
                            full_name: recipe.author_name,
                            avatar_url: recipe.author_avatar
                        },
                        created_at: recipe.created_at
                    })),
                    pagination: result.pagination
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
    },

    getFeaturedRecipes: async (req, res) => {
        try {
            const recipes = await RecipeModel.getFeaturedRecipes(req.user?.id);
            
            res.json({
                success: true,
                data: recipes.map(recipe => ({
                    id: recipe.id,
                    title: recipe.title,
                    description: recipe.description,
                    difficulty_level: recipe.difficulty_level,
                    prep_time: recipe.prep_time,
                    cook_time: recipe.cook_time,
                    likes_count: parseInt(recipe.likes_count || 0),
                    saves_count: parseInt(recipe.saves_count || 0),
                    has_liked: recipe.has_liked || false,
                    has_saved: recipe.has_saved || false,
                    media: recipe.media,
                    author: {
                        id: recipe.user_id,
                        full_name: recipe.author_name,
                        avatar_url: recipe.author_avatar
                    },
                    created_at: recipe.created_at
                }))
            });
        } catch (error) {
            console.error('Error fetching featured recipes:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching featured recipes',
                error: error.message
            });
        }
    },
}

module.exports = ListController;

