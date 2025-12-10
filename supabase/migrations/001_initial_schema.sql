-- Orbit Database Schema
-- Version: 1.0
-- Description: Core tables for personal work operating system

-- =============================================
-- Table: emails
-- Purpose: Store email metadata from multiple inboxes
-- =============================================
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(50) NOT NULL, -- 'gmail' or 'outlook'
  sender_email VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255),
  subject TEXT NOT NULL,
  body_snippet TEXT,
  body_full TEXT,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_emails_source ON emails(source);
CREATE INDEX IF NOT EXISTS idx_emails_is_processed ON emails(is_processed);
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at DESC);

-- =============================================
-- Table: rules
-- Purpose: Store filtering criteria synced from Apple Reminders
-- =============================================
CREATE TABLE IF NOT EXISTS rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name VARCHAR(255) NOT NULL,
  criteria_logic TEXT NOT NULL,
  source_id VARCHAR(255) UNIQUE, -- Apple Reminders ID
  priority_override INTEGER CHECK (priority_override BETWEEN 0 AND 100),
  tag VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for active rules
CREATE INDEX IF NOT EXISTS idx_rules_is_active ON rules(is_active);

-- =============================================
-- Table: tasks
-- Purpose: Store processed tasks with AI estimations
-- =============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
  task_title VARCHAR(500) NOT NULL,
  task_description TEXT,
  time_estimate INTEGER NOT NULL, -- in minutes
  priority_score INTEGER NOT NULL CHECK (priority_score BETWEEN 0 AND 100),
  deadline_date TIMESTAMP WITH TIME ZONE,
  lead_time_buffer_days INTEGER DEFAULT 0,
  ai_reasoning TEXT, -- Why the AI made this classification
  tags VARCHAR(100)[],
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'scheduled', 'in_progress', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for scheduling queries
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority_score DESC);

-- =============================================
-- Table: schedule_blocks
-- Purpose: Store scheduled time slots for tasks
-- =============================================
CREATE TABLE IF NOT EXISTS schedule_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  is_split_session BOOLEAN DEFAULT FALSE,
  session_index INTEGER, -- For tasks split across multiple sessions
  calendar_synced BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prevent overlapping blocks
CREATE INDEX IF NOT EXISTS idx_schedule_blocks_time_range ON schedule_blocks(start_time, end_time);

-- =============================================
-- Table: availability_blocks
-- Purpose: Define user's available working hours
-- =============================================
CREATE TABLE IF NOT EXISTS availability_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  capacity_minutes INTEGER NOT NULL,
  used_minutes INTEGER DEFAULT 0,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50), -- 'weekdays', 'monday', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for date-based queries
CREATE INDEX IF NOT EXISTS idx_availability_date ON availability_blocks(block_date);

-- =============================================
-- Table: sync_logs
-- Purpose: Track Apple Reminders sync history
-- =============================================
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  rules_synced INTEGER DEFAULT 0,
  status VARCHAR(50), -- 'success', 'partial', 'error'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- Trigger: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_blocks_updated_at BEFORE UPDATE ON schedule_blocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_blocks_updated_at BEFORE UPDATE ON availability_blocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
