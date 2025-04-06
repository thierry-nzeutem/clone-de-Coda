import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Visit } from '../types';
import { Building2, Calendar, FileText, FilePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VisitsTableProps {
  visits: Visit[];
  onVisitClick: (visit: Visit) => void;
}

export function VisitsTable({ visits, onVisitClick }: VisitsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Établissement</TableHead>
            <TableHead>Consultant</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visits.map((visit) => (
            <TableRow key={visit.id}>
              <TableCell>
                {new Date(visit.scheduled_date).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell>
                <Badge variant={getVisitTypeBadgeVariant(visit.visit_type)}>
                  {getVisitTypeLabel(visit.visit_type)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">{visit.establishments?.name}</div>
                <div className="text-sm text-gray-600">{visit.establishments?.address}</div>
              </TableCell>
              <TableCell>{visit.consultant?.full_name || '-'}</TableCell>
              <TableCell>
                <div className="max-w-xs truncate">{visit.notes || '-'}</div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onVisitClick(visit)}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to={`/etablissements/${visit.establishment_id}`}>
                      <Building2 className="h-4 w-4 mr-1" />
                      Établissement
                    </Link>
                  </Button>
                  {visit.report_url ? (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={visit.report_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-1" />
                        Rapport
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to={`/visites/${visit.id}/rapport/${visit.establishment_id}`}>
                        <FilePlus className="h-4 w-4 mr-1" />
                        Générer rapport
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

function getVisitTypeLabel(type: string) {
  const labels: Record<string, string> = {
    commission: 'Commission',
    first_visit: '1ère visite',
    second_visit: '2ème visite',
    reminder: 'Rappel',
  };
  return labels[type] || type;
}

function getVisitTypeBadgeVariant(type: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    commission: 'destructive',
    first_visit: 'default',
    second_visit: 'secondary',
    reminder: 'outline',
  };
  return variants[type] || 'default';
}