import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Contact = Database['public']['Tables']['contacts']['Row'];

export async function getContactsByEstablishment(establishmentId: string) {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('establishment_id', establishmentId)
    .order('full_name');

  if (error) throw error;
  return data as Contact[];
}