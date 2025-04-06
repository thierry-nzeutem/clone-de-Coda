import { Database } from '@/lib/database.types';

export type RegulatoryFile = Database['public']['Tables']['regulatory_files']['Row'] & {
  establishments?: {
    name: string;
    address: string;
  };
};

export type RegulatoryFileStatus = 'in_progress' | 'report_sent' | 'archived';

export const STATUS_LABELS: Record<RegulatoryFileStatus, string> = {
  in_progress: 'En cours',
  report_sent: 'Rapport envoyé',
  archived: 'Archivé',
};