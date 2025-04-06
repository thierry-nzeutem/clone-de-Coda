import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEstablishment } from '../api/establishments';

const establishmentTypes = [
  { value: 'type_l', label: 'Type L - Salles de spectacles' },
  { value: 'type_m', label: 'Type M - Magasins' },
  { value: 'type_n', label: 'Type N - Restaurants' },
  { value: 'type_o', label: 'Type O - Hôtels' },
  { value: 'type_p', label: 'Type P - Salles de danse' },
  { value: 'type_r', label: 'Type R - Enseignement' },
  { value: 'type_s', label: 'Type S - Bibliothèques' },
  { value: 'type_t', label: 'Type T - Expositions' },
  { value: 'type_u', label: 'Type U - Sanitaires' },
  { value: 'type_v', label: 'Type V - Culte' },
  { value: 'type_w', label: 'Type W - Bureaux' },
  { value: 'type_x', label: 'Type X - Sports' },
  { value: 'type_y', label: 'Type Y - Musées' },
];

const establishmentCategories = [
  { value: '1', label: '1ère catégorie' },
  { value: '2', label: '2ème catégorie' },
  { value: '3', label: '3ème catégorie' },
  { value: '4', label: '4ème catégorie' },
  { value: '5', label: '5ème catégorie' },
];

const createEstablishmentSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  address: z.string().min(1, "L'adresse est requise"),
  types: z.array(z.string()).min(1, 'Au moins un type est requis'),
  category: z.string().min(1, 'La catégorie est requise'),
  visit_periodicity: z.number().int().min(1, 'La périodicité est requise'),
});

type CreateEstablishmentForm = z.infer<typeof createEstablishmentSchema>;

export function CreateEstablishmentDialog() {
  const queryClient = useQueryClient();
  const form = useForm<CreateEstablishmentForm>({
    resolver: zodResolver(createEstablishmentSchema),
    defaultValues: {
      name: '',
      address: '',
      types: [],
      category: '',
      visit_periodicity: 12,
    },
  });

  const createEstablishmentMutation = useMutation({
    mutationFn: createEstablishment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['establishments'] });
      form.reset();
    },
  });

  const onSubmit = (data: CreateEstablishmentForm) => {
    createEstablishmentMutation.mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel établissement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouvel établissement</DialogTitle>
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
                    <Input placeholder="Nom de l'établissement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse complète" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="types"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Types</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value[0] || undefined}
                      onValueChange={(value) => field.onChange([value])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {establishmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {establishmentCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visit_periodicity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Périodicité des visites (mois)</FormLabel>
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