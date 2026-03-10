-- Before/After Cases table for admin management
CREATE TABLE IF NOT EXISTS before_after_cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  treatment_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  patient_age TEXT,
  patient_gender TEXT,
  tag TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  before_image TEXT,
  after_image TEXT,
  is_published INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ba_treatment ON before_after_cases(treatment_slug);
CREATE INDEX IF NOT EXISTS idx_ba_published ON before_after_cases(is_published);
CREATE INDEX IF NOT EXISTS idx_ba_sort ON before_after_cases(sort_order DESC, created_at DESC);
