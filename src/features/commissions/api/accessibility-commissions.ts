import { supabase } from '@/lib/supabase';
import { Commission } from '../types';

export async function getAccessibilityCommissionsByEstablishment(establishmentId: string) {
  const { data: commissions, error: commissionsError } = await supabase
    .from('accessibility_commissions')
    .select(`
      *,
      prescriptions:accessibility_commission_prescriptions (
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

export async function updateAccessibilityCommissionPrescription(
  prescriptionId: string,
  data: { status: string; comment?: string }
) {
  const { error } = await supabase
    .from('accessibility_commission_prescriptions')
    .update({
      status: data.status,
      comment: data.comment,
      updated_at: new Date().toISOString(),
    })
    .eq('id', prescriptionId);

  if (error) throw error;
}