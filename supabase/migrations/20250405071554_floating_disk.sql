/*
  # Fix RLS policies for establishments table

  1. Security Changes
    - Drop existing policies
    - Create new policies with correct role checking using public.users table
*/

-- Drop existing policies
DROP POLICY IF EXISTS "admins_all_access" ON establishments;
DROP POLICY IF EXISTS "consultants_read_access" ON establishments;
DROP POLICY IF EXISTS "users_establishment_access" ON establishments;

-- Create new policies with correct role checking
CREATE POLICY "Enable all access for admin users"
ON establishments FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "Enable read access for consultants"
ON establishments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'consultant'
  )
);

CREATE POLICY "Enable read access for users with explicit access"
ON establishments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_establishment_access
    WHERE user_establishment_access.establishment_id = establishments.id
    AND user_establishment_access.user_id = auth.uid()
  )
);