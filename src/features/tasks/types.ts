import { Database } from '@/lib/database.types';

export type Task = Database['public']['Tables']['tasks']['Row'] & {
  establishments?: {
    name: string;
    address: string;
  };
  assignees?: {
    id: string;
    full_name: string;
  }[];
};

export type TaskPriority = 'p1' | 'p2' | 'p3';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  p1: 'P1 - Urgent',
  p2: 'P2 - Normal',
  p3: 'P3 - Faible',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'À faire',
  in_progress: 'En cours',
  done: 'Fait',
};