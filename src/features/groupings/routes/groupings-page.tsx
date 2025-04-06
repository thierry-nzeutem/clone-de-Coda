import { GroupingsList } from '../components/groupings-list';

export function GroupingsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Groupements</h1>
      </div>
      <GroupingsList />
    </div>
  );
}