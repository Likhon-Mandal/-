const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const generateRandomName = () => {
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Emma', 'Robert', 'Olivia', 'William', 'Ava', 'Joseph', 'Isabella', 'Thomas', 'Sophia', 'Charles', 'Mia', 'Daniel', 'Charlotte'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

const seedData = async () => {
    try {
        console.log('🌱 Starting seed process...');
        
        // 1. Clear existing data
        await pool.query('TRUNCATE TABLE members RESTART IDENTITY CASCADE');
        console.log('✅ Cleared existing members table.');

        const totalNodes = 1000;
        const rootCount = 5; // User wanted multiple roots
        const members = [];
        const levels = 6; // How deep the tree goes

        // Geographic constants
        const geoInfo = {
            division: 'Simulation Div',
            district: 'Simulation Dist',
            upazila: 'Simulation Upa',
            union_ward: 'Simulation Union',
            village: 'Simulation Village',
            home_name: 'Global Tree'
        };

        const allMemberIds = [];

        // 2. Generate Roots (Gen 1)
        let currentGenIds = [];
        for (let i = 0; i < rootCount; i++) {
            const id = crypto.randomUUID();
            members.push({
                id: id,
                full_name: `${generateRandomName()} (Root ${i+1})`,
                father_id: null,
                mother_id: null,
                occupation: 'Patriarch',
                blood_group: ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)],
                level: 1,
                ...geoInfo
            });
            currentGenIds.push(id);
            allMemberIds.push(id);
        }

        // 3. Generate Descendants (Gen 2 to Gen 6)
        let previousGenIds = [...currentGenIds];

        // Calculate roughly how many children per parent to reach 1000
        // But simply iterating generations is safer
        
        let nodesCreated = rootCount;

        for (let gen = 2; gen <= levels; gen++) {
            const nodesInThisGen = Math.floor((totalNodes - rootCount) / (levels - 1)); 
            currentGenIds = [];
            
            for (let i = 0; i < nodesInThisGen; i++) {
                if (nodesCreated >= totalNodes) break;

                // Pick a random father from the PREVIOUS generation
                const fatherId = previousGenIds[Math.floor(Math.random() * previousGenIds.length)];
                const id = crypto.randomUUID();

                members.push({
                    id: id,
                    full_name: generateRandomName(),
                    father_id: fatherId,
                    mother_id: null,
                    occupation: ['Engineer', 'Doctor', 'Teacher', 'Farmer', 'Artist', 'Soldier'][Math.floor(Math.random() * 6)],
                    blood_group: ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)],
                    level: gen,
                    ...geoInfo
                });

                currentGenIds.push(id);
                allMemberIds.push(id);
                nodesCreated++;
            }

            if (currentGenIds.length > 0) {
                 previousGenIds = currentGenIds;
            } else {
                // If previous gen had no kids (unlikely with this logic), use the one before or stop
                break;
            }
        }

        console.log(`Prepared ${members.length} members for insertion...`);

        // 4. Batch Insert (Sequential to strict hierarchy)
        const query = `
            INSERT INTO members (id, full_name, father_id, mother_id, occupation, blood_group, division, district, upazila, union_ward, village, home_name)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `;

        // We must ensure parents are inserted before children.
        // Since 'members' is ordered by generation (Gen 1 is at index 0..4, Gen 2 follows, etc.),
        // sequential insertion guarantees parents exist.
        
        console.log('Inserting members sequentially to maintain hierarchy...');
        
        for (const member of members) {
            const params = [
                member.id, 
                member.full_name, 
                member.father_id, 
                member.mother_id, 
                member.occupation, 
                member.blood_group,
                member.division,
                member.district,
                member.upazila,
                member.union_ward,
                member.village,
                member.home_name
            ];
            await pool.query(query, params);
            if (members.indexOf(member) % 100 === 0) process.stdout.write('.');
        }

        console.log('\n✅ Seed completed successfully!');
        process.exit(0);

    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
