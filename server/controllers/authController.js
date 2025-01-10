// controllers/authController.js
const pool = require('../config/db');
const { hashPassword } = require('../utils/passwordUtils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');

const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user using UserModel
        const newUser = await UserModel.createUser({
            fullName,
            email,
            passwordHash: hashedPassword
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: newUser,
            token
        });
    } catch (error) {
        console.error('Signup error details:', error);
        
        if (error.message === 'Email already registered' || 
            error.message === 'Username already taken') {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ 
            error: 'Error creating user', 
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        console.log('Attempting login for email:', email); // Debug log

        // Find user by email
        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        ).catch(err => {
            console.error('Database query error (find user):', err);
            throw new Error('Database error finding user');
        });

        console.log('User query completed, found rows:', userResult.rows.length); // Debug log

        const user = userResult.rows[0];

        // Check if user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Update last login
        await pool.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        ).catch(err => {
            console.error('Database query error (update login):', err);
            // Don't throw here as login was successful
        });

        // Don't send password hash to client
        const { password_hash, ...userWithoutPassword } = user;

        res.status(200).json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Login error details:', error);
        res.status(500).json({ 
            error: 'Error logging in', 
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
};

const verifyToken = async (req, res) => {
    try {
        // If the request makes it here, the token is valid (verified by authMiddleware)
        res.status(200).json({ 
            valid: true,
            userId: req.user.id
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { signup, login, verifyToken };