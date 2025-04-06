import { Database } from '@/lib/database.types';

export type Prescription = Database['public']['Tables']['prescriptions']['Row'] & {
  establishments?: {
    name: string;
    address: string;
  };
  commission?: {
    commission_date: string;
    type: string;
  };
};

export type PrescriptionStatus = 'todo' | 'in_progress' | 'done' | 'not_applicable';
export type PrescriptionSource = 'commission' | 'visit' | 'internal';