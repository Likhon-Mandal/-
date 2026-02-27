const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

exports.getEvents = async (req, res) => {
    try {
        const query = 'SELECT * FROM events ORDER BY created_at DESC';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.addEvent = async (req, res) => {
    const { title, date, time, location, description } = req.body;

    if (!title || !date) {
        return res.status(400).json({ error: 'Title and date are required' });
    }

    try {
        const query = `
            INSERT INTO events (title, date, time, location, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const result = await pool.query(query, [title, date, time, location, description]);
        res.status(201).json({ message: 'Event added successfully', data: result.rows[0] });
    } catch (err) {
        console.error('Error adding event:', err);
        res.status(500).json({ error: 'Server error adding event' });
    }
};

exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM events WHERE id = $1', [id]);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Server error deleting event' });
    }
};

exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, date, time, location, description } = req.body;

    if (!title || !date) {
        return res.status(400).json({ error: 'Title and date are required' });
    }

    try {
        const query = `
            UPDATE events
            SET title = $1, date = $2, time = $3, location = $4, description = $5
            WHERE id = $6
            RETURNING *
        `;
        const result = await pool.query(query, [title, date, time, location, description, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ message: 'Event updated successfully', data: result.rows[0] });
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ error: 'Server error updating event' });
    }
};
