import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const DashboardProductsPage: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Produits</h1>
    <p className="text-gray-600 dark:text-gray-300">Gérez vos produits ici.</p>
  </div>
);

export default DashboardProductsPage;
