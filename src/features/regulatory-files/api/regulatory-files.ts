import { supabase } from '@/lib/supabase';
import { RegulatoryFile } from '../types';

export async function getRegulatoryFiles() {
  const { data, error } = await supabase
    .from('regulatory_files')
    .select(`
      *,
      establishments (
        name,
        address
      )
    `)
    .order('submission_date', { ascending: false });

  if (error) throw error;
  return data as RegulatoryFile[];
}

export async function getRegulatoryFilesByEstablishment(establishmentId: string) {
  const { data, error } = await supabase
    .from('regulatory_files')
    .select(`
      *,
      establishments (
        name,
        address
      )
    `)
    .eq('establishment_id', establishmentId)
    .order('deadline_date');

  if (error) throw error;
  return data as RegulatoryFile[];
}

export async function createRegulatoryFile(file: Omit<RegulatoryFile, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('regulatory_files')
    .insert(file)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateRegulatoryFile(id: string, file: Partial<RegulatoryFile>) {
  const { data, error } = await supabase
    .from('regulatory_files')
    .update(file)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadAttachment(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `regulatory_files/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  return publicUrl;
}