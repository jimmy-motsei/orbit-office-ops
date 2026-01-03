-- Orbit Database Schema - Migration 002
-- Version: 1.1
-- Description: Add projects and support for manual task creation

-- =============================================
-- Table: projects
-- Purpose: Group related tasks into projects/stacks
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#06b6d4', -- Tailwind cyan-500
  icon VARCHAR(50) DEFAULT 'folder', -- Lucide icon name
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add default projects
INSERT INTO projects (name, description, color, icon, sort_order) VALUES
  ('Inbox', 'Uncategorized tasks', '#64748b', 'inbox', 0),
  ('Work', 'Professional tasks', '#3b82f6', 'briefcase', 1),
  ('Personal', 'Personal tasks and errands', '#22c55e', 'home', 2)
ON CONFLICT DO NOTHING;

-- =============================================
-- Alter tasks table: Add project reference and manual task support
-- =============================================

-- Add project_id column (nullable for backwards compatibility)
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- Add source column to distinguish AI-generated vs manual tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'ai';

-- Add completed_at timestamp for tracking when task was completed
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Add notes field for additional context
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS notes TEXT;

-- Make email_id nullable to support manual tasks
ALTER TABLE tasks ALTER COLUMN email_id DROP NOT NULL;

-- Index for project-based queries
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_source ON tasks(source);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed_at);

-- Trigger for projects updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
