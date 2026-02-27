-- Migration 010: Update location foreign keys on `members` to ON DELETE CASCADE

BEGIN;

-- 1. Drop the existing foreign key constraints
ALTER TABLE members
  DROP CONSTRAINT IF EXISTS members_home_id_fkey,
  DROP CONSTRAINT IF EXISTS members_village_id_fkey,
  DROP CONSTRAINT IF EXISTS members_upazila_id_fkey,
  DROP CONSTRAINT IF EXISTS members_district_id_fkey,
  DROP CONSTRAINT IF EXISTS members_division_id_fkey,
  DROP CONSTRAINT IF EXISTS members_country_id_fkey;

-- 2. Add them back with ON DELETE CASCADE
ALTER TABLE members
  ADD CONSTRAINT members_home_id_fkey FOREIGN KEY (home_id) REFERENCES homes(id) ON DELETE CASCADE,
  ADD CONSTRAINT members_village_id_fkey FOREIGN KEY (village_id) REFERENCES villages(id) ON DELETE CASCADE,
  ADD CONSTRAINT members_upazila_id_fkey FOREIGN KEY (upazila_id) REFERENCES upazilas(id) ON DELETE CASCADE,
  ADD CONSTRAINT members_district_id_fkey FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE,
  ADD CONSTRAINT members_division_id_fkey FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE,
  ADD CONSTRAINT members_country_id_fkey FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE;

COMMIT;
