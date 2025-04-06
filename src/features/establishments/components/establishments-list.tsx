import { useQuery } from '@tanstack/react-query';
import { getEstablishments } from '../api/establishments';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EstablishmentsList() {
  const { data: establishments, isLoading, error } = useQuery({
    queryKey: ['establishments'],
    queryFn: getEstablishments,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des établissements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Une erreur est survenue lors du chargement des établissements.</div>
      </div>
    );
  }

  if (!establishments?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Building2 className="h-12 w-12 mb-4" />
        <div>Aucun établissement trouvé</div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {establishments.map((establishment) => (
        <Link
          key={establishment.id}
          to={`/etablissements/${establishment.id}`}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2">{establishment.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{establishment.address}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {establishment.types.map((type) => (
              <span
                key={type}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {type}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            <div>Catégorie: {establishment.category}</div>
            <div>Périodicité des visites: {establishment.visit_periodicity} mois</div>
          </div>
        </Link>
      ))}
    </div>
  );
}