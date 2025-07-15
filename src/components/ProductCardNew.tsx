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

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.images?.[0] || '/api/placeholder/300/200'} 
          alt={productName} 
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        {product.certifiedCE && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            CE
          </span>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {productName}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
            {productDescription}
          </p>
          
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
                  <div className="text-xs text-gray-500">
                    {formatPrice(unitPriceConverted, currency)}/unité
                  </div>
                  <div className="text-lg font-bold text-blue-700">
                    {formatPrice(priceConverted, currency)}
                  </div>
                  <div className="text-xs text-gray-500">
                    pour {product.moq} unités
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">
                    Fournisseur
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {product.supplier.name}
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400 text-xs">
                      {'★'.repeat(Math.floor(product.supplier.rating))}
                      {'☆'.repeat(5 - Math.floor(product.supplier.rating))}
                    </div>
                    <span className="ml-1 text-xs text-gray-500">
                      ({product.supplier.rating})
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
