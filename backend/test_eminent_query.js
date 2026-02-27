const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function testQuery() {
    try {
        const query = `
            SELECT ef.id, ef.category, ef.title, ef.member_id,
                   m.full_name, m.profile_image_url, m.education, m.occupation, m.district, m.village
            FROM eminent_figures ef
            JOIN members m ON ef.member_id = m.id
            ORDER BY ef.created_at DESC
        `;
        const result = await pool.query(query);
        console.log(result.rows);
    } catch (err) {
        console.error('ERROR:', err.message);
    } finally {
        await pool.end();
    }
}

testQuery();
