import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useQuery } from '@tanstack/react-query';
import { getEstablishmentById } from '@/features/establishments/api/establishments';
import { getVisitsByEstablishment } from '@/features/visits/api/visits';
import { getCommissionsByEstablishment } from '@/features/commissions/api/commissions';
import { getVerificationsByEstablishment } from '@/features/verifications/api/verifications';
import { getPrescriptionsByEstablishment } from '@/features/establishments/api/prescriptions';
import { generateVisitReport } from '../api/visit-reports';

const visitReportSchema = z.object({
  establishment_id: z.string().min(1, "L'établissement est requis"),
  visit_id: z.string().min(1, "La visite est requise"),
  consultant_id: z.string().min(1, "Le consultant est requis"),
  visit_date: z.string().min(1, "La date est requise"),
  visit_type: z.string().min(1, "Le type de visite est requis"),
  
  // Informations générales
  contact_name: z.string().min(1, "Le nom du contact est requis"),
  contact_role: z.string().min(1, "La fonction du contact est requise"),
  contact_email: z.string().email("Email invalide").optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  
  // Observations
  observations: z.string().optional(),
  
  // Vérifications techniques
  technical_verifications_done: z.boolean().default(false),
  technical_verifications_notes: z.string().optional(),
  
  // Prescriptions
  prescriptions_reviewed: z.boolean().default(false),
  prescriptions_notes: z.string().optional(),
  
  // Registre de sécurité
  safety_register_checked: z.boolean().default(false),
  safety_register_notes: z.string().optional(),
  
  // Formation du personnel
  staff_training_checked: z.boolean().default(false),
  staff_training_notes: z.string().optional(),
  
  // Conclusion
  conclusion: z.string().min(1, "La conclusion est requise"),
  
  // Actions à mener
  actions_needed: z.string().optional(),
  
  // Prochaine visite
  next_visit_date: z.string().optional(),
  next_visit_type: z.string().optional(),
});

type VisitReportFormValues = z.infer<typeof visitReportSchema>;

interface VisitReportFormProps {
  establishmentId?: string;
  visitId?: string;
  onSuccess?: () => void;
}

