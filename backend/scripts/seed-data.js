const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { pool } = require('../config/db');

// --- DATA CONSTANTS ---
const FIRST_NAMES_MALE = [
    'Aditya', 'Arjun', 'Amit', 'Bijoy', 'Biplob', 'Chandan', 'Debashis', 'Dipak', 
    'Gopal', 'Hiron', 'Indra', 'Jitendra', 'Kamal', 'Likhon', 'Manik', 'Niron', 
    'Partha', 'Pradip', 'Rajib', 'Ratan', 'Sanjib', 'Shyam', 'Subrata', 'Tapas'
];
const FIRST_NAMES_FEMALE = [
    'Anjali', 'Archana', 'Bithi', 'Champa', 'Dipali', 'Gouri', 'Joya', 'Kajol', 
    'Lata', 'Mitali', 'Nipa', 'Purnima', 'Ratna', 'Soma', 'Shampa', 'Tumpa'
];
const LAST_NAMES = ['Barai', 'Mandal', 'Biswas', 'Gain', 'Halder', 'Roy'];

const OCCUPATIONS = ['Farmer', 'Teacher', 'Business', 'Service', 'Doctor', 'Engineer', 'Student', 'Housewife'];
const EDUCATIONS = ['SSC', 'HSC', 'BA', 'MA', 'B.Sc', 'M.Sc', 'Below SSC'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const LOCATIONS = [
    { country: 'Bangladesh', division: 'Dhaka', district: 'Madaripur', upazila: 'Kalkini', union_ward: 'Enayetnagar', village: 'Enayetnagar' },
    { country: 'Bangladesh', division: 'Dhaka', district: 'Gopalgong', upazila: 'Kotalipara', union_ward: 'Sadullapur', village: 'Ramshil' },
    { country: 'Bangladesh', division: 'Barishal', district: 'Barishal', upazila: 'Agailjhara', union_ward: 'Gaila', village: 'Gaila' },
    { country: 'Bangladesh', division: 'Barishal', district: 'Pirojpur', upazila: 'Nazirpur', union_ward: 'Matibhanga', village: 'Matibhanga' }
];

// --- HELPER FUNCTIONS ---
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generatePerson = (gender, lastName, generationIndex) => {
    const firstName = gender === 'Male' ? getRandom(FIRST_NAMES_MALE) : getRandom(FIRST_NAMES_FEMALE);
    const location = getRandom(LOCATIONS);
    
    // Age based on generation
    // Gen 0 (Root): Born 1900-1920
    // Gen 1: Born 1925-1945
    // Gen 2: Born 1950-1970
    // Gen 3: Born 1975-1995
    // Gen 4: Born 2000-2020
    const startYear = 1900 + (generationIndex * 25);
    const endYear = startYear + 20;
    const birthDate = getRandomDate(new Date(`${startYear}-01-01`), new Date(`${endYear}-12-31`));
    
    // Is Alive logic (Rough approximation)
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthDate.getFullYear();
    let isAlive = true;
    let deathDate = null;
    
    if (age > 90 || (generationIndex <= 1 && Math.random() > 0.1)) {
        isAlive = false;
        const deathYear = birthDate.getFullYear() + 50 + Math.floor(Math.random() * 40);
        deathDate = getRandomDate(new Date(`${deathYear}-01-01`), new Date(`${Math.min(deathYear, currentYear)}-12-31`));
    }

    return {
        full_name: `${firstName} ${lastName || getRandom(LAST_NAMES)}`,
        gender: gender,
        blood_group: getRandom(BLOOD_GROUPS),
        occupation: gender === 'Female' && Math.random() > 0.6 ? 'Housewife' : getRandom(OCCUPATIONS),
        education: getRandom(EDUCATIONS),
        birth_date: birthDate,
        death_date: deathDate,
        is_alive: isAlive,
        contact_number: isAlive ? `+8801${Math.floor(Math.random() * 900000000 + 100000000)}` : null,
        email: null, // demo
        present_address: `${location.village}, ${location.district}`,
        permanent_address: `${location.village}, ${location.district}`,
        ...location,
        home_name: `${firstName}'s House`
    };
};

// --- SEEDING LOGIC ---
async function seedData() {
    try {
        console.log('Starting seed process...');
        
        // Clear existing data
        console.log('Clearing existing data...');
        await pool.query('TRUNCATE members CASCADE'); 
        await pool.query('TRUNCATE users CASCADE'); 
        await pool.query('TRUNCATE events CASCADE'); 

        const insertQuery = `
            INSERT INTO members (
                full_name, gender, blood_group, occupation, education,
                birth_date, death_date, is_alive,
                contact_number, email, present_address, permanent_address,
                country, division, district, upazila, union_ward, village, home_name,
                father_id, mother_id, spouse_id, level
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
            RETURNING id
        `;

        const createMember = async (person) => {
            const values = [
                person.full_name, person.gender, person.blood_group, person.occupation, person.education,
                person.birth_date, person.death_date, person.is_alive,
                person.contact_number, person.email, person.present_address, person.permanent_address,
                person.country, person.division, person.district, person.upazila, person.union_ward, person.village, person.home_name,
                person.father_id || null, person.mother_id || null, person.spouse_id || null,
                person.level || 0 // Default level 0 if not provided
            ];
            const res = await pool.query(insertQuery, values);
            return res.rows[0].id;
        };

        const updateSpouse = async (id1, id2) => {
            await pool.query('UPDATE members SET spouse_id = $1 WHERE id = $2', [id2, id1]);
            await pool.query('UPDATE members SET spouse_id = $1 WHERE id = $2', [id1, id2]);
        };

        // Generational Queues
        let currentGeneration = [];
        let totalCount = 0;
        const TARGET_COUNT = 1000;

        // --- Generation 0 (Root Ancestors) ---
        // Create 20 root families (40 people)
        for (let i = 0; i < 20; i++) {
            const husband = generatePerson('Male', 'Barai', 0);
            husband.level = 0;
            const wife = generatePerson('Female', null, 0); 
            wife.level = 0;
            
            const hId = await createMember(husband);
            const wId = await createMember(wife);
            await updateSpouse(hId, wId);
            
            currentGeneration.push({ father: hId, mother: wId, lastName: 'Barai', level: 0 });
            totalCount += 2;
        }

        console.log(`Gen 0 created. Total: ${totalCount}`);

        let genIndex = 1;

        while (totalCount < TARGET_COUNT && currentGeneration.length > 0) {
            const nextGeneration = [];
            
            for (const parents of currentGeneration) {
                if (totalCount >= TARGET_COUNT) break;

                // Each couple has 2-5 children
                const numChildren = Math.floor(Math.random() * 4) + 2;

                for (let c = 0; c < numChildren; c++) {
                    if (totalCount >= TARGET_COUNT) break;

                    const isMale = Math.random() > 0.5;
                    const child = generatePerson(isMale ? 'Male' : 'Female', parents.lastName, genIndex);
                    child.father_id = parents.father;
                    child.mother_id = parents.mother;
                    child.level = parents.level + 1; // Increment level for child

                    const childId = await createMember(child);
                    totalCount++;

                    // Marriage Logic
                    if (genIndex < 3 || (genIndex === 3 && Math.random() > 0.3)) {
                        const spouse = generatePerson(isMale ? 'Female' : 'Male', null, genIndex); 
                        spouse.spouse_id = childId; 
                        spouse.level = child.level; // Spouse has same level
                        const spouseId = await createMember(spouse);
                        await updateSpouse(childId, spouseId);
                        totalCount++;

                        if (isMale) {
                            nextGeneration.push({ father: childId, mother: spouseId, lastName: parents.lastName, level: child.level });
                        } else {
                            nextGeneration.push({ father: spouseId, mother: childId, lastName: spouse.full_name.split(' ').pop(), level: child.level });
                        }
                    }
                }
            }
            
            currentGeneration = nextGeneration;
            console.log(`Gen ${genIndex} created. Total: ${totalCount}`);
            genIndex++;
        }

        console.log(`Successfully seeded ${totalCount} members.`);

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        await pool.end();
    }
}

seedData();
