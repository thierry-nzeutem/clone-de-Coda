import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateEstablishment } from "../api/establishments";
import { getGroupings } from "@/features/groupings/api/groupings";
import { getCommissionsByEstablishment } from "@/features/commissions/api/commissions";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

const establishmentSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  postal_code: z.string().min(5, "Le code postal est requis").max(5, "Le code postal doit faire 5 caractères"),
  city: z.string().min(1, "La ville est requise"),
  email: z.string().email("Email invalide").optional().nullable(),
  phone: z.string().optional().nullable(),
  types: z.array(z.string()).min(1, "Au moins un type est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  visit_periodicity: z.number()
    .min(1, "La périodicité minimale est de 1 an")
    .max(5, "La périodicité maximale est de 5 ans"),
  commission_opinion: z.string().nullable(),
  last_commission_date: z.string().nullable(),
  next_commission_date: z.string().nullable(),
  grouping_id: z.string().nullable(),
  ge5_displayed: z.boolean().nullable(),
  sogs_transmitted: z.boolean().nullable(),
});

type EditEstablishmentForm = z.infer<typeof establishmentSchema>;

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

const visitPeriodicities = [
  { value: 1, label: '1 an' },
  { value: 2, label: '2 ans' },
  { value: 3, label: '3 ans' },
  { value: 4, label: '4 ans' },
  { value: 5, label: '5 ans' },
];

interface EditEstablishmentFormProps {
  establishment: any;
  onCancel: () => void;
}

export function EditEstablishmentForm({ establishment, onCancel }: EditEstablishmentFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<EditEstablishmentForm>({
    resolver: zodResolver(establishmentSchema),
    defaultValues: {
      name: establishment.name,
      address: establishment.address,
      postal_code: establishment.postal_code,
      city: establishment.city,
      email: establishment.email,
      phone: establishment.phone,
      types: establishment.types,
      category: establishment.category,
      visit_periodicity: establishment.visit_periodicity,
      commission_opinion: establishment.commission_opinion,
      last_commission_date: establishment.last_commission_date,
      next_commission_date: establishment.next_commission_date,
      grouping_id: establishment.grouping_id,
      ge5_displayed: establishment.ge5_displayed,
      sogs_transmitted: establishment.sogs_transmitted,
    },
  });

  // Fetch commissions to get the latest visit date
  const { data: commissions = [] } = useQuery({
    queryKey: ['commissions', establishment.id],
    queryFn: () => getCommissionsByEstablishment(establishment.id),
  });

  const { data: groupings = [] } = useQuery({
    queryKey: ['groupings'],
    queryFn: getGroupings,
  });

  const updateEstablishmentMutation = useMutation({
    mutationFn: (data: EditEstablishmentForm) => {
      return updateEstablishment(establishment.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['establishment', establishment.id] });
      onCancel();
    },
  });

  // Update last commission date when commissions data is loaded
  useEffect(() => {
    if (commissions.length > 0) {
      // Filter only periodic visits
      const periodicVisits = commissions.filter(
        commission => commission.purpose === 'visite_periodique'
      );

      if (periodicVisits.length > 0) {
        // Sort by date descending to get the most recent
        const sortedVisits = periodicVisits.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const lastVisit = sortedVisits[0];
        const lastVisitDate = new Date(lastVisit.date);
        
        // Calculate next visit date based on periodicity
        const nextVisitDate = new Date(lastVisitDate);
        nextVisitDate.setFullYear(nextVisitDate.getFullYear() + form.getValues('visit_periodicity'));

        form.setValue('last_commission_date', lastVisit.date);
        form.setValue('next_commission_date', nextVisitDate.toISOString().split('T')[0]);
        form.setValue('commission_opinion', lastVisit.opinion);
      }
    }
  }, [commissions, form]);

  const onSubmit = (data: EditEstablishmentForm) => {
    updateEstablishmentMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Adresse</h3>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code postal</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Classification</h3>
          <FormField
            control={form.control}
            name="types"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Types</FormLabel>
                <Select
                  value={field.value[0] || undefined}
                  onValueChange={(value) => field.onChange([value])}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {establishmentTypes.map((type) => (
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {establishmentCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
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
            name="grouping_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Groupement</FormLabel>
                <Select
                  value={field.value || "none"}
                  onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un groupement" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Néant</SelectItem>
                    {groupings.map((grouping) => (
                      <SelectItem key={grouping.id} value={grouping.id}>
                        {grouping.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Sécurité</h3>
          <FormField
            control={form.control}
            name="visit_periodicity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Périodicité des visites</FormLabel>
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une périodicité" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {visitPeriodicities.map((period) => (
                      <SelectItem key={period.value} value={period.value.toString()}>
                        {period.label}
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
            name="commission_opinion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avis de la commission</FormLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={(value) => field.onChange(value || null)}
                >
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

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="ge5_displayed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>GE 5 affiché</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === true}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sogs_transmitted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>SOGS Transmis</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === true}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
}