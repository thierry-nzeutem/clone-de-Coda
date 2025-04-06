import { supabase } from '@/lib/supabase';
import { User, ActivityLog } from '../types';

export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      user_establishment_access (
        establishments (
          id,
          name
        )
      )
    `)
    .order('full_name');

  if (error) throw error;
  return data as User[];
}

export async function createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: user.email,
    password: 'ChangeMe123!', // Temporary password
    email_confirm: true,
  });

  if (authError) throw authError;

  const { data, error } = await supabase
    .from('users')
    .insert({
      ...user,
      id: authUser.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(id: string, user: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(user)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function assignEstablishmentToUser(userId: string, establishmentId: string) {
  const { error } = await supabase
    .from('user_establishment_access')
    .insert({
      user_id: userId,
      establishment_id: establishmentId,
    });

  if (error) throw error;
}

export async function removeEstablishmentFromUser(userId: string, establishmentId: string) {
  const { error } = await supabase
    .from('user_establishment_access')
    .delete()
    .eq('user_id', userId)
    .eq('establishment_id', establishmentId);

  if (error) throw error;
}

export async function getActivityLogs(limit = 50) {
  const { data, error } = await supabase
    .from('activity_logs')
    .select(`
      *,
      user:users (
        full_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as ActivityLog[];
}

export async function logActivity(log: Omit<ActivityLog, 'id' | 'created_at'>) {
  const { error } = await supabase
    .from('activity_logs')
    .insert(log);

  if (error) throw error;
}