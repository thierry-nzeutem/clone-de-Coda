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
import { createVisit, getConsultants } from "../api/visits";
import { useState } from "react";

const createVisitSchema = z.object({
  visit_type: z.enum(['commission', 'first_visit', 'second_visit', 'reminder']),
  scheduled_date: z.string().min(1, 'La date est requise'),
  consultant_id: z.string().optional(),
  notes: z.string().optional(),
});

type CreateVisitForm = z.infer<typeof createVisitSchema>;

interface CreateVisitDialogProps {
  establishmentId: string;
}

export function CreateVisitDialog({ establishmentId }: CreateVisitDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<CreateVisitForm>({
    resolver: zodResolver(createVisitSchema),
    defaultValues: {
      scheduled_date: new Date().toISOString().split('T')[0],
    },
  });

  const { data: consultants } = useQuery({
    queryKey: ['consultants'],
    queryFn: getConsultants,
  });

  const createVisitMutation = useMutation({
    mutationFn: (data: CreateVisitForm) => {
      return createVisit({
        ...data,
        establishment_id: establishmentId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      form.reset();
      setIsOpen(false);
    },
  });

  const onSubmit = (data: CreateVisitForm) => {
    createVisitMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Planifier une visite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Planifier une visite</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="visit_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de visite</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="commission">Commission</SelectItem>
                      <SelectItem value="first_visit">1ère visite</SelectItem>
                      <SelectItem value="second_visit">2ème visite</SelectItem>
                      <SelectItem value="reminder">Rappel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduled_date"
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
              name="consultant_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultant</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un consultant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {consultants?.map((consultant) => (
                        <SelectItem key={consultant.id} value={consultant.id}>
                          {consultant.full_name}
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
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Planifier
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}