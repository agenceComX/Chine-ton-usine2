import React, { useState, useEffect } from 'react';
import { Package, Search, Eye, Pencil, Trash2, Plus, MapPin, Star, TrendingUp } from 'lucide-react';
import Button from '../../components/Button';
import AdminLayout from '../../layouts/AdminLayout';

interface Supplier {
  id: string;
  name: string;
  email: string;
  location: string;
  specialties: string[];
  rating: number;
  totalProducts: number;
  totalOrders: number;
  status: 'active' | 'pending' | 'suspended';
  joinedDate: Date;
  lastActivity: Date;
  image?: string;
}

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  // Mock data for demonstration
  const mockSuppliers: Supplier[] = [
    {
      id: '1',
      name: 'Shanghai Electronics Co.',
      email: 'contact@shanghai-electronics.com',
      location: 'Shanghai, Chine',
      specialties: ['Électronique', 'Composants', 'Gadgets'],
      rating: 4.8,
      totalProducts: 1247,
      totalOrders: 892,
      status: 'active',
      joinedDate: new Date('2023-01-15'),
      lastActivity: new Date('2024-01-14'),
      image: '/public/categories/electronics.svg'
    },
    {
      id: '2',
      name: 'Guangzhou Textiles Ltd.',
      email: 'info@gz-textiles.com',
      location: 'Guangzhou, Chine',
      specialties: ['Textile', 'Vêtements', 'Mode'],
      rating: 4.6,
      totalProducts: 856,
      totalOrders: 634,
      status: 'active',
      joinedDate: new Date('2023-03-20'),
      lastActivity: new Date('2024-01-13'),
      image: '/public/categories/clothing.svg'
    },
    {
      id: '3',
      name: 'Beijing Machinery Works',
      email: 'sales@beijing-machinery.com',
      location: 'Beijing, Chine',
      specialties: ['Machines', 'Outils', 'Industriel'],
      rating: 4.9,
      totalProducts: 423,
      totalOrders: 178,
      status: 'pending',
      joinedDate: new Date('2023-12-10'),
      lastActivity: new Date('2024-01-10'),
      image: '/public/categories/machinery.svg'
    },
    {
      id: '4',
      name: 'Shenzhen Beauty Products',
      email: 'hello@sz-beauty.com',
      location: 'Shenzhen, Chine',
      specialties: ['Beauté', 'Cosmétiques', 'Soins'],
      rating: 4.4,
      totalProducts: 678,
      totalOrders: 445,
      status: 'suspended',
      joinedDate: new Date('2023-06-05'),
      lastActivity: new Date('2023-12-25'),
      image: '/public/categories/beauty.svg'
    }
  ];

  // Load suppliers
  const loadSuppliers = async () => {
    setLoading(true);
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuppliers(mockSuppliers);
    } catch (err: unknown) {
      console.error('Erreur lors du chargement des fournisseurs:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des fournisseurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'Actif',
      pending: 'En attente',
      suspended: 'Suspendu'
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestion des Fournisseurs
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez tous les fournisseurs de la plateforme
            </p>
          </div>
          <Button onClick={() => console.log('Ajouter fournisseur')} className="flex items-center gap-2">
            <Plus size={16} />
            Nouveau fournisseur
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{suppliers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Actifs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {suppliers.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">En attente</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {suppliers.filter(s => s.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Suspendus</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {suppliers.filter(s => s.status === 'suspended').length}
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
                  placeholder="Rechercher par nom, email ou localisation..."
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
                <option value="active">Actif</option>
                <option value="pending">En attente</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Suppliers Grid */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Chargement...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center">
                        {supplier.image ? (
                          <img src={supplier.image} alt={supplier.name} className="h-8 w-8" />
                        ) : (
                          <span className="text-white font-medium text-lg">
                            {supplier.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {supplier.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(supplier.rating)}
                          <span className="text-xs text-gray-500 ml-1">{supplier.rating}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(supplier.status)}`}>
                      {getStatusText(supplier.status)}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <MapPin size={14} className="mr-1" />
                    {supplier.location}
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {supplier.specialties.slice(0, 3).map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                      {supplier.specialties.length > 3 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded">
                          +{supplier.specialties.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{supplier.totalProducts}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Produits</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{supplier.totalOrders}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Commandes</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Rejoint le {formatDate(supplier.joinedDate)}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => console.log('View supplier:', supplier)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => console.log('Edit supplier:', supplier)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => console.log('Delete supplier:', supplier)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </button>
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
    </AdminLayout>
  );
};

export default SuppliersPage;
