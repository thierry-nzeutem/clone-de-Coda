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
import { createVerification, getTechnicalInstallations } from "../api/verifications";
import { getEstablishments } from "@/features/establishments/api/establishments";
import { STATUS_LABELS } from "../types";

const createVerificationSchema = z.object({
  establishment_id: z.string().min(1, "L'établissement est requis"),
  installation_id: z.string().min(1, "L'installation est requise"),
  verification_date: z.string().min(1, "La date est requise"),
  next_verification_date: z.string().min(1, "La date est requise"),
  provider_name: z.string().min(1, "Le prestataire est requis"),
  status: z.string().min(1, "Le statut est requis"),
  observations: z.string().optional(),
  report_url: z.string().optional(),
});

type CreateVerificationForm = z.infer<typeof createVerificationSchema>;

export function CreateVerificationDialog() {
  const queryClient = useQueryClient();
  const form = useForm<CreateVerificationForm>({
    resolver: zodResolver(createVerificationSchema),
    defaultValues: {
      status: 'pending',
    },
  });

  const { data: establishments } = useQuery({
    queryKey: ['establishments'],
    queryFn: getEstablishments,
  });

  const { data: installations } = useQuery({
    queryKey: ['technical_installations'],
    queryFn: getTechnicalInstallations,
  });

  const createVerificationMutation = useMutation({
    mutationFn: createVerification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] });
      form.reset();
    },
  });

  const onSubmit = (data: CreateVerificationForm) => {
    createVerificationMutation.mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle vérification
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une vérification</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="installation_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Installation</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une installation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {installations?.map((installation) => (
                        <SelectItem key={installation.id} value={installation.id}>
                          {installation.name}
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
                    <Input {...field} placeholder="Nom du prestataire" />
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

            <Button type="submit" className="w-full">
              Créer
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}