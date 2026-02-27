const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

exports.getCommittees = async (req, res) => {
    try {
        // Fetch committees
        const committeeResult = await pool.query(
            'SELECT * FROM committees ORDER BY is_current DESC, end_date DESC NULLS LAST'
        );
        const committees = committeeResult.rows;

        // Fetch members for these committees
        const membersResult = await pool.query(`
            SELECT cm.committee_id, cm.role, cm.order_index, cm.member_id,
                   m.full_name, m.profile_image_url, m.occupation
            FROM committee_members cm
            JOIN members m ON cm.member_id = m.id
            ORDER BY cm.order_index ASC
        `);
        const membersRows = membersResult.rows;

        // Group members by committee_id
        const memMap = {};
        membersRows.forEach(row => {
            if (!memMap[row.committee_id]) memMap[row.committee_id] = [];
            memMap[row.committee_id].push({
                member_id: row.member_id,
                full_name: row.full_name,
                role: row.role,
                profile_image_url: row.profile_image_url,
                occupation: row.occupation
            });
        });

        // Attach
        const result = committees.map(c => ({
            ...c,
            members: memMap[c.id] || []
        }));

        res.json(result);
    } catch (err) {
        console.error('Error fetching committees:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createCommittee = async (req, res) => {
    const { name, start_date, end_date, is_current, members } = req.body;
    // members should be an array of: { member_id, role, order_index }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        if (is_current) {
            // Unset current for others
            await client.query('UPDATE committees SET is_current = FALSE');
        }

        // Insert committee
        const insertCommText = `
            INSERT INTO committees (name, start_date, end_date, is_current)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;
        const commRes = await client.query(insertCommText, [
            name, start_date || null, end_date || null, is_current || false
        ]);
        const newCommitteeId = commRes.rows[0].id;

        // Insert members
        if (members && members.length > 0) {
            const insertMemText = `
                INSERT INTO committee_members (committee_id, member_id, role, order_index)
                VALUES ($1, $2, $3, $4)
            `;
            for (let i = 0; i < members.length; i++) {
                const mem = members[i];
                await client.query(insertMemText, [
                    newCommitteeId, mem.member_id, mem.role, mem.order_index || i
                ]);
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Committee created successfully', id: newCommitteeId });
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error creating committee:', e);
        res.status(500).json({ error: 'Server error creating committee' });
    } finally {
        client.release();
    }
};

exports.updateCommittee = async (req, res) => {
    const { id } = req.params;
    const { name, start_date, end_date, is_current, members } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        if (is_current) {
            await client.query('UPDATE committees SET is_current = FALSE WHERE id != $1', [id]);
        }

        const updateCommText = `
            UPDATE committees 
            SET name = $1, start_date = $2, end_date = $3, is_current = $4
            WHERE id = $5
        `;
        await client.query(updateCommText, [
            name, start_date || null, end_date || null, is_current || false, id
        ]);

        // Delete all old members and reinsert
        await client.query('DELETE FROM committee_members WHERE committee_id = $1', [id]);

        if (members && members.length > 0) {
            const insertMemText = `
                INSERT INTO committee_members (committee_id, member_id, role, order_index)
                VALUES ($1, $2, $3, $4)
            `;
            for (let i = 0; i < members.length; i++) {
                const mem = members[i];
                await client.query(insertMemText, [
                    id, mem.member_id, mem.role, mem.order_index || i
                ]);
            }
        }

        await client.query('COMMIT');
        res.json({ message: 'Committee updated successfully' });
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error updating committee:', e);
        res.status(500).json({ error: 'Server error updating committee' });
    } finally {
        client.release();
    }
};

exports.deleteCommittee = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM committees WHERE id = $1', [id]);
        res.json({ message: 'Committee deleted successfully' });
    } catch (e) {
        console.error('Error deleting committee:', e);
        res.status(500).json({ error: 'Server error deleting committee' });
    }
};

