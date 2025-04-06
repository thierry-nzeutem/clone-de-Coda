import { MapPin } from 'lucide-react';

interface StaticMapProps {
  latitude: number;
  longitude: number;
  city: string;
}

export function StaticMap({ latitude, longitude, city }: StaticMapProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
      <div className="text-center p-6">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{city}</h3>
        <p className="text-sm text-gray-600">
          {latitude.toFixed(6)}°, {longitude.toFixed(6)}°
        </p>
      </div>
    </div>
  );
}