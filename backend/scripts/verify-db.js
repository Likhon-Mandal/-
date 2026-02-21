const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { pool } = require('../config/db');

async function verifyDb() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tables found:', res.rows.map(r => r.table_name));
    
    // Check if expected tables exist
    const expectedTables = ['users', 'members', 'events'];
    const foundTables = res.rows.map(r => r.table_name);
    
    const missing = expectedTables.filter(t => !foundTables.includes(t));
    
    if (missing.length === 0) {
      console.log('Verification SUCCESS: All expected tables found.');
    } else {
      console.log('Verification FAILED: Missing tables:', missing);
    }
    
  } catch (err) {
    console.error('Error verifying database:', err);
  } finally {
    await pool.end();
  }
}

verifyDb();
