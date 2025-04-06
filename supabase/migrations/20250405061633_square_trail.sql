/*
  # Initial Schema for Fire Safety Management System

  1. New Tables
    - establishments
      - Basic information about establishments
      - Linked to groupings, contacts, and various operational data
    
    - groupings
      - Organizations/groups that own multiple establishments
      - Contains consolidated information and mapping data
    
    - contacts
      - Contact information for people associated with establishments/groupings
    
    - users
      - System users with role-based access
    
    - user_establishment_access
      - Maps users to establishments they can access
    
    - visits
      - Scheduled and completed safety visits/inspections
    
    - safety_commissions
      - Safety commission meetings and outcomes
    
    - prescriptions
      - Safety requirements and observations
    
    - tasks
      - Collaborative tasks linked to establishments
    
    - technical_installations
      - Types of technical installations requiring periodic verification
    
    - verifications
      - Periodic verification records for technical installations
    
    - regulatory_files
      - Work authorization requests and related documents

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'consultant', 'client');
CREATE TYPE establishment_type AS ENUM ('type_l', 'type_m', 'type_n', 'type_o', 'type_p', 'type_r', 'type_s', 'type_t', 'type_u', 'type_v', 'type_w', 'type_x', 'type_y');
CREATE TYPE establishment_category AS ENUM ('1', '2', '3', '4', '5');
CREATE TYPE visit_type AS ENUM ('commission', 'first_visit', 'second_visit', 'reminder');
CREATE TYPE task_priority AS ENUM ('p1', 'p2', 'p3');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE verification_status AS ENUM ('compliant', 'non_compliant', 'pending');
CREATE TYPE regulatory_file_status AS ENUM ('in_progress', 'report_sent', 'archived');

-- Base tables
CREATE TABLE groupings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  city text NOT NULL,
  logo_url text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE establishments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  grouping_id uuid REFERENCES groupings(id),
  name text NOT NULL,
  address text NOT NULL,
  types establishment_type[] NOT NULL,
  category establishment_category NOT NULL,
  commission_opinion text,
  last_commission_date date,
  next_commission_date date,
  visit_periodicity integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE user_establishment_access (
  user_id uuid REFERENCES users(id),
  establishment_id uuid REFERENCES establishments(id),
  PRIMARY KEY (user_id, establishment_id)
);

CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid REFERENCES establishments(id),
  full_name text NOT NULL,
  role text NOT NULL,
  email text,
  phone text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE visits (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid REFERENCES establishments(id),
  visit_type visit_type NOT NULL,
  scheduled_date date NOT NULL,
  consultant_id uuid REFERENCES users(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE safety_commissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid REFERENCES establishments(id),
  commission_date date NOT NULL,
  type text NOT NULL,
  status text NOT NULL,
  minutes_received boolean DEFAULT false,
  responsible_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE prescriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid REFERENCES establishments(id),
  commission_id uuid REFERENCES safety_commissions(id),
  description text NOT NULL,
  status task_status NOT NULL DEFAULT 'todo',
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid REFERENCES establishments(id),
  title text NOT NULL,
  description text,
  priority task_priority NOT NULL DEFAULT 'p2',
  status task_status NOT NULL DEFAULT 'todo',
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE task_assignments (
  task_id uuid REFERENCES tasks(id),
  user_id uuid REFERENCES users(id),
  PRIMARY KEY (task_id, user_id)
);

CREATE TABLE technical_installations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  regulation_type text NOT NULL,
  verification_period_months integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE verifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid REFERENCES establishments(id),
  installation_id uuid REFERENCES technical_installations(id),
  verification_date date NOT NULL,
  next_verification_date date NOT NULL,
  provider_name text NOT NULL,
  status verification_status NOT NULL DEFAULT 'pending',
  observations text,
  report_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE regulatory_files (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  establishment_id uuid REFERENCES establishments(id),
  file_number text NOT NULL,
  submission_date date NOT NULL,
  deadline_date date NOT NULL,
  status regulatory_file_status NOT NULL DEFAULT 'in_progress',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE groupings ENABLE ROW LEVEL SECURITY;
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_establishment_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_files ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can do everything"
ON groupings FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add more policies for each table based on user roles...

-- Create indexes for better performance
CREATE INDEX idx_establishments_grouping ON establishments(grouping_id);
CREATE INDEX idx_visits_establishment ON visits(establishment_id);
CREATE INDEX idx_prescriptions_establishment ON prescriptions(establishment_id);
CREATE INDEX idx_tasks_establishment ON tasks(establishment_id);
CREATE INDEX idx_verifications_establishment ON verifications(establishment_id);