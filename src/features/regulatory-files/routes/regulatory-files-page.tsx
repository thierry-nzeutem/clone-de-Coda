import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRegulatoryFiles } from '../api/regulatory-files';
import { RegulatoryFilesTable } from '../components/regulatory-files-table';
import { CreateRegulatoryFileDialog } from '../components/create-regulatory-file-dialog';
import { RegulatoryFilesFilters, filterRegulatoryFiles, RegulatoryFilesFilters as FilterType } from '../components/regulatory-files-filters';
import { RegulatoryFile, STATUS_LABELS } from '../types';
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

export function RegulatoryFilesPage() {
  const [selectedFile, setSelectedFile] = useState<RegulatoryFile | null>(null);
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    status: 'all',
    startDate: '',
    endDate: '',
  });

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['regulatory_files'],
    queryFn: getRegulatoryFiles,
  });

  const filteredFiles = filterRegulatoryFiles(files, filters);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dossiers réglementaires</h1>
        <CreateRegulatoryFileDialog />
      </div>

      <RegulatoryFilesFilters onFilterChange={setFilters} />

      <RegulatoryFilesTable
        files={filteredFiles}
        onFileClick={setSelectedFile}
      />

      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails du dossier</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{selectedFile.file_number}</div>
                <Badge variant={getStatusBadgeVariant(selectedFile.status)}>
                  {STATUS_LABELS[selectedFile.status]}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {selectedFile.establishments?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedFile.establishments?.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <div>
                      Dépôt : {new Date(selectedFile.submission_date).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      Butoir : {new Date(selectedFile.deadline_date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                {selectedFile.notes && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-600">Remarques :</div>
                    <div className="mt-1 text-sm">{selectedFile.notes}</div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-1" />
                  Ajouter une pièce
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/etablissements/${selectedFile.establishment_id}`}>
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
    in_progress: 'default',
    report_sent: 'secondary',
    archived: 'outline',
  };
  return variants[status] || 'default';
}