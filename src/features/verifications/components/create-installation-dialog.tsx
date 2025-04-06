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
import { createTechnicalInstallation } from "../api/verifications";
import { REGULATION_TYPES } from "../types";

const createInstallationSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  regulation_type: z.string().min(1, "Le type de réglementation est requis"),
  verification_period_months: z.number().min(1, "La périodicité est requise"),
});

type CreateInstallationForm = z.infer<typeof createInstallationSchema>;

export function CreateInstallationDialog() {
  const queryClient = useQueryClient();
  const form = useForm<CreateInstallationForm>({
    resolver: zodResolver(createInstallationSchema),
    defaultValues: {
      verification_period_months: 12,
    },
  });

  const createInstallationMutation = useMutation({
    mutationFn: createTechnicalInstallation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical_installations'] });
      form.reset();
    },
  });

  const onSubmit = (data: CreateInstallationForm) => {
    createInstallationMutation.mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle installation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une installation technique</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom de l'installation" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regulation_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de réglementation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {REGULATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
              name="verification_period_months"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Périodicité (mois)</FormLabel>
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

            <Button type="submit" className="w-full">
              Créer
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}