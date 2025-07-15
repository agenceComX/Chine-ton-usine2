import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Home, 
  Package, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Settings,
  Users,
  Star
} from 'lucide-react';

const SupplierSidebar: React.FC = () => {
  const { t } = useLanguage();
  const supplierMenuItems = [
    { label: t('supplier.sidebar.dashboard'), icon: <Home size={20} />, to: '/supplier/dashboard' },
    { label: t('supplier.sidebar.products'), icon: <Package size={20} />, to: '/supplier/products-new' },
    { label: t('supplier.sidebar.customers'), icon: <Users size={20} />, to: '/supplier/customers' },
    { label: t('supplier.sidebar.messages'), icon: <MessageSquare size={20} />, to: '/supplier/messages' },
    { label: t('supplier.sidebar.documents'), icon: <FileText size={20} />, to: '/supplier/documents' },
    { label: t('supplier.sidebar.reviews'), icon: <Star size={20} />, to: '/supplier/reviews' },
    { label: t('supplier.sidebar.analytics'), icon: <BarChart3 size={20} />, to: '/supplier/analytics' },
    { label: t('supplier.sidebar.settings'), icon: <Settings size={20} />, to: '/supplier/settings' },
  ];

  return (
    <aside
      className="fixed top-0 left-0 h-full w-64 z-30 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300"
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-800">
        <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">{t('supplier.sidebar.title')}</span>
      </div>
      <nav className="flex-1 py-6 px-2 space-y-2">
        {supplierMenuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 group text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 ${
                isActive ? 'border-l-4 border-blue-600 bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`
            }
          >
            <span className="mr-3 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SupplierSidebar;
