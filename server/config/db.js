// config/db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database:process.env.DATABASE_NAME,
    password:process.env.DATABASE_PASSWORD, 
    port: 5432,
});

module.exports = pool;