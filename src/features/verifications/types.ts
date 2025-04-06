import { Database } from '@/lib/database.types';

export type TechnicalInstallation = Database['public']['Tables']['technical_installations']['Row'];
export type Verification = Database['public']['Tables']['verifications']['Row'] & {
  establishments?: {
    name: string;
    address: string;
  };
  installation?: {
    name: string;
    regulation_type: string;
    verification_period_months: number;
  };
};

export type VerificationStatus = 'compliant' | 'non_compliant' | 'pending';

export const STATUS_LABELS: Record<VerificationStatus, string> = {
  compliant: 'Conforme',
  non_compliant: 'Non conforme',
  pending: 'En attente',
};

export const REGULATION_TYPES = [
  { value: 'erp', label: 'ERP' },
  { value: 'work_code', label: 'Code du Travail' },
];