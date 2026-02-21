const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const fs = require('fs');
const { pool } = require('../config/db');

const schemaPath = path.join(__dirname, '../database/schema.sql');

async function initDb() {
  try {
    const sql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Running schema.sql...');
    await pool.query(sql);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await pool.end();
  }
}

initDb();
