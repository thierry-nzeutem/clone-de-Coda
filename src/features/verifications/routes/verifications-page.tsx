import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVerifications, getTechnicalInstallations } from '../api/verifications';
import { VerificationsTable } from '../components/verifications-table';
import { InstallationsTable } from '../components/installations-table';
import { CreateVerificationDialog } from '../components/create-verification-dialog';
import { CreateInstallationDialog } from '../components/create-installation-dialog';
import { Verification, STATUS_LABELS } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

export function VerificationsPage() {
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);

  const { data: verifications = [], isLoading: verificationsLoading } = useQuery({
    queryKey: ['verifications'],
    queryFn: getVerifications,
  });

  const { data: installations = [], isLoading: installationsLoading } = useQuery({
    queryKey: ['technical_installations'],
    queryFn: getTechnicalInstallations,
  });

  if (verificationsLoading || installationsLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="verifications" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="verifications">Vérifications</TabsTrigger>
            <TabsTrigger value="installations">Installations techniques</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <CreateVerificationDialog />
            <CreateInstallationDialog />
          </div>
        </div>

        <TabsContent value="verifications" className="space-y-4">
          <VerificationsTable
            verifications={verifications}
            onVerificationClick={setSelectedVerification}
          />
        </TabsContent>

        <TabsContent value="installations" className="space-y-4">
          <InstallationsTable installations={installations} />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedVerification} onOpenChange={() => setSelectedVerification(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails de la vérification</DialogTitle>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-4">
              <div>
                <Badge variant={getStatusBadgeVariant(selectedVerification.status)}>
                  {STATUS_LABELS[selectedVerification.status]}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {selectedVerification.establishments?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedVerification.establishments?.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <div>
                      Dernière vérification : {new Date(selectedVerification.verification_date).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      Prochaine vérification : {new Date(selectedVerification.next_verification_date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                {selectedVerification.observations && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-600">Observations :</div>
                    <div className="mt-1 text-sm">{selectedVerification.observations}</div>
                  </div>
                )}

                {selectedVerification.report_url && (
                  <div className="mt-4">
                    <a
                      href={selectedVerification.report_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Voir le rapport
                    </a>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-1" />
                  Ajouter un rapport
                </Button>
                <Button variant="outline" asChild>
                  <Link 
                    to={`/etablissements/${selectedVerification.establishment_id}`}
                    className="flex items-center"
                  >
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

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    compliant: 'secondary',
    non_compliant: 'destructive',
    pending: 'outline',
  };
  return variants[status] || 'default';
}