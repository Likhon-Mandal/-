const { pool } = require('./config/db');
require('dotenv').config();

async function test() {
    try {
        console.log("Testing deletion...");
        // Assuming we are trying to delete a fake district "TestDist"
        const query = `
                DELETE FROM districts 
                WHERE name = $1 AND division_id IN (
                    SELECT id FROM divisions WHERE country_id = (
                        SELECT id FROM countries WHERE name = $2
                    )
                )
                RETURNING *
             `;
        const result = await pool.query(query, ['TestDist', 'Bangladesh']);
        console.log(result.rows);
    } catch (err) {
        console.error("DB Error =>", err);
    } finally {
        pool.end();
    }
}
test();
