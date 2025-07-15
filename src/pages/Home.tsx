import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AdvancedSearch } from '../components/AdvancedSearch';
import { ProductComparison } from '../components/ProductComparison';
import { Product } from '../types';
import { getProductName } from '../utils/productUtils';
import { productsService } from '../services/productsService';

interface SearchFilters {
  priceRange: [number, number];
  categories: string[];
  certifications: string[];
  moqRange: [number, number];
  location: string;
}

export const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  // Charger tous les produits au montage (incluant ceux ajoutés par les fournisseurs)
  useEffect(() => {
    const loadProducts = () => {
      const products = productsService.getAllProducts();
      setAllProducts(products);
      // Afficher les 6 premiers produits par défaut
      setSearchResults(products.slice(0, 6));
    };
    
    // Charger les produits initialement
    loadProducts();
    
    // S'abonner aux changements pour mise à jour automatique
    const unsubscribe = productsService.subscribe(loadProducts);
    
    // Nettoyer l'abonnement au démontage
    return unsubscribe;
  }, []);const handleSearch = (filters: SearchFilters) => {
    // Filtrer les produits selon les critères
    const filtered = allProducts.filter(() => {
      // TODO: Implémenter les filtres complets
      return true; // Pour l'instant, retourner tous les produits
    });
    setSearchResults(filtered);
    console.log('Search filters:', filters);
  };

  const handleAddToComparison = (product: Product) => {
    if (comparisonProducts.length < 3) {
      setComparisonProducts([...comparisonProducts, product]);
    }
  };

  const handleRemoveFromComparison = (productId: string) => {
    setComparisonProducts(comparisonProducts.filter(p => p.id !== productId));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar with advanced search */}
        <div className="lg:col-span-1">
          <AdvancedSearch onSearch={handleSearch} />
        </div>

        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="space-y-8">            {/* Search results */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {searchResults.length === 0 ? t('search.noResults') : `${t('search.results')} (${searchResults.length})`}
              </h2>
              {searchResults.length === 0 ? (
                <p className="text-gray-500">{t('search.noResults')}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((product: Product) => (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
                    >                      <h3 className="text-lg font-medium">{getProductName(product, language)}</h3>
                      <p className="text-gray-600">{product.description.fr}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-lg font-bold">{product.price.cny} ¥</span>
                        <button
                          onClick={() => handleAddToComparison(product)}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          disabled={comparisonProducts.length >= 3}
                        >
                          {t('comparison.addProduct')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product comparison */}
            <ProductComparison
              products={comparisonProducts}
              onAddProduct={handleAddToComparison}
              onRemoveProduct={handleRemoveFromComparison}
            />
          </div>
        </div>
      </div>
    </div>
  );
};