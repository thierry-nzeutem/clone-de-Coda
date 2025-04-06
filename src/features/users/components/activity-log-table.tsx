import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActivityLog } from "../types";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ActivityLogTableProps {
  logs: ActivityLog[];
}

const LOG_TYPE_LABELS: Record<string, string> = {
  user_login: 'Connexion',
  user_logout: 'Déconnexion',
  establishment_view: 'Consultation établissement',
  establishment_edit: 'Modification établissement',
  prescription_create: 'Création prescription',
  prescription_update: 'Mise à jour prescription',
  document_upload: 'Upload document',
  document_download: 'Téléchargement document',
};

export function ActivityLogTable({ logs }: ActivityLogTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Détails</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap">
                {formatDistanceToNow(new Date(log.created_at), {
                  addSuffix: true,
                  locale: fr,
                })}
              </TableCell>
              <TableCell>{log.user?.full_name}</TableCell>
              <TableCell>{LOG_TYPE_LABELS[log.type]}</TableCell>
              <TableCell>{log.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}