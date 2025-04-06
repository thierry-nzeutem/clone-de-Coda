import { useQuery } from '@tanstack/react-query';
import { getGroupings } from '../api/groupings';
import { GroupingCard } from './grouping-card';
import { Building2 } from 'lucide-react';

export function GroupingsList() {
  const { data: groupings, isLoading, error } = useQuery({
    queryKey: ['groupings'],
    queryFn: getGroupings,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des groupements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Une erreur est survenue lors du chargement des groupements.</div>
      </div>
    );
  }

  if (!groupings?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Building2 className="h-12 w-12 mb-4" />
        <div>Aucun groupement trouvé</div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {groupings.map((grouping) => (
        <GroupingCard
          key={grouping.id}
          id={grouping.id}
          name={grouping.name}
          city={grouping.city}
          logoUrl={grouping.logo_url}
          establishments={grouping.establishments}
        />
      ))}
    </div>
  );
}