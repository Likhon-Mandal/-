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
        const sqlPath = path.join(__dirname, 'migrations', '005_create_committee_tables.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running Committee Board migration...');
        await pool.query(sql);
        console.log('Migration 005 completed successfully.');
    } catch (err) {
        console.error('Migration 005 failed:', err);
    } finally {
        await pool.end();
    }
}

runMigration();
