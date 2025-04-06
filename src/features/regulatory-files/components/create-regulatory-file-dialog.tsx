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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRegulatoryFile } from "../api/regulatory-files";
import { getEstablishments } from "@/features/establishments/api/establishments";
import { STATUS_LABELS } from "../types";

const createRegulatoryFileSchema = z.object({
  establishment_id: z.string().min(1, "L'établissement est requis"),
  file_number: z.string().min(1, "Le numéro de dossier est requis"),
  submission_date: z.string().min(1, "La date de dépôt est requise"),
  deadline_date: z.string().min(1, "La date butoir est requise"),
  status: z.string().min(1, "Le statut est requis"),
  notes: z.string().optional(),
});

type CreateRegulatoryFileForm = z.infer<typeof createRegulatoryFileSchema>;

export function CreateRegulatoryFileDialog() {
  const queryClient = useQueryClient();
  const form = useForm<CreateRegulatoryFileForm>({
    resolver: zodResolver(createRegulatoryFileSchema),
    defaultValues: {
      status: 'in_progress',
    },
  });

  const { data: establishments } = useQuery({
    queryKey: ['establishments'],
    queryFn: getEstablishments,
  });

  const createFileMutation = useMutation({
    mutationFn: createRegulatoryFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regulatory_files'] });
      form.reset();
    },
  });

  const onSubmit = (data: CreateRegulatoryFileForm) => {
    createFileMutation.mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau dossier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un dossier d'autorisation de travaux</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de dossier</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="AT-2025-001" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="establishment_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Établissement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un établissement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {establishments?.map((establishment) => (
                        <SelectItem key={establishment.id} value={establishment.id}>
                          {establishment.name}
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
              name="submission_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de dépôt</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date butoir</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarques</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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