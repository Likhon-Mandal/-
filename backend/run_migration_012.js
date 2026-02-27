require('dotenv').config();
const { pool } = require('./config/db');
const fs = require('fs');

async function run() {
  try {
    const script = fs.readFileSync('migrations/012_add_member_work_social.sql', 'utf8');
    await pool.query(script);
    console.log('Migration 012 applied successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit();
  }
}
run();
