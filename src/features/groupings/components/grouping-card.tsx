import { Link } from 'react-router-dom';
import { Building2, Calendar, MapPin } from 'lucide-react';

interface GroupingCardProps {
  id: string;
  name: string;
  city: string;
  logoUrl: string | null;
  establishments: {
    id: string;
    name: string;
    types: string[];
    category: string;
    next_commission_date: string | null;
  }[];
}

export function GroupingCard({ id, name, city, logoUrl, establishments }: GroupingCardProps) {
  const nextCommissionDate = establishments
    .map(e => e.next_commission_date)
    .filter(Boolean)
    .sort()[0];

  return (
    <Link
      to={`/groupements/${id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <div className="relative h-40 rounded-t-lg bg-gray-100">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={name}
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="h-16 w-16 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{city}</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between text-sm">
            <div>
              <span className="font-medium">{establishments.length}</span>
              <span className="text-gray-600 ml-1">établissements</span>
            </div>
            {nextCommissionDate && (
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {new Date(nextCommissionDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}