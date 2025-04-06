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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCommissionPrescription } from "../api/commissions";
import { updateAccessibilityCommissionPrescription } from "../api/accessibility-commissions";
import { CommissionPrescription, PRESCRIPTION_STATUS_LABELS } from "../types";

const editPrescriptionSchema = z.object({
  status: z.string().min(1, "Le statut est requis"),
  comment: z.string().optional(),
  is_urgent: z.boolean().default(false),
});

type EditPrescriptionForm = z.infer<typeof editPrescriptionSchema>;

interface EditPrescriptionDialogProps {
  prescription: CommissionPrescription;
  isOpen: boolean;
  onClose: () => void;
  isAccessibility?: boolean;
}

export function EditPrescriptionDialog({
  prescription,
  isOpen,
  onClose,
  isAccessibility = false,
}: EditPrescriptionDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<EditPrescriptionForm>({
    resolver: zodResolver(editPrescriptionSchema),
    defaultValues: {
      status: prescription.status,
      comment: prescription.comment || '',
      is_urgent: prescription.is_urgent || false,
    },
  });

  const updatePrescriptionMutation = useMutation({
    mutationFn: (data: EditPrescriptionForm) => {
      if (isAccessibility) {
        return updateAccessibilityCommissionPrescription(prescription.id, data);
      }
      return updateCommissionPrescription(prescription.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      queryClient.invalidateQueries({ queryKey: ['accessibilityCommissions'] });
      queryClient.invalidateQueries({ queryKey: ['urgentPrescriptions'] });
      onClose();
    },
  });

  const onSubmit = (data: EditPrescriptionForm) => {
    updatePrescriptionMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la prescription</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="mb-4">
            <div className="font-medium">Prescription n°{prescription.number}</div>
            <div className="text-sm text-gray-600 mt-1">{prescription.description}</div>
            <div className="text-sm text-gray-500 mt-1">Référence : {prescription.reference}</div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PRESCRIPTION_STATUS_LABELS).map(([value, label]) => (
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
                name="is_urgent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Prescription urgente</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Marquer cette prescription comme prioritaire
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commentaire</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
        </div>
      </DialogContent>
    </Dialog>
  );
}