// server/controllers/collections/listController.js
const CollectionModel = require('../../models/collections');

const CollectionListController = {
    getUserCollections: async (req, res) => {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 12;

            const result = await CollectionModel.getUserCollections(userId, { page, limit });

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Error in getUserCollections:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching collections',
                error: error.message
            });
        }
    }
};

module.exports = CollectionListController;