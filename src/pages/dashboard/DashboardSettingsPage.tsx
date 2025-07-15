import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const DashboardSettingsPage: React.FC = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
    <p className="text-gray-600 dark:text-gray-300">Modifiez vos paramètres de compte ici.</p>
  </div>
);

export default DashboardSettingsPage;
