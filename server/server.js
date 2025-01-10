// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ListBucketsCommand } = require('@aws-sdk/client-s3');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const recipeDraftRoutes = require('./routes/recipeDraftRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const userRoutes = require('./routes/userRoutes');     // Add this line

const app = express();

// Environment-specific variables
const isDevelopment = process.env.NODE_ENV !== 'production';
const allowedOrigins = [
    'https://www.culixo.com',              // Production
    'http://localhost:3000',               // Local development
    process.env.FRONTEND_URL               // Flexible override
].filter(Boolean); // Remove any undefined values

// Middleware for detailed logging (only in development)
if (isDevelopment) {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Enhanced CORS configuration
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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
app.use('/api/users', userRoutes);         // Add this line

// Catch unmatched routes
app.use((req, res) => {
    if (isDevelopment) {
        console.log('No route matched:', req.method, req.url);
    }
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.url}`
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});