import { useQuery } from '@tanstack/react-query';
import { getContactsByEstablishment } from '../api/contacts';
import { Mail, Phone } from 'lucide-react';

interface ContactsListProps {
  establishmentId: string;
}

export function ContactsList({ establishmentId }: ContactsListProps) {
  const { data: contacts, isLoading, error } = useQuery({
    queryKey: ['contacts', establishmentId],
    queryFn: () => getContactsByEstablishment(establishmentId),
  });

  if (isLoading) {
    return <div className="text-sm text-gray-600">Chargement des contacts...</div>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        Une erreur est survenue lors du chargement des contacts.
      </div>
    );
  }

  if (!contacts?.length) {
    return (
      <div className="text-sm text-gray-600">
        Aucun contact enregistré pour cet établissement.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="border-b border-gray-100 last:border-0 pb-2 last:pb-0"
        >
          <div className="font-medium">{contact.full_name}</div>
          <div className="text-sm text-gray-600">{contact.role}</div>
          <div className="mt-1 space-y-1">
            {contact.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {contact.email}
                </a>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <a
                  href={`tel:${contact.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}