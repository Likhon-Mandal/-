-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (Authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    member_id UUID, -- Link to member profile if exists
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Members Table (Core Genealogical Data)
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(20),
    blood_group VARCHAR(5),
    occupation VARCHAR(100),
    education VARCHAR(255),
    
    -- Dates
    birth_date DATE,
    death_date DATE,
    is_alive BOOLEAN DEFAULT TRUE,
    
    -- Contact & Address
    contact_number VARCHAR(20),
    email VARCHAR(255),
    present_address TEXT,
    permanent_address TEXT,
    
    -- Geography (Hierarchy for Explorer)
    country VARCHAR(100) DEFAULT 'Bangladesh',
    division VARCHAR(100),
    district VARCHAR(100),
    upazila VARCHAR(100),
    union_ward VARCHAR(100),
    village VARCHAR(100),
    home_name VARCHAR(255),
    
    -- Lineage (Self-Referencing Relationships)
    father_id UUID REFERENCES members(id) ON DELETE SET NULL,
    mother_id UUID REFERENCES members(id) ON DELETE SET NULL,
    spouse_id UUID REFERENCES members(id) ON DELETE SET NULL,
    
    level INTEGER DEFAULT 0, -- Generational Level (0 = Root, 1 = Children, etc.)

    -- Assets
    profile_image_url TEXT,
    bio TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for frequent searches
CREATE INDEX idx_members_name ON members(full_name);
CREATE INDEX idx_members_district ON members(district);
CREATE INDEX idx_members_home ON members(home_name);
CREATE INDEX idx_members_father ON members(father_id);

-- Events Table (Notices, Gatherings, Help)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE,
    type VARCHAR(50) CHECK (type IN ('event', 'notice', 'help_request')),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'resolved')),
    
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
