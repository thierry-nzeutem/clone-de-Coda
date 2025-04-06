import { supabase } from '@/lib/supabase';
import { TechnicalInstallation, Verification } from '../types';

export async function getTechnicalInstallations() {
  const { data, error } = await supabase
    .from('technical_installations')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as TechnicalInstallation[];
}

export async function createTechnicalInstallation(installation: Omit<TechnicalInstallation, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('technical_installations')
    .insert(installation)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getVerifications() {
  const { data, error } = await supabase
    .from('verifications')
    .select(`
      *,
      establishments (
        name,
        address
      ),
      installation:technical_installations (
        name,
        regulation_type,
        verification_period_months
      )
    `)
    .order('verification_date', { ascending: false });

  if (error) throw error;
  return data as Verification[];
}

export async function getVerificationsByEstablishment(establishmentId: string) {
  const { data, error } = await supabase
    .from('verifications')
    .select(`
      *,
      establishments (
        name,
        address
      ),
      installation:technical_installations (
        name,
        regulation_type,
        verification_period_months
      )
    `)
    .eq('establishment_id', establishmentId)
    .order('next_verification_date');

  if (error) throw error;
  return data as Verification[];
}

export async function createVerification(verification: Omit<Verification, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('verifications')
    .insert(verification)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateVerification(id: string, verification: Partial<Verification>) {
  const { data, error } = await supabase
    .from('verifications')
    .update(verification)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadVerificationReport(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `verifications/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  return publicUrl;
}