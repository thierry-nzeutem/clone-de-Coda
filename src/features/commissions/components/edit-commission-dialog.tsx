import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCommission, uploadCommissionReport } from "../api/commissions";
import { Commission, COMMISSION_TYPE_LABELS, COMMISSION_PURPOSE_LABELS } from "../types";
import { Upload } from "lucide-react";

const editCommissionSchema = z.object({
  date: z.string().min(1, "La date est requise"),
  commission_type: z.string().min(1, "Le type est requis"),
  purpose: z.string().min(1, "L'objet est requis"),
  opinion: z.string().min(1, "L'avis est requis"),
});

type EditCommissionForm = z.infer<typeof editCommissionSchema>;

interface EditCommissionDialogProps {
  commission: Commission;
  isOpen: boolean;
  onClose: () => void;
}

export function EditCommissionDialog({
  commission,
  isOpen,
  onClose,
}: EditCommissionDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<EditCommissionForm>({
    resolver: zodResolver(editCommissionSchema),
    defaultValues: {
      date: commission.date,
      commission_type: commission.commission_type,
      purpose: commission.purpose,
      opinion: commission.opinion,
    },
  });

  const updateCommissionMutation = useMutation({
    mutationFn: (data: EditCommissionForm) => updateCommission(commission.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      onClose();
    },
  });

  const uploadReportMutation = useMutation({
    mutationFn: async (file: File) => {
      const reportUrl = await uploadCommissionReport(file);
      return updateCommission(commission.id, { report_url: reportUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
    },
  });

  const onSubmit = (data: EditCommissionForm) => {
    updateCommissionMutation.mutate(data);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadReportMutation.mutate(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la commission</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commission_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de commission</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(COMMISSION_TYPE_LABELS).map(([value, label]) => (
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
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objet</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un objet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(COMMISSION_PURPOSE_LABELS).map(([value, label]) => (
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
              name="opinion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avis</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un avis" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="favorable">Favorable</SelectItem>
                      <SelectItem value="defavorable">Défavorable</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Procès-verbal</h4>
                  {commission.report_url && (
                    <a
                      href={commission.report_url}
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
                    {commission.report_url ? 'Modifier' : 'Ajouter'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}