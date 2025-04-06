import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/header';
import { Sidebar } from './components/layout/sidebar';
import { DashboardPage } from './features/dashboard/routes/dashboard-page';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;