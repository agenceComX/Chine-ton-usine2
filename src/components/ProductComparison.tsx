import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';
import { getProductName } from '../utils/productUtils';

interface ProductComparisonProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  onRemoveProduct,
}) => {
  const { t, language } = useLanguage();
  const [showDifferences, setShowDifferences] = useState(false);

  const getSpecifications = (product: Product) => {
    return [
      { label: 'Origin', value: product.origin },
      { label: 'Material', value: product.material },
      { label: 'Brand', value: product.brand },
      { label: 'Model Number', value: product.modelNumber },
      { label: 'Application', value: product.application },
      { label: 'Style', value: product.style },
    ].filter(spec => spec.value);
  };

  const handleExport = () => {
    const data = products.map(product => ({
      name: getProductName(product, language),
      specifications: getSpecifications(product),
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-comparison.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{t('comparison.specifications')}</h2>
        <div className="space-x-4">
          <button
            onClick={() => setShowDifferences(!showDifferences)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {showDifferences ? t('comparison.similarities') : t('comparison.differences')}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {t('comparison.export')}
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            {t('comparison.print')}
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-4">{t('comparison.noProducts')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('comparison.specifications')}
                </th>
                {products.map(product => (
                  <th key={product.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex justify-between items-center">
                      <span>{getProductName(product, language)}</span>
                      <button
                        onClick={() => onRemoveProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        {t('comparison.removeProduct')}
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {getSpecifications(products[0]).map((spec, index) => {
                const values = products.map(p => getSpecifications(p)[index]?.value);
                const allSame = values.every(v => v === values[0]);
                
                if (showDifferences && allSame) return null;

                return (
                  <tr key={spec.label}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {spec.label}
                    </td>
                    {products.map(product => (
                      <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getSpecifications(product)[index]?.value || '-'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {products.length < 3 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">{t('comparison.maxProducts')}</p>
          <button
            onClick={() => {/* TODO: Implement product selection modal */}}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {t('comparison.addProduct')}
          </button>
        </div>
      )}
    </div>
  );
};