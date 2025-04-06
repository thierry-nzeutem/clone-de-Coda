import { supabase } from '@/lib/supabase';

export async function getDashboardStats() {
  const [
    { count: establishmentsCount },
    { count: visitsCount },
    { count: commissionPrescriptionsCount },
    { count: accessibilityPrescriptionsCount },
    { count: regulatoryFilesCount },
  ] = await Promise.all([
    supabase
      .from('establishments')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })
      .gte('scheduled_date', new Date().toISOString()),
    supabase
      .from('commission_prescriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'to_correct'),
    supabase
      .from('accessibility_commission_prescriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'to_correct'),
    supabase
      .from('regulatory_files')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'in_progress'),
  ]);

  return {
    establishments: establishmentsCount ?? 0,
    visits: visitsCount ?? 0,
    prescriptions: (commissionPrescriptionsCount ?? 0) + (accessibilityPrescriptionsCount ?? 0),
    regulatoryFiles: regulatoryFilesCount ?? 0,
  };
}

export async function getUpcomingVisits() {
  const { data: visits, error } = await supabase
    .from('visits')
    .select(`
      *,
      establishments (
        name
      )
    `)
    .gte('scheduled_date', new Date().toISOString())
    .order('scheduled_date')
    .limit(3);

  if (error) throw error;
  return visits;
}

export async function getUrgentPrescriptions() {
  // Get urgent prescriptions from both tables
  const [{ data: safetyPrescriptions }, { data: accessibilityPrescriptions }] = await Promise.all([
    supabase
      .from('commission_prescriptions')
      .select(`
        *,
        commission:commissions (
          date,
          commission_type,
          establishments (
            name
          )
        )
      `)
      .eq('status', 'to_correct')
      .eq('is_urgent', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('accessibility_commission_prescriptions')
      .select(`
        *,
        commission:accessibility_commissions (
          date,
          commission_type,
          establishments (
            name
          )
        )
      `)
      .eq('status', 'to_correct')
      .eq('is_urgent', true)
      .order('created_at', { ascending: false })
  ]);

  // Combine and sort prescriptions
  const allPrescriptions = [
    ...(safetyPrescriptions || []).map(p => ({ ...p, type: 'safety' })),
    ...(accessibilityPrescriptions || []).map(p => ({ ...p, type: 'accessibility' }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return allPrescriptions.slice(0, 5); // Return only the 5 most recent
}