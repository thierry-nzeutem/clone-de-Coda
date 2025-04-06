/*
  # Add test data

  1. Test Data
    - Add sample groupings
    - Add sample establishments with various types and categories
    - Add sample users (admin, consultant, client)
    - Add sample contacts
    - Add sample visits
    - Add sample tasks
    - Add sample technical installations and verifications
    - Add sample safety commissions
    - Add sample prescriptions
    - Add sample regulatory files

  2. Security
    - All tables already have RLS enabled
    - Test data respects existing policies
*/

-- Sample groupings
INSERT INTO groupings (id, name, city, logo_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Groupe Hospitalier Paris', 'Paris', 'https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80&w=200'),
  ('22222222-2222-2222-2222-222222222222', 'Réseau Éducatif IDF', 'Paris', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=200');

-- Sample establishments
INSERT INTO establishments (id, grouping_id, name, address, types, category, visit_periodicity) VALUES
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Hôpital Saint-Antoine', '184 Rue du Faubourg Saint-Antoine, 75012 Paris', ARRAY['type_u']::establishment_type[], '1'::establishment_category, 12),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Hôpital Tenon', '4 Rue de la Chine, 75020 Paris', ARRAY['type_u']::establishment_type[], '2'::establishment_category, 12),
  ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Lycée Henri IV', '23 Rue Clovis, 75005 Paris', ARRAY['type_r']::establishment_type[], '2'::establishment_category, 24),
  ('66666666-6666-6666-6666-666666666666', '22222222-2222-2222-2222-222222222222', 'Lycée Louis-le-Grand', '123 Rue Saint-Jacques, 75005 Paris', ARRAY['type_r']::establishment_type[], '3'::establishment_category, 24);

-- Sample users
INSERT INTO users (id, email, role, full_name) VALUES
  ('77777777-7777-7777-7777-777777777777', 'admin@example.com', 'admin'::user_role, 'Jean Dupont'),
  ('88888888-8888-8888-8888-888888888888', 'consultant@example.com', 'consultant'::user_role, 'Marie Martin'),
  ('99999999-9999-9999-9999-999999999999', 'client@example.com', 'client'::user_role, 'Pierre Bernard');

-- Sample user_establishment_access
INSERT INTO user_establishment_access (user_id, establishment_id) VALUES
  ('99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333'),
  ('99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444');

-- Sample contacts
INSERT INTO contacts (id, establishment_id, full_name, role, email, phone) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Sophie Lambert', 'Responsable Sécurité', 'sophie.lambert@example.com', '+33123456789'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'Lucas Martin', 'Directeur Technique', 'lucas.martin@example.com', '+33123456790');

-- Sample visits
INSERT INTO visits (id, establishment_id, visit_type, scheduled_date, consultant_id, notes) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'first_visit'::visit_type, '2024-06-15', '88888888-8888-8888-8888-888888888888', 'Visite initiale programmée'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444', 'commission'::visit_type, '2024-07-20', '88888888-8888-8888-8888-888888888888', 'Commission de sécurité annuelle');

-- Sample technical installations
INSERT INTO technical_installations (id, name, regulation_type, verification_period_months) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Système de Désenfumage', 'ERP', 12),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Installation Électrique', 'ERP', 12);

-- Sample verifications
INSERT INTO verifications (id, establishment_id, installation_id, verification_date, next_verification_date, provider_name, status) VALUES
  ('12345678-1234-5678-1234-567812345678', '33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '2024-01-15', '2025-01-15', 'VERITAS', 'compliant'::verification_status),
  ('87654321-8765-4321-8765-432187654321', '44444444-4444-4444-4444-444444444444', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '2024-02-20', '2025-02-20', 'APAVE', 'pending'::verification_status);

-- Sample safety commissions
INSERT INTO safety_commissions (id, establishment_id, commission_date, type, status, minutes_received, responsible_id) VALUES
  ('a1b2c3d4-a1b2-c3d4-a1b2-c3d4a1b2c3d4', '33333333-3333-3333-3333-333333333333', '2024-03-15', 'Périodique', 'Favorable', true, '77777777-7777-7777-7777-777777777777'),
  ('d4c3b2a1-d4c3-b2a1-d4c3-b2a1d4c3b2a1', '44444444-4444-4444-4444-444444444444', '2024-04-20', 'Périodique', 'En attente', false, '77777777-7777-7777-7777-777777777777');

-- Sample prescriptions
INSERT INTO prescriptions (id, establishment_id, commission_id, description, status, due_date) VALUES
  ('abcd1234-abcd-1234-abcd-1234abcd1234', '33333333-3333-3333-3333-333333333333', 'a1b2c3d4-a1b2-c3d4-a1b2-c3d4a1b2c3d4', 'Mise à jour du registre de sécurité', 'todo'::task_status, '2024-06-15'),
  ('dcba4321-dcba-4321-dcba-4321dcba4321', '44444444-4444-4444-4444-444444444444', 'd4c3b2a1-d4c3-b2a1-d4c3-b2a1d4c3b2a1', 'Installation d''un système d''alarme supplémentaire', 'in_progress'::task_status, '2024-07-20');

-- Sample tasks
INSERT INTO tasks (id, establishment_id, title, description, priority, status, due_date) VALUES
  ('a1234567-89ab-cdef-0123-456789abcdef', '33333333-3333-3333-3333-333333333333', 'Révision Plan Évacuation', 'Mettre à jour les plans d''évacuation des étages 1-3', 'p1'::task_priority, 'todo'::task_status, '2024-05-15'),
  ('b1234567-89ab-cdef-0123-456789abcdef', '44444444-4444-4444-4444-444444444444', 'Formation Personnel', 'Former le nouveau personnel aux procédures d''urgence', 'p2'::task_priority, 'in_progress'::task_status, '2024-06-20');

-- Sample task assignments
INSERT INTO task_assignments (task_id, user_id) VALUES
  ('a1234567-89ab-cdef-0123-456789abcdef', '88888888-8888-8888-8888-888888888888'),
  ('b1234567-89ab-cdef-0123-456789abcdef', '88888888-8888-8888-8888-888888888888');

-- Sample regulatory files
INSERT INTO regulatory_files (id, establishment_id, file_number, submission_date, deadline_date, status, notes) VALUES
  ('c1234567-89ab-cdef-0123-456789abcdef', '33333333-3333-3333-3333-333333333333', 'AT-2024-001', '2024-01-15', '2024-07-15', 'in_progress'::regulatory_file_status, 'Dossier de mise en conformité'),
  ('d1234567-89ab-cdef-0123-456789abcdef', '44444444-4444-4444-4444-444444444444', 'AT-2024-002', '2024-02-20', '2024-08-20', 'in_progress'::regulatory_file_status, 'Demande de dérogation');