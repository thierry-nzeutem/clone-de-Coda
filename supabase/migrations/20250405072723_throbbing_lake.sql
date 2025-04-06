/*
  # Associate establishments with groupings

  Cette migration ajoute les établissements aux groupements existants.
*/

-- Mise à jour des établissements pour les associer aux groupements
UPDATE establishments 
SET grouping_id = '11111111-1111-1111-1111-111111111111'
WHERE id IN (
  'e1111111-1111-1111-1111-111111111111',
  'e2222222-2222-2222-2222-222222222222'
);

UPDATE establishments 
SET grouping_id = '22222222-2222-2222-2222-222222222222'
WHERE id IN (
  'e3333333-3333-3333-3333-333333333333',
  'e4444444-4444-4444-4444-444444444444'
);

-- Mise à jour des coordonnées des groupements pour la carte
UPDATE groupings
SET 
  latitude = 48.8566,
  longitude = 2.3522
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE groupings
SET 
  latitude = 48.8534,
  longitude = 2.3488
WHERE id = '22222222-2222-2222-2222-222222222222';