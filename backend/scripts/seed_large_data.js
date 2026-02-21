const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config(); // Looks for .env in current working directory (backend root)

// Fallback to default env vars if strictly running from root
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'projenitor_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Emma', 'Robert', 'Olivia', 'William', 'Ava', 'Joseph', 'Isabella', 'Thomas', 'Sophia', 'Charles', 'Mia', 'Daniel', 'Charlotte', 'Rahim', 'Karim', 'Sultana', 'Fatima', 'Abdul', 'Ayesha', 'Kamal', 'Jamal', 'Nasreen', 'Parveen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Khan', 'Chowdhury', 'Ahmed', 'Islam', 'Rahman', 'Ali', 'Hossain', 'Sarkar', 'Uddin', 'Alam'];
const occupations = ['Engineer', 'Doctor', 'Teacher', 'Farmer', 'Artist', 'Soldier', 'Banker', 'Lawyer', 'Merchant', 'Carpenter', 'Civil Servant', 'Nurse', 'Pilot', 'Scientist'];

const generateRandomName = () => {
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedLargeData = async () => {
    const client = await pool.connect();
    try {
        console.log('🌱 Starting large seed process (1000+ nodes)...');
        await client.query('BEGIN');

        // 1. Clear existing data
        console.log('🧹 Clearing existing data...');
        await client.query('TRUNCATE TABLE members, homes, villages, upazilas, districts, divisions, countries RESTART IDENTITY CASCADE');

        // 2. See Locations
        console.log('🌍 Seeding Locations...');
        
        // Country
        const countryRes = await client.query("INSERT INTO countries (name) VALUES ('Bangladesh') RETURNING id");
        const countryId = countryRes.rows[0].id;

        // Divisions (2)
        const divNames = ['Dhaka', 'Barishal', 'Chittagong', 'Khulna'];
        const divisionIds = [];
        for (let i = 0; i < 2; i++) {
            const res = await client.query('INSERT INTO divisions (name, country_id) VALUES ($1, $2) RETURNING id', [divNames[i], countryId]);
            divisionIds.push(res.rows[0].id);
        }

        // Districts (4 per div)
        const districtIds = [];
        for (const divId of divisionIds) {
            for (let i = 1; i <= 4; i++) {
                const res = await client.query('INSERT INTO districts (name, division_id) VALUES ($1, $2) RETURNING id', [`District ${i}-${divId}`, divId]);
                districtIds.push(res.rows[0].id);
            }
        }

        // Upazilas (4 per dist)
        const upazilaIds = [];
        for (const distId of districtIds) {
            for (let i = 1; i <= 4; i++) {
                const res = await client.query('INSERT INTO upazilas (name, district_id) VALUES ($1, $2) RETURNING id', [`Upazila ${i}-${distId}`, distId]);
                upazilaIds.push(res.rows[0].id);
            }
        }

        // Villages (4 per upazila)
        const villageIds = [];
        for (const upaId of upazilaIds) {
            for (let i = 1; i <= 4; i++) {
                const res = await client.query('INSERT INTO villages (name, upazila_id) VALUES ($1, $2) RETURNING id', [`Village ${i}-${upaId}`, upaId]);
                villageIds.push(res.rows[0].id);
            }
        }

        // Homes (4 per village)
        // Store full location context for homes to easily assign to members
        const homes = [];
        for (const villId of villageIds) {
            for (let i = 1; i <= 4; i++) {
                const homeName = `Bari ${i}-${villId}`;
                const res = await client.query('INSERT INTO homes (name, village_id) VALUES ($1, $2) RETURNING id', [homeName, villId]);
                
                // Need to look up the hierarchy for this home to assign consistent FKs to members
                // optimization: we could have tracked this in nested loops, but let's just do a quick lookup query or pass ids down?
                // Actually, passing IDs down in loops is cleaner but deeply nested.
                // Let's just pick a random home later and traverse UP to get parents.
                homes.push(res.rows[0].id);
            }
        }
        
        console.log(`✅ Created infrastructure: ${divisionIds.length} Divs, ${districtIds.length} Dists, ${upazilaIds.length} Upas, ${villageIds.length} Villages, ${homes.length} Homes.`);

        // Helper to get full location hierarchy for a home
        // We will just query the DB for the mapping to avoid complexity
        // Better: Pre-fetch all homes with their hierarchy
        const homeDetailsQuery = `
            SELECT h.id as home_id, v.id as village_id, u.id as upazila_id, d.id as district_id, div.id as division_id, c.id as country_id
            FROM homes h
            JOIN villages v ON h.village_id = v.id
            JOIN upazilas u ON v.upazila_id = u.id
            JOIN districts d ON u.district_id = d.id
            JOIN divisions div ON d.division_id = div.id
            JOIN countries c ON div.country_id = c.id
        `;
        const allHomeDetails = (await client.query(homeDetailsQuery)).rows;

        // 3. Generate Members
        const TOTAL_TARGET = 1000;
        const membersToInsert = [];
        const savedIds = new Set(); // Track IDs to ensure fathers exist
        
        // --- Generational Logic ---
        // Gen 1: 10 Roots
        // Gen 2: Each root has ~3-5 children
        // Gen 3+: Each person has ~0-4 children
        
        let generation = [
            // Gen 1
        ];
        
        // Create 10 Roots
        for(let i=0; i<10; i++) {
            const loc = getRandomItem(allHomeDetails);
            const id = crypto.randomUUID();
            generation.push({
                id,
                full_name: `${generateRandomName()} (Root)`,
                level: 1,
                father_id: null,
                loc
            });
            savedIds.add(id);
        }

        let allGenerations = [...generation];
        let currentGen = generation;
        let genLevel = 2;
        let count = generation.length;

        while (count < TOTAL_TARGET && currentGen.length > 0) {
            const nextGen = [];
            
            for (const parent of currentGen) {
                if (count >= TOTAL_TARGET) break;

                // Determine number of children (weighted random)
                // 30% no kids (if level > 2), 70% have 1-5 kids
                const hasKids = Math.random() > 0.3;
                if (!hasKids) continue;

                const numKids = Math.floor(Math.random() * 5) + 1; // 1 to 5 kids

                for (let k = 0; k < numKids; k++) {
                     if (count >= TOTAL_TARGET) break;
                     
                     // Inheritance of location (80% chance same home, 20% moved)
                     let loc = parent.loc;
                     if (Math.random() > 0.8) {
                         loc = getRandomItem(allHomeDetails);
                     }

                     const id = crypto.randomUUID();
                     const child = {
                         id,
                         full_name: generateRandomName(),
                         level: genLevel,
                         father_id: parent.id,
                         loc
                     };
                     
                     nextGen.push(child);
                     savedIds.add(id);
                     count++;
                }
            }
            
            if (nextGen.length === 0) break; // Should not happen easily
            allGenerations = allGenerations.concat(nextGen);
            currentGen = nextGen;
            genLevel++;
        }

        console.log(`👨‍👩‍👧‍👦 Generated ${allGenerations.length} members across ${genLevel - 1} generations.`);

        // 4. Batch Insert
        // IMPORTANT: We must insert parents before children to satisfy FK constraints?
        // Actually, if we use deferred constraints or insert in order of generation, it works.
        // Since `allGenerations` is ordered (Gen 1, then Gen 2...), we can just iterate.
        // BUT, database constraint checks might be immediate.
        // `father_id REFERENCES members` -> Parent must exist.
        // Yes, Generation order is safe.

        const memberQuery = `
            INSERT INTO members (
                id, full_name, father_id, level, occupation, blood_group, 
                country_id, division_id, district_id, upazila_id, village_id, home_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `;

        console.log('Inserting members...');
        let i = 0;
        for (const m of allGenerations) {
            await client.query(memberQuery, [
                m.id,
                m.full_name,
                m.father_id,
                m.level,
                getRandomItem(occupations),
                ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-'][Math.floor(Math.random() * 6)],
                m.loc.country_id,
                m.loc.division_id,
                m.loc.district_id,
                m.loc.upazila_id,
                m.loc.village_id,
                m.loc.home_id
            ]);
            i++;
            if (i % 100 === 0) process.stdout.write(` ${i}`);
        }

        await client.query('COMMIT');
        console.log('\n✅ Successfully populated database with 1000+ demo data!');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Error during seeding:', e);
    } finally {
        client.release();
        await pool.end();
    }
};

seedLargeData();
