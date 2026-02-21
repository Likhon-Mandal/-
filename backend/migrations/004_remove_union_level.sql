-- Add upazila_id to villages
ALTER TABLE villages ADD COLUMN IF NOT EXISTS upazila_id INTEGER REFERENCES upazilas(id) ON DELETE CASCADE;

-- Update villages to link to upazilas (Data migration logic if needed, but for now we might lose relation if we don't have complex join logic. 
-- Since we are in dev/prototype phase and just created these tables, we might accept data loss or manual fix.
-- However, for correctness, we *could* try to update based on existing unions, but unions are going away.
-- Let's assume we just reset village parents or if we had data we'd do:
-- UPDATE villages v SET upazila_id = u.upazila_id FROM unions u WHERE v.union_id = u.id;
-- But standard practice: Add column -> Migrate Data -> Add Constraint -> Drop Old Column)

-- Try to migrate data if exists
UPDATE villages v 
SET upazila_id = (SELECT upazila_id FROM unions u WHERE u.id = v.union_id)
WHERE v.union_id IS NOT NULL;

-- Remove union_id from villages
ALTER TABLE villages DROP COLUMN IF EXISTS union_id;

-- Remove union_id from members
ALTER TABLE members DROP COLUMN IF EXISTS union_id;

-- Drop unions table
DROP TABLE IF EXISTS unions;
