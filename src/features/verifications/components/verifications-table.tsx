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
import { Verification, STATUS_LABELS } from "../types";
import { Building2, Calendar, FileText, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface VerificationsTableProps {
  verifications: Verification[];
  onVerificationClick: (verification: Verification) => void;
}

export function VerificationsTable({ verifications, onVerificationClick }: VerificationsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Installation</TableHead>
            <TableHead>Établissement</TableHead>
            <TableHead>Dernière vérification</TableHead>
            <TableHead>Prochaine vérification</TableHead>
            <TableHead>Prestataire</TableHead>
            <TableHead>État</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {verifications.map((verification) => {
            const isOverdue = new Date(verification.next_verification_date) < new Date();
            const isUpcoming = new Date(verification.next_verification_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            return (
              <TableRow key={verification.id}>
                <TableCell>
                  <div className="font-medium">{verification.installation?.name}</div>
                  <div className="text-sm text-gray-600">
                    {verification.installation?.regulation_type === 'erp' ? 'ERP' : 'Code du Travail'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{verification.establishments?.name}</div>
                  <div className="text-sm text-gray-600">
                    {verification.establishments?.address}
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(verification.verification_date).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {new Date(verification.next_verification_date).toLocaleDateString('fr-FR')}
                    {isOverdue && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                    {!isOverdue && isUpcoming && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{verification.provider_name}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(verification.status)}>
                    {STATUS_LABELS[verification.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onVerificationClick(verification)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to={`/etablissements/${verification.establishment_id}`}>
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
    compliant: 'secondary',
    non_compliant: 'destructive',
    pending: 'outline',
  };
  return variants[status] || 'default';
}