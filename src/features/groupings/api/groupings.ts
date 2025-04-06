import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Grouping = Database['public']['Tables']['groupings']['Row'];
type GroupingWithEstablishments = Grouping & {
  establishments: {
    id: string;
    name: string;
    types: string[];
    category: string;
    next_commission_date: string | null;
  }[];
};

export async function getGroupings() {
  const { data, error } = await supabase
    .from('groupings')
    .select(`
      *,
      establishments (
        id,
        name,
        types,
        category,
        next_commission_date
      )
    `)
    .order('name');

  if (error) throw error;
  return data as GroupingWithEstablishments[];
}

export async function getGroupingById(id: string) {
  const { data, error } = await supabase
    .from('groupings')
    .select(`
      *,
      establishments (
        id,
        name,
        types,
        category,
        next_commission_date,
        visits (
          scheduled_date,
          visit_type
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as GroupingWithEstablishments;
}