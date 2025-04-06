import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VisitReportForm } from '../components/visit-report-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function VisitReportPage() {
  const { id, establishmentId } = useParams<{ id: string, establishmentId: string }>();
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    // Navigate back to the visit details or establishment page
    if (establishmentId) {
      navigate(`/etablissements/${establishmentId}`);
    } else {
      navigate('/visites');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Générer un rapport de visite</h1>
        </div>
      </div>
      
      <VisitReportForm 
        visitId={id} 
        establishmentId={establishmentId} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
}