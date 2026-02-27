require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('./config/db');

async function runMigration() {
    try {
        const sqlPath = path.join(__dirname, 'migrations', '011_soft_deletes.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running Migration 011: Soft Deletes...');
        await pool.query(sql);
        console.log('Migration 011 completed successfully!');
    } catch (err) {
        console.error('Error running migration 011:', err);
    } finally {
        pool.end();
    }
}

runMigration();
