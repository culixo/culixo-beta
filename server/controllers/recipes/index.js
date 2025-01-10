// server/controllers/recipes/index.js
const BaseController = require('./baseController');
const ListController = require('./listController');
const InteractionController = require('./interactionController');
const PublishController = require('./publishController');
const MediaController = require('./mediaController');
const NutritionController = require('./nutritionController');

const RecipeController = {
  ...BaseController,
  ...ListController,
  ...InteractionController,
  ...PublishController,
  ...MediaController,
  ...NutritionController
};

module.exports = RecipeController;