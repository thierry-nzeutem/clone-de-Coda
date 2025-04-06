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
import { RegulatoryFile, STATUS_LABELS } from "../types";
import { Building2, Calendar, FileText, Upload } from "lucide-react";
import { Link } from "react-router-dom";

interface RegulatoryFilesTableProps {
  files: RegulatoryFile[];
  onFileClick: (file: RegulatoryFile) => void;
}

export function RegulatoryFilesTable({ files, onFileClick }: RegulatoryFilesTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° Dossier</TableHead>
            <TableHead>Établissement</TableHead>
            <TableHead>Date dépôt</TableHead>
            <TableHead>Date butoir</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => {
            const isOverdue = new Date(file.deadline_date) < new Date();

            return (
              <TableRow key={file.id}>
                <TableCell className="font-medium">
                  {file.file_number}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{file.establishments?.name}</div>
                  <div className="text-sm text-gray-600">
                    {file.establishments?.address}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(file.submission_date).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600' : ''}`}>
                    {new Date(file.deadline_date).toLocaleDateString('fr-FR')}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(file.status)}>
                    {STATUS_LABELS[file.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onFileClick(file)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to={`/etablissements/${file.establishment_id}`}>
                        <Building2 className="h-4 w-4 mr-1" />
                        Établissement
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    in_progress: 'default',
    report_sent: 'secondary',
    archived: 'outline',
  };
  return variants[status] || 'default';
}