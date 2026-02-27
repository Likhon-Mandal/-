CREATE TABLE IF NOT EXISTS eminent_figures (
    id SERIAL PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL CHECK (category IN ('কৃতি শিক্ষার্থী', 'মরণোত্তর জ্ঞাতি', 'আজীবন জ্ঞাতি')),
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, category)
);
