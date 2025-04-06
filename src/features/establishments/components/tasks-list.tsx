import { useQuery } from '@tanstack/react-query';
import { getTasksByEstablishment } from '../api/tasks';
import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';

interface TasksListProps {
  establishmentId: string;
}

const statusIcons = {
  todo: Circle,
  in_progress: AlertCircle,
  done: CheckCircle2,
};

const priorityColors = {
  p1: 'text-red-500',
  p2: 'text-orange-500',
  p3: 'text-blue-500',
};

export function TasksList({ establishmentId }: TasksListProps) {
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks', establishmentId],
    queryFn: () => getTasksByEstablishment(establishmentId),
  });

  if (isLoading) {
    return <div className="text-sm text-gray-600">Chargement des tâches...</div>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        Une erreur est survenue lors du chargement des tâches.
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <div className="text-sm text-gray-600">
        Aucune tâche en cours pour cet établissement.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const StatusIcon = statusIcons[task.status];
        const priorityColor = priorityColors[task.priority];

        return (
          <div
            key={task.id}
            className="border-b border-gray-100 last:border-0 pb-2 last:pb-0"
          >
            <div className="flex items-start gap-2">
              <StatusIcon className={`h-5 w-5 mt-0.5 ${priorityColor}`} />
              <div>
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-600">{task.description}</div>
                {task.due_date && (
                  <div className="text-sm text-gray-500 mt-1">
                    Échéance: {new Date(task.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}