import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Mail, Bell, Shield, Database, Workflow } from "lucide-react";
import { useState } from "react";

export function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [reminderDays, setReminderDays] = useState("7");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-gray-600">Gérez les paramètres de l'application</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>
                  Configurez les paramètres généraux de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom de l'organisation</Label>
                  <Input placeholder="Nom de votre organisation" />
                </div>
                <div className="space-y-2">
                  <Label>Email de contact principal</Label>
                  <Input type="email" placeholder="contact@organisation.fr" />
                </div>
                <div className="space-y-2">
                  <Label>Fuseau horaire</Label>
                  <Select defaultValue="Europe/Paris">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un fuseau horaire" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personnalisation</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Thème</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un thème" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Langue</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Gérez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications par email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications du navigateur</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir des notifications dans le navigateur
                    </p>
                  </div>
                  <Switch
                    checked={browserNotifications}
                    onCheckedChange={setBrowserNotifications}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rappels</Label>
                  <Select
                    value={reminderDays}
                    onValueChange={setReminderDays}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le délai" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 jour avant</SelectItem>
                      <SelectItem value="3">3 jours avant</SelectItem>
                      <SelectItem value="7">1 semaine avant</SelectItem>
                      <SelectItem value="14">2 semaines avant</SelectItem>
                      <SelectItem value="30">1 mois avant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Types de notifications</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="visits" defaultChecked />
                    <label htmlFor="visits">Visites planifiées</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="commissions" defaultChecked />
                    <label htmlFor="commissions">Commissions</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="prescriptions" defaultChecked />
                    <label htmlFor="prescriptions">Prescriptions</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="verifications" defaultChecked />
                    <label htmlFor="verifications">Vérifications</label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>
                Gérez les paramètres de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Authentification à deux facteurs</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="2fa" />
                    <Label htmlFor="2fa">Activer l'authentification à deux facteurs</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Session</Label>
                  <Select defaultValue="8">
                    <SelectTrigger>
                      <SelectValue placeholder="Durée de la session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 heures</SelectItem>
                      <SelectItem value="8">8 heures</SelectItem>
                      <SelectItem value="24">24 heures</SelectItem>
                      <SelectItem value="168">1 semaine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Historique des connexions</Label>
                  <Button variant="outline" className="w-full">
                    Voir l'historique
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Microsoft 365</CardTitle>
                <CardDescription>
                  Intégrations avec les services Microsoft 365
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Outlook Calendar</h3>
                    <p className="text-sm text-muted-foreground">
                      Synchronisez les visites et commissions avec votre calendrier Outlook
                    </p>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Microsoft To Do</h3>
                    <p className="text-sm text-muted-foreground">
                      Synchronisez les tâches et prescriptions avec Microsoft To Do
                    </p>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Microsoft Teams</h3>
                    <p className="text-sm text-muted-foreground">
                      Intégrez les notifications avec Teams
                    </p>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Autres services</CardTitle>
                <CardDescription>
                  Intégrations avec d'autres services tiers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Google Calendar</h3>
                    <p className="text-sm text-muted-foreground">
                      Synchronisez les visites avec Google Calendar
                    </p>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <h3 className="font-medium">Slack</h3>
                    <p className="text-sm text-muted-foreground">
                      Recevez les notifications dans Slack
                    </p>
                  </div>
                  <Button variant="outline">Connecter</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle>Workflow</CardTitle>
              <CardDescription>
                Configurez les processus automatisés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Rappels automatiques</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-reminders" defaultChecked />
                      <Label htmlFor="auto-reminders">
                        Activer les rappels automatiques
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Envoie automatiquement des rappels pour les visites et échéances à venir
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Rapports automatiques</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger>
                      <SelectValue placeholder="Fréquence des rapports" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="never">Désactivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Archivage automatique</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-archive" />
                      <Label htmlFor="auto-archive">
                        Archiver automatiquement les dossiers terminés
                      </Label>
                    </div>
                    <Select defaultValue="90">
                      <SelectTrigger>
                        <SelectValue placeholder="Délai d'archivage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">Après 30 jours</SelectItem>
                        <SelectItem value="60">Après 60 jours</SelectItem>
                        <SelectItem value="90">Après 90 jours</SelectItem>
                        <SelectItem value="180">Après 6 mois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}