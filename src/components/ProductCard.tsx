import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { getProductName } from '../utils/productUtils';
import { convertCurrency, formatPrice } from '../data/exchangeRates';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { currency } = useCurrency();
  const { language } = useLanguage();
  
  const productName = getProductName(product, language);
  const productDescription = product.description[language] || product.description.en || '';
  
  const unitPriceConverted = convertCurrency(product.price.unitCny, currency);
  const priceConverted = convertCurrency(product.price.cny, currency);

  // Calcul du prix avec remise
  const discountedPrice = product.discount 
    ? priceConverted * (1 - product.discount / 100)
    : priceConverted;

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.images?.[0] || '/api/placeholder/300/200'} 
          alt={productName} 
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              NOUVEAU
            </span>
          )}
          {product.isPopular && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              POPULAIRE
            </span>
          )}
        </div>
        
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.certifiedCE && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              CE
            </span>
          )}
          {product.discount && product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col h-full">
          {/* Marque */}
          {product.brand && (
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
              {product.brand}
            </div>
          )}
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors font-display">
            {productName}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow font-reading text-readable">
            {productDescription}
          </p>
          
          {/* Fonctionnalités principales */}
          {product.featured && product.featured.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {product.featured.slice(0, 3).map((feature, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {product.featured.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{product.featured.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>MOQ: {product.moq} unités</span>
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                {product.category}
              </span>
            </div>
            
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 font-reading">
                    {formatPrice(unitPriceConverted, currency)}/unité
                  </div>
                  <div className="flex items-center gap-2">
                    {product.discount && product.discount > 0 ? (
                      <>
                        <div className="text-lg font-bold text-red-600 font-display">
                          {formatPrice(discountedPrice, currency)}
                        </div>
                        <div className="text-sm line-through text-gray-400 font-display">
                          {formatPrice(priceConverted, currency)}
                        </div>
                      </>
                    ) : (
                      <div className="text-lg font-bold text-blue-700 font-display">
                        {formatPrice(priceConverted, currency)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 font-reading">
                    pour {product.moq} unités
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1 font-reading">
                    Fournisseur
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 font-display">
                    {product.supplier.name}
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400 text-xs">
                      {'★'.repeat(Math.floor(product.rating || product.supplier.rating || 0))}
                      {'☆'.repeat(5 - Math.floor(product.rating || product.supplier.rating || 0))}
                    </div>
                    <span className="ml-1 text-xs text-gray-500">
                      ({product.rating || product.supplier.rating || 0})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
