// server/models/recipes/index.js

const BaseModel = require('./baseModel');
const ListModel = require('./listModel');
const InteractionModel = require('./interactionModel');
const PublishModel = require('./publishModel');
const NutritionModel = require('./nutritionModel');

const RecipeModel = {
  ...BaseModel,
  ...ListModel,
  ...InteractionModel,
  ...PublishModel,
  ...NutritionModel
};

module.exports = RecipeModel;