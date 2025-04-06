import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrescriptionStatus, Prescription } from "../types";

interface PrescriptionFiltersProps {
  onFilterChange: (filters: PrescriptionFilters) => void;
}

export interface PrescriptionFilters {
  search: string;
  status: PrescriptionStatus | 'all';
  startDate: string;
  endDate: string;
}

const prescriptionStatuses: { value: PrescriptionStatus; label: string }[] = [
  { value: 'todo', label: 'À faire' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'done', label: 'Fait' },
  { value: 'not_applicable', label: 'Non applicable' },
];

export function PrescriptionFilters({ onFilterChange }: PrescriptionFiltersProps) {
  const handleFilterChange = (key: keyof PrescriptionFilters, value: string) => {
    onFilterChange((prev: PrescriptionFilters) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Input
            placeholder="Rechercher..."
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div>
          <Select onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {prescriptionStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Input
            type="date"
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            placeholder="Date début"
          />
        </div>

        <div>
          <Input
            type="date"
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            placeholder="Date fin"
          />
        </div>
      </div>
    </div>
  );
}

export function filterPrescriptions(
  prescriptions: Prescription[],
  filters: PrescriptionFilters
): Prescription[] {
  return prescriptions.filter((prescription) => {
    const matchesSearch =
      !filters.search ||
      prescription.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      prescription.establishments?.name.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === 'all' || prescription.status === filters.status;

    const dueDate = prescription.due_date ? new Date(prescription.due_date) : null;
    const matchesStartDate = !filters.startDate || !dueDate || dueDate >= new Date(filters.startDate);
    const matchesEndDate = !filters.endDate || !dueDate || dueDate <= new Date(filters.endDate);

    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });
}