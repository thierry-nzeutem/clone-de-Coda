import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RegulatoryFileStatus, RegulatoryFile, STATUS_LABELS } from "../types";

interface RegulatoryFilesFiltersProps {
  onFilterChange: (filters: RegulatoryFilesFilters) => void;
}

export interface RegulatoryFilesFilters {
  search: string;
  status: RegulatoryFileStatus | 'all';
  startDate: string;
  endDate: string;
}

export function RegulatoryFilesFilters({ onFilterChange }: RegulatoryFilesFiltersProps) {
  const handleFilterChange = (key: keyof RegulatoryFilesFilters, value: string) => {
    onFilterChange((prev: RegulatoryFilesFilters) => ({
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
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
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

export function filterRegulatoryFiles(
  files: RegulatoryFile[],
  filters: RegulatoryFilesFilters
): RegulatoryFile[] {
  return files.filter((file) => {
    const matchesSearch =
      !filters.search ||
      file.file_number.toLowerCase().includes(filters.search.toLowerCase()) ||
      file.establishments?.name.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === 'all' || file.status === filters.status;

    const submissionDate = new Date(file.submission_date);
    const matchesStartDate = !filters.startDate || submissionDate >= new Date(filters.startDate);
    const matchesEndDate = !filters.endDate || submissionDate <= new Date(filters.endDate);

    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });
}