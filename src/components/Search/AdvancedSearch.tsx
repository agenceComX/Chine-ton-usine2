import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../Button';

interface FilterOption {
  id: string;
  label: string;
  type: 'range' | 'select' | 'checkbox';
  options?: string[];
  min?: number;
  max?: number;
}

interface FilterValue {
  min?: number;
  max?: number;
}

interface AdvancedSearchProps {
  onSearch: (filters: Record<string, string | number | string[] | FilterValue>) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<Record<string, string | number | string[] | FilterValue>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions: FilterOption[] = [
    {
      id: 'price',
      label: t('search.filters.price'),
      type: 'range',
      min: 0,
      max: 10000,
    },
    {
      id: 'category',
      label: t('search.filters.category'),
      type: 'select',
      options: ['Électronique', 'Textile', 'Mobilier', 'Alimentation', 'Cosmétiques'],
    },
    {
      id: 'certification',
      label: t('search.filters.certification'),
      type: 'checkbox',
      options: ['CE', 'ISO 9001', 'ISO 14001', 'Oeko-Tex'],
    },
    {
      id: 'moq',
      label: t('search.filters.moq'),
      type: 'range',
      min: 1,
      max: 10000,
    },
    {
      id: 'location',
      label: t('search.filters.location'),
      type: 'select',
      options: ['Chine', 'Vietnam', 'Thaïlande', 'Indonésie', 'Malaisie'],
    },
  ];  const handleFilterChange = (filterId: string, value: string | number | string[] | FilterValue) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query: searchQuery,
      ...filters,
    });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <Button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <Filter size={20} />
            <span>{t('search.filters')}</span>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Button>
          <Button type="submit" variant="primary">
            {t('search.button')}
          </Button>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {filterOptions.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {filter.label}
                </label>                {filter.type === 'range' && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min={filter.min}
                      max={filter.max}
                      value={(filters[filter.id] as FilterValue)?.min || filter.min}
                      onChange={(e) =>
                        handleFilterChange(filter.id, {
                          ...(filters[filter.id] as FilterValue || {}),
                          min: parseInt(e.target.value),
                        })
                      }
                      className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      min={filter.min}
                      max={filter.max}
                      value={(filters[filter.id] as FilterValue)?.max || filter.max}
                      onChange={(e) =>
                        handleFilterChange(filter.id, {
                          ...(filters[filter.id] as FilterValue || {}),
                          max: parseInt(e.target.value),
                        })
                      }
                      className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}                {filter.type === 'select' && (
                  <select
                    value={(filters[filter.id] as string) || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">{t('search.selectAll')}</option>
                    {filter.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}                {filter.type === 'checkbox' && (
                  <div className="space-y-2">
                    {filter.options?.map((option) => (
                      <label key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={(filters[filter.id] as string[])?.includes(option) || false}
                          onChange={(e) => {
                            const currentValues = (filters[filter.id] as string[]) || [];
                            const newValues = e.target.checked
                              ? [...currentValues, option]
                              : currentValues.filter((v: string) => v !== option);
                            handleFilterChange(filter.id, newValues);
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="col-span-full flex justify-end">
              <Button
                type="button"
                onClick={clearFilters}
                variant="ghost"
                className="flex items-center space-x-2"
              >
                <X size={20} />
                <span>{t('search.clearFilters')}</span>
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdvancedSearch; 