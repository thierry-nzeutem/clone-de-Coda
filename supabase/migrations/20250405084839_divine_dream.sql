-- Insert sample commission data
INSERT INTO commissions (establishment_id, date, commission_type, purpose, opinion) VALUES
  ((SELECT id FROM establishments LIMIT 1), '2024-03-15', 'departementale', 'visite_periodique', 'favorable'),
  ((SELECT id FROM establishments LIMIT 1), '2023-09-20', 'communale', 'etude_autorisation_travaux', 'favorable'),
  ((SELECT id FROM establishments LIMIT 1), '2023-06-10', 'arrondissement', 'visite_inopinee', 'defavorable');

-- Insert sample commission prescriptions
INSERT INTO commission_prescriptions (commission_id, number, description, reference, status) VALUES
  ((SELECT id FROM commissions ORDER BY date DESC LIMIT 1), 1, 'Installer un système de désenfumage dans le local technique', 'Article DF 6 §1', 'to_correct'),
  ((SELECT id FROM commissions ORDER BY date DESC LIMIT 1), 2, 'Remplacer les blocs autonomes d''éclairage de sécurité défectueux', 'Article EC 14 §3', 'corrected'),
  ((SELECT id FROM commissions ORDER BY date DESC LIMIT 1), 3, 'Faire vérifier l''installation électrique par un organisme agréé', 'Article EL 19 §2', 'to_correct');

-- Insert sample accessibility commission data
INSERT INTO accessibility_commissions (establishment_id, date, commission_type, purpose, opinion) VALUES
  ((SELECT id FROM establishments LIMIT 1), '2024-02-20', 'departementale', 'visite_periodique', 'favorable'),
  ((SELECT id FROM establishments LIMIT 1), '2023-08-15', 'communale', 'etude_autorisation_travaux', 'defavorable');

-- Insert sample accessibility commission prescriptions
INSERT INTO accessibility_commission_prescriptions (commission_id, number, description, reference, status) VALUES
  ((SELECT id FROM accessibility_commissions ORDER BY date DESC LIMIT 1), 1, 'Mettre en place une rampe d''accès conforme', 'Article 4 de l''arrêté du 8 décembre 2014', 'to_correct'),
  ((SELECT id FROM accessibility_commissions ORDER BY date DESC LIMIT 1), 2, 'Installer une barre d''appui dans les sanitaires', 'Article 12 de l''arrêté du 8 décembre 2014', 'corrected');