export function VisitReportForm({ establishmentId, visitId, onSuccess }: VisitReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<VisitReportFormValues>({
    resolver: zodResolver(visitReportSchema),
    defaultValues: {
      establishment_id: establishmentId || '',
      visit_id: visitId || '',
      consultant_id: '',
      visit_date: new Date().toISOString().split('T')[0],
      visit_type: '',
      contact_name: '',
      contact_role: '',
      contact_email: '',
      contact_phone: '',
      observations: '',
      technical_verifications_done: false,
      technical_verifications_notes: '',
      prescriptions_reviewed: false,
      prescriptions_notes: '',
      safety_register_checked: false,
      safety_register_notes: '',
      staff_training_checked: false,
      staff_training_notes: '',
      conclusion: '',
      actions_needed: '',
      next_visit_date: '',
      next_visit_type: '',
    },
  });
  
  const { data: establishment } = useQuery({
    queryKey: ['establishment', establishmentId],
    queryFn: () => establishmentId ? getEstablishmentById(establishmentId) : null,
    enabled: !!establishmentId,
  });
  
  const { data: visits } = useQuery({
    queryKey: ['visits', establishmentId],
    queryFn: () => establishmentId ? getVisitsByEstablishment(establishmentId) : [],
    enabled: !!establishmentId,
  });
  
  const { data: commissions } = useQuery({
    queryKey: ['commissions', establishmentId],
    queryFn: () => establishmentId ? getCommissionsByEstablishment(establishmentId) : [],
    enabled: !!establishmentId,
  });
  
  const { data: verifications } = useQuery({
    queryKey: ['verifications', establishmentId],
    queryFn: () => establishmentId ? getVerificationsByEstablishment(establishmentId) : [],
    enabled: !!establishmentId,
  });
  
  const { data: prescriptions } = useQuery({
    queryKey: ['prescriptions', establishmentId],
    queryFn: () => establishmentId ? getPrescriptionsByEstablishment(establishmentId) : [],
    enabled: !!establishmentId,
  });
  
  // Populate form with visit data if visitId is provided
  useEffect(() => {
    if (visitId && visits) {
      const visit = visits.find(v => v.id === visitId);
      if (visit) {
        form.setValue('visit_date', visit.scheduled_date);
        form.setValue('visit_type', visit.visit_type);
        form.setValue('consultant_id', visit.consultant_id || '');
        
        // If visit has notes, set them as observations
        if (visit.notes) {
          form.setValue('observations', visit.notes);
        }
      }
    }
  }, [visitId, visits, form]);
  
  // Populate contact information if establishment is loaded
  useEffect(() => {
    if (establishment) {
      // If establishment has contact information
      if (establishment.email) {
        form.setValue('contact_email', establishment.email);
      }
      if (establishment.phone) {
        form.setValue('contact_phone', establishment.phone);
      }
    }
  }, [establishment, form]);
  
  async function onSubmit(data: VisitReportFormValues) {
    try {
      setIsSubmitting(true);
      
      // Add establishment data to the report
      const reportData = {
        ...data,
        establishment_name: establishment?.name || '',
        establishment_address: establishment?.address || '',
        establishment_city: establishment?.city || '',
        establishment_postal_code: establishment?.postal_code || '',
        establishment_category: establishment?.category || '',
        establishment_types: establishment?.types || [],
      };
      
      // Generate the report
      await generateVisitReport(reportData);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Rapport de visite</CardTitle>
            <CardDescription>
              Générez un rapport de visite complet pour l'établissement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="general">Informations générales</TabsTrigger>
                <TabsTrigger value="observations">Observations</TabsTrigger>
                <TabsTrigger value="verifications">Vérifications</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="conclusion">Conclusion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="visit_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de visite</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="visit_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de visite</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="first_visit">Première visite</SelectItem>
                            <SelectItem value="second_visit">Seconde visite</SelectItem>
                            <SelectItem value="commission">Commission</SelectItem>
                            <SelectItem value="reminder">Visite de rappel</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contact_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du contact</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contact_role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fonction du contact</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contact_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email du contact</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone du contact</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="observations" className="space-y-4">
                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observations</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Saisissez vos observations sur l'établissement" 
                          className="min-h-[200px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="verifications" className="space-y-4">
                <div className="space-y-6">
                  <div className="border p-4 rounded-md space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Vérifications techniques</h3>
                      <FormField
                        control={form.control}
                        name="technical_verifications_done"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Effectuées</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="technical_verifications_notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes sur les vérifications techniques</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {verifications && verifications.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2">Dernières vérifications</h4>
                        <ul className="text-sm space-y-1">
                          {verifications.slice(0, 3).map(verification => (
                            <li key={verification.id} className="flex justify-between">
                              <span>{verification.installation?.name}</span>
                              <span className="text-gray-500">
                                {new Date(verification.verification_date).toLocaleDateString('fr-FR')}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="border p-4 rounded-md space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Registre de sécurité</h3>
                      <FormField
                        control={form.control}
                        name="safety_register_checked"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Vérifié</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="safety_register_notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes sur le registre de sécurité</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="border p-4 rounded-md space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Formation du personnel</h3>
                      <FormField
                        control={form.control}
                        name="staff_training_checked"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Vérifiée</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="staff_training_notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes sur la formation du personnel</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="prescriptions" className="space-y-4">
                <div className="border p-4 rounded-md space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Prescriptions</h3>
                    <FormField
                      control={form.control}
                      name="prescriptions_reviewed"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Revues</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="prescriptions_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes sur les prescriptions</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {prescriptions && prescriptions.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium mb-2">Prescriptions en cours</h4>
                      <ul className="text-sm space-y-1">
                        {prescriptions.filter(p => p.status === 'todo' || p.status === 'in_progress').slice(0, 3).map(prescription => (
                          <li key={prescription.id} className="flex justify-between">
                            <span className="truncate max-w-[300px]">{prescription.description}</span>
                            <span className="text-gray-500">
                              {prescription.status === 'todo' ? 'À faire' : 'En cours'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {commissions && commissions.length > 0 && (
                  <div className="border p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Dernière commission</h3>
                    <div className="text-sm">
                      <p><span className="font-medium">Date:</span> {new Date(commissions[0].date).toLocaleDateString('fr-FR')}</p>
                      <p><span className="font-medium">Type:</span> {commissions[0].commission_type === 'communale' ? 'Communale' : 
                        commissions[0].commission_type === 'arrondissement' ? 'Arrondissement' : 'Départementale'}</p>
                      <p><span className="font-medium">Avis:</span> {commissions[0].opinion === 'favorable' ? 'Favorable' : 'Défavorable'}</p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="conclusion" className="space-y-4">
                <FormField
                  control={form.control}
                  name="conclusion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conclusion</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Conclusion générale de la visite" 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="actions_needed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Actions à mener</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Actions à mener suite à la visite" 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="next_visit_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de la prochaine visite</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="next_visit_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de la prochaine visite</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="first_visit">Première visite</SelectItem>
                            <SelectItem value="second_visit">Seconde visite</SelectItem>
                            <SelectItem value="commission">Commission</SelectItem>
                            <SelectItem value="reminder">Visite de rappel</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button">Annuler</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Génération..." : "Générer le rapport"}
          </Button>
        </div>
      </form>
    </Form>
  );
}