/*
  # Create commission tables

  1. New Tables
    - `commissions` - Stores safety commission information
    - `commission_prescriptions` - Stores prescriptions from safety commissions
    - `accessibility_commissions` - Stores accessibility commission information
    - `accessibility_commission_prescriptions` - Stores prescriptions from accessibility commissions
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Safety Commissions
CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid REFERENCES establishments(id) NOT NULL,
  date date NOT NULL,
  commission_type text NOT NULL CHECK (commission_type IN ('communale', 'arrondissement', 'departementale')),
  purpose text NOT NULL CHECK (purpose IN (
    'etude_autorisation_travaux', 
    'etude_permis_construire', 
    'demande_avis', 
    'levee_prescription', 
    'etude_derogation', 
    'visite_periodique', 
    'visite_inopinee', 
    'reception_travaux', 
    'visite_ouverture', 
    'visite_chantier'
  )),
  opinion text NOT NULL CHECK (opinion IN ('favorable', 'defavorable')),
  report_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Safety Commission Prescriptions
CREATE TABLE IF NOT EXISTS commission_prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id uuid REFERENCES commissions(id) NOT NULL,
  number integer NOT NULL,
  description text NOT NULL,
  reference text NOT NULL,
  status text NOT NULL DEFAULT 'to_correct' CHECK (status IN ('corrected', 'to_correct', 'not_applicable')),
  comment text,
  attachment_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Accessibility Commissions
CREATE TABLE IF NOT EXISTS accessibility_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id uuid REFERENCES establishments(id) NOT NULL,
  date date NOT NULL,
  commission_type text NOT NULL CHECK (commission_type IN ('communale', 'arrondissement', 'departementale')),
  purpose text NOT NULL CHECK (purpose IN (
    'etude_autorisation_travaux', 
    'etude_permis_construire', 
    'demande_avis', 
    'levee_prescription', 
    'etude_derogation', 
    'visite_periodique', 
    'visite_inopinee', 
    'reception_travaux', 
    'visite_ouverture', 
    'visite_chantier'
  )),
  opinion text NOT NULL CHECK (opinion IN ('favorable', 'defavorable')),
  report_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Accessibility Commission Prescriptions
CREATE TABLE IF NOT EXISTS accessibility_commission_prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id uuid REFERENCES accessibility_commissions(id) NOT NULL,
  number integer NOT NULL,
  description text NOT NULL,
  reference text NOT NULL,
  status text NOT NULL DEFAULT 'to_correct' CHECK (status IN ('corrected', 'to_correct', 'not_applicable')),
  comment text,
  attachment_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessibility_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessibility_commission_prescriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
  ON commissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON commission_prescriptions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON accessibility_commissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read access for authenticated users"
  ON accessibility_commission_prescriptions
  FOR SELECT
  TO authenticated
  USING (true);

-- Admin can do everything
CREATE POLICY "Admins can do everything"
  ON commissions
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admins can do everything"
  ON commission_prescriptions
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admins can do everything"
  ON accessibility_commissions
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admins can do everything"
  ON accessibility_commission_prescriptions
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Consultants can update prescriptions
CREATE POLICY "Consultants can update prescriptions"
  ON commission_prescriptions
  FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'consultant'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'consultant'));

CREATE POLICY "Consultants can update prescriptions"
  ON accessibility_commission_prescriptions
  FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'consultant'))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'consultant'));