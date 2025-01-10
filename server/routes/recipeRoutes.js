// server/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/recipes');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for image uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// =============================================
// Public Routes (No Auth Required)
// =============================================

// Explore and Search
router.get('/explore', (req, res, next) => {
    console.log('Headers received:', req.headers);
    console.log('Cookies received:', req.cookies);
    next();
  }, RecipeController.getAllRecipes);
router.get('/explore/search', RecipeController.searchRecipes);
router.get('/explore/filter', RecipeController.getFilteredRecipes);
router.get('/featured', RecipeController.getFeaturedRecipes);
// router.get('/view/:id', RecipeController.getRecipe);

// Apply authentication middleware to all routes below this line
router.use(authMiddleware);

// =============================================
// Protected Routes (Auth Required)
// =============================================

// Saved Recipes
router.get('/saved', RecipeController.getSavedRecipes);

// User Recipe Management
router.get('/my-recipes', RecipeController.getUserRecipes);
router.get('/user/:userId/recipes', RecipeController.getUserRecipesByUserId);
router.post('/', RecipeController.createRecipe);
router.put('/:id', RecipeController.updateRecipe);

// Single Recipe View
router.get('/:id', RecipeController.getRecipe);

// Recipe Draft Management
router.put('/drafts/:id/ingredients', RecipeController.updateIngredients);
router.get('/drafts/:id/ingredients', RecipeController.getIngredients);
router.put('/drafts/:id/instructions', RecipeController.updateInstructions);
router.put('/drafts/:id/tags', RecipeController.updateTags);
router.put('/drafts/:id/cooking-tips', RecipeController.updateCookingTips);
router.post('/drafts/:draftId/publish', RecipeController.publishRecipe);

// Media Uploads - Draft Specific
router.post('/drafts/:id/instructions/upload', 
    upload.single('image'),
    RecipeController.uploadInstructionImage
);
router.post('/drafts/:id/media/main',
    upload.single('image'),
    RecipeController.uploadMainImage
);
router.post('/drafts/:id/media/additional',
    upload.array('images', 5),
    RecipeController.uploadAdditionalImages
);

// Media Uploads - General
router.post('/upload-instruction-image',
    upload.single('image'),
    RecipeController.uploadInstructionImage
);
router.post('/media/main',
    upload.single('image'),
    RecipeController.uploadMainImageNoUser
);
router.post('/media/additional',
    upload.array('images', 5),
    RecipeController.uploadAdditionalImagesNoUser
);

// Recipe Interactions
router.post('/:id/like', RecipeController.likeRecipe);
router.delete('/:id/like', RecipeController.unlikeRecipe);
router.post('/:id/save', RecipeController.saveRecipe);
router.delete('/:id/save', RecipeController.unsaveRecipe);
router.get('/:id/interactions', RecipeController.getRecipeInteractions);

// Nutritional Information
router.get('/:id/nutrition', RecipeController.getNutritionalInfo);

module.exports = router;