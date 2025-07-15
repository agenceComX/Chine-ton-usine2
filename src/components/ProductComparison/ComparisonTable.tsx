import React from 'react';
import { X, Plus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { Product } from '../../types';
import Button from '../Button';
import { getProductName } from '../../utils/productUtils';

interface ComparisonTableProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onAddProduct: () => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  products,
  onRemoveProduct,
  onAddProduct,
}) => {
  const { t, language } = useLanguage();
  const { currency } = useCurrency();

  const getSpecifications = (product: Product) => {
    return {
      price: `${product.price} ${currency}`,
      moq: `${product.moq} ${t('units')}`,
      certification: product.certifiedCE ? t('ceCertified') : t('notCeCertified'),
      supplier: product.supplier.name,
      origin: product.origin || t('notSpecified'),
      material: product.material || t('notSpecified'),
      brand: product.brand || t('notSpecified'),
      modelNumber: product.modelNumber || t('notSpecified'),
      application: product.application || t('notSpecified'),
      style: product.style || t('notSpecified'),
    };
  };

  const specifications = [
    { key: 'price', label: t('price') },
    { key: 'moq', label: t('minOrderQuantity') },
    { key: 'certification', label: t('certifications') },
    { key: 'supplier', label: t('supplier') },
    { key: 'origin', label: t('specs.origin') },
    { key: 'material', label: t('specs.material') },
    { key: 'brand', label: t('specs.brand') },
    { key: 'modelNumber', label: t('specs.modelNumber') },
    { key: 'application', label: t('specs.application') },
    { key: 'style', label: t('specs.style') },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('comparison.specifications')}
            </th>
            {products.map((product) => (
              <th key={product.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center justify-between">
                  <span className="truncate max-w-[150px]">{getProductName(product, language)}</span>
                  <button
                    onClick={() => onRemoveProduct(product.id)}
                    className="ml-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              </th>
            ))}
            {products.length < 3 && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Button
                  onClick={onAddProduct}
                  variant="ghost"
                  className="flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>{t('comparison.addProduct')}</span>
                </Button>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {specifications.map((spec) => (
            <tr key={spec.key}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {spec.label}
              </td>
              {products.map((product) => {
                const productSpecs = getSpecifications(product);
                return (
                  <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {productSpecs[spec.key as keyof typeof productSpecs]}
                  </td>
                );
              })}
              {products.length < 3 && <td className="px-6 py-4"></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;