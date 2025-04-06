import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEstablishmentById } from '../api/establishments';
import { Building2, Calendar, Edit2 } from 'lucide-react';
import { ContactsList } from '../components/contacts-list';
import { TasksList } from '../components/tasks-list';
import { PrescriptionsList } from '../components/prescriptions-list';
import { VerificationsList } from '../components/verifications-list';
import { VisitsList } from '../components/visits-list';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EstablishmentInfoCard } from '../components/establishment-info-card';
import { useState } from 'react';

export function EstablishmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: establishment, isLoading: establishmentLoading } = useQuery({
    queryKey: ['establishment', id],
    queryFn: () => getEstablishmentById(id!),
  });

  if (establishmentLoading || !establishment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des détails...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{establishment.name}</h1>
          <p className="text-gray-600">{establishment.address}</p>
          <div className="flex gap-2 mt-2">
            {establishment.types.map((type) => (
              <span
                key={type}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setEditMode(!editMode)}
          className="flex items-center gap-2"
        >
          {editMode ? (
            <>
              <Calendar className="h-4 w-4" />
              Annuler
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4" />
              Mode édition
            </>
          )}
        </Button>
      </div>

      <EstablishmentInfoCard
        establishment={establishment}
        editMode={editMode}
        onEditCancel={() => setEditMode(false)}
      />

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="tasks">Tâches</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="visits">Visites</TabsTrigger>
          <TabsTrigger value="verifications">Vérifications</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="files">Dossiers réglementaires</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Overview content */}
        </TabsContent>

        <TabsContent value="contacts">
          <ContactsList establishmentId={id!} />
        </TabsContent>

        <TabsContent value="tasks">
          <TasksList establishmentId={id!} />
        </TabsContent>

        <TabsContent value="prescriptions">
          <PrescriptionsList establishmentId={id!} />
        </TabsContent>

        <TabsContent value="visits">
          <VisitsList establishmentId={id!} />
        </TabsContent>

        <TabsContent value="verifications">
          <VerificationsList establishmentId={id!} />
        </TabsContent>

        <TabsContent value="commissions">
          {/* Commissions content */}
        </TabsContent>

        <TabsContent value="files">
          {/* Files content */}
        </TabsContent>
      </Tabs>
    </div>
  );
}