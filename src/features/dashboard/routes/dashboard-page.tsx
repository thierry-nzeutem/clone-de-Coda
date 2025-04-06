export function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Bienvenue sur FireSafe Pro</h2>
          <p className="mt-2 text-gray-600">
            Application de gestion de la sécurité incendie
          </p>
        </div>
      </div>
    </div>
  );
}