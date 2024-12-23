const express = require('express');
const router = express.Router();
const nutritionController = require('../controllers/nutritionController');
const authMiddleware = require('../middleware/authMiddleware');
const NutritionService = require('../services/nutritionService');

// Health check route (no auth required)
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Nutrition routes are working'
    });
});

// Test route
router.post('/test', authMiddleware, async (req, res) => {
    try {
        console.log('Starting nutrition test calculation');
        
        const testIngredients = [
            { quantity: 100, unit: 'g', name: 'chicken breast' },
            { quantity: 1, unit: 'cup', name: 'rice' },
            { quantity: 2, unit: 'tbsp', name: 'olive oil' }
        ];
        
        console.log('Test ingredients:', testIngredients);
        console.log('API credentials:', {
            appId: process.env.EDAMAM_APP_ID ? 'Present' : 'Missing',
            appKey: process.env.EDAMAM_APP_KEY ? 'Present' : 'Missing'
        });

        const nutritionInfo = await NutritionService.calculateNutrition(testIngredients);
        
        console.log('Calculation successful:', nutritionInfo);
        
        res.json({
            success: true,
            data: nutritionInfo,
            message: 'Test calculation successful'
        });
    } catch (error) {
        console.error('Test calculation error:', {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
        });
        
        res.status(500).json({
            success: false,
            message: 'Test calculation failed',
            error: error.message,
            details: error.response?.data || 'No additional error details'
        });
    }
});

// Main routes
router.post('/calculate', authMiddleware, nutritionController.calculateAndSaveNutrition);
router.get('/:id', authMiddleware, nutritionController.getNutritionInfo);

module.exports = router;