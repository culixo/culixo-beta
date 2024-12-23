// server/routes/recipeDraftRoutes.js
const express = require('express');
const router = express.Router();
const recipeDraftController = require('../controllers/recipeDraftController');
const authenticateToken = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authenticateToken);

// Core draft operations
router.post('/', recipeDraftController.saveDraft);
router.get('/', recipeDraftController.getAllDrafts);
router.get('/:id', recipeDraftController.getDraft);
router.delete('/:id', recipeDraftController.deleteDraft);

// Note: Section-specific operations (ingredients, instructions, media, tags, cooking tips)
// are handled in recipeRoutes.js using RecipeController to maintain existing functionality
// This keeps the current architecture where section updates go through RecipeController

module.exports = router;