const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
async function check() {
    try {
        const res = await pool.query('SELECT * FROM committees;');
        console.log("Committees:", res.rows);
        const res2 = await pool.query('SELECT * FROM committee_members;');
        console.log("Committee Members:", res2.rows);
    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
check();
