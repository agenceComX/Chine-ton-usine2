import React, { useState } from 'react';
import SupplierLayout from '../../layouts/SupplierLayout';
import BackButton from '../../components/BackButton';
import { useLanguage } from '../../context/LanguageContext';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  DollarSign,
  Eye,
  ShoppingCart,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import Button from '../../components/Button';

interface AnalyticsData {
  period: string;
  sales: number;
  orders: number;
  customers: number;
  views: number;
  revenue: number;
  growth: number;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

const mockAnalytics: AnalyticsData[] = [
  { period: 'Jan 2024', sales: 245, orders: 89, customers: 67, views: 1250, revenue: 24500, growth: 12.5 },
  { period: 'Feb 2024', sales: 312, orders: 102, customers: 85, views: 1580, revenue: 31200, growth: 27.3 },
  { period: 'Mar 2024', sales: 289, orders: 95, customers: 78, views: 1420, revenue: 28900, growth: -7.4 },
  { period: 'Avr 2024', sales: 356, orders: 118, customers: 94, views: 1780, revenue: 35600, growth: 23.2 },
  { period: 'Mai 2024', sales: 402, orders: 134, customers: 108, views: 2010, revenue: 40200, growth: 12.9 },
  { period: 'Jun 2024', sales: 378, orders: 127, customers: 102, views: 1890, revenue: 37800, growth: -6.0 }
];

const mockTopProducts: TopProduct[] = [
  { id: '1', name: 'Ordinateur portable Dell XPS', sales: 45, revenue: 67500, growth: 15.3 },
  { id: '2', name: 'Smartphone Samsung Galaxy', sales: 78, revenue: 58500, growth: 8.7 },
  { id: '3', name: 'Casque audio Sony WH-1000XM5', sales: 123, revenue: 36900, growth: 22.1 },
  { id: '4', name: 'Tablette iPad Pro', sales: 34, revenue: 34000, growth: -3.2 },
  { id: '5', name: 'Montre connectée Apple Watch', sales: 89, revenue: 31150, growth: 18.9 }
];

const AnalyticsPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('6-months');
  const [analytics] = useState<AnalyticsData[]>(mockAnalytics);
  const [topProducts] = useState<TopProduct[]>(mockTopProducts);

  const currentMonth = analytics[analytics.length - 1];
  const previousMonth = analytics[analytics.length - 2];

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const totalRevenue = analytics.reduce((sum, data) => sum + data.revenue, 0);
  const totalOrders = analytics.reduce((sum, data) => sum + data.orders, 0);
  const totalCustomers = analytics.reduce((sum, data) => sum + data.customers, 0);
  const totalViews = analytics.reduce((sum, data) => sum + data.views, 0);

  return (
    <SupplierLayout>      <div className="space-y-6">        {/* Bouton retour */}
        <BackButton to="/supplier/dashboard" label={t('supplier.analytics.back')} variant="ghost" />

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('supplier.analytics.title')}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('supplier.analytics.subtitle')}
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
              >                <option value="1-month">{t('supplier.analytics.period.1month')}</option>
                <option value="3-months">{t('supplier.analytics.period.3months')}</option>
                <option value="6-months">{t('supplier.analytics.period.6months')}</option>
                <option value="1-year">{t('supplier.analytics.period.1year')}</option>
              </select>
            </div>            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('supplier.analytics.refresh')}
            </Button>            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t('supplier.analytics.export')}
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('supplier.analytics.revenue')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(totalRevenue / 1000).toFixed(0)}k€
                </p>
                <div className="flex items-center mt-2">
                  {currentMonth.growth > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}                  <span className={`text-sm font-medium ${
                    currentMonth.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(currentMonth.growth)}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{t('supplier.analytics.vsLastMonth')}</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('supplier.analytics.orders')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
                <div className="flex items-center mt-2">
                  {currentMonth.orders > previousMonth.orders ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    currentMonth.orders > previousMonth.orders ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(parseFloat(calculateChange(currentMonth.orders, previousMonth.orders)))}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs mois dernier</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('supplier.analytics.customers')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCustomers}</p>
                <div className="flex items-center mt-2">
                  {currentMonth.customers > previousMonth.customers ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}                  <span className={`text-sm font-medium ${
                    currentMonth.customers > previousMonth.customers ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(parseFloat(calculateChange(currentMonth.customers, previousMonth.customers)))}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{t('supplier.analytics.vsLastMonth')}</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('supplier.analytics.productViews')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(totalViews / 1000).toFixed(1)}k
                </p>
                <div className="flex items-center mt-2">
                  {currentMonth.views > previousMonth.views ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}                  <span className={`text-sm font-medium ${
                    currentMonth.views > previousMonth.views ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(parseFloat(calculateChange(currentMonth.views, previousMonth.views)))}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{t('supplier.analytics.vsLastMonth')}</span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Graphique des ventes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('supplier.analytics.salesEvolution')}</h2>
            <BarChart3 className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.map((data, index) => {
              const maxRevenue = Math.max(...analytics.map(d => d.revenue));
              const height = (data.revenue / maxRevenue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex justify-center mb-2">
                    <div
                      className="bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${height}%`, width: '60%' }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {data.period}
                  </div>
                  <div className="text-xs font-medium text-gray-900 dark:text-white text-center">
                    {(data.revenue / 1000).toFixed(0)}k€
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top produits */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('supplier.analytics.topProducts')}</h2>
              <Package className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.sales} ventes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {(product.revenue / 1000).toFixed(1)}k€
                    </p>
                    <div className="flex items-center">
                      {product.growth > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${
                        product.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(product.growth)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistiques mensuelles */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance mensuelle</h2>
              <Calendar className="h-5 w-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {analytics.slice(-3).reverse().map((data, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{data.period}</h3>
                    <div className="flex items-center">
                      {data.growth > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        data.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.abs(data.growth)}%
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Ventes</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{data.sales}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Commandes</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{data.orders}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Clients</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{data.customers}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">CA</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {(data.revenue / 1000).toFixed(0)}k€
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
};

export default AnalyticsPage;
