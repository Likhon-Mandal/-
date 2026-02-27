CREATE OR REPLACE FUNCTION cascade_generation_update()
RETURNS TRIGGER AS $$
BEGIN
    -- If the level changed
    IF NEW.level IS DISTINCT FROM OLD.level THEN
        -- Update all immediate children to be NEW.level + 1
        -- Since this is an UPDATE on members, it will trigger itself for the children, 
        -- causing a cascading effect down the entire tree automatically!
        UPDATE members
        SET level = NEW.level + 1
        WHERE father_id = NEW.id OR mother_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cascade_generation ON members;
CREATE TRIGGER trigger_cascade_generation
AFTER UPDATE OF level ON members
FOR EACH ROW
EXECUTE FUNCTION cascade_generation_update();
