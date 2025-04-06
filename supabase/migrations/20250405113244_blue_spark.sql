-- Insert more sample safety commission data
INSERT INTO commissions (establishment_id, date, commission_type, purpose, opinion) VALUES
  ((SELECT id FROM establishments LIMIT 1), '2024-01-10', 'departementale', 'visite_periodique', 'favorable'),
  ((SELECT id FROM establishments LIMIT 1), '2023-11-25', 'communale', 'etude_permis_construire', 'defavorable'),
  ((SELECT id FROM establishments LIMIT 1), '2023-07-15', 'arrondissement', 'reception_travaux', 'favorable'),
  ((SELECT id FROM establishments LIMIT 1), '2023-04-05', 'departementale', 'visite_chantier', 'favorable'),
  ((SELECT id FROM establishments LIMIT 1), '2023-02-20', 'communale', 'levee_prescription', 'favorable');

-- Insert more sample safety commission prescriptions
INSERT INTO commission_prescriptions (commission_id, number, description, reference, status) VALUES
  ((SELECT id FROM commissions WHERE date = '2024-01-10'), 1, 'Mettre à jour le registre de sécurité', 'Article R123-51', 'corrected'),
  ((SELECT id FROM commissions WHERE date = '2024-01-10'), 2, 'Remplacer les détecteurs de fumée défectueux', 'Article MS 56', 'to_correct'),
  ((SELECT id FROM commissions WHERE date = '2024-01-10'), 3, 'Afficher les plans d''évacuation à jour', 'Article CO 44', 'corrected'),
  ((SELECT id FROM commissions WHERE date = '2023-11-25'), 1, 'Installer un système d''alarme conforme', 'Article MS 62', 'to_correct'),
  ((SELECT id FROM commissions WHERE date = '2023-11-25'), 2, 'Mettre en place un éclairage de sécurité', 'Article EC 7', 'to_correct'),
  ((SELECT id FROM commissions WHERE date = '2023-07-15'), 1, 'Vérifier la stabilité au feu des structures', 'Article CO 12', 'corrected'),
  ((SELECT id FROM commissions WHERE date = '2023-07-15'), 2, 'Former le personnel à l''utilisation des extincteurs', 'Article MS 51', 'corrected'),
  ((SELECT id FROM commissions WHERE date = '2023-04-05'), 1, 'Installer des portes coupe-feu', 'Article CO 44', 'not_applicable');

-- Insert more sample accessibility commission data
INSERT INTO accessibility_commissions (establishment_id, date, commission_type, purpose, opinion) VALUES
  ((SELECT id FROM establishments LIMIT 1), '2024-01-15', 'departementale', 'etude_derogation', 'favorable'),
  ((SELECT id FROM establishments LIMIT 1), '2023-10-05', 'communale', 'visite_periodique', 'defavorable'),
  ((SELECT id FROM establishments LIMIT 1), '2023-07-20', 'arrondissement', 'reception_travaux', 'favorable'),
  ((SELECT id FROM establishments LIMIT 1), '2023-04-12', 'departementale', 'etude_autorisation_travaux', 'favorable');

-- Insert more sample accessibility commission prescriptions
INSERT INTO accessibility_commission_prescriptions (commission_id, number, description, reference, status) VALUES
  ((SELECT id FROM accessibility_commissions WHERE date = '2024-01-15'), 1, 'Installer un ascenseur accessible aux PMR', 'Article 7.2 de l''arrêté du 8 décembre 2014', 'to_correct'),
  ((SELECT id FROM accessibility_commissions WHERE date = '2024-01-15'), 2, 'Mettre en place une signalétique adaptée', 'Article 4.2 de l''arrêté du 8 décembre 2014', 'corrected'),
  ((SELECT id FROM accessibility_commissions WHERE date = '2023-10-05'), 1, 'Créer une place de stationnement PMR', 'Article 3 de l''arrêté du 8 décembre 2014', 'to_correct'),
  ((SELECT id FROM accessibility_commissions WHERE date = '2023-10-05'), 2, 'Installer des bandes podotactiles', 'Article 6.1 de l''arrêté du 8 décembre 2014', 'to_correct'),
  ((SELECT id FROM accessibility_commissions WHERE date = '2023-07-20'), 1, 'Élargir les portes d''accès', 'Article 10 de l''arrêté du 8 décembre 2014', 'corrected'),
  ((SELECT id FROM accessibility_commissions WHERE date = '2023-07-20'), 2, 'Installer un sanitaire adapté', 'Article 12 de l''arrêté du 8 décembre 2014', 'corrected'),
  ((SELECT id FROM accessibility_commissions WHERE date = '2023-04-12'), 1, 'Mettre en place un éclairage adapté', 'Article 14 de l''arrêté du 8 décembre 2014', 'not_applicable'),
  ((SELECT id FROM accessibility_commissions WHERE date = '2023-04-12'), 2, 'Installer une balise sonore', 'Article 4.3 de l''arrêté du 8 décembre 2014', 'corrected');