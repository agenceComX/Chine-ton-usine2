import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const DashboardStatsPage: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Statistiques</h1>
    <p className="text-gray-600 dark:text-gray-300">Visualisez vos statistiques ici.</p>
  </div>
);

export default DashboardStatsPage;
