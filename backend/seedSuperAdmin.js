const bcrypt = require('bcrypt');
const { pool } = require('./config/db');

const SUPERADMIN_EMAIL = 'likhon.cse9.bu@gmail.com';
const SUPERADMIN_PASSWORD = '26269234';
const SUPERADMIN_NAME = 'Likhon Mandal';

const seedSuperAdmin = async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, salt);

        await pool.query(
            `INSERT INTO admin_users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'superadmin')
       ON CONFLICT (email)
       DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         name = EXCLUDED.name,
         role = 'superadmin'`,
            [SUPERADMIN_NAME, SUPERADMIN_EMAIL, hashedPassword]
        );

        console.log('✅ SuperAdmin seeded/verified successfully');
    } catch (err) {
        console.error('❌ Failed to seed SuperAdmin:', err.message);
    }
};

module.exports = { seedSuperAdmin };
