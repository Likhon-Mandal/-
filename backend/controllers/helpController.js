const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

exports.getHelpRequests = async (req, res) => {
    try {
        const query = 'SELECT * FROM help_requests ORDER BY created_at DESC';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching help requests:', err);
        res.status(500).json({ error: 'Server error fetching help requests' });
    }
};

exports.addHelpRequest = async (req, res) => {
    const { title, tag, type, content, posted_by, help_seeker } = req.body;

    if (!title || !tag) {
        return res.status(400).json({ error: 'Title and tag are required' });
    }

    try {
        const query = `
            INSERT INTO help_requests (title, tag, type, content, posted_by, help_seeker)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const result = await pool.query(query, [
            title,
            tag,
            type || 'alert',
            content,
            posted_by || 'Admin',
            help_seeker
        ]);
        res.status(201).json({ message: 'Help request added successfully', data: result.rows[0] });
    } catch (err) {
        console.error('Error adding help request:', err);
        res.status(500).json({ error: 'Server error adding help request' });
    }
};

exports.updateHelpRequest = async (req, res) => {
    const { id } = req.params;
    const { title, tag, type, content, posted_by, help_seeker } = req.body;

    if (!title || !tag) {
        return res.status(400).json({ error: 'Title and tag are required' });
    }

    try {
        const query = `
            UPDATE help_requests
            SET title = $1, tag = $2, type = $3, content = $4, posted_by = $5, help_seeker = $6
            WHERE id = $7
            RETURNING *
        `;
        const result = await pool.query(query, [title, tag, type, content, posted_by, help_seeker, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Help request not found' });
        }
        res.json({ message: 'Help request updated successfully', data: result.rows[0] });
    } catch (err) {
        console.error('Error updating help request:', err);
        res.status(500).json({ error: 'Server error updating help request' });
    }
};

exports.deleteHelpRequest = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM help_requests WHERE id = $1', [id]);
        res.json({ message: 'Help request deleted successfully' });
    } catch (err) {
        console.error('Error deleting help request:', err);
        res.status(500).json({ error: 'Server error deleting help request' });
    }
};
