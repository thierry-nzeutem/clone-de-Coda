import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCommissions } from '../api/commissions';
import { CommissionsTable } from '../components/commissions-table';
import { CreateCommissionDialog } from '../components/create-commission-dialog';
import { CommissionFilters, filterCommissions, CommissionFilters as FilterType } from '../components/commission-filters';
import { SafetyCommission } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Calendar, FileText, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CommissionsPage() {
  const [selectedCommission, setSelectedCommission] = useState<SafetyCommission | null>(null);
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    type: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const { data: commissions = [], isLoading } = useQuery({
    queryKey: ['commissions'],
    queryFn: getCommissions,
  });

  const filteredCommissions = filterCommissions(commissions, filters);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Commissions de sécurité</h1>
        <CreateCommissionDialog />
      </div>

      <CommissionFilters onFilterChange={setFilters} />

      <CommissionsTable
        commissions={filteredCommissions}
        onCommissionClick={setSelectedCommission}
      />

      <Dialog open={!!selectedCommission} onOpenChange={() => setSelectedCommission(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails de la commission</DialogTitle>
          </DialogHeader>
          {selectedCommission && (
            <div className="space-y-4">
              <div>
                <Badge variant={getCommissionTypeBadgeVariant(selectedCommission.type)}>
                  {getCommissionTypeLabel(selectedCommission.type)}
                </Badge>
                <Badge 
                  variant={getCommissionStatusBadgeVariant(selectedCommission.status)}
                  className="ml-2"
                >
                  {getCommissionStatusLabel(selectedCommission.status)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {selectedCommission.establishments?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedCommission.establishments?.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    {new Date(selectedCommission.commission_date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                {selectedCommission.responsible && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>{selectedCommission.responsible.full_name}</div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    PV {selectedCommission.minutes_received ? 'reçu' : 'en attente'}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" asChild>
                  <Link to={`/etablissements/${selectedCommission.establishment_id}`}>
                    <Building2 className="h-4 w-4 mr-1" />
                    Voir l'établissement
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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