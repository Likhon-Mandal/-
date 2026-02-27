const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function main() {
    try {
        const committeeResult = await pool.query(
            'SELECT * FROM committees ORDER BY is_current DESC, end_date DESC NULLS LAST'
        );
        console.log("committees:", committeeResult.rows.length);

        const membersResult = await pool.query(`
            SELECT cm.committee_id, cm.role, cm.order_index, cm.member_id,
                   m.full_name, m.profile_image_url, m.occupation, m.district
            FROM committee_members cm
            JOIN members m ON cm.member_id = m.id
            ORDER BY cm.order_index ASC
        `);
        console.log("members:", membersResult.rows.length);
    } catch (err) {
        console.error("SQL ERROR:", err);
    } finally {
        pool.end();
    }
}
main();
