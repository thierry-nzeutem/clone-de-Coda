import { supabase } from '@/lib/supabase';
import { Commission, CommissionPrescription } from '../types';

export async function getCommissions() {
  const { data: commissions, error: commissionsError } = await supabase
    .from('commissions')
    .select(`
      *,
      establishments (
        id,
        name,
        address
      ),
      prescriptions:commission_prescriptions (
        id,
        number,
        description,
        reference,
        status,
        comment,
        attachment_url
      )
    `)
    .order('date', { ascending: false });

  if (commissionsError) throw commissionsError;
  return commissions as Commission[];
}

export async function getCommissionsByEstablishment(establishmentId: string) {
  const { data: commissions, error: commissionsError } = await supabase
    .from('commissions')
    .select(`
      *,
      prescriptions:commission_prescriptions (
        id,
        number,
        description,
        reference,
        status,
        comment,
        attachment_url
      )
    `)
    .eq('establishment_id', establishmentId)
    .order('date', { ascending: false });

  if (commissionsError) throw commissionsError;
  return commissions as Commission[];
}

export async function createCommission(data: Partial<Commission>) {
  const { data: commission, error } = await supabase
    .from('commissions')
    .insert(data)
    .select(`
      *,
      establishments (
        id,
        name,
        address
      )
    `)
    .single();

  if (error) throw error;
  return commission as Commission;
}

export async function updateCommission(id: string, data: Partial<Commission>) {
  const { data: commission, error } = await supabase
    .from('commissions')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return commission;
}

export async function deleteCommission(id: string) {
  const { error } = await supabase
    .from('commissions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateCommissionPrescription(
  prescriptionId: string,
  data: Partial<CommissionPrescription>
) {
  const { data: prescription, error } = await supabase
    .from('commission_prescriptions')
    .update(data)
    .eq('id', prescriptionId)
    .select()
    .single();

  if (error) throw error;
  return prescription;
}

export async function createCommissionPrescription(data: Partial<CommissionPrescription>) {
  const { data: prescription, error } = await supabase
    .from('commission_prescriptions')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return prescription;
}

export async function deleteCommissionPrescription(id: string) {
  const { error } = await supabase
    .from('commission_prescriptions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function uploadCommissionReport(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `commission_reports/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function uploadPrescriptionAttachment(file: File) {
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