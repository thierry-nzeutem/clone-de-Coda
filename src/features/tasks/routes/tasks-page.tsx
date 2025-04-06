import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api/tasks';
import { TasksTable } from '../components/tasks-table';
import { TasksKanban } from '../components/tasks-kanban';
import { CreateTaskDialog } from '../components/create-task-dialog';
import { TaskFilters, filterTasks, TaskFilters as FilterType } from '../components/task-filters';
import { Task } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    priority: 'all',
    status: 'all',
    assignee: 'all',
    establishment: 'all',
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const filteredTasks = filterTasks(tasks, filters);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tâches</h1>
        <CreateTaskDialog />
      </div>

      <TaskFilters onFilterChange={setFilters} />

      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kanban">Vue Kanban</TabsTrigger>
          <TabsTrigger value="table">Vue tableau</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          <TasksKanban tasks={filteredTasks} onTaskClick={setSelectedTask} />
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <TasksTable tasks={filteredTasks} onTaskClick={setSelectedTask} />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails de la tâche</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{selectedTask.title}</h3>
                <Badge variant={getPriorityBadgeVariant(selectedTask.priority)}>
                  P{selectedTask.priority.slice(1)}
                </Badge>
              </div>

              {selectedTask.description && (
                <p className="text-sm text-gray-600">{selectedTask.description}</p>
              )}

              <div className="space-y-2">
                {selectedTask.establishments && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">
                        {selectedTask.establishments.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedTask.establishments.address}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTask.due_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      Échéance : {new Date(selectedTask.due_date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                )}

                {selectedTask.assignees && selectedTask.assignees.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      Assigné à : {selectedTask.assignees.map(a => a.full_name).join(', ')}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                {selectedTask.establishment_id && (
                  <Button variant="outline" asChild>
                    <Link to={`/etablissements/${selectedTask.establishment_id}`}>
                      <Building2 className="h-4 w-4 mr-1" />
                      Voir l'établissement
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getPriorityBadgeVariant(priority: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default'| 'secondary' | 'destructive' | 'outline'> = {
    p1: 'destructive',
    p2: 'default',
    p3: 'secondary',
  };
  return variants[priority] || 'default';
}