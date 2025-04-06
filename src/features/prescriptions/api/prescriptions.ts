import { supabase } from '@/lib/supabase';
import { Prescription } from '../types';

export async function getPrescriptions() {
  const { data, error } = await supabase
    .from('prescriptions')
    .select(`
      *,
      establishments (
        name,
        address
      ),
      commission:safety_commissions (
        commission_date,
        type
      )
    `)
    .order('due_date', { ascending: true });

  if (error) throw error;
  return data as Prescription[];
}

export async function createPrescription(prescription: Omit<Prescription, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('prescriptions')
    .insert(prescription)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePrescription(id: string, prescription: Partial<Prescription>) {
  const { data, error } = await supabase
    .from('prescriptions')
    .update(prescription)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePrescription(id: string) {
  const { error } = await supabase
    .from('prescriptions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function uploadPrescriptionFile(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `prescriptions/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  return publicUrl;
}