const { pool } = require('../config/db');

exports.getRecycleBin = async (req, res) => {
    try {
        const deletedItems = {
            members: [],
            countries: [],
            divisions: [],
            districts: [],
            upazilas: [],
            villages: [],
            homes: []
        };

        // Fetch members (Only if no parent location is also deleted)
        const membersQuery = `
            SELECT m.id, m.full_name as name, m.deleted_at 
            FROM members m 
            WHERE m.deleted_at IS NOT NULL 
            AND NOT EXISTS (SELECT 1 FROM homes h WHERE h.id = m.home_id AND h.deleted_at IS NOT NULL)
            AND NOT EXISTS (SELECT 1 FROM villages v WHERE v.id = m.village_id AND v.deleted_at IS NOT NULL)
            AND NOT EXISTS (SELECT 1 FROM upazilas u WHERE u.id = m.upazila_id AND u.deleted_at IS NOT NULL)
            AND NOT EXISTS (SELECT 1 FROM districts d WHERE d.id = m.district_id AND d.deleted_at IS NOT NULL)
            AND NOT EXISTS (SELECT 1 FROM divisions div WHERE div.id = m.division_id AND div.deleted_at IS NOT NULL)
            AND NOT EXISTS (SELECT 1 FROM countries c WHERE c.id = m.country_id AND c.deleted_at IS NOT NULL)
            ORDER BY m.deleted_at DESC
        `;
        const membersRes = await pool.query(membersQuery);
        deletedItems.members = membersRes.rows;

        // Fetch locations dynamically based on their parent relationships
        const queryMap = {
            countries: `SELECT id, name, deleted_at FROM countries WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC`,
            divisions: `SELECT d.id, d.name, d.deleted_at FROM divisions d WHERE d.deleted_at IS NOT NULL AND NOT EXISTS (SELECT 1 FROM countries c WHERE c.id = d.country_id AND c.deleted_at IS NOT NULL) ORDER BY d.deleted_at DESC`,
            districts: `SELECT d.id, d.name, d.deleted_at FROM districts d WHERE d.deleted_at IS NOT NULL AND NOT EXISTS (SELECT 1 FROM divisions div WHERE div.id = d.division_id AND div.deleted_at IS NOT NULL) ORDER BY d.deleted_at DESC`,
            upazilas: `SELECT u.id, u.name, u.deleted_at FROM upazilas u WHERE u.deleted_at IS NOT NULL AND NOT EXISTS (SELECT 1 FROM districts d WHERE d.id = u.district_id AND d.deleted_at IS NOT NULL) ORDER BY u.deleted_at DESC`,
            villages: `SELECT v.id, v.name, v.deleted_at FROM villages v WHERE v.deleted_at IS NOT NULL AND NOT EXISTS (SELECT 1 FROM upazilas u WHERE u.id = v.upazila_id AND u.deleted_at IS NOT NULL) ORDER BY v.deleted_at DESC`,
            homes: `SELECT h.id, h.name, h.deleted_at FROM homes h WHERE h.deleted_at IS NOT NULL AND NOT EXISTS (SELECT 1 FROM villages v WHERE v.id = h.village_id AND v.deleted_at IS NOT NULL) ORDER BY h.deleted_at DESC`
        };

        const fetchDeleted = async (table) => {
            const result = await pool.query(queryMap[table]);
            deletedItems[table] = result.rows;
        };

        await Promise.all([
            fetchDeleted('countries'),
            fetchDeleted('divisions'),
            fetchDeleted('districts'),
            fetchDeleted('upazilas'),
            fetchDeleted('villages'),
            fetchDeleted('homes')
        ]);

        res.json(deletedItems);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error fetching recycle bin' });
    }
};

exports.restoreItem = async (req, res) => {
    try {
        const { table, id } = req.params;

        // Validate table name to prevent SQL Injection
        const allowedTables = ['members', 'countries', 'divisions', 'districts', 'upazilas', 'villages', 'homes'];
        if (!allowedTables.includes(table)) {
            return res.status(400).json({ error: 'Invalid table name' });
        }

        // Restore the record
        // The PostgreSQL Triggers we created will take care of cascading this restoration down the hierarchy automatically.
        let query;
        if (table === 'members') {
            query = `UPDATE ${table} SET deleted_at = NULL WHERE id = $1 RETURNING *`;
        } else {
            // For location tables, we use ID as well since we fetch it from the Recycle Bin API.
            query = `UPDATE ${table} SET deleted_at = NULL WHERE id = $1 RETURNING *`;
        }

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found in recycle bin' });
        }

        res.json({ message: 'Item restored successfully', restored_item: result.rows[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error restoring item' });
    }
};
