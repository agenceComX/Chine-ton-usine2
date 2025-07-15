import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Container } from '../types';

interface PreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  container: Container | null;
  onPreOrder: (containerId: string, quantity: number) => void;
}

export const PreOrderModal: React.FC<PreOrderModalProps> = ({ isOpen, onClose, container, onPreOrder }) => {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !container) return null;

  const availableCapacity = container.totalCapacity - container.usedCapacity;

  const handlePreOrder = () => {
    if (quantity <= 0 || quantity > availableCapacity) {
      setError(t('preOrder.invalidQuantity'));
      return;
    }
    setError(null);
    onPreOrder(container.id, quantity);
    setQuantity(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('preOrder.title')}</h3>
        
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <strong>{t('containers.name')}:</strong> {container.name}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <strong>{t('containers.departure')}:</strong> {container.departureLocation}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <strong>{t('containers.arrival')}:</strong> {container.arrivalLocation}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          <strong>{t('preOrder.availableCapacity')}:</strong> {availableCapacity} {t('units')}
        </p>

        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('preOrder.quantity')}
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            max={availableCapacity}
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder={t('preOrder.quantityPlaceholder')}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handlePreOrder}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={quantity <= 0 || quantity > availableCapacity || container.status === 'closed'}
          >
            {t('preOrder.button')}
          </button>
        </div>
      </div>
    </div>
  );
}; 