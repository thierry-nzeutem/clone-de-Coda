import React from 'react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVerificationsByEstablishment, updateVerification, uploadVerificationReport } from '@/features/verifications/api/verifications';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Clock, FileText, Upload } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface VerificationsListProps {
  establishmentId: string;
}

const STATUS_LABELS = {
  compliant: 'Conforme',
  non_compliant: 'Non conforme',
  pending: 'En attente',
};

const editVerificationSchema = z.object({
  verification_date: z.string().min(1, "La date est requise"),
  next_verification_date: z.string().min(1, "La date est requise"),
  provider_name: z.string().min(1, "Le prestataire est requis"),
  status: z.string().min(1, "Le statut est requis"),
  observations: z.string().optional(),
});

type EditVerificationForm = z.infer<typeof editVerificationSchema>;

export function VerificationsList({ establishmentId }: VerificationsListProps) {
  const [selectedVerification, setSelectedVerification] = useState<any | null>(null);
  const queryClient = useQueryClient();

  const { data: verifications = [], isLoading } = useQuery({
    queryKey: ['verifications', establishmentId],
    queryFn: () => getVerificationsByEstablishment(establishmentId),
  });

  const form = useForm<EditVerificationForm>({
    resolver: zodResolver(editVerificationSchema),
  });

  const updateVerificationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EditVerificationForm> }) => 
      updateVerification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications', establishmentId] });
      setSelectedVerification(null);
    },
  });

  const uploadReportMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!selectedVerification) return;
      const reportUrl = await uploadVerificationReport(file);
      return updateVerification(selectedVerification.id, { report_url: reportUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications', establishmentId] });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadReportMutation.mutate(file);
    }
  };

  const onSubmit = (data: EditVerificationForm) => {
    if (selectedVerification) {
      updateVerificationMutation.mutate({
        id: selectedVerification.id,
        data,
      });
    }
  };

  React.useEffect(() => {
    if (selectedVerification) {
      form.reset({
        verification_date: selectedVerification.verification_date,
        next_verification_date: selectedVerification.next_verification_date,
        provider_name: selectedVerification.provider_name,
        status: selectedVerification.status,
        observations: selectedVerification.observations || '',
      });
    }
  }, [selectedVerification, form]);

  if (isLoading) {
    return <div className="text-sm text-gray-600">Chargement des vérifications...</div>;
  }

  if (!verifications.length) {
    return (
      <div className="text-sm text-gray-600">
        Aucune vérification pour cet établissement.
      </div>
    );
  }

  // Sort verifications by next verification date
  const sortedVerifications = [...verifications].sort(
    (a, b) => new Date(a.next_verification_date).getTime() - new Date(b.next_verification_date).getTime()
  );

  return (
    <>
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Installation</TableHead>
              <TableHead>Dernière vérification</TableHead>
              <TableHead>Prochaine vérification</TableHead>
              <TableHead>Prestataire</TableHead>
              <TableHead>État</TableHead>
              <TableHead>Rapport</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedVerifications.map((verification) => {
              const isOverdue = new Date(verification.next_verification_date) < new Date();
              const isUpcoming = new Date(verification.next_verification_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

              return (
                <TableRow 
                  key={verification.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedVerification(verification)}
                >
                  <TableCell>
                    <div className="font-medium">{verification.installation?.name}</div>
                    <div className="text-sm text-gray-500">
                      {verification.installation?.regulation_type === 'erp' ? 'ERP' : 'Code du Travail'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{new Date(verification.verification_date).toLocaleDateString('fr-FR')}</div>
                    {verification.observations && (
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {verification.observations}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className={cn(
                      "flex items-center gap-2",
                      isOverdue ? "text-red-600" : isUpcoming ? "text-yellow-600" : "text-green-600"
                    )}>
                      {isOverdue ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : isUpcoming ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      <span>
                        {new Date(verification.next_verification_date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{verification.provider_name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(verification.status)}>
                      {STATUS_LABELS[verification.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {verification.report_url ? (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={verification.report_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Voir
                        </a>
                      </Button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedVerification} onOpenChange={() => setSelectedVerification(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails de la vérification</DialogTitle>
          </DialogHeader>
          {selectedVerification && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="mb-4">
                  <div className="font-medium">{selectedVerification.installation?.name}</div>
                  <div className="text-sm text-gray-600">
                    {selectedVerification.installation?.regulation_type === 'erp' ? 'ERP' : 'Code du Travail'}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="verification_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de vérification</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="next_verification_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prochaine vérification</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="provider_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prestataire</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>État</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un état" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observations</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Rapport de vérification</h4>
                      {selectedVerification.report_url && (
                        <a
                          href={selectedVerification.report_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Voir le document
                        </a>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="report"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('report')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {selectedVerification.report_url ? 'Modifier' : 'Ajouter'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={() => setSelectedVerification(null)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    Enregistrer
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    compliant: 'secondary',
    non_compliant: 'destructive',
    pending: 'outline',
  };
  return variants[status] || 'default';
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}