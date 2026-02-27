-- Migration 013: Create admin_users table for SuperAdmin/Admin role system
BEGIN;

-- Create role enum type
DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM ('superadmin', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role         admin_role NOT NULL DEFAULT 'admin',
  reset_token  VARCHAR(255),
  reset_token_expires TIMESTAMP WITH TIME ZONE,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON admin_users;
CREATE TRIGGER trg_admin_users_updated_at
BEFORE UPDATE ON admin_users
FOR EACH ROW EXECUTE FUNCTION update_admin_users_updated_at();

COMMIT;
