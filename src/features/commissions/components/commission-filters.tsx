import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommissionType, CommissionStatus, SafetyCommission } from "../types";

interface CommissionFiltersProps {
  onFilterChange: (filters: CommissionFilters) => void;
}

export interface CommissionFilters {
  search: string;
  type: CommissionType | 'all';
  status: CommissionStatus | 'all';
  startDate: string;
  endDate: string;
}

const commissionTypes: { value: CommissionType; label: string }[] = [
  { value: 'periodic', label: 'Périodique' },
  { value: 'work_reception', label: 'Réception de travaux' },
  { value: 'opening', label: "Ouverture d'établissement" },
  { value: 'exceptional', label: 'Exceptionnelle' },
];

const commissionStatuses: { value: CommissionStatus; label: string }[] = [
  { value: 'in_progress', label: 'En cours' },
  { value: 'report_sent', label: 'PV reçu' },
  { value: 'archived', label: 'Archivé' },
];

export function CommissionFilters({ onFilterChange }: CommissionFiltersProps) {
  const handleFilterChange = (key: keyof CommissionFilters, value: string) => {
    onFilterChange((prev: CommissionFilters) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <Input
            placeholder="Rechercher..."
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div>
          <Select onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Type de commission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {commissionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {commissionStatuses.map((status) => (
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
          />
        </div>

        <div>
          <Input
            type="date"
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export function filterCommissions(
  commissions: SafetyCommission[],
  filters: CommissionFilters
): SafetyCommission[] {
  return commissions.filter((commission) => {
    const matchesSearch =
      !filters.search ||
      commission.establishments?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      commission.responsible?.full_name.toLowerCase().includes(filters.search.toLowerCase());

    const matchesType = filters.type === 'all' || commission.type === filters.type;
    const matchesStatus = filters.status === 'all' || commission.status === filters.status;

    const commissionDate = new Date(commission.commission_date);
    const matchesStartDate = !filters.startDate || commissionDate >= new Date(filters.startDate);
    const matchesEndDate = !filters.endDate || commissionDate <= new Date(filters.endDate);

    return matchesSearch && matchesType && matchesStatus && matchesStartDate && matchesEndDate;
  });
}