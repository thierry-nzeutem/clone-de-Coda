import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];

export async function getTasksByEstablishment(establishmentId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('establishment_id', establishmentId)
    .order('due_date');

  if (error) throw error;
  return data as Task[];
}