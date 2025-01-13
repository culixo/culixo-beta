// server/routes/collectionRoutes.js
const express = require('express');
const router = express.Router();
const CollectionController = require('../controllers/collections');
const authMiddleware = require('../middleware/authMiddleware');

// =============================================
// All Collection Routes Require Authentication
// =============================================
router.use(authMiddleware);

// =============================================
// Collection Management
// =============================================

// Get user's collections with pagination
router.get('/', CollectionController.getUserCollections);

// Create new collection
router.post('/', CollectionController.createCollection);

// Get specific collection with its recipes
router.get('/:id', CollectionController.getCollection);

// Update collection details (name, description)
router.put('/:id', CollectionController.updateCollection);

// Delete collection
router.delete('/:id', CollectionController.deleteCollection);

// =============================================
// Collection Recipe Management
// =============================================

// Get recipes in a collection
router.get('/:id/recipes', CollectionController.getCollectionRecipes);

// Add recipe to collection
router.post('/:id/recipes', CollectionController.addRecipeToCollection);

// Remove recipe from collection
router.delete('/:id/recipes/:recipeId', CollectionController.removeRecipeFromCollection);

module.exports = router;