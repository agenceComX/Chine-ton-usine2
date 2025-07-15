import React, { useState, useEffect } from 'react';
import { Users, Search, Eye, MessageSquare, MapPin, Calendar, Mail, Phone, ShoppingBag } from 'lucide-react';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import SupplierLayout from '../../layouts/SupplierLayout';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  joinedDate: Date;
  status: 'active' | 'inactive';
  avatar?: string;
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  // Mock data for demonstration
  const mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'Marie Dupont',
      email: 'marie.dupont@entreprise.fr',
      phone: '+33 1 23 45 67 89',
      company: 'Tech Solutions SARL',
      location: 'Paris, France',
      totalOrders: 12,
      totalSpent: 15680.50,
      lastOrderDate: new Date('2024-01-14'),
      joinedDate: new Date('2023-06-15'),
      status: 'active'
    },
    {
      id: '2',
      name: 'Jean Martin',
      email: 'j.martin@boutique-mode.com',
      phone: '+33 4 56 78 90 12',
      company: 'Boutique Mode & Style',
      location: 'Lyon, France',
      totalOrders: 8,
      totalSpent: 8450.00,
      lastOrderDate: new Date('2024-01-10'),
      joinedDate: new Date('2023-09-20'),
      status: 'active'
    },
    {
      id: '3',
      name: 'Sophie Bernard',
      email: 'sophie.bernard@gmail.com',
      location: 'Marseille, France',
      totalOrders: 3,
      totalSpent: 2100.75,
      lastOrderDate: new Date('2023-12-18'),
      joinedDate: new Date('2023-11-05'),
      status: 'inactive'
    },
    {
      id: '4',
      name: 'Pierre Dubois',
      email: 'p.dubois@construction-pro.fr',
      phone: '+33 2 34 56 78 90',
      company: 'Construction Pro',
      location: 'Nantes, France',
      totalOrders: 25,
      totalSpent: 42300.20,
      lastOrderDate: new Date('2024-01-12'),
      joinedDate: new Date('2023-03-10'),
      status: 'active'
    },
    {
      id: '5',
      name: 'Lucie Moreau',
      email: 'lucie.moreau@beauty-center.fr',
      company: 'Beauty Center',
      location: 'Bordeaux, France',
      totalOrders: 15,
      totalSpent: 18900.40,
      lastOrderDate: new Date('2024-01-08'),
      joinedDate: new Date('2023-07-22'),
      status: 'active'
    }
  ];

  // Load customers
  const loadCustomers = async () => {
    setLoading(true);
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setCustomers(mockCustomers);
    } catch (err: unknown) {
      console.error('Erreur lors du chargement:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getTotalRevenue = () => {
    return customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  };
  return (
    <SupplierLayout>
      <div className="space-y-6">
        {/* Bouton retour */}
        <BackButton to="/supplier/dashboard" label="Retour au tableau de bord" variant="ghost" />

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mes Clients
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos relations clients et suivez leur activité
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total clients</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{customers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Clients actifs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {customers.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Commandes totales</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">€</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Chiffre d'affaires</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatPrice(getTotalRevenue())}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou entreprise..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                />
              </div>
            </div>            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers Grid */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-medium text-lg">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {customer.name}
                        </h3>
                        {customer.company && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {customer.company}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Mail size={14} className="mr-2" />
                      {customer.email}
                    </div>
                    {customer.phone && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Phone size={14} className="mr-2" />
                        {customer.phone}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin size={14} className="mr-2" />
                      {customer.location}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{customer.totalOrders}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Commandes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatPrice(customer.totalSpent)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total dépensé</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          Client depuis {formatDate(customer.joinedDate)}
                        </div>
                        {customer.lastOrderDate && (
                          <div className="flex items-center gap-1 mt-1">
                            <ShoppingBag size={12} />
                            Dernière commande: {formatDate(customer.lastOrderDate)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => console.log('View customer:', customer)}
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <Eye size={14} />
                        Voir
                      </Button>
                      <Button
                        onClick={() => console.log('Message customer:', customer)}
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <MessageSquare size={14} />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
};

export default CustomersPage;
