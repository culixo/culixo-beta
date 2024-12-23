// server/routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only images are allowed'));
      }
    }
});

router.get('/explore', RecipeController.getAllRecipes);
router.get('/explore/search', RecipeController.searchRecipes);
router.get('/explore/filter', RecipeController.getFilteredRecipes);
router.get('/:id', RecipeController.getRecipe);

// All routes will require authentication
router.use(authMiddleware);

// Debug route
router.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    body: req.body
  });
  next();
});

// General image upload routes
router.post('/upload-instruction-image', upload.single('image'), RecipeController.uploadInstructionImage);

// Non-draft media routes - these should come before parameterized routes
router.post('/media/main', upload.single('image'), RecipeController.uploadMainImageNoUser);
router.post('/media/additional', upload.array('images', 5), RecipeController.uploadAdditionalImagesNoUser);

// Draft-specific media routes
router.post('/drafts/:id/instructions/upload', upload.single('image'), RecipeController.uploadInstructionImage);
router.post('/drafts/:id/media/main', upload.single('image'), RecipeController.uploadMainImage);
router.post('/drafts/:id/media/additional', upload.array('images', 5), RecipeController.uploadAdditionalImages);

// Draft-specific data routes
router.put('/drafts/:id/ingredients', RecipeController.updateIngredients);
router.get('/drafts/:id/ingredients', RecipeController.getIngredients);
router.put('/drafts/:id/instructions', RecipeController.updateInstructions);
router.put('/drafts/:id/tags', RecipeController.updateTags);
router.put('/drafts/:id/cooking-tips', RecipeController.updateCookingTips);
router.post('/drafts/:draftId/publish', RecipeController.publishRecipe);

// Common recipe routes with specific actions
router.get('/my-recipes', RecipeController.getUserRecipes);
router.get('/:id/nutrition', RecipeController.getNutritionalInfo);

// Generic CRUD routes should come last
router.post('/', RecipeController.createRecipe);
router.put('/:id', RecipeController.updateRecipe);
// router.get('/user/:id', RecipeController.getUserById);

module.exports = router;