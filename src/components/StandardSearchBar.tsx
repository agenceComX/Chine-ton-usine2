import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface StandardSearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showFilters?: boolean;
  onFilterToggle?: () => void;
  variant?: 'default' | 'compact' | 'hero';
  className?: string;
}

const StandardSearchBar: React.FC<StandardSearchBarProps> = ({
  placeholder,
  onSearch,
  showFilters = false,
  onFilterToggle,
  variant = 'default',
  className = '',
}) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          container: 'max-w-xs',
          input: 'py-2 text-sm',
          button: 'px-4 py-2 text-sm',
          icon: 'h-4 w-4',
        };
      case 'hero':
        return {
          container: 'max-w-2xl',
          input: 'py-4 text-lg',
          button: 'px-8 py-4 text-lg',
          icon: 'h-6 w-6',
        };
      default:
        return {
          container: 'max-w-lg',
          input: 'py-3',
          button: 'px-6 py-3',
          icon: 'h-5 w-5',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`w-full ${styles.container} mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-300 dark:border-gray-500 overflow-hidden transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          {/* Icône de recherche */}
          <div className="pl-4 pr-3">
            <Search className={`${styles.icon} text-gray-500 dark:text-gray-300`} />
          </div>
          
          {/* Input de recherche */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder || t('search.placeholder') || 'Rechercher des produits...'}
            className={`flex-1 ${styles.input} px-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none`}
          />
          
          {/* Bouton filtre (optionnel) */}
          {showFilters && onFilterToggle && (
            <button
              type="button"
              onClick={onFilterToggle}
              className="px-3 py-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <Filter className={styles.icon} />
            </button>
          )}
          
          {/* Bouton de recherche */}
          <button
            type="submit"
            className={`${styles.button} bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium transition-colors duration-200 flex items-center space-x-2`}
          >
            <span>{t('search.button') || 'Rechercher'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default StandardSearchBar;
