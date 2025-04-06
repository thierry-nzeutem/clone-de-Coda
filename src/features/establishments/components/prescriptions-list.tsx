import { useQuery } from '@tanstack/react-query';
import { getCommissionsByEstablishment } from '@/features/commissions/api/commissions';
import { getAccessibilityCommissionsByEstablishment } from '@/features/commissions/api/accessibility-commissions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PRESCRIPTION_STATUS_LABELS } from '@/features/commissions/types';
import { AlertCircle, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PrescriptionsListProps {
  establishmentId: string;
}

const statusIcons = {
  to_correct: AlertCircle,
  corrected: CheckCircle2,
  not_applicable: Circle,
};

export function PrescriptionsList({ establishmentId }: PrescriptionsListProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [groupByCommission, setGroupByCommission] = useState(true);
  const [expandedCommissions, setExpandedCommissions] = useState<Set<string>>(new Set());

  const { data: safetyCommissions = [], isLoading: safetyLoading } = useQuery({
    queryKey: ['commissions', establishmentId],
    queryFn: () => getCommissionsByEstablishment(establishmentId),
  });

  const { data: accessibilityCommissions = [], isLoading: accessibilityLoading } = useQuery({
    queryKey: ['accessibilityCommissions', establishmentId],
    queryFn: () => getAccessibilityCommissionsByEstablishment(establishmentId),
  });

  if (safetyLoading || accessibilityLoading) {
    return <div className="text-sm text-gray-600">Chargement des prescriptions...</div>;
  }

  const toggleCommission = (commissionId: string) => {
    const newExpanded = new Set(expandedCommissions);
    if (newExpanded.has(commissionId)) {
      newExpanded.delete(commissionId);
    } else {
      newExpanded.add(commissionId);
    }
    setExpandedCommissions(newExpanded);
  };

  const allPrescriptions = [...safetyCommissions, ...accessibilityCommissions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(commission => ({
      ...commission,
      prescriptions: (commission.prescriptions || [])
        .filter(prescription => selectedStatus === 'all' || prescription.status === selectedStatus)
        .map(prescription => ({
          ...prescription,
          commission: {
            id: commission.id,
            date: commission.date,
            type: commission.commission_type === 'accessibility' ? 'Accessibilité' : 'Sécurité',
          },
        }))
    }))
    .filter(commission => commission.prescriptions.length > 0);

  const flatPrescriptions = allPrescriptions
    .flatMap(commission => commission.prescriptions)
    .sort((a, b) => new Date(b.commission.date).getTime() - new Date(a.commission.date).getTime());

  if ((!groupByCommission && flatPrescriptions.length === 0) || 
      (groupByCommission && allPrescriptions.length === 0)) {
    return (
      <div className="text-sm text-gray-600">
        Aucune prescription pour cet établissement.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="to_correct">À corriger</SelectItem>
                <SelectItem value="corrected">Corrigées</SelectItem>
                <SelectItem value="not_applicable">Non applicable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="group-by-commission"
              checked={groupByCommission}
              onCheckedChange={setGroupByCommission}
            />
            <Label htmlFor="group-by-commission">Grouper par commission</Label>
          </div>
        </div>
      </div>

      {groupByCommission ? (
        <div className="space-y-4">
          {allPrescriptions.map((commission) => (
            <Card key={commission.id} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggleCommission(commission.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {expandedCommissions.has(commission.id) ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                    <div>
                      <div className="font-medium">
                        Commission du {new Date(commission.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {commission.prescriptions.length} prescription{commission.prescriptions.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {commission.commission_type === 'accessibility' ? 'Accessibilité' : 'Sécurité'}
                  </Badge>
                </div>
              </CardHeader>
              {expandedCommissions.has(commission.id) && (
                <CardContent className="divide-y">
                  {commission.prescriptions.map((prescription) => {
                    const StatusIcon = statusIcons[prescription.status];
                    return (
                      <div key={prescription.id} className="py-4 first:pt-2 last:pb-2">
                        <div className="flex items-start gap-3">
                          <StatusIcon className={`h-5 w-5 mt-0.5 ${getStatusIconColor(prescription.status)}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">Prescription n°{prescription.number}</div>
                              <Badge variant={getPrescriptionStatusVariant(prescription.status)}>
                                {PRESCRIPTION_STATUS_LABELS[prescription.status]}
                              </Badge>
                            </div>
                            <div className="text-sm mt-1">{prescription.description}</div>
                            <div className="text-sm text-gray-500 mt-1">Référence : {prescription.reference}</div>
                            {prescription.comment && (
                              <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                                {prescription.comment}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {flatPrescriptions.map((prescription) => {
            const StatusIcon = statusIcons[prescription.status];
            return (
              <Card key={prescription.id}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <StatusIcon className={`h-5 w-5 mt-0.5 ${getStatusIconColor(prescription.status)}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Prescription n°{prescription.number}</div>
                          <div className="text-sm text-gray-500">
                            Commission {prescription.commission.type} du{' '}
                            {new Date(prescription.commission.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <Badge variant={getPrescriptionStatusVariant(prescription.status)}>
                          {PRESCRIPTION_STATUS_LABELS[prescription.status]}
                        </Badge>
                      </div>
                      <div className="text-sm mt-1">{prescription.description}</div>
                      <div className="text-sm text-gray-500 mt-1">Référence : {prescription.reference}</div>
                      {prescription.comment && (
                        <div className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                          {prescription.comment}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getPrescriptionStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    corrected: 'secondary',
    to_correct: 'destructive',
    not_applicable: 'outline',
  };
  return variants[status] || 'default';
}

function getStatusIconColor(status: string): string {
  const colors: Record<string, string> = {
    corrected: 'text-green-500',
    to_correct: 'text-red-500',
    not_applicable: 'text-gray-400',
  };
  return colors[status] || 'text-gray-400';
}