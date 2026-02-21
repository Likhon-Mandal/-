const { pool } = require('../config/db');

exports.getAllMembers = async (req, res) => {
  try {
    const { name, workplace, education, blood_group, country, division, district } = req.query;
    
    let query = `
        SELECT m.*, 
               c.name as country, 
               d.name as division, 
               di.name as district, 
               u.name as upazila, 
               v.name as village, 
               h.name as home_name
        FROM members m
        LEFT JOIN countries c ON m.country_id = c.id
        LEFT JOIN divisions d ON m.division_id = d.id
        LEFT JOIN districts di ON m.district_id = di.id
        LEFT JOIN upazilas u ON m.upazila_id = u.id
        LEFT JOIN villages v ON m.village_id = v.id
        LEFT JOIN homes h ON m.home_id = h.id
        WHERE 1=1
    `;
    
    const params = [];

    if (name) {
      params.push(`%${name}%`);
      query += ` AND m.full_name ILIKE $${params.length}`;
    }
    if (workplace) {
      params.push(`%${workplace}%`);
      query += ` AND m.occupation ILIKE $${params.length}`;
    }
    if (education) {
      params.push(`%${education}%`);
      query += ` AND m.education ILIKE $${params.length}`;
    }
    if (blood_group) {
        params.push(blood_group);
        query += ` AND m.blood_group = $${params.length}`;
    }
    
    // Geographic filters (by Name)
    // Since frontend sends names, we filter on the joined table names
    if (country) {
        params.push(country);
        query += ` AND c.name = $${params.length}`;
    }
    if (division) {
        params.push(division);
        query += ` AND d.name = $${params.length}`;
    }
    if (district) {
        params.push(district);
        query += ` AND di.name = $${params.length}`;
    }

    query += ' LIMIT 100'; 

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM members WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createMember = async (req, res) => {
  try {
    const {
      full_name, gender, blood_group, occupation, education,
      birth_date, death_date, is_alive,
      contact_number, email, present_address, permanent_address,
      country, division, district, upazila, union_ward, village, home_name,
      father_id, mother_id, spouse_id,
      profile_image_url, bio, level
    } = req.body;

    // Helper to get ID or create if not exists (or just get)
    // For now, we assume locations exist or we fail?
    // User flow: Explorer adds locations first. Member form selects them (or passes them).
    // If strict FK, we must find IDs.
    
    // Function to find ID by name from a table
    const findId = async (table, name, parentCol, parentId) => {
        if (!name) return null;
        let query = `SELECT id FROM ${table} WHERE name = $1`;
        let params = [name];
        if (parentCol && parentId) {
            query += ` AND ${parentCol} = $2`;
            params.push(parentId);
        }
        const res = await pool.query(query, params);
        if (res.rows.length > 0) return res.rows[0].id;
        return null; // Or throw error?
    };

    // Resolve IDs hierarchy
    const country_id = await findId('countries', country);
    const division_id = await findId('divisions', division, 'country_id', country_id);
    const district_id = await findId('districts', district, 'division_id', division_id);
    const upazila_id = await findId('upazilas', upazila, 'district_id', district_id);
    // Union removed
    const village_id = await findId('villages', village, 'upazila_id', upazila_id);
    const home_id = await findId('homes', home_name, 'village_id', village_id);

    // Note: If any ID is missing but name was provided, it means data inconsistency or location not added yet.

    const query = `
      INSERT INTO members (
        full_name, gender, blood_group, occupation, education,
        birth_date, death_date, is_alive,
        contact_number, email, present_address, permanent_address,
        country_id, division_id, district_id, upazila_id, village_id, home_id,
        father_id, mother_id, spouse_id,
        profile_image_url, bio, level
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8,
        $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20, $21,
        $22, $23, $24
      ) RETURNING *`;
    
    const values = [
      full_name, gender, blood_group, occupation, education,
      birth_date || null, death_date || null, is_alive,
      contact_number, email, present_address, permanent_address,
      country_id, division_id, district_id, upazila_id, village_id, home_id,
      father_id, mother_id, spouse_id,
      profile_image_url, bio, level
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name, gender, blood_group, occupation, education,
      birth_date, death_date, is_alive,
      contact_number, email, present_address, permanent_address,
      country, division, district, upazila, village, home_name,
      father_id, mother_id, spouse_id,
      profile_image_url, bio, level
    } = req.body;

    // Helper to find ID (same as create)
    const findId = async (table, name, parentCol, parentId) => {
        if (!name) return null;
        let query = `SELECT id FROM ${table} WHERE name = $1`;
        let params = [name];
        if (parentCol && parentId) {
            query += ` AND ${parentCol} = $2`;
            params.push(parentId);
        }
        const res = await pool.query(query, params);
        if (res.rows.length > 0) return res.rows[0].id;
        return null;
    };

    // Resolve IDs
    const country_id = await findId('countries', country);
    const division_id = await findId('divisions', division, 'country_id', country_id);
    const district_id = await findId('districts', district, 'division_id', division_id);
    const upazila_id = await findId('upazilas', upazila, 'district_id', district_id);
    const village_id = await findId('villages', village, 'upazila_id', upazila_id);
    const home_id = await findId('homes', home_name, 'village_id', village_id);

    const query = `
      UPDATE members SET
        full_name = $1, gender = $2, blood_group = $3, occupation = $4, education = $5,
        birth_date = $6, death_date = $7, is_alive = $8,
        contact_number = $9, email = $10, present_address = $11, permanent_address = $12,
        country_id = $13, division_id = $14, district_id = $15, upazila_id = $16, village_id = $17, home_id = $18,
        father_id = $19, mother_id = $20, spouse_id = $21,
        profile_image_url = $22, bio = $23, level = $24,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $25 RETURNING *`;
    
    const values = [
      full_name, gender, blood_group, occupation, education,
      birth_date || null, death_date || null, is_alive,
      contact_number, email, present_address, permanent_address,
      country_id, division_id, district_id, upazila_id, village_id, home_id,
      father_id, mother_id, spouse_id,
      profile_image_url, bio, level,
      id
    ];

    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM members WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
