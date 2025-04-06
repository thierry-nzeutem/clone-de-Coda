import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const createPrescriptionSchema = z.object({
  number: z.number().min(1, "Le numéro est requis"),
  description: z.string().min(1, "La description est requise"),
  reference: z.string().min(1, "La référence est requise"),
});

type CreatePrescriptionForm = z.infer<typeof createPrescriptionSchema>;

interface CreatePrescriptionDialogProps {
  commissionId: string;
  isAccessibility?: boolean;
}

export function CreatePrescriptionDialog({ commissionId, isAccessibility = false }: CreatePrescriptionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<CreatePrescriptionForm>({
    resolver: zodResolver(createPrescriptionSchema),
    defaultValues: {
      number: 1,
      description: '',
      reference: '',
    },
  });

  const createPrescriptionMutation = useMutation({
    mutationFn: async (data: CreatePrescriptionForm) => {
      const table = isAccessibility ? 'accessibility_commission_prescriptions' : 'commission_prescriptions';
      const { data: newPrescription, error } = await supabase
        .from(table)
        .insert({
          ...data,
          commission_id: commissionId,
          status: 'to_correct',
        })
        .select()
        .single();

      if (error) throw error;
      return newPrescription;
    },
    onSuccess: () => {
      // Invalidate both commission types to ensure all data is refreshed
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      queryClient.invalidateQueries({ queryKey: ['accessibilityCommissions'] });
      queryClient.invalidateQueries({ queryKey: ['establishment'] });
      
      // Reset form and close dialog
      form.reset();
      setIsOpen(false);
    },
  });

  const onSubmit = async (data: CreatePrescriptionForm) => {
    try {
      await createPrescriptionMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error creating prescription:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle prescription
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une prescription</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence réglementaire</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Article CO 28 §2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Création...' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}