import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getGroupingById } from '../api/groupings';
import { Building2, Calendar, MapPin } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { StaticMap } from '../components/static-map';
import { Link } from 'react-router-dom';

const ESTABLISHMENT_TYPES_COLORS = {
  type_l: '#FF6B6B',
  type_m: '#4ECDC4',
  type_n: '#45B7D1',
  type_o: '#96CEB4',
  type_p: '#FFEEAD',
  type_r: '#D4A5A5',
  type_s: '#9FA8DA',
  type_t: '#CE93D8',
  type_u: '#80CBC4',
  type_v: '#A5D6A7',
  type_w: '#FFF59D',
  type_x: '#FFCC80',
  type_y: '#BCAAA4'
};

const ESTABLISHMENT_TYPES_LABELS = {
  type_l: 'Salles de spectacles',
  type_m: 'Magasins',
  type_n: 'Restaurants',
  type_o: 'Hôtels',
  type_p: 'Salles de danse',
  type_r: 'Enseignement',
  type_s: 'Bibliothèques',
  type_t: 'Expositions',
  type_u: 'Sanitaires',
  type_v: 'Culte',
  type_w: 'Bureaux',
  type_x: 'Sports',
  type_y: 'Musées'
};

export function GroupingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: grouping, isLoading } = useQuery({
    queryKey: ['grouping', id],
    queryFn: () => getGroupingById(id!),
  });

  if (isLoading || !grouping) {
    return <div>Chargement...</div>;
  }

  const typeStats = grouping.establishments.reduce((acc, est) => {
    est.types.forEach(type => {
      acc[type] = (acc[type] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(typeStats).map(([type, count]) => ({
    name: ESTABLISHMENT_TYPES_LABELS[type as keyof typeof ESTABLISHMENT_TYPES_LABELS],
    value: count,
    type
  }));

  const upcomingCommissions = grouping.establishments
    .filter(e => e.next_commission_date)
    .sort((a, b) => {
      const dateA = new Date(a.next_commission_date!).getTime();
      const dateB = new Date(b.next_commission_date!).getTime();
      return dateA - dateB;
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{grouping.name}</h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{grouping.city}</span>
            </div>
          </div>
          {grouping.logo_url && (
            <img
              src={grouping.logo_url}
              alt={grouping.name}
              className="h-16 w-16 object-cover rounded"
            />
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Répartition par type</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.type}
                      fill={ESTABLISHMENT_TYPES_COLORS[entry.type as keyof typeof ESTABLISHMENT_TYPES_COLORS]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Prochaines commissions</h2>
          <div className="space-y-4">
            {upcomingCommissions.map((establishment) => (
              <div
                key={establishment.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <div>
                  <Link 
                    to={`/etablissements/${establishment.id}`}
                    className="font-medium hover:text-blue-600 hover:underline"
                  >
                    {establishment.name}
                  </Link>
                  <div className="text-sm text-gray-600">
                    {establishment.types.map(type => ESTABLISHMENT_TYPES_LABELS[type as keyof typeof ESTABLISHMENT_TYPES_LABELS]).join(', ')}
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {new Date(establishment.next_commission_date!).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Localisation</h2>
        <div className="h-[400px] rounded-lg overflow-hidden">
          <StaticMap
            latitude={grouping.latitude || 48.8566}
            longitude={grouping.longitude || 2.3522}
            city={grouping.city}
          />
        </div>
      </div>

      {/* Establishments Grid */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Établissements ({grouping.establishments.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grouping.establishments.map((establishment) => (
            <Link
              key={establishment.id}
              to={`/etablissements/${establishment.id}`}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow hover:border-blue-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium hover:text-blue-600">{establishment.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    Catégorie {establishment.category}
                  </div>
                </div>
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {establishment.types.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                    style={{
                      backgroundColor: `${ESTABLISHMENT_TYPES_COLORS[type as keyof typeof ESTABLISHMENT_TYPES_COLORS]}20`,
                      color: ESTABLISHMENT_TYPES_COLORS[type as keyof typeof ESTABLISHMENT_TYPES_COLORS]
                    }}
                  >
                    {ESTABLISHMENT_TYPES_LABELS[type as keyof typeof ESTABLISHMENT_TYPES_LABELS]}
                  </span>
                ))}
              </div>
              {establishment.next_commission_date && (
                <div className="mt-2 text-sm text-gray-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Prochaine commission : {new Date(establishment.next_commission_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}