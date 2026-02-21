const { pool } = require('../config/db');

exports.getGeographicHierarchy = async (req, res) => {
    try {
        const { level, parent } = req.query; 
        
        // Hierarchy: country -> division -> district -> upazila -> union -> village -> home
        
        let query = '';
        let params = [];
        let parentId = null;

        // If parent is provided (name), we need to find its ID first to use as FK
        // Ideally frontend should send ID, but our current URL structure uses names. 
        // We will fetch ID based on parent name. This assumes names are unique within their scope (handled by UNIQUE constraints).

        if (parent && level !== 'country') {
             // Find parent ID.
             // Parent level is the one *above* current level.
             let parentTable = '';
             if (level === 'division') parentTable = 'countries';
             else if (level === 'district') parentTable = 'countries';
             else if (level === 'upazila') parentTable = 'districts';
             // Union removed
             else if (level === 'village') parentTable = 'upazilas';
             else if (level === 'home') parentTable = 'villages';

             if (parentTable) {
                 const parentRes = await pool.query(`SELECT id FROM ${parentTable} WHERE name = $1`, [parent]);
                 if (parentRes.rows.length > 0) {
                     parentId = parentRes.rows[0].id;
                 } else {
                     // Parent not found? Return empty
                     return res.json([]);
                 }
             }
        }

        if (!level || level === 'country') {
             query = 'SELECT name FROM countries ORDER BY name ASC';
        } else if (level === 'division') {
            query = 'SELECT name FROM divisions WHERE country_id = $1 ORDER BY name ASC';
            params = [parentId];
        } else if (level === 'district') {
            query = 'SELECT districts.name FROM districts JOIN divisions ON districts.division_id = divisions.id WHERE divisions.country_id = $1 ORDER BY districts.name ASC';
            params = [parentId];
        } else if (level === 'upazila') {
            query = 'SELECT name FROM upazilas WHERE district_id = $1 ORDER BY name ASC';
            params = [parentId];
        } else if (level === 'village') {
            // Village now child of Upazila
            query = 'SELECT name FROM villages WHERE upazila_id = $1 ORDER BY name ASC';
            params = [parentId];
        } else if (level === 'home') {
             query = 'SELECT name FROM homes WHERE village_id = $1 ORDER BY name ASC';
             params = [parentId];
        }

        const result = await pool.query(query, params);
        const items = result.rows.map(row => row.name);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.addLocationItem = async (req, res) => {
    try {
        const { level, name, parentName } = req.body;
        
        let table = '';
        let parentTable = '';
        let foreignKey = '';

        if (level === 'country') {
            table = 'countries';
        } else if (level === 'division') {
            table = 'divisions'; parentTable = 'countries'; foreignKey = 'country_id';
        } else if (level === 'district') {
            table = 'districts'; parentTable = 'countries'; // Direct connect to countries visually
        } else if (level === 'upazila') {
            table = 'upazilas'; parentTable = 'districts'; foreignKey = 'district_id';
        } else if (level === 'village') {
            table = 'villages'; parentTable = 'upazilas'; foreignKey = 'upazila_id';
        } else if (level === 'home') {
            table = 'homes'; parentTable = 'villages'; foreignKey = 'village_id';
        } else {
            return res.status(400).json({ error: 'Invalid level' });
        }

        let parentId = null;
        if (parentTable && parentName) {
            const parentRes = await pool.query(`SELECT id FROM ${parentTable} WHERE name = $1`, [parentName]);
            if (parentRes.rows.length === 0) {
                return res.status(404).json({ error: `Parent ${parentTable} not found` });
            }
            parentId = parentRes.rows[0].id;
        }

        let query = '';
        let params = [];

        if (table === 'countries') {
            query = `INSERT INTO ${table} (name) VALUES ($1) RETURNING *`;
            params = [name];
        } else if (level === 'district') {
            // Find or create 'Default Division' for this country
            let divRes = await pool.query('SELECT id FROM divisions WHERE country_id = $1 LIMIT 1', [parentId]);
            let divisionId;
            if (divRes.rows.length === 0) {
                const newDiv = await pool.query('INSERT INTO divisions (name, country_id) VALUES ($1, $2) RETURNING id', [`Default Division - ${parentName}`, parentId]);
                divisionId = newDiv.rows[0].id;
            } else {
                divisionId = divRes.rows[0].id;
            }
            query = `INSERT INTO districts (name, division_id) VALUES ($1, $2) RETURNING *`;
            params = [name, divisionId];
        } else {
            query = `INSERT INTO ${table} (name, ${foreignKey}) VALUES ($1, $2) RETURNING *`;
            params = [name, parentId];
        }

        const result = await pool.query(query, params);
        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique violation
            res.status(409).json({ error: 'Item already exists' });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
};

exports.editLocationItem = async (req, res) => {
    try {
        const { level, oldName, newName, parentName } = req.body;
        
        if (!level || !oldName || !newName) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let table = '';
        let parentTable = '';
        let foreignKey = '';

        if (level === 'country') {
            table = 'countries';
        } else if (level === 'division') {
            table = 'divisions'; parentTable = 'countries'; foreignKey = 'country_id';
        } else if (level === 'district') {
            // Note: Our DB schema uses districts pointing to divisions. 
            // In addLocationItem, we create a default division if linking district directly to country.
            // When editing a district by its visually-apparent parent (Country), we need to find that default division or join.
            table = 'districts'; parentTable = 'divisions'; // Because district.division_id exists
        } else if (level === 'upazila') {
            table = 'upazilas'; parentTable = 'districts'; foreignKey = 'district_id';
        } else if (level === 'village') {
            table = 'villages'; parentTable = 'upazilas'; foreignKey = 'upazila_id';
        } else if (level === 'home') {
            table = 'homes'; parentTable = 'villages'; foreignKey = 'village_id';
        } else {
            return res.status(400).json({ error: 'Invalid level' });
        }

        let query = '';
        let params = [];

        if (level === 'country') {
            // Country is top level, just update by name
            query = `UPDATE ${table} SET name = $1 WHERE name = $2 RETURNING *`;
            params = [newName, oldName];
        } else if (level === 'district' && parentName) {
             // To securely rename a district, make sure it belongs to the intended Country 
             // (via its intermediate division). This prevents renaming ALL districts named X globally.
             query = `
                UPDATE districts 
                SET name = $1 
                WHERE name = $2 AND division_id IN (
                    SELECT id FROM divisions WHERE country_id = (
                        SELECT id FROM countries WHERE name = $3
                    )
                )
                RETURNING *
             `;
             params = [newName, oldName, parentName];
        } else if (parentName) {
            // Secure update for all other levels relying on foreignKey to specific parent
            query = `
                UPDATE ${table} 
                SET name = $1 
                WHERE name = $2 AND ${foreignKey} = (
                    SELECT id FROM ${parentTable} WHERE name = $3
                )
                RETURNING *
            `;
            params = [newName, oldName, parentName];
        } else {
            // Fallback unsafe query (should only happen if frontend doesn't send parentName)
            query = `UPDATE ${table} SET name = $1 WHERE name = $2 RETURNING *`;
            params = [newName, oldName];
        }

        const result = await pool.query(query, params);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found or parent mismatch' });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique constraint violation on update
            res.status(409).json({ error: 'A location with this new name already exists here' });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
};

exports.getFamilyMembers = async (req, res) => {
    // Get members of a specific household
    try {
        const { home_name, village } = req.query;
        
        // We need to join with homes and villages to filter by their strings
        const query = `
            SELECT m.*, h.name as home_name, v.name as village
            FROM members m
            JOIN homes h ON m.home_id = h.id
            JOIN villages v ON m.village_id = v.id
            WHERE h.name = $1 AND v.name = $2
        `;

        const result = await pool.query(query, [home_name, village]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getRelatives = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get the member first
        const memberResult = await pool.query('SELECT * FROM members WHERE id = $1', [id]);
        if (memberResult.rows.length === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }
        const member = memberResult.rows[0];

        // Get Parents
        const parentsQuery = 'SELECT * FROM members WHERE id IN ($1, $2)';
        const parentsResult = await pool.query(parentsQuery, [member.father_id, member.mother_id]);

        // Get Spouse
        const spouseQuery = 'SELECT * FROM members WHERE id = $1';
        const spouseResult = member.spouse_id ? await pool.query(spouseQuery, [member.spouse_id]) : { rows: [] };

        // Get Children
        const childrenQuery = 'SELECT * FROM members WHERE father_id = $1 OR mother_id = $1';
        const childrenResult = await pool.query(childrenQuery, [id]);

        const response = {
            self: member,
            parents: parentsResult.rows,
            spouse: spouseResult.rows[0] || null,
            children: childrenResult.rows
        };

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
