import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  Shield,
  FileText,
  AlertTriangle,
  Database,
  Ship
} from 'lucide-react';

const adminMenuItems = [
  { label: 'Tableau de bord', icon: <Home size={20} />, to: '/admin/dashboard' },
  { label: 'Utilisateurs', icon: <Users size={20} />, to: '/admin/users' },
  { label: 'Fournisseurs', icon: <Package size={20} />, to: '/admin/suppliers' },
  { label: 'Commandes', icon: <ShoppingBag size={20} />, to: '/admin/orders' },
  { label: 'Conteneurs', icon: <Ship size={20} />, to: '/admin/containers' },
  { label: 'Rapports', icon: <BarChart3 size={20} />, to: '/admin/reports' },
  { label: 'Modération', icon: <Shield size={20} />, to: '/admin/moderation' },
  { label: 'Documents', icon: <FileText size={20} />, to: '/admin/documents' },
  { label: 'Alertes', icon: <AlertTriangle size={20} />, to: '/admin/alerts' },
  { label: 'Base de données', icon: <Database size={20} />, to: '/admin/database' },
  { label: 'Paramètres', icon: <Settings size={20} />, to: '/admin/settings' },
];

const AdminSidebar: React.FC = () => {
  return (
    <aside
      className="sticky top-0 left-0 w-64 z-30 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg"
      style={{ height: 'calc(100vh - 120px)', alignSelf: 'flex-start' }}
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <span className="text-xl font-bold tracking-tight text-red-600 dark:text-red-400">Admin Panel</span>
      </div>
      <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <div className="space-y-1">
          {adminMenuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-400 ${isActive ? 'bg-red-50 dark:bg-gray-800 text-red-600 dark:text-red-400 font-semibold border-r-3 border-red-600' : ''
                }`
              }
            >
              <span className="mr-3 text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="truncate text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Admin Panel v1.0
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
