import React from 'react';
import { Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderStatusProps {
  status: OrderStatus;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  lastUpdate?: Date;
}

const OrderStatus: React.FC<OrderStatusProps> = ({
  status,
  estimatedDelivery,
  trackingNumber,
  lastUpdate,
}) => {
  const { t } = useLanguage();

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-6 w-6 text-yellow-500" />,
          color: 'bg-yellow-100 text-yellow-800',
          borderColor: 'border-yellow-500',
        };
      case 'processing':
        return {
          icon: <Package className="h-6 w-6 text-blue-500" />,
          color: 'bg-blue-100 text-blue-800',
          borderColor: 'border-blue-500',
        };      case 'shipped':
        return {
          icon: <Truck className="h-6 w-6 text-orange-500" />,
          color: 'bg-orange-100 text-orange-800',
          borderColor: 'border-orange-500',
        };
      case 'delivered':
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
          color: 'bg-green-100 text-green-800',
          borderColor: 'border-green-500',
        };
      case 'cancelled':
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-500" />,
          color: 'bg-red-100 text-red-800',
          borderColor: 'border-red-500',
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className={`p-3 rounded-full ${statusConfig.color}`}>
          {statusConfig.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t(`order.status.${status}`)}
          </h3>
          {lastUpdate && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('order.lastUpdate')}: {lastUpdate.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {estimatedDelivery && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-600 dark:text-gray-300">
              {t('order.estimatedDelivery')}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {estimatedDelivery.toLocaleDateString()}
            </span>
          </div>
        )}

        {trackingNumber && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-600 dark:text-gray-300">
              {t('order.trackingNumber')}
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {trackingNumber}
            </span>
          </div>
        )}

        <div className="relative pt-4">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700">
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                statusConfig.borderColor
              }`}
              style={{
                width:
                  status === 'pending'
                    ? '20%'
                    : status === 'processing'
                    ? '40%'
                    : status === 'shipped'
                    ? '60%'
                    : status === 'delivered'
                    ? '100%'
                    : '0%',
              }}
            />
          </div>
          <div className="flex justify-between relative">
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  status === 'pending' ? statusConfig.color : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
              <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                {t('order.status.pending')}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  status === 'processing' ? statusConfig.color : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
              <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                {t('order.status.processing')}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  status === 'shipped' ? statusConfig.color : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
              <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                {t('order.status.shipped')}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  status === 'delivered' ? statusConfig.color : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
              <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                {t('order.status.delivered')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus; 