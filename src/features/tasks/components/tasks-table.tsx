import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task, PRIORITY_LABELS, STATUS_LABELS } from "../types";
import { Building2, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface TasksTableProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function TasksTable({ tasks, onTaskClick }: TasksTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Établissement</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Échéance</TableHead>
            <TableHead>Assignés</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div className="font-medium">{task.title}</div>
                <div className="text-sm text-gray-600 truncate max-w-md">
                  {task.description}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{task.establishments?.name}</div>
                <div className="text-sm text-gray-600">
                  {task.establishments?.address}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityBadgeVariant(task.priority)}>
                  {PRIORITY_LABELS[task.priority]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(task.status)}>
                  {STATUS_LABELS[task.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {task.due_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {new Date(task.due_date).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {task.assignees?.map(a => a.full_name).join(', ')}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTaskClick(task)}
                  >
                    Modifier
                  </Button>
                  {task.establishment_id && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to={`/etablissements/${task.establishment_id}`}>
                        <Building2 className="h-4 w-4 mr-1" />
                        Établissement
                      </Link>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    todo: 'outline',
    in_progress: 'default',
    done: 'secondary',
  };
  return variants[status] || 'default';
}