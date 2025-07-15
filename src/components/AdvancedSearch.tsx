import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getCategoriesWithTranslations } from '../data/products';
import Button from './Button';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

interface SearchFilters {
  priceRange: [number, number];
  categories: string[];
  certifications: string[];
  moqRange: [number, number];
  location: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch }) => {
  const { t, language } = useLanguage();
  const categories = getCategoriesWithTranslations(language);
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [0, 1000],
    categories: [],
    certifications: [],
    moqRange: [0, 1000],
    location: '',
  });
  const handleFilterChange = (key: keyof SearchFilters, value: string | number[] | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{t('search.filters')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('search.filters.price')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span>-</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Catégories */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('search.filters.category')}
            </label>
            <select
              multiple
              value={filters.categories}
              onChange={(e) => handleFilterChange('categories', Array.from(e.target.selectedOptions, option => option.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.translatedName}
                </option>
              ))}
            </select>
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('search.filters.certification')}
            </label>
            <select
              multiple
              value={filters.certifications}
              onChange={(e) => handleFilterChange('certifications', Array.from(e.target.selectedOptions, option => option.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="iso9001">ISO 9001</option>
              <option value="iso14001">ISO 14001</option>
              <option value="ce">CE</option>
            </select>
          </div>

          {/* Quantité minimale */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('search.filters.moq')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={filters.moqRange[0]}
                onChange={(e) => handleFilterChange('moqRange', [Number(e.target.value), filters.moqRange[1]])}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span>-</span>
              <input
                type="number"
                value={filters.moqRange[1]}
                onChange={(e) => handleFilterChange('moqRange', [filters.moqRange[0], Number(e.target.value)])}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Localisation */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('search.filters.location')}
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder={t('search.filters.location')}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFilters({
                priceRange: [0, 1000],
                categories: [],
                certifications: [],
                moqRange: [0, 1000],
                location: '',
              })}
            >
              {t('search.clearFilters')}
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              {t('search.button')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}; 