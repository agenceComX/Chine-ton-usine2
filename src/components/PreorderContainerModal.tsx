import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Container } from '../types';

interface PreorderContainerModalProps {
  container: Container;
  isOpen: boolean;
  onClose: () => void;
  onPreorder: (containerId: string, quantity: number) => void;
}

export const PreorderContainerModal: React.FC<PreorderContainerModalProps> = ({
  container,
  isOpen,
  onClose,
  onPreorder,
}) => {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPreorder(container.id, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{t('preorder.title')} {container.name}</h2>
        <p className="text-gray-600 mb-6">{t('preorder.description')}</p>

        <div className="mb-4">
          <p className="text-gray-700"><span className="font-medium">{t('containers.departure')}:</span> {container.departureLocation}</p>
          <p className="text-gray-700"><span className="font-medium">{t('containers.arrival')}:</span> {container.arrivalLocation}</p>
          <p className="text-gray-700"><span className="font-medium">{t('containers.estimatedDeparture')}:</span> {new Date(container.estimatedDepartureDate).toLocaleDateString()}</p>
          <p className="text-gray-700"><span className="font-medium">{t('containers.capacity')}:</span> {container.usedCapacity}/{container.totalCapacity} CBM</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              {t('preorder.quantity')}
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              max={container.totalCapacity - container.usedCapacity}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              {t('preorder.confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 