require('dotenv').config();
const { pool } = require('./config/db');

async function testDelete() {
  await pool.query('BEGIN');
  
  await pool.query('CREATE TEMP TABLE test_m (id serial primary key, father_id int, mother_id int, deleted_at timestamp)');
  
  await pool.query('INSERT INTO test_m (id, father_id, mother_id) VALUES (1, null, null)');
  await pool.query('INSERT INTO test_m (id, father_id, mother_id) VALUES (2, 1, null)');
  await pool.query('INSERT INTO test_m (id, father_id, mother_id) VALUES (3, 2, null)');
  await pool.query('INSERT INTO test_m (id, father_id, mother_id) VALUES (4, 3, null)');
  
  const targetId = 2; // Delete person 2, so 2, 3, 4 should be deleted
  
  const query = `
    WITH RECURSIVE descendants AS (
      SELECT id FROM test_m WHERE id = $1
      UNION ALL
      SELECT m.id FROM test_m m
      INNER JOIN descendants d ON m.father_id = d.id OR m.mother_id = d.id
    )
    UPDATE test_m
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id IN (SELECT id FROM descendants)
    RETURNING *;
  `;
  
  const res = await pool.query(query, [targetId]);
  console.log('Deleted rows:', res.rows.map(r => r.id));
  
  await pool.query('ROLLBACK');
  process.exit();
}
testDelete().catch(console.error);
