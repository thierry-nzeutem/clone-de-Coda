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
import { Prescription } from "../types";
import { Building2, Calendar, FileText, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface PrescriptionsTableProps {
  prescriptions: Prescription[];
  onPrescriptionClick: (prescription: Prescription) => void;
}

export function PrescriptionsTable({ prescriptions, onPrescriptionClick }: PrescriptionsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Établissement</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Échéance</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.map((prescription) => (
            <TableRow key={prescription.id}>
              <TableCell>
                <div className="font-medium">{prescription.establishments?.name}</div>
                <div className="text-sm text-gray-600">
                  {prescription.establishments?.address}
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-md truncate">{prescription.description}</div>
              </TableCell>
              <TableCell>
                {prescription.due_date ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    {new Date(prescription.due_date).toLocaleDateString('fr-FR')}
                  </div>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getPrescriptionStatusBadgeVariant(prescription.status)}>
                  {getPrescriptionStatusLabel(prescription.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {prescription.commission_id ? (
                  <div className="text-sm">
                    Commission du{' '}
                    {new Date(prescription.commission?.commission_date || '').toLocaleDateString('fr-FR')}
                  </div>
                ) : (
                  <div className="text-sm">Visite interne</div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPrescriptionClick(prescription)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to={`/etablissements/${prescription.establishment_id}`}>
                      <Building2 className="h-4 w-4 mr-1" />
                      Établissement
                    </Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getPrescriptionStatusLabel(status: string) {
  const labels: Record<string, string> = {
    todo: 'À faire',
    in_progress: 'En cours',
    done: 'Fait',
    not_applicable: 'Non applicable',
  };
  return labels[status] || status;
}

function getPrescriptionStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    todo: 'destructive',
    in_progress: 'default',
    done: 'secondary',
    not_applicable: 'outline',
  };
  return variants[status] || 'default';
}