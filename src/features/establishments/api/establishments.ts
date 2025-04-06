import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Establishment = Database['public']['Tables']['establishments']['Row'] & {
  grouping?: {
    id: string;
    name: string;
  };
};

export async function getEstablishmentById(id: string) {
  const { data, error } = await supabase
    .from('establishments')
    .select(`
      *,
      grouping:groupings (
        id,
        name
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Establishment;
}

export async function getEstablishments() {
  const { data, error } = await supabase
    .from('establishments')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as Establishment[];
}

export async function createEstablishment(establishment: Omit<Establishment, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('establishments')
    .insert(establishment)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEstablishment(id: string, establishment: Partial<Establishment>) {
  const { data, error } = await supabase
    .from('establishments')
    .update(establishment)
    .eq('id', id)
    .select(`
      *,
      grouping:groupings (
        id,
        name
      )
    `)
    .single();

  if (error) throw error;
  return data;
}