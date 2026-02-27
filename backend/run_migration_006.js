const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function runMigration() {
    try {
        const sqlPath = path.join(__dirname, 'migrations', '006_create_eminent_figures.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running Eminent Figures migration...');
        await pool.query(sql);
        console.log('Migration 006 completed successfully.');
    } catch (err) {
        console.error('Migration 006 failed:', err);
    } finally {
        await pool.end();
    }
}

runMigration();
