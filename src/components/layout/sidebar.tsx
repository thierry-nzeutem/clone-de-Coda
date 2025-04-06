import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu } from 'lucide-react';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`bg-blue-800 text-white ${isCollapsed ? 'w-[70px]' : 'w-64'} flex flex-col transition-all duration-300`}>
      <div className="p-4 flex items-center justify-between border-b border-blue-700">
        <div className="flex items-center">
          <LayoutDashboard className="text-2xl mr-3" />
          {!isCollapsed && <span className="text-xl font-bold">FireSafe Pro</span>}
        </div>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white hover:text-blue-200">
          <Menu />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <Link 
          to="/" 
          className={`flex items-center px-3 py-2 text-white ${isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-700'} rounded-lg mb-1`}
        >
          <LayoutDashboard className="mr-3" />
          {!isCollapsed && <span>Tableau de bord</span>}
        </Link>
      </nav>
    </div>
  );
}