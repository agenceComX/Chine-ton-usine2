import React, { useState, useEffect } from 'react';
import { Truck, Search, Eye, Package, MapPin, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import SupplierLayout from '../../layouts/SupplierLayout';

interface Shipment {
  id: string;
  trackingNumber: string;
  orderId: string;
  customerName: string;
  customerAddress: string;
  carrier: string;
  service: string;
  status: 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'exception';
  createdAt: Date;
  shippedAt?: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  weight: number;
  dimensions: string;
  value: number;
  items: {
    name: string;
    quantity: number;
  }[];
}

const ShipmentsPage: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  // Mock data for demonstration
  const mockShipments: Shipment[] = [
    {
      id: '1',
      trackingNumber: 'FR2024010001',
      orderId: 'ORD-2024-001',
      customerName: 'Marie Dupont',
      customerAddress: '123 Rue de la Paix, 75001 Paris, France',
      carrier: 'DHL Express',
      service: 'Express Worldwide',
      status: 'in_transit',
      createdAt: new Date('2024-01-10'),
      shippedAt: new Date('2024-01-12'),
      estimatedDelivery: new Date('2024-01-16'),
      weight: 2.5,
      dimensions: '30x25x15 cm',
      value: 679.97,
      items: [
        { name: 'Smartphone Android 128GB', quantity: 2 },
        { name: 'Écouteurs Bluetooth', quantity: 1 }
      ]
    },
    {
      id: '2',
      trackingNumber: 'FR2024010002',
      orderId: 'ORD-2024-002',
      customerName: 'Jean Martin',
      customerAddress: '456 Avenue des Champs, 69000 Lyon, France',
      carrier: 'UPS Standard',
      service: 'UPS Standard',
      status: 'delivered',
      createdAt: new Date('2024-01-08'),
      shippedAt: new Date('2024-01-09'),
      estimatedDelivery: new Date('2024-01-13'),
      actualDelivery: new Date('2024-01-12'),
      weight: 15.2,
      dimensions: '60x40x30 cm',
      value: 1274.25,
      items: [
        { name: 'T-shirt coton bio', quantity: 50 },
        { name: 'Jeans slim fit', quantity: 25 }
      ]
    },
    {
      id: '3',
      trackingNumber: 'FR2024010003',
      orderId: 'ORD-2024-003',
      customerName: 'Sophie Bernard',
      customerAddress: '789 Boulevard Industriel, 13000 Marseille, France',
      carrier: 'Colissimo',
      service: 'Colissimo Suivi',
      status: 'preparing',
      createdAt: new Date('2024-01-14'),
      estimatedDelivery: new Date('2024-01-18'),
      weight: 3.8,
      dimensions: '40x30x20 cm',
      value: 129.97,
      items: [
        { name: 'Perceuse électrique 18V', quantity: 1 },
        { name: 'Kit embouts', quantity: 2 }
      ]
    },
    {
      id: '4',
      trackingNumber: 'FR2024010004',
      orderId: 'ORD-2024-004',
      customerName: 'Pierre Dubois',
      customerAddress: '321 Rue de la Beauté, 33000 Bordeaux, France',
      carrier: 'FedEx',
      service: 'FedEx International Priority',
      status: 'shipped',
      createdAt: new Date('2024-01-05'),
      shippedAt: new Date('2024-01-07'),
      estimatedDelivery: new Date('2024-01-15'),
      weight: 1.2,
      dimensions: '25x20x10 cm',
      value: 203.95,
      items: [
        { name: 'Crème hydratante anti-âge', quantity: 3 },
        { name: 'Sérum vitamine C', quantity: 2 }
      ]
    },
    {
      id: '5',
      trackingNumber: 'FR2024010005',
      orderId: 'ORD-2024-005',
      customerName: 'Lucie Moreau',
      customerAddress: '654 Place du Commerce, 59000 Lille, France',
      carrier: 'Chronopost',
      service: 'Chronopost Express',
      status: 'exception',
      createdAt: new Date('2024-01-12'),
      shippedAt: new Date('2024-01-13'),
      estimatedDelivery: new Date('2024-01-15'),
      weight: 0.8,
      dimensions: '20x15x8 cm',
      value: 199.99,
      items: [
        { name: 'Tablette 10 pouces', quantity: 1 }
      ]
    }
  ];

  // Load shipments
  const loadShipments = async () => {
    setLoading(true);
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setShipments(mockShipments);
    } catch (err: unknown) {
      console.error('Erreur lors du chargement:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des expéditions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  // Filter shipments
  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      preparing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      in_transit: 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      exception: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      preparing: <Package size={14} />,
      shipped: <Truck size={14} />,
      in_transit: <Truck size={14} />,
      delivered: <CheckCircle size={14} />,
      exception: <AlertTriangle size={14} />
    };
    return icons[status as keyof typeof icons] || <Package size={14} />;
  };

  const getStatusText = (status: string) => {
    const texts = {
      preparing: 'Préparation',
      shipped: 'Expédiée',
      in_transit: 'En transit',
      delivered: 'Livrée',
      exception: 'Exception'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  return (
    <SupplierLayout>
      <div className="space-y-6">
        {/* Bouton retour */}
        <BackButton to="/supplier/dashboard" label="Retour au tableau de bord" variant="ghost" />

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mes Expéditions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Suivez et gérez toutes vos expéditions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Préparation</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {shipments.filter(s => s.status === 'preparing').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expédiées</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {shipments.filter(s => s.status === 'shipped').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">En transit</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {shipments.filter(s => s.status === 'in_transit').length}
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
                  {shipments.filter(s => s.status === 'delivered').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Exceptions</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {shipments.filter(s => s.status === 'exception').length}
                </p>
              </div>
            </div>
          </div>
        </div>        {/* Filters */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher par numéro de suivi, commande ou client..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Tous les statuts</option>
                <option value="preparing">Préparation</option>
                <option value="shipped">Expédiée</option>
                <option value="in_transit">En transit</option>
                <option value="delivered">Livrée</option>
                <option value="exception">Exception</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Chargement...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Expédition
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Transporteur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Valeur
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {shipment.trackingNumber}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Commande: {shipment.orderId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {shipment.customerName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <MapPin size={12} />
                            {shipment.customerAddress.split(',')[0]}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white font-medium">
                            {shipment.carrier}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {shipment.service}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                          {getStatusIcon(shipment.status)}
                          {getStatusText(shipment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            Créée: {formatDate(shipment.createdAt)}
                          </div>
                          {shipment.shippedAt && (
                            <div className="flex items-center gap-1">
                              <Truck size={12} />
                              Expédiée: {formatDate(shipment.shippedAt)}
                            </div>
                          )}
                          {shipment.estimatedDelivery && (
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              Livraison prévue: {formatDate(shipment.estimatedDelivery)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatPrice(shipment.value)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {shipment.weight} kg
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          onClick={() => console.log('View shipment:', shipment)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Eye size={14} />
                          Suivre
                        </Button>
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
    </SupplierLayout>
  );
};

export default ShipmentsPage;
