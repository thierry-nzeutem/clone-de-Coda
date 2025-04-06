import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPrescriptions } from '../api/prescriptions';
import { PrescriptionsTable } from '../components/prescriptions-table';
import { CreatePrescriptionDialog } from '../components/create-prescription-dialog';
import { PrescriptionFilters, filterPrescriptions, PrescriptionFilters as FilterType } from '../components/prescriptions-filters';
import { Prescription } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Calendar, FileText, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PrescriptionsPage() {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    status: 'all',
    startDate: '',
    endDate: '',
  });

  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: getPrescriptions,
  });

  const filteredPrescriptions = filterPrescriptions(prescriptions, filters);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <CreatePrescriptionDialog />
      </div>

      <PrescriptionFilters onFilterChange={setFilters} />

      <PrescriptionsTable
        prescriptions={filteredPrescriptions}
        onPrescriptionClick={setSelectedPrescription}
      />

      <Dialog open={!!selectedPrescription} onOpenChange={() => setSelectedPrescription(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails de la prescription</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div>
                <Badge variant={getPrescriptionStatusBadgeVariant(selectedPrescription.status)}>
                  {getPrescriptionStatusLabel(selectedPrescription.status)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {selectedPrescription.establishments?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedPrescription.establishments?.address}
                    </div>
                  </div>
                </div>

                {selectedPrescription.due_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      Échéance : {new Date(selectedPrescription.due_date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-600">Description :</div>
                  <div className="mt-1 text-sm">{selectedPrescription.description}</div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-1" />
                  Ajouter un document
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/etablissements/${selectedPrescription.establishment_id}`}>
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