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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommission } from "../api/commissions";
import { COMMISSION_TYPE_LABELS, COMMISSION_PURPOSE_LABELS } from "../types";
import { useState } from "react";

const createCommissionSchema = z.object({
  date: z.string().min(1, "La date est requise"),
  commission_type: z.string().min(1, "Le type est requis"),
  purpose: z.string().min(1, "L'objet est requis"),
  opinion: z.string().min(1, "L'avis est requis"),
});

type CreateCommissionForm = z.infer<typeof createCommissionSchema>;

interface CreateCommissionDialogProps {
  establishmentId: string;
  isAccessibility?: boolean;
}

export function CreateCommissionDialog({ establishmentId, isAccessibility = false }: CreateCommissionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<CreateCommissionForm>({
    resolver: zodResolver(createCommissionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      commission_type: '',
      purpose: '',
      opinion: 'favorable',
    },
  });

  const createCommissionMutation = useMutation({
    mutationFn: (data: CreateCommissionForm) => {
      return createCommission({
        ...data,
        establishment_id: establishmentId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commissions'] });
      form.reset({
        date: new Date().toISOString().split('T')[0],
        commission_type: '',
        purpose: '',
        opinion: 'favorable',
      });
      setIsOpen(false);
    },
  });

  const onSubmit = async (data: CreateCommissionForm) => {
    try {
      await createCommissionMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error creating commission:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle commission
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une commission</DialogTitle>
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
                  <Select onValueChange={field.onChange}>
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
                  <Select onValueChange={field.onChange}>
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

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Créer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}