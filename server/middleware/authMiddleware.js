const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Auth header received:', authHeader);
        let token;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
            console.log('Token extracted from header:', token ? 'exists' : 'missing');
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
            console.log('Token extracted from cookies:', token ? 'exists' : 'missing');
        }

        if (!token) {
            console.log('No token found in request');
            return res.status(401).json({ error: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token userId:', decoded.userId);
            
            const userResult = await pool.query(
                'SELECT id, email, full_name FROM users WHERE id = $1',
                [decoded.userId]
            );

            console.log('User found:', userResult.rows[0] ? 'yes' : 'no');

            if (!userResult.rows[0]) {
                return res.status(401).json({ error: 'User not found' });
            }

            req.user = userResult.rows[0];
            next();
        } catch (err) {
            console.log('Token verification error:', err.message);
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authMiddleware;