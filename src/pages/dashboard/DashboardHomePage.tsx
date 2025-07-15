import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const DashboardHomePage: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Bienvenue sur votre dashboard</h1>
    <p className="text-gray-600 dark:text-gray-300">Accédez rapidement à vos commandes, produits, statistiques et plus encore.</p>
  </div>
);

export default DashboardHomePage;
