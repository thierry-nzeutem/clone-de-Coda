import { Database } from '@/lib/database.types';

export type Visit = Database['public']['Tables']['visits']['Row'] & {
  establishments?: {
    name: string;
    address: string;
  };
  consultant?: {
    full_name: string;
  };
  report_url?: string;
};

export type VisitReport = {
  id: string;
  visit_id: string;
  establishment_id: string;
  consultant_id: string;
  report_url: string;
  report_date: string;
  report_type: string;
  file_path: string;
  created_at?: string;
};