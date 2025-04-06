/*
  # Désactivation temporaire du RLS pour le développement
  
  Cette migration désactive temporairement le RLS sur toutes les tables
  pour permettre un accès complet aux données pendant le développement.
  
  ATTENTION: Ne pas utiliser en production !
*/

ALTER TABLE establishments DISABLE ROW LEVEL SECURITY;
ALTER TABLE groupings DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_establishment_access DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE safety_commissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE technical_installations DISABLE ROW LEVEL SECURITY;
ALTER TABLE verifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_files DISABLE ROW LEVEL SECURITY;