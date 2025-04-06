/*
  # Add test data for FireSafe Pro

  1. Test Data
    - Add sample establishments with various types and categories
    - Add sample visits and commissions
    - Add sample prescriptions and tasks
    - Add sample contacts
    - Add sample verifications
*/

-- Sample establishments
INSERT INTO establishments (id, name, address, types, category, visit_periodicity, commission_opinion, last_commission_date, next_commission_date) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'Centre Commercial Rivoli', '15 Rue de Rivoli, 75001 Paris', ARRAY['type_m']::establishment_type[], '1', 12, 'Favorable', '2023-12-15', '2024-12-15'),
  ('e2222222-2222-2222-2222-222222222222', 'Théâtre du Palais-Royal', '38 Rue de Montpensier, 75001 Paris', ARRAY['type_l']::establishment_type[], '2', 24, 'Favorable avec prescriptions', '2023-10-20', '2025-10-20'),
  ('e3333333-3333-3333-3333-333333333333', 'Hôtel Saint-Germain', '88 Rue du Bac, 75007 Paris', ARRAY['type_o']::establishment_type[], '3', 36, 'Favorable', '2024-01-10', '2027-01-10'),
  ('e4444444-4444-4444-4444-444444444444', 'Restaurant Le Marais', '25 Rue des Rosiers, 75004 Paris', ARRAY['type_n']::establishment_type[], '4', 36, 'Défavorable', '2024-02-01', '2024-05-01');

-- Sample contacts
INSERT INTO contacts (establishment_id, full_name, role, email, phone) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'Marie Dubois', 'Directrice Sécurité', 'marie.dubois@example.com', '+33123456789'),
  ('e1111111-1111-1111-1111-111111111111', 'Pierre Martin', 'Responsable Technique', 'pierre.martin@example.com', '+33123456790'),
  ('e2222222-2222-2222-2222-222222222222', 'Sophie Laurent', 'Directrice', 'sophie.laurent@example.com', '+33123456791'),
  ('e3333333-3333-3333-3333-333333333333', 'Jean Dupont', 'Responsable Sécurité', 'jean.dupont@example.com', '+33123456792'),
  ('e4444444-4444-4444-4444-444444444444', 'Luc Bernard', 'Gérant', 'luc.bernard@example.com', '+33123456793');

-- Sample visits
INSERT INTO visits (establishment_id, visit_type, scheduled_date, consultant_id, notes) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'commission', '2024-12-15', '11111111-1111-1111-1111-111111111111', 'Visite périodique annuelle'),
  ('e2222222-2222-2222-2222-222222222222', 'first_visit', '2024-05-20', '11111111-1111-1111-1111-111111111111', 'Première visite de contrôle'),
  ('e4444444-4444-4444-4444-444444444444', 'second_visit', '2024-04-15', '11111111-1111-1111-1111-111111111111', 'Visite de contrôle suite à avis défavorable');

-- Sample safety commissions
INSERT INTO safety_commissions (establishment_id, commission_date, type, status, minutes_received, responsible_id) VALUES
  ('e1111111-1111-1111-1111-111111111111', '2023-12-15', 'Périodique', 'Favorable', true, '11111111-1111-1111-1111-111111111111'),
  ('e2222222-2222-2222-2222-222222222222', '2023-10-20', 'Périodique', 'Favorable avec prescriptions', true, '11111111-1111-1111-1111-111111111111'),
  ('e4444444-4444-4444-4444-444444444444', '2024-02-01', 'Périodique', 'Défavorable', true, '11111111-1111-1111-1111-111111111111');

-- Sample prescriptions
INSERT INTO prescriptions (establishment_id, description, status, due_date) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'Mise à jour du registre de sécurité', 'todo', '2024-06-15'),
  ('e2222222-2222-2222-2222-222222222222', 'Installation d''un système d''alarme type 4', 'in_progress', '2024-05-20'),
  ('e2222222-2222-2222-2222-222222222222', 'Formation du personnel à l''évacuation', 'todo', '2024-07-01'),
  ('e4444444-4444-4444-4444-444444444444', 'Remplacement des blocs autonomes défectueux', 'todo', '2024-04-15'),
  ('e4444444-4444-4444-4444-444444444444', 'Mise en conformité du système de désenfumage', 'in_progress', '2024-05-01');

-- Sample tasks
INSERT INTO tasks (establishment_id, title, description, priority, status, due_date) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'Exercice d''évacuation', 'Organiser un exercice d''évacuation avec le personnel', 'p2', 'todo', '2024-06-01'),
  ('e2222222-2222-2222-2222-222222222222', 'Vérification extincteurs', 'Contrôle annuel des extincteurs', 'p1', 'in_progress', '2024-04-30'),
  ('e3333333-3333-3333-3333-333333333333', 'Formation nouveaux agents', 'Former les nouveaux agents de sécurité', 'p2', 'todo', '2024-05-15'),
  ('e4444444-4444-4444-4444-444444444444', 'Mise à jour plans', 'Mise à jour des plans d''évacuation', 'p1', 'todo', '2024-04-20');

-- Sample technical installations
INSERT INTO technical_installations (name, regulation_type, verification_period_months) VALUES
  ('Système de Sécurité Incendie', 'SSI', 12),
  ('Désenfumage', 'DF', 12),
  ('Installation électrique', 'ELEC', 12),
  ('Ascenseurs', 'ASC', 12);

-- Sample verifications for each establishment
INSERT INTO verifications (establishment_id, installation_id, verification_date, next_verification_date, provider_name, status)
SELECT
  e.id as establishment_id,
  i.id as installation_id,
  '2024-01-15'::date as verification_date,
  '2025-01-15'::date as next_verification_date,
  'VERITAS' as provider_name,
  'compliant'::verification_status as status
FROM establishments e
CROSS JOIN technical_installations i;

-- Sample regulatory files
INSERT INTO regulatory_files (establishment_id, file_number, submission_date, deadline_date, status, notes) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'AT-2024-001', '2024-01-15', '2024-07-15', 'in_progress', 'Dossier de mise en conformité du système de sécurité incendie'),
  ('e2222222-2222-2222-2222-222222222222', 'AT-2024-002', '2024-02-01', '2024-08-01', 'in_progress', 'Demande d''autorisation pour modification des issues de secours'),
  ('e4444444-4444-4444-4444-444444444444', 'AT-2024-003', '2024-03-01', '2024-09-01', 'in_progress', 'Dossier de mise en conformité suite à avis défavorable');

-- Give access to admin user
INSERT INTO user_establishment_access (user_id, establishment_id)
SELECT '11111111-1111-1111-1111-111111111111', id
FROM establishments;