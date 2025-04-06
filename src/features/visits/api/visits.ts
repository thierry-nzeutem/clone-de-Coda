import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Visit = Database['public']['Tables']['visits']['Row'];
type VisitWithDetails = Visit & {
  establishments: {
    name: string;
    address: string;
  };
  consultant: {
    full_name: string;
  } | null;
};

export async function getVisits() {
  const { data, error } = await supabase
    .from('visits')
    .select(`
      *,
      establishments (
        name,
        address
      ),
      consultant:users (
        full_name
      )
    `)
    .order('scheduled_date');

  if (error) throw error;
  return data as VisitWithDetails[];
}

export async function getVisitsByEstablishment(establishmentId: string) {
  const { data, error } = await supabase
    .from('visits')
    .select(`
      *,
      establishments (
        name,
        address
      ),
      consultant:users (
        full_name
      )
    `)
    .eq('establishment_id', establishmentId)
    .order('scheduled_date');

  if (error) throw error;
  return data as VisitWithDetails[];
}

export async function createVisit(visit: Omit<Visit, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('visits')
    .insert(visit)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateVisit(id: string, visit: Partial<Visit>) {
  const { data, error } = await supabase
    .from('visits')
    .update(visit)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVisit(id: string) {
  const { error } = await supabase
    .from('visits')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getConsultants() {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name')
    .eq('role', 'consultant');

  if (error) throw error;
  return data;
}