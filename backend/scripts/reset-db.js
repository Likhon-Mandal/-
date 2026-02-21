const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { pool } = require('../config/db');

async function resetDb() {
  try {
    console.log('Dropping existing tables...');
    await pool.query('DROP TABLE IF EXISTS events CASCADE');
    await pool.query('DROP TABLE IF EXISTS members CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('Tables dropped successfully.');
  } catch (err) {
    console.error('Error resetting database:', err);
  } finally {
    await pool.end();
  }
}

resetDb();
