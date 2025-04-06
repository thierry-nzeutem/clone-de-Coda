import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TechnicalInstallation } from "../types";

interface InstallationsTableProps {
  installations: TechnicalInstallation[];
}

export function InstallationsTable({ installations }: InstallationsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type de réglementation</TableHead>
            <TableHead>Périodicité (mois)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {installations.map((installation) => (
            <TableRow key={installation.id}>
              <TableCell className="font-medium">
                {installation.name}
              </TableCell>
              <TableCell>
                {installation.regulation_type === 'erp' ? 'ERP' : 'Code du Travail'}
              </TableCell>
              <TableCell>
                {installation.verification_period_months}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}