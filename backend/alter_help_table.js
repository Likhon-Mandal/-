const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function runAlter() {
    try {
        console.log('Adding help_seeker to help_requests...');
        await pool.query('ALTER TABLE help_requests ADD COLUMN IF NOT EXISTS help_seeker VARCHAR(255);');
        console.log('Column added successfully.');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}

runAlter();
