require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const runMigration = async () => {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'migrations', '013_admin_users.sql'), 'utf8');
        await pool.query(sql);
        console.log('✅ Migration 013 (admin_users) completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration 013 failed:', err.message);
        process.exit(1);
    }
};

runMigration();
