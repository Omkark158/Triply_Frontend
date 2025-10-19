import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Map, DollarSign, FileText, Users } from 'lucide-react';

interface MenuItem {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  path: string;
  id: string;
  disabled?: boolean;
}

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard',
      id: 'dashboard',
    },
    {
      icon: MapPin,
      label: 'Trips',
      path: '/dashboard',
      id: 'trips',
      disabled: true, // Mark as disabled since route doesn't exist yet
    },
    {
      icon: Map,
      label: 'Map',
      path: '/dashboard',
      id: 'map',
      disabled: true,
    },
    {
      icon: DollarSign,
      label: 'Budget',
      path: '/dashboard',
      id: 'budget',
      disabled: true,
    },
    {
      icon: FileText,
      label: 'Documents',
      path: '/dashboard',
      id: 'documents',
      disabled: true,
    },
    {
      icon: Users,
      label: 'Collaboration',
      path: '/dashboard',
      id: 'collaboration',
      disabled: true,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path && item.id === 'dashboard';

            if (item.disabled) {
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed opacity-50"
                  title="Coming soon"
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  <span className="ml-auto text-xs">Soon</span>
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;