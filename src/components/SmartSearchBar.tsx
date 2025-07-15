import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const SmartSearchBar = () => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique de recherche
    console.log(`Recherche : ${query}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-500 overflow-hidden transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <div className="pl-4 pr-3">
            <Search className="h-5 w-5 text-gray-500 dark:text-gray-300" />
          </div>
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={t('search.placeholder') || 'Rechercher des produits...'}
            className="flex-1 py-3 px-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <span>{t('search.button') || 'Rechercher'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SmartSearchBar;
