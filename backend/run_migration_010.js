require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('./config/db');

async function runMigration() {
    try {
        const sqlPath = path.join(__dirname, 'migrations', '010_cascade_deletes.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running Migration 010: Cascading Deletes...');
        await pool.query(sql);
        console.log('Migration 010 completed successfully!');
    } catch (err) {
        console.error('Error running migration 010:', err);
    } finally {
        pool.end();
    }
}

runMigration();
