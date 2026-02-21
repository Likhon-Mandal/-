-- Create Countries Table
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Create Divisions Table
CREATE TABLE IF NOT EXISTS divisions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE,
    UNIQUE(name, country_id)
);

-- Create Districts Table
CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    division_id INTEGER REFERENCES divisions(id) ON DELETE CASCADE,
    UNIQUE(name, division_id)
);

-- Create Upazilas Table
CREATE TABLE IF NOT EXISTS upazilas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    UNIQUE(name, district_id)
);

-- Create Unions/Wards Table
CREATE TABLE IF NOT EXISTS unions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    upazila_id INTEGER REFERENCES upazilas(id) ON DELETE CASCADE,
    UNIQUE(name, upazila_id)
);

-- Create Villages Table
CREATE TABLE IF NOT EXISTS villages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    union_id INTEGER REFERENCES unions(id) ON DELETE CASCADE,
    UNIQUE(name, union_id)
);

-- Create Homes Table
CREATE TABLE IF NOT EXISTS homes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    village_id INTEGER REFERENCES villages(id) ON DELETE CASCADE,
    UNIQUE(name, village_id)
);

-- Add home_id to members table
ALTER TABLE members ADD COLUMN IF NOT EXISTS home_id INTEGER REFERENCES homes(id) ON DELETE SET NULL;
