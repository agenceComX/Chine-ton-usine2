import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, Package, ShoppingBag, DollarSign, Calendar, Download } from 'lucide-react';
import Button from '../../components/Button';
import AdminLayout from '../../layouts/AdminLayout';

interface ChartData {
  month: string;
  orders: number;
  revenue: number;
  users: number;
}

interface ReportStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalSuppliers: number;
  revenueChange: number;
  ordersChange: number;
  usersChange: number;
  suppliersChange: number;
}

const ReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [error, setError] = useState('');

  // Mock data for demonstration
  const mockChartData: ChartData[] = [
    { month: 'Août', orders: 45, revenue: 12500, users: 23 },
    { month: 'Sept', orders: 52, revenue: 15200, users: 31 },
    { month: 'Oct', orders: 48, revenue: 14100, users: 28 },
    { month: 'Nov', orders: 61, revenue: 18900, users: 42 },
    { month: 'Déc', orders: 73, revenue: 22400, users: 56 },
    { month: 'Jan', orders: 89, revenue: 28700, users: 67 }
  ];

  const mockStats: ReportStats = {
    totalRevenue: 111800,
    totalOrders: 368,
    totalUsers: 247,
    totalSuppliers: 48,
    revenueChange: 15.3,
    ordersChange: 12.7,
    usersChange: 8.9,
    suppliersChange: 4.2
  };

  const [chartData] = useState<ChartData[]>(mockChartData);
  const [stats] = useState<ReportStats>(mockStats);

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (err: unknown) {
      console.error('Erreur lors du chargement des données:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedPeriod]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(1)}%`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));
  const maxOrders = Math.max(...chartData.map(d => d.orders));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Rapports et Analyses
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Analysez les performances de la plateforme
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="3months">3 derniers mois</option>
              <option value="6months">6 derniers mois</option>
              <option value="12months">12 derniers mois</option>
            </select>
            <Button onClick={() => console.log('Exporter rapport')} className="flex items-center gap-2">
              <Download size={16} />
              Exporter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenus totaux</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatPrice(stats.totalRevenue)}
                </p>
                <div className={`flex items-center mt-2 text-sm ${getChangeColor(stats.revenueChange)}`}>
                  {getChangeIcon(stats.revenueChange)}
                  <span className="ml-1">{formatPercent(stats.revenueChange)}</span>
                  <span className="text-gray-500 ml-1">vs période précédente</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Commandes</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalOrders.toLocaleString()}
                </p>
                <div className={`flex items-center mt-2 text-sm ${getChangeColor(stats.ordersChange)}`}>
                  {getChangeIcon(stats.ordersChange)}
                  <span className="ml-1">{formatPercent(stats.ordersChange)}</span>
                  <span className="text-gray-500 ml-1">vs période précédente</span>
                </div>
              </div>
              <ShoppingBag className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Utilisateurs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <div className={`flex items-center mt-2 text-sm ${getChangeColor(stats.usersChange)}`}>
                  {getChangeIcon(stats.usersChange)}
                  <span className="ml-1">{formatPercent(stats.usersChange)}</span>
                  <span className="text-gray-500 ml-1">vs période précédente</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fournisseurs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.totalSuppliers.toLocaleString()}
                </p>
                <div className={`flex items-center mt-2 text-sm ${getChangeColor(stats.suppliersChange)}`}>
                  {getChangeIcon(stats.suppliersChange)}
                  <span className="ml-1">{formatPercent(stats.suppliersChange)}</span>
                  <span className="text-gray-500 ml-1">vs période précédente</span>
                </div>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Évolution des Revenus
              </h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="h-64">
                <div className="flex items-end justify-between h-full space-x-2">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t relative">
                        <div
                          className="bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all duration-500"
                          style={{
                            height: `${(data.revenue / maxRevenue) * 200}px`,
                            minHeight: '4px'
                          }}
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-xs font-medium text-gray-900 dark:text-white">
                          {formatPrice(data.revenue)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {data.month}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Orders Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Évolution des Commandes
              </h3>
              <ShoppingBag className="h-5 w-5 text-gray-400" />
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="h-64">
                <div className="flex items-end justify-between h-full space-x-2">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t relative">
                        <div
                          className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500"
                          style={{
                            height: `${(data.orders / maxOrders) * 200}px`,
                            minHeight: '4px'
                          }}
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-xs font-medium text-gray-900 dark:text-white">
                          {data.orders}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {data.month}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Suppliers */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Top Fournisseurs
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Shanghai Electronics Co.', revenue: 45600, orders: 127 },
                { name: 'Guangzhou Textiles Ltd.', revenue: 32100, orders: 89 },
                { name: 'Beijing Machinery Works', revenue: 28900, orders: 72 },
                { name: 'Shenzhen Beauty Products', revenue: 21800, orders: 64 },
              ].map((supplier, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center mr-3">
                      <span className="text-white font-medium text-sm">
                        {supplier.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {supplier.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {supplier.orders} commandes
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatPrice(supplier.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Activité Récente
            </h3>
            <div className="space-y-4">
              {[
                { text: 'Nouvelle commande de Marie Dupont', time: 'Il y a 2h', type: 'order' },
                { text: 'Nouveau fournisseur approuvé', time: 'Il y a 4h', type: 'supplier' },
                { text: 'Commande livrée à Jean Martin', time: 'Il y a 6h', type: 'delivery' },
                { text: 'Nouveau utilisateur inscrit', time: 'Il y a 8h', type: 'user' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.text}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;
