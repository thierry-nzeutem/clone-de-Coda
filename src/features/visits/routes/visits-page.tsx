import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVisits } from '../api/visits';
import { VisitsTable } from '../components/visits-table';
import { VisitCalendar } from '../components/visit-calendar';
import { CreateVisitDialog } from '../components/create-visit-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, Calendar, FileText } from 'lucide-react';

export function VisitsPage() {
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const { data: visits = [], isLoading } = useQuery({
    queryKey: ['visits'],
    queryFn: getVisits,
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Visites</h1>
        <CreateVisitDialog />
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Vue calendrier</TabsTrigger>
          <TabsTrigger value="table">Vue tableau</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <VisitCalendar visits={visits} onVisitClick={setSelectedVisit} />
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <VisitsTable visits={visits} onVisitClick={setSelectedVisit} />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedVisit} onOpenChange={() => setSelectedVisit(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails de la visite</DialogTitle>
          </DialogHeader>
          {selectedVisit && (
            <div className="space-y-4">
              <div>
                <Badge variant={getVisitTypeBadgeVariant(selectedVisit.visit_type)}>
                  {getVisitTypeLabel(selectedVisit.visit_type)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">{selectedVisit.establishments?.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedVisit.establishments?.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    {new Date(selectedVisit.scheduled_date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                {selectedVisit.consultant && (
                  <div className="text-sm">
                    <span className="text-gray-600">Consultant:</span>{' '}
                    {selectedVisit.consultant.full_name}
                  </div>
                )}

                {selectedVisit.notes && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-600">Notes:</div>
                    <div className="text-sm mt-1">{selectedVisit.notes}</div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" asChild>
                  <Link to={`/etablissements/${selectedVisit.establishment_id}`}>
                    <FileText className="h-4 w-4 mr-1" />
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