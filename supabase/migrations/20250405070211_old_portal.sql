/*
  # Add test admin user

  1. Changes
    - Create a test admin user in auth.users table
    - Add the user to public.users table with admin role
    - Use proper error handling and conflict resolution
*/

DO $$
DECLARE
  auth_user_id uuid := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- Insert into auth.users with a predefined UUID
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
    auth_user_id,
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
  ON CONFLICT (id) DO NOTHING;

  -- Insert into public.users
  INSERT INTO public.users (id, email, role, full_name)
  VALUES (
    auth_user_id,
    'admin@firesafe.pro',
    'admin',
    'Admin FireSafe'
  )
  ON CONFLICT (id) DO NOTHING;
END $$;