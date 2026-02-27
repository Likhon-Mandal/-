require('dotenv').config();
const { pool } = require('./config/db');

async function test() {
    await pool.query('BEGIN');

    await pool.query('CREATE TEMP TABLE test_m (id serial primary key, father_id int, mother_id int, level int)');

    await pool.query('INSERT INTO test_m (id, father_id, mother_id, level) VALUES (1, null, null, 1)');
    await pool.query('INSERT INTO test_m (id, father_id, mother_id, level) VALUES (2, 1, null, 2)');
    await pool.query('INSERT INTO test_m (id, father_id, mother_id, level) VALUES (3, 2, null, 3)');
    await pool.query('INSERT INTO test_m (id, father_id, mother_id, level) VALUES (4, 3, null, 4)');

    const id = 1;
    const levelDiff = 2; // G1 -> G3 => +2

    await pool.query(`UPDATE test_m SET level = level + $1 WHERE id = $2`, [levelDiff, id]);

    const cte = `
        WITH RECURSIVE descendants AS (
          SELECT id FROM test_m WHERE father_id = $1 OR mother_id = $1
          UNION ALL
          SELECT m.id FROM test_m m
          INNER JOIN descendants d ON m.father_id = d.id OR m.mother_id = d.id
        )
        UPDATE test_m
        SET level = level + $2
        WHERE id IN (SELECT id FROM descendants)
          AND level IS NOT NULL
        RETURNING *;
  `;
    const res = await pool.query(cte, [id, levelDiff]);
    console.log('Updated rows:', res.rows);

    const all = await pool.query('SELECT * FROM test_m ORDER BY id');
    console.log('All rows:', all.rows);

    // Also check descendants exact count
    const printDesc = await pool.query(`
        WITH RECURSIVE descendants AS (
          SELECT id FROM test_m WHERE father_id = $1 OR mother_id = $1
          UNION ALL
          SELECT m.id FROM test_m m
          INNER JOIN descendants d ON m.father_id = d.id OR m.mother_id = d.id
        )
        SELECT * FROM descendants;
  `, [id]);
    console.log('Descendants CTE output:', printDesc.rows);

    await pool.query('ROLLBACK');
    process.exit(0);
}
test().catch(console.error);
