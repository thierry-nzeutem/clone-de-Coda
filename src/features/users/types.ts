export interface User {
  id: string;
  email: string;
  role: 'admin' | 'consultant' | 'client';
  full_name: string;
  created_at?: string;
  updated_at?: string;
  user_establishment_access?: {
    establishments: {
      id: string;
      name: string;
    }[];
  }[];
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  details?: string;
  created_at: string;
  user?: {
    full_name: string;
  };
}

export const ROLE_LABELS: Record<User['role'], string> = {
  admin: 'Admin',
  consultant: 'Consultant',
  client: 'Client'
};