/*
  # Add missing test data

  Cette migration ajoute uniquement les données de test manquantes.
  Les données existantes ne sont pas réinsérées pour éviter les conflits.
*/

-- Vérifier et insérer les données manquantes pour les installations techniques
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM technical_installations WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid) THEN
    INSERT INTO technical_installations (id, name, regulation_type, verification_period_months) VALUES
      ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid, 'Système de Désenfumage', 'ERP', 12);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM technical_installations WHERE id = 'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid) THEN
    INSERT INTO technical_installations (id, name, regulation_type, verification_period_months) VALUES
      ('ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid, 'Installation Électrique', 'ERP', 12);
  END IF;
END $$;

-- Vérifier et insérer les données manquantes pour les vérifications
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM verifications WHERE id = '12345678-1234-5678-1234-567812345678'::uuid) THEN
    INSERT INTO verifications (id, establishment_id, installation_id, verification_date, next_verification_date, provider_name, status) VALUES
      ('12345678-1234-5678-1234-567812345678'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid, '2024-01-15', '2025-01-15', 'VERITAS', 'compliant'::verification_status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM verifications WHERE id = '87654321-8765-4321-8765-432187654321'::uuid) THEN
    INSERT INTO verifications (id, establishment_id, installation_id, verification_date, next_verification_date, provider_name, status) VALUES
      ('87654321-8765-4321-8765-432187654321'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid, '2024-02-20', '2025-02-20', 'APAVE', 'pending'::verification_status);
  END IF;
END $$;

-- Vérifier et insérer les données manquantes pour les prescriptions
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM prescriptions WHERE id = 'abcd1234-abcd-1234-abcd-1234abcd1234'::uuid) THEN
    INSERT INTO prescriptions (id, establishment_id, commission_id, description, status, due_date) VALUES
      ('abcd1234-abcd-1234-abcd-1234abcd1234'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'a1b2c3d4-a1b2-c3d4-a1b2-c3d4a1b2c3d4'::uuid, 'Mise à jour du registre de sécurité', 'todo'::task_status, '2024-06-15');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM prescriptions WHERE id = 'dcba4321-dcba-4321-dcba-4321dcba4321'::uuid) THEN
    INSERT INTO prescriptions (id, establishment_id, commission_id, description, status, due_date) VALUES
      ('dcba4321-dcba-4321-dcba-4321dcba4321'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'd4c3b2a1-d4c3-b2a1-d4c3-b2a1d4c3b2a1'::uuid, 'Installation d''un système d''alarme supplémentaire', 'in_progress'::task_status, '2024-07-20');
  END IF;
END $$;