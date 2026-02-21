const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const clearData = async () => {
    try {
        console.log('🗑️  Clearing all data...');
        await pool.query('TRUNCATE TABLE members RESTART IDENTITY CASCADE');
        console.log('✅ Database cleared successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error clearing data:', err);
        process.exit(1);
    }
};

clearData();
