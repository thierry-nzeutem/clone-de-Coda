/*
  # Fix establishments RLS policies

  1. Changes
    - Remove existing RLS policies on establishments table
    - Add new policies with correct role checking logic
    
  2. Security
    - Enable RLS on establishments table
    - Add policies for:
      - Admins: full access
      - Consultants: read-only access
      - Authenticated users: access only to establishments they have access to
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can do everything on establishments" ON establishments;
DROP POLICY IF EXISTS "Consultants can read all establishments" ON establishments;
DROP POLICY IF EXISTS "Users can read establishments they have access to" ON establishments;

-- Create new policies with correct role checking
CREATE POLICY "admins_all_access" ON establishments
FOR ALL 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() 
  AND users.role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() 
  AND users.role = 'admin'
));

CREATE POLICY "consultants_read_access" ON establishments
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() 
  AND users.role = 'consultant'
));

CREATE POLICY "users_establishment_access" ON establishments
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM user_establishment_access
  WHERE user_establishment_access.establishment_id = establishments.id
  AND user_establishment_access.user_id = auth.uid()
));