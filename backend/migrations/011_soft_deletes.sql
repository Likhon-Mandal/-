-- Migration 011: Add Soft Deletes (deleted_at) to geographic locations and members, along with cascading triggers.

BEGIN;

-- 1. Add `deleted_at` column to all tables
ALTER TABLE countries ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE divisions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE districts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE upazilas ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE villages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE homes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE members ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- 2. Create the Cascade Trigger Function
CREATE OR REPLACE FUNCTION cascade_soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle Soft Delete (deleted_at goes from NULL to a timestamp)
    IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        IF TG_TABLE_NAME = 'countries' THEN
            UPDATE divisions SET deleted_at = NEW.deleted_at WHERE country_id = NEW.id AND deleted_at IS NULL;
        ELSIF TG_TABLE_NAME = 'divisions' THEN
            UPDATE districts SET deleted_at = NEW.deleted_at WHERE division_id = NEW.id AND deleted_at IS NULL;
        ELSIF TG_TABLE_NAME = 'districts' THEN
            UPDATE upazilas SET deleted_at = NEW.deleted_at WHERE district_id = NEW.id AND deleted_at IS NULL;
        ELSIF TG_TABLE_NAME = 'upazilas' THEN
            UPDATE villages SET deleted_at = NEW.deleted_at WHERE upazila_id = NEW.id AND deleted_at IS NULL;
        ELSIF TG_TABLE_NAME = 'villages' THEN
            UPDATE homes SET deleted_at = NEW.deleted_at WHERE village_id = NEW.id AND deleted_at IS NULL;
        ELSIF TG_TABLE_NAME = 'homes' THEN
            UPDATE members SET deleted_at = NEW.deleted_at WHERE home_id = NEW.id AND deleted_at IS NULL;
        END IF;
    
    -- Handle Restore (deleted_at goes from a timestamp to NULL)
    ELSIF NEW.deleted_at IS NULL AND OLD.deleted_at IS NOT NULL THEN
        IF TG_TABLE_NAME = 'countries' THEN
            UPDATE divisions SET deleted_at = NULL WHERE country_id = NEW.id AND deleted_at = OLD.deleted_at;
        ELSIF TG_TABLE_NAME = 'divisions' THEN
            UPDATE districts SET deleted_at = NULL WHERE division_id = NEW.id AND deleted_at = OLD.deleted_at;
        ELSIF TG_TABLE_NAME = 'districts' THEN
            UPDATE upazilas SET deleted_at = NULL WHERE district_id = NEW.id AND deleted_at = OLD.deleted_at;
        ELSIF TG_TABLE_NAME = 'upazilas' THEN
            UPDATE villages SET deleted_at = NULL WHERE upazila_id = NEW.id AND deleted_at = OLD.deleted_at;
        ELSIF TG_TABLE_NAME = 'villages' THEN
            UPDATE homes SET deleted_at = NULL WHERE village_id = NEW.id AND deleted_at = OLD.deleted_at;
        ELSIF TG_TABLE_NAME = 'homes' THEN
            UPDATE members SET deleted_at = NULL WHERE home_id = NEW.id AND deleted_at = OLD.deleted_at;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Drop existing triggers if they exist to prevent duplicates
DROP TRIGGER IF EXISTS trg_cascade_soft_delete ON countries;
DROP TRIGGER IF EXISTS trg_cascade_soft_delete ON divisions;
DROP TRIGGER IF EXISTS trg_cascade_soft_delete ON districts;
DROP TRIGGER IF EXISTS trg_cascade_soft_delete ON upazilas;
DROP TRIGGER IF EXISTS trg_cascade_soft_delete ON villages;
DROP TRIGGER IF EXISTS trg_cascade_soft_delete ON homes;

-- 4. Attach Trigger to Tables
CREATE TRIGGER trg_cascade_soft_delete
AFTER UPDATE OF deleted_at ON countries
FOR EACH ROW EXECUTE FUNCTION cascade_soft_delete();

CREATE TRIGGER trg_cascade_soft_delete
AFTER UPDATE OF deleted_at ON divisions
FOR EACH ROW EXECUTE FUNCTION cascade_soft_delete();

CREATE TRIGGER trg_cascade_soft_delete
AFTER UPDATE OF deleted_at ON districts
FOR EACH ROW EXECUTE FUNCTION cascade_soft_delete();

CREATE TRIGGER trg_cascade_soft_delete
AFTER UPDATE OF deleted_at ON upazilas
FOR EACH ROW EXECUTE FUNCTION cascade_soft_delete();

CREATE TRIGGER trg_cascade_soft_delete
AFTER UPDATE OF deleted_at ON villages
FOR EACH ROW EXECUTE FUNCTION cascade_soft_delete();

CREATE TRIGGER trg_cascade_soft_delete
AFTER UPDATE OF deleted_at ON homes
FOR EACH ROW EXECUTE FUNCTION cascade_soft_delete();

COMMIT;
