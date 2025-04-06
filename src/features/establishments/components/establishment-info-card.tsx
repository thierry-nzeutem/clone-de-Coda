import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Link as LinkIcon, Mail, Phone, Calendar } from "lucide-react";
import { EditEstablishmentForm } from "./edit-establishment-form";
import { Link } from "react-router-dom";

interface EstablishmentInfoCardProps {
  establishment: any;
  editMode: boolean;
  onEditCancel: () => void;
}

export function EstablishmentInfoCard({ establishment, editMode, onEditCancel }: EstablishmentInfoCardProps) {
  // Calculate next commission date based on last commission date and periodicity
  const getNextCommissionDate = () => {
    if (!establishment.last_commission_date || !establishment.visit_periodicity) {
      return null;
    }
    const lastDate = new Date(establishment.last_commission_date);
    const nextDate = new Date(lastDate);
    nextDate.setFullYear(nextDate.getFullYear() + establishment.visit_periodicity);
    return nextDate;
  };

  const nextCommissionDate = getNextCommissionDate();

  if (editMode) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Building2 className="h-5 w-5 text-gray-500 mr-2" />
            Modifier les informations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EditEstablishmentForm
            establishment={establishment}
            onCancel={onEditCancel}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Building2 className="h-5 w-5 text-gray-500 mr-2" />
          Informations générales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Localisation</h3>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="font-medium">Adresse :</span> {establishment.address}
              </div>
              <div className="text-sm">
                <span className="font-medium">Code postal :</span> {establishment.postal_code || '-'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Ville :</span> {establishment.city || '-'}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Contact</h3>
            <div className="space-y-1">
              <div className="text-sm flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {establishment.email || '-'}
              </div>
              <div className="text-sm flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                {establishment.phone || '-'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Classification</h3>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="font-medium">Type :</span>{' '}
                {establishment.types?.map((type: string) => type).join(', ')}
              </div>
              <div className="text-sm">
                <span className="font-medium">Catégorie :</span> {establishment.category}
              </div>
              <div className="text-sm">
                <span className="font-medium">Groupement :</span>{' '}
                {establishment.grouping ? (
                  <Link 
                    to={`/groupements/${establishment.grouping.id}`}
                    className="text-blue-600 hover:underline flex items-center gap-1 inline-flex"
                  >
                    {establishment.grouping.name}
                    <LinkIcon className="h-3 w-3" />
                  </Link>
                ) : (
                  'Néant'
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Sécurité</h3>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="font-medium">Périodicité des commissions :</span>{' '}
                {establishment.visit_periodicity} {establishment.visit_periodicity > 1 ? 'ans' : 'an'}
              </div>
              <div className="text-sm">
                <span className="font-medium">Date dernière commission :</span>{' '}
                {establishment.last_commission_date ? (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    {new Date(establishment.last_commission_date).toLocaleDateString('fr-FR')}
                  </span>
                ) : (
                  '-'
                )}
              </div>
              <div className="text-sm">
                <span className="font-medium">Prochaine commission :</span>{' '}
                {nextCommissionDate ? (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    {nextCommissionDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </span>
                ) : (
                  '-'
                )}
              </div>
              <div className="text-sm">
                <span className="font-medium">Avis :</span>{' '}
                <span className={establishment.commission_opinion === 'favorable' ? 'text-green-600' : 'text-red-600'}>
                  {establishment.commission_opinion || 'Non défini'}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">GE 5 affiché :</span>{' '}
                {establishment.ge5_displayed === true ? 'Oui' : establishment.ge5_displayed === false ? 'Non' : 'Néant'}
              </div>
              <div className="text-sm">
                <span className="font-medium">SOGS Transmis :</span>{' '}
                {establishment.sogs_transmitted === true ? 'Oui' : establishment.sogs_transmitted === false ? 'Non' : 'Néant'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}