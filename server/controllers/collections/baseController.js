// server/controllers/collections/baseController.js
const CollectionModel = require('../../models/collections');

const CollectionBaseController = {
    createCollection: async (req, res) => {
        try {
            const userId = req.user.id;
            const { name, description } = req.body;

            // Validate input
            if (!name?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Collection name is required'
                });
            }

            const collection = await CollectionModel.createCollection(userId, {
                name: name.trim(),
                description: description?.trim()
            });

            res.status(201).json({
                success: true,
                message: 'Collection created successfully',
                data: collection
            });
        } catch (error) {
            console.error('Error in createCollection:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating collection',
                error: error.message
            });
        }
    },

    getCollection: async (req, res) => {
        try {
            const { id: collectionId } = req.params;
            const userId = req.user.id;

            const collection = await CollectionModel.getCollectionById(collectionId, userId);

            if (!collection) {
                return res.status(404).json({
                    success: false,
                    message: 'Collection not found'
                });
            }

            res.json({
                success: true,
                data: collection
            });
        } catch (error) {
            console.error('Error in getCollection:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching collection',
                error: error.message
            });
        }
    },

    updateCollection: async (req, res) => {
        try {
            const { id: collectionId } = req.params;
            const userId = req.user.id;
            const { name, description } = req.body;

            if (!name?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Collection name is required'
                });
            }

            const updatedCollection = await CollectionModel.updateCollection(
                collectionId,
                userId,
                {
                    name: name.trim(),
                    description: description?.trim()
                }
            );

            if (!updatedCollection) {
                return res.status(404).json({
                    success: false,
                    message: 'Collection not found'
                });
            }

            res.json({
                success: true,
                message: 'Collection updated successfully',
                data: updatedCollection
            });
        } catch (error) {
            console.error('Error in updateCollection:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating collection',
                error: error.message
            });
        }
    },

    deleteCollection: async (req, res) => {
        try {
            const { id: collectionId } = req.params;
            const userId = req.user.id;

            const deletedCollection = await CollectionModel.deleteCollection(collectionId, userId);

            if (!deletedCollection) {
                return res.status(404).json({
                    success: false,
                    message: 'Collection not found'
                });
            }

            res.json({
                success: true,
                message: 'Collection deleted successfully'
            });
        } catch (error) {
            console.error('Error in deleteCollection:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting collection',
                error: error.message
            });
        }
    }
};

module.exports = CollectionBaseController;