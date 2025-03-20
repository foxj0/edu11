/*
  # Create tables for educational platform

  1. New Tables
    - `grades` - Fixed 12 grades with enable/disable functionality
    - `semesters` - Multiple semesters per grade
    - `subjects` - Subjects within semesters
    - `lessons` - Lessons within subjects
    - `questions` - Test questions for lessons

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Create grades table (fixed 12 grades)
CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create semesters table
CREATE TABLE IF NOT EXISTS semesters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id INTEGER REFERENCES grades(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semester_id UUID REFERENCES semesters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  enabled BOOLEAN DEFAULT true,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Allow full access for admins on grades"
  ON grades
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow full access for admins on semesters"
  ON semesters
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow full access for admins on subjects"
  ON subjects
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow full access for admins on lessons"
  ON lessons
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow full access for admins on questions"
  ON questions
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create read-only policies for users
CREATE POLICY "Allow read for users on enabled grades"
  ON grades
  FOR SELECT
  TO authenticated
  USING (enabled = true);

CREATE POLICY "Allow read for users on enabled semesters"
  ON semesters
  FOR SELECT
  TO authenticated
  USING (enabled = true);

CREATE POLICY "Allow read for users on enabled subjects"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (enabled = true);

CREATE POLICY "Allow read for users on enabled lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (enabled = true);

CREATE POLICY "Allow read for users on enabled questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (enabled = true);

-- Insert the 12 grades
DO $$
BEGIN
  FOR i IN 1..12 LOOP
    INSERT INTO grades (id, name) VALUES (i, 'Grade ' || i);
  END LOOP;
END $$;
