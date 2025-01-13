// server/controllers/collections/interactionController.js
const CollectionModel = require('../../models/collections');

const CollectionInteractionController = {
    addRecipeToCollection: async (req, res) => {
        try {
            const { id: collectionId } = req.params;
            const { recipeId } = req.body;
            const userId = req.user.id;

            // Validate input
            if (!recipeId) {
                return res.status(400).json({
                    success: false,
                    message: 'Recipe ID is required'
                });
            }

            // Verify collection belongs to user
            const collection = await CollectionModel.getCollectionById(collectionId, userId);
            if (!collection) {
                return res.status(404).json({
                    success: false,
                    message: 'Collection not found'
                });
            }

            const result = await CollectionModel.addRecipeToCollection(collectionId, recipeId);

            res.status(201).json({
                success: true,
                message: 'Recipe added to collection successfully',
                data: result
            });
        } catch (error) {
            console.error('Error in addRecipeToCollection:', error);
            if (error.message === 'Recipe already in collection') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            res.status(500).json({
                success: false,
                message: 'Error adding recipe to collection',
                error: error.message
            });
        }
    },

    removeRecipeFromCollection: async (req, res) => {
        try {
            const { id: collectionId, recipeId } = req.params;
            const userId = req.user.id;

            // Verify collection belongs to user
            const collection = await CollectionModel.getCollectionById(collectionId, userId);
            if (!collection) {
                return res.status(404).json({
                    success: false,
                    message: 'Collection not found'
                });
            }

            const result = await CollectionModel.removeRecipeFromCollection(collectionId, recipeId);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Recipe not found in collection'
                });
            }

            res.json({
                success: true,
                message: 'Recipe removed from collection successfully'
            });
        } catch (error) {
            console.error('Error in removeRecipeFromCollection:', error);
            res.status(500).json({
                success: false,
                message: 'Error removing recipe from collection',
                error: error.message
            });
        }
    },

    getCollectionRecipes: async (req, res) => {
        try {
            const { id: collectionId } = req.params;
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;

            // Verify collection belongs to user
            const collection = await CollectionModel.getCollectionById(collectionId, userId);
            if (!collection) {
                return res.status(404).json({
                    success: false,
                    message: 'Collection not found'
                });
            }

            const recipes = await CollectionModel.getCollectionRecipes(collectionId, { page, limit });

            res.json({
                success: true,
                data: {
                    recipes,
                    collection
                }
            });
        } catch (error) {
            console.error('Error in getCollectionRecipes:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching collection recipes',
                error: error.message
            });
        }
    }
};

module.exports = CollectionInteractionController;