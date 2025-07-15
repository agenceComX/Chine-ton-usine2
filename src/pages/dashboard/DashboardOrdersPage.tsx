import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const DashboardOrdersPage: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Commandes</h1>
    <p className="text-gray-600 dark:text-gray-300">Gérez toutes vos commandes ici.</p>
  </div>
);

export default DashboardOrdersPage;
