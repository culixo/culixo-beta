// config/db.js
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

console.log('Environment:', process.env.NODE_ENV);
console.log('Attempting database connection...'); // Debug log

const pool = new Pool({
    connectionString: connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Test connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client:', err.stack);
        return;
    }
    console.log('Database connected successfully to:', 
        connectionString ? connectionString.split('@')[1] : 'local database');
    release();
});

module.exports = pool;