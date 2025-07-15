import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Package, Users, BarChart2, Settings } from 'lucide-react';

const menuItems = [
  { label: 'Accueil', icon: <Home size={20} />, to: '/dashboard/home' },
  { label: 'Commandes', icon: <ShoppingBag size={20} />, to: '/dashboard/orders' },
  { label: 'Produits', icon: <Package size={20} />, to: '/dashboard/products' },
  { label: 'Fournisseurs', icon: <Users size={20} />, to: '/dashboard/suppliers' },
  { label: 'Statistiques', icon: <BarChart2 size={20} />, to: '/dashboard/stats' },
  { label: 'Paramètres', icon: <Settings size={20} />, to: '/dashboard/settings' },
];

const DashboardSidebar: React.FC = () => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300`}
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
        <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-orange-400">Chine Ton Usine</span>
      </div>
      <nav className="flex-1 py-6 px-2 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 group text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 ${
                isActive ? 'border-l-4 border-orange-600 bg-orange-50 dark:bg-gray-800 text-orange-600 dark:text-orange-400 font-semibold' : ''
              }`
            }
          >
            <span className="mr-3 text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
