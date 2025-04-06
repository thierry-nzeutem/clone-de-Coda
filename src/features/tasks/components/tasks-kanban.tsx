import { Task, TaskStatus, STATUS_LABELS } from "../types";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface TasksKanbanProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function TasksKanban({ tasks, onTaskClick }: TasksKanbanProps) {
  const columns: TaskStatus[] = ['todo', 'in_progress', 'done'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((status) => (
        <div
          key={status}
          className="bg-white rounded-lg shadow p-4"
        >
          <h3 className="font-semibold mb-4 flex items-center justify-between">
            <span>{STATUS_LABELS[status]}</span>
            <Badge variant="secondary" className="ml-2">
              {tasks.filter((t) => t.status === status).length}
            </Badge>
          </h3>

          <div className="space-y-4">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onTaskClick(task)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium">{task.title}</div>
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      P{task.priority.slice(1)}
                    </Badge>
                  </div>

                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    {task.establishments && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="h-4 w-4" />
                        <Link
                          to={`/etablissements/${task.establishment_id}`}
                          className="hover:text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {task.establishments.name}
                        </Link>
                      </div>
                    )}

                    {task.due_date && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(task.due_date).toLocaleDateString('fr-FR')}
                      </div>
                    )}

                    {task.assignees && task.assignees.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        {task.assignees.map(a => a.full_name).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function getPriorityBadgeVariant(priority: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    p1: 'destructive',
    p2: 'default',
    p3: 'secondary',
  };
  return variants[priority] || 'default';
}