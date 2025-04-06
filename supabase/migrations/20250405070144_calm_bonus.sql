/*
  # Add test admin user

  1. Changes
    - Create a test admin user in the auth.users table
    - Add the user to the public.users table with admin role
    - Grant necessary permissions
*/

-- Create test admin user in auth.users
DO $$
DECLARE
  auth_user_id uuid;
BEGIN
  -- Insert into auth.users if not exists
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@firesafe.pro',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO auth_user_id;

  -- Insert into public.users if auth user was created
  IF auth_user_id IS NOT NULL THEN
    INSERT INTO public.users (id, email, role, full_name)
    VALUES (
      auth_user_id,
      'admin@firesafe.pro',
      'admin',
      'Admin FireSafe'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;