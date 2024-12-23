require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ListBucketsCommand } = require('@aws-sdk/client-s3');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const recipeDraftRoutes = require('./routes/recipeDraftRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');

const app = express();

// Middleware for detailed logging
app.use((req, res, next) => {
    console.log('Incoming request:', {
        method: req.method,
        path: req.path,
        url: req.url,
        headers: req.headers
    });
    next();
});

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/drafts', recipeDraftRoutes);
app.use('/api/nutrition', nutritionRoutes);
// app.use('/recipes', recipeRoutes);

// Catch unmatched routes
app.use((req, res) => {
    console.log('No route matched:', req.method, req.url);
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.url}`
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});