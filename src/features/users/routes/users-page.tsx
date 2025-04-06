import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers, getActivityLogs } from '../api/users';
import { UsersTable } from '../components/users-table';
import { ActivityLogTable } from '../components/activity-log-table';
import { CreateUserDialog } from '../components/create-user-dialog';
import { User, ROLE_LABELS } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

export function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { data: activityLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['activity_logs'],
    queryFn: () => getActivityLogs(50),
  });

  if (usersLoading || logsLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="activity">Journal d'activité</TabsTrigger>
          </TabsList>
          <CreateUserDialog />
        </div>

        <TabsContent value="users" className="space-y-4">
          <UsersTable
            users={users}
            onUserClick={setSelectedUser}
          />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityLogTable logs={activityLogs} />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{selectedUser.full_name}</div>
                <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                  {ROLE_LABELS[selectedUser.role]}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-600">{selectedUser.email}</div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-medium mb-2">Établissements assignés</h3>
                  <div className="space-y-2">
                    {selectedUser.establishments?.map((establishment) => (
                      <div
                        key={establishment.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span>{establishment.name}</span>
                      </div>
                    ))}
                    {(!selectedUser.establishments || selectedUser.establishments.length === 0) && (
                      <div className="text-sm text-gray-500">
                        Aucun établissement assigné
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    admin: 'destructive',
    consultant: 'default',
    client: 'secondary',
  };
  return variants[role] || 'default';
}