import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { Visit } from '../types';
import { Badge } from '@/components/ui/badge';

interface VisitCalendarProps {
  visits: Visit[];
  onVisitClick: (visit: Visit) => void;
}

export function VisitCalendar({ visits, onVisitClick }: VisitCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Helper function to format a date to YYYY-MM-DD string
  const formatDateToYMD = (date: Date) => {
    return date.toLocaleDateString('fr-CA'); // fr-CA locale gives YYYY-MM-DD format
  };

  // Helper function to convert a date string to local date without time
  const toLocalDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // Group visits by date using YYYY-MM-DD format
  const visitsByDate = visits.reduce((acc, visit) => {
    // Convert the visit date to local date string
    const localDate = toLocalDate(visit.scheduled_date);
    const dateStr = formatDateToYMD(localDate);
    
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(visit);
    return acc;
  }, {} as Record<string, Visit[]>);

  // Helper function to check if a date has visits
  const hasVisitsOnDate = (date: Date) => {
    const dateStr = formatDateToYMD(date);
    return !!visitsByDate[dateStr];
  };

  // Helper function to get visits for a date
  const getVisitsForDate = (date: Date | undefined) => {
    if (!date) return [];
    const dateStr = formatDateToYMD(date);
    return visitsByDate[dateStr] || [];
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
        modifiers={{
          hasVisit: hasVisitsOnDate,
        }}
        modifiersClassNames={{
          hasVisit: 'bg-blue-100 font-bold text-blue-900',
        }}
      />

      <div className="mt-6">
        <h3 className="font-semibold mb-4">
          {selectedDate && new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(selectedDate)}
        </h3>
        <div className="space-y-4">
          {selectedDate && getVisitsForDate(selectedDate).map((visit) => (
            <div
              key={visit.id}
              className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => onVisitClick(visit)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{visit.establishments?.name}</div>
                  <div className="text-sm text-gray-600">{visit.establishments?.address}</div>
                </div>
                <Badge variant={getVisitTypeBadgeVariant(visit.visit_type)}>
                  {getVisitTypeLabel(visit.visit_type)}
                </Badge>
              </div>
              {visit.consultant && (
                <div className="mt-2 text-sm text-gray-600">
                  Consultant: {visit.consultant.full_name}
                </div>
              )}
              {visit.notes && (
                <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                  {visit.notes}
                </div>
              )}
            </div>
          ))}
          {selectedDate && getVisitsForDate(selectedDate).length === 0 && (
            <div className="text-center text-gray-500 py-4">
              Aucune visite prévue pour cette date
            </div>
          )}
        </div>
      </div>
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