import React from 'react';
import { BarChart3, Package, TruckIcon, AlertCircle, DollarSign, Star, MessageSquare, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import SupplierLayout from '../../layouts/SupplierLayout';
import { useLanguage } from '../../context/LanguageContext';

// Mock data for demonstration
const dashboardData = {
  totalProducts: 156,
  activeOrders: 23,
  completedOrders: 89,
  cancelledOrders: 3,
  monthlyRevenue: 45678.90,
  yearlyRevenue: 534567.89,
  alerts: [
    { id: 1, type: 'stock', message: '5 produits en rupture de stock' },
    { id: 2, type: 'document', message: 'Certificat CE manquant pour 2 produits' },
    { id: 3, type: 'dispute', message: '2 litiges en attente de résolution' }
  ]
};

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <SupplierLayout>
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('supplier.dashboard.title')}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('supplier.dashboard.overview')}</p>
          </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg dark:shadow-gray-700/20 rounded-lg border dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {t('supplier.dashboard.totalProducts')}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {dashboardData.totalProducts}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <Link to="/supplier/products" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  {t('supplier.dashboard.viewAllProducts')}
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg dark:shadow-gray-700/20 rounded-lg border dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {t('supplier.dashboard.monthlyRevenue')}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(dashboardData.monthlyRevenue)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <Link to="/supplier/analytics" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  {t('supplier.dashboard.viewAnalytics')}
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg dark:shadow-gray-700/20 rounded-lg border dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {t('supplier.dashboard.customerSatisfaction')}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        4.8/5
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <Link to="/supplier/reviews" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  {t('supplier.dashboard.viewReviews')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('supplier.dashboard.importantAlerts')}</h2>
          <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700/20 rounded-lg border dark:border-gray-700">
            {dashboardData.alerts.map(alert => (
              <div key={alert.id} className="p-4 border-b dark:border-gray-700 last:border-b-0">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">{alert.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/supplier/products/new" className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg dark:shadow-gray-700/20 rounded-lg border dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-700/30 transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('supplier.dashboard.addProduct')}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('supplier.dashboard.addProductDesc')}</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/supplier/messages" className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg dark:shadow-gray-700/20 rounded-lg border dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-700/30 transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-green-500 dark:text-green-400" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('supplier.dashboard.messages')}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('supplier.dashboard.threeNewMessages')}</p>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/supplier/documents" className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg dark:shadow-gray-700/20 rounded-lg border dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-700/30 transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('supplier.dashboard.documents')}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('supplier.dashboard.manageDocuments')}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Performance Chart */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('supplier.dashboard.salesPerformance')}</h2>
          <div className="bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-700/20 rounded-lg border dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">{t('supplier.dashboard.revenue')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('supplier.dashboard.last30Days')}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  {t('supplier.dashboard.month')}
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  {t('supplier.dashboard.year')}
                </button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">{t('supplier.dashboard.salesChart')}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('supplier.dashboard.dataWillDisplay')}</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </SupplierLayout>
  );
};

export default DashboardPage;