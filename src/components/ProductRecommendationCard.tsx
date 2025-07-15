import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { convertCurrency, formatPrice } from '../data/exchangeRates';

interface ProductRecommendationCardProps {
  product: Product;
  index: number;
}

const ProductRecommendationCard: React.FC<ProductRecommendationCardProps> = ({ product, index }) => {
  const { t } = useLanguage();
  const { currency } = useCurrency();

  const convertedPrice = convertCurrency(product.price.cny, currency);
  const formattedPrice = formatPrice(convertedPrice, currency);

  return (
    <div 
      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl aspect-square">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay avec gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badge CE si certifié */}
        {product.certifiedCE && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            CE
          </div>
        )}
        
        {/* Actions flottantes */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg">
            <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-red-500" />
          </button>
          <button className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-lg">
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-blue-500" />
          </button>
        </div>
      </div>

      {/* Contenu de la carte */}
      <div className="p-5">
        {/* Nom du produit */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 font-display">
          {product.name}
        </h3>

        {/* Fournisseur */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-reading">
          {product.supplier.name}
        </p>

        {/* Prix */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-display">
              {formattedPrice}
            </span>
            {product.moq > 1 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                MOQ: {product.moq}
              </span>
            )}
          </div>
          
          {/* Rating étoiles */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < 4 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">4.0</span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex space-x-2">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 group/btn"
          >
            <Eye className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
            <span>{t('homepage.recommendations.discover')}</span>
          </Link>
          
          <button className="bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2.5 rounded-xl transition-all duration-300 transform hover:scale-105">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
    </div>
  );
};

export default ProductRecommendationCard;
