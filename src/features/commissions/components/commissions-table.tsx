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
import { SafetyCommission } from "../types";
import { Building2, FileText, CheckCircle, Archive } from "lucide-react";
import { Link } from "react-router-dom";

interface CommissionsTableProps {
  commissions: SafetyCommission[];
  onCommissionClick: (commission: SafetyCommission) => void;
}

export function CommissionsTable({ commissions, onCommissionClick }: CommissionsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Établissement</TableHead>
            <TableHead>Responsable</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>PV</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commissions.map((commission) => (
            <TableRow key={commission.id}>
              <TableCell>
                {new Date(commission.commission_date).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell>
                <Badge variant={getCommissionTypeBadgeVariant(commission.type)}>
                  {getCommissionTypeLabel(commission.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">{commission.establishments?.name}</div>
                <div className="text-sm text-gray-600">
                  {commission.establishments?.address}
                </div>
              </TableCell>
              <TableCell>{commission.responsible?.full_name || '-'}</TableCell>
              <TableCell>
                <Badge variant={getCommissionStatusBadgeVariant(commission.status)}>
                  {getCommissionStatusLabel(commission.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {commission.minutes_received ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCommissionClick(commission)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to={`/etablissements/${commission.establishment_id}`}>
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

function getCommissionTypeLabel(type: string) {
  const labels: Record<string, string> = {
    periodic: 'Périodique',
    work_reception: 'Réception travaux',
    opening: 'Ouverture',
    exceptional: 'Exceptionnelle',
  };
  return labels[type] || type;
}

function getCommissionTypeBadgeVariant(type: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    periodic: 'default',
    work_reception: 'secondary',
    opening: 'destructive',
    exceptional: 'outline',
  };
  return variants[type] || 'default';
}

function getCommissionStatusLabel(status: string) {
  const labels: Record<string, string> = {
    in_progress: 'En cours',
    report_sent: 'PV reçu',
    archived: 'Archivé',
  };
  return labels[status] || status;
}

function getCommissionStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    in_progress: 'default',
    report_sent: 'secondary',
    archived: 'outline',
  };
  return variants[status] || 'default';
}