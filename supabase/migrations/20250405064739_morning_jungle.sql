/*
  # Add RLS policies for establishments table

  1. Security Changes
    - Enable RLS on establishments table if not already enabled
    - Add policies for:
      - Authenticated users with 'admin' role can do everything
      - Authenticated users can read establishments they have access to via user_establishment_access
      - Authenticated consultants can read all establishments
*/

-- Enable RLS
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;

-- Policy for admins (full access)
CREATE POLICY "Admins can do everything on establishments"
ON establishments
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role')::user_role = 'admin'
)
WITH CHECK (
  (auth.jwt() ->> 'role')::user_role = 'admin'
);

-- Policy for consultants (read access to all)
CREATE POLICY "Consultants can read all establishments"
ON establishments
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'role')::user_role = 'consultant'
);

-- Policy for users with explicit access
CREATE POLICY "Users can read establishments they have access to"
ON establishments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_establishment_access
    WHERE user_establishment_access.establishment_id = establishments.id
    AND user_establishment_access.user_id = auth.uid()
  )
);