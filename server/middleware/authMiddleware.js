const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authMiddleware = async (req, res, next) => {
    try {
        // First check Authorization header
        const authHeader = req.headers.authorization;
        let token;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            // If no Bearer token, check for cookie
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from database
            const userResult = await pool.query(
                'SELECT id, email, full_name FROM users WHERE id = $1',
                [decoded.userId]
            );

            if (!userResult.rows[0]) {
                return res.status(401).json({ error: 'User not found' });
            }

            req.user = userResult.rows[0];
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authMiddleware;