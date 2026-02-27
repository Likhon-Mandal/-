const { pool } = require('./config/db');
require('dotenv').config();

async function run() {
    try {
        console.log("Checking locations...");
        const res = await pool.query("SELECT * FROM districts LIMIT 5");
        console.log(res.rows);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        pool.end();
    }
}
run();
