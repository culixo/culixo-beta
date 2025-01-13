// server/controllers/collections/index.js
const CollectionBaseController = require('./baseController');
const CollectionInteractionController = require('./interactionController');
const CollectionListController = require('./listController');

module.exports = {
    ...CollectionBaseController,
    ...CollectionInteractionController,
    ...CollectionListController
};