import { supabase } from '@/lib/supabase';
import { Task } from '../types';

export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      establishments (
        name,
        address
      ),
      task_assignments (
        user:users (
          id,
          full_name
        )
      )
    `)
    .order('due_date', { ascending: true });

  if (error) throw error;

  // Transform the data to match our Task type
  return data.map(task => ({
    ...task,
    assignees: task.task_assignments?.map(assignment => assignment.user),
  })) as Task[];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>, assigneeIds: string[]) {
  const { data: newTask, error: taskError } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();

  if (taskError) throw taskError;

  if (assigneeIds.length > 0) {
    const assignments = assigneeIds.map(userId => ({
      task_id: newTask.id,
      user_id: userId,
    }));

    const { error: assignmentError } = await supabase
      .from('task_assignments')
      .insert(assignments);

    if (assignmentError) throw assignmentError;
  }

  return newTask;
}

export async function updateTask(id: string, task: Partial<Task>, assigneeIds?: string[]) {
  const { data: updatedTask, error: taskError } = await supabase
    .from('tasks')
    .update(task)
    .eq('id', id)
    .select()
    .single();

  if (taskError) throw taskError;

  if (assigneeIds !== undefined) {
    // Delete existing assignments
    const { error: deleteError } = await supabase
      .from('task_assignments')
      .delete()
      .eq('task_id', id);

    if (deleteError) throw deleteError;

    // Create new assignments
    if (assigneeIds.length > 0) {
      const assignments = assigneeIds.map(userId => ({
        task_id: id,
        user_id: userId,
      }));

      const { error: assignmentError } = await supabase
        .from('task_assignments')
        .insert(assignments);

      if (assignmentError) throw assignmentError;
    }
  }

  return updatedTask;
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, role')
    .order('full_name');

  if (error) throw error;
  return data;
}