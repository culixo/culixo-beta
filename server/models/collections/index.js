// server/models/collections/index.js
const CollectionBaseModel = require('./baseModel');
const CollectionInteractionModel = require('./interactionModel');
const CollectionListModel = require('./listModel');

module.exports = {
    ...CollectionBaseModel,
    ...CollectionInteractionModel,
    ...CollectionListModel
};