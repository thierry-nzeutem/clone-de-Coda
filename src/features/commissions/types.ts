import { Database } from '@/lib/database.types';

export type Commission = {
  id: string;
  establishment_id: string;
  date: string;
  commission_type: CommissionType;
  purpose: CommissionPurpose;
  opinion: CommissionOpinion;
  report_url: string | null;
  prescriptions?: CommissionPrescription[];
  created_at?: string;
  updated_at?: string;
};

export type CommissionPrescription = {
  id: string;
  commission_id: string;
  number: number;
  description: string;
  reference: string;
  status: PrescriptionStatus;
  comment?: string | null;
  attachment_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CommissionType = 'communale' | 'arrondissement' | 'departementale';
export type CommissionPurpose = 
  | 'etude_autorisation_travaux' 
  | 'etude_permis_construire' 
  | 'demande_avis' 
  | 'levee_prescription' 
  | 'etude_derogation' 
  | 'visite_periodique' 
  | 'visite_inopinee' 
  | 'reception_travaux' 
  | 'visite_ouverture' 
  | 'visite_chantier';
export type CommissionOpinion = 'favorable' | 'defavorable';
export type PrescriptionStatus = 'corrected' | 'to_correct' | 'not_applicable';

export const COMMISSION_TYPE_LABELS: Record<CommissionType, string> = {
  communale: 'Communale',
  arrondissement: 'Arrondissement',
  departementale: 'Départementale',
};

export const COMMISSION_PURPOSE_LABELS: Record<CommissionPurpose, string> = {
  etude_autorisation_travaux: "Étude d'autorisation de travaux",
  etude_permis_construire: "Étude de permis de construire",
  demande_avis: "Demande d'avis",
  levee_prescription: "Levée de prescription",
  etude_derogation: "Étude de demande de dérogation",
  visite_periodique: "Visite périodique",
  visite_inopinee: "Visite inopinée",
  reception_travaux: "Visite de réception de travaux",
  visite_ouverture: "Visite d'ouverture",
  visite_chantier: "Visite de chantier",
};

export const COMMISSION_OPINION_LABELS: Record<CommissionOpinion, string> = {
  favorable: 'Favorable',
  defavorable: 'Défavorable',
};

export const PRESCRIPTION_STATUS_LABELS: Record<PrescriptionStatus, string> = {
  corrected: 'Corrigée',
  to_correct: 'À corriger',
  not_applicable: 'Non applicable',
};