import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Prescription = Database['public']['Tables']['prescriptions']['Row'];

export async function getPrescriptionsByEstablishment(establishmentId: string) {
  const { data, error } = await supabase
    .from('prescriptions')
    .select('*')
    .eq('establishment_id', establishmentId)
    .order('due_date');

  if (error) throw error;
  return data as Prescription[];
}