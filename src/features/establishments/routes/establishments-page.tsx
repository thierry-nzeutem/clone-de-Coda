import { EstablishmentsList } from '../components/establishments-list';
import { CreateEstablishmentDialog } from '../components/create-establishment-dialog';

export function EstablishmentsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Établissements</h1>
        <CreateEstablishmentDialog />
      </div>
      <EstablishmentsList />
    </div>
  );
}