import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, Package, Truck, CheckCircle, XCircle, Calendar, DollarSign } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  supplierName: string;
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: string;
  notes?: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  // Mock data for demonstration
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerName: 'Marie Dupont',
      customerEmail: 'marie.dupont@email.com',
      supplierName: 'Shanghai Electronics Co.',
      products: [
        { name: 'Smartphone Android 128GB', quantity: 2, price: 299.99 },
        { name: 'Écouteurs Bluetooth', quantity: 1, price: 79.99 }
      ],
      totalAmount: 679.97,
      status: 'shipped',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      shippingAddress: '123 Rue de la Paix, 75001 Paris, France',
      notes: 'Livraison urgente demandée'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerName: 'Jean Martin',
      customerEmail: 'jean.martin@email.com',
      supplierName: 'Guangzhou Textiles Ltd.',
      products: [
        { name: 'T-shirt coton bio', quantity: 50, price: 12.99 },
        { name: 'Jeans slim fit', quantity: 25, price: 24.99 }
      ],
      totalAmount: 1274.25,
      status: 'confirmed',
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-09'),
      shippingAddress: '456 Avenue des Champs, 69000 Lyon, France'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customerName: 'Sophie Bernard',
      customerEmail: 'sophie.bernard@email.com',
      supplierName: 'Beijing Machinery Works',
      products: [
        { name: 'Perceuse électrique 18V', quantity: 1, price: 89.99 },
        { name: 'Kit embouts', quantity: 2, price: 19.99 }
      ],
      totalAmount: 129.97,
      status: 'pending',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14'),
      shippingAddress: '789 Boulevard Industriel, 13000 Marseille, France'
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      customerName: 'Pierre Dubois',
      customerEmail: 'pierre.dubois@email.com',
      supplierName: 'Shenzhen Beauty Products',
      products: [
        { name: 'Crème hydratante anti-âge', quantity: 3, price: 45.99 },
        { name: 'Sérum vitamine C', quantity: 2, price: 32.99 }
      ],
      totalAmount: 203.95,
      status: 'delivered',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-11'),
      shippingAddress: '321 Rue de la Beauté, 33000 Bordeaux, France'
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-005',
      customerName: 'Lucie Moreau',
      customerEmail: 'lucie.moreau@email.com',
      supplierName: 'Shanghai Electronics Co.',
      products: [
        { name: 'Tablette 10 pouces', quantity: 1, price: 199.99 }
      ],
      totalAmount: 199.99,
      status: 'cancelled',
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-13'),
      shippingAddress: '654 Place du Commerce, 59000 Lille, France',
      notes: 'Annulé par le client'
    }
  ];

  // Load orders
  const loadOrders = async () => {
    setLoading(true);
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setOrders(mockOrders);
    } catch (err: unknown) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      shipped: 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Package size={14} />,
      confirmed: <CheckCircle size={14} />,
      shipped: <Truck size={14} />,
      delivered: <CheckCircle size={14} />,
      cancelled: <XCircle size={14} />
    };
    return icons[status as keyof typeof icons] || <Package size={14} />;
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestion des Commandes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Suivez et gérez toutes les commandes de la plateforme
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">En attente</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expédiées</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {orders.filter(o => o.status === 'shipped').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Livrées</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenus</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatPrice(getTotalRevenue())}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher par numéro, client ou fournisseur..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Chargement...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Commande
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Fournisseur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Produits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.orderNumber}
                        </div>
                        {order.notes && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {order.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.customerName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.customerEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {order.supplierName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {order.products.length} produit{order.products.length > 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {order.products[0]?.name}
                          {order.products.length > 1 && ` +${order.products.length - 1} autre${order.products.length > 2 ? 's' : ''}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatPrice(order.totalAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => console.log('View order:', order)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

export default OrdersPage;
