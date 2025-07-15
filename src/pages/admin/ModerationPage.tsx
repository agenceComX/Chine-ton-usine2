import React, { useState, useEffect } from 'react';
import { Shield, Eye, CheckCircle, XCircle, AlertTriangle, MessageSquare, User, Package } from 'lucide-react';
import Button from '../../components/Button';
import AdminLayout from '../../layouts/AdminLayout';

interface ModerationItem {
  id: string;
  type: 'user' | 'product' | 'review' | 'message';
  title: string;
  description: string;
  reportedBy: string;
  reportedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  content?: string;
  images?: string[];
}

const ModerationPage: React.FC = () => {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');

  // Mock data for demonstration
  const mockItems: ModerationItem[] = [
    {
      id: '1',
      type: 'product',
      title: 'Produit suspect signalé',
      description: 'Produit potentiellement contrefait - iPhone 15 à 50€',
      reportedBy: 'client.secure@email.com',
      reportedAt: new Date('2024-01-15T10:30:00'),
      status: 'pending',
      priority: 'high',
      content: 'Ce produit semble être une contrefaçon. Le prix est anormalement bas et les images ne correspondent pas à un vrai iPhone.',
      images: ['/public/categories/electronics.svg']
    },
    {
      id: '2',
      type: 'user',
      title: 'Comportement suspect utilisateur',
      description: 'Utilisateur créant de multiples comptes',
      reportedBy: 'moderator@chinetousine.com',
      reportedAt: new Date('2024-01-14T16:45:00'),
      status: 'pending',
      priority: 'medium',
      content: 'Cet utilisateur a créé 5 comptes avec des emails similaires en 24h.'
    },
    {
      id: '3',
      type: 'review',
      title: 'Avis inapproprié',
      description: 'Avis contenant un langage inapproprié',
      reportedBy: 'autre.client@email.com',
      reportedAt: new Date('2024-01-14T09:20:00'),
      status: 'approved',
      priority: 'low',
      content: 'Avis validé après révision - pas de contenu inapproprié détecté.'
    },
    {
      id: '4',
      type: 'message',
      title: 'Message de spam',
      description: 'Message commercial non sollicité',
      reportedBy: 'destinataire@email.com',
      reportedAt: new Date('2024-01-13T14:15:00'),
      status: 'rejected',
      priority: 'high',
      content: 'Message de spam confirmé et utilisateur sanctionné.'
    }
  ];

  // Load moderation items
  const loadItems = async () => {
    setLoading(true);
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setItems(mockItems);
    } catch (err: unknown) {
      console.error('Erreur lors du chargement:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des éléments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesType = filterType === '' || item.type === filterType;
    const matchesStatus = filterStatus === '' || item.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      user: <User size={16} />,
      product: <Package size={16} />,
      review: <MessageSquare size={16} />,
      message: <MessageSquare size={16} />
    };
    return icons[type as keyof typeof icons] || <AlertTriangle size={16} />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      user: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      product: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      review: 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
      message: 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      high: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      approved: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <AlertTriangle size={14} />,
      approved: <CheckCircle size={14} />,
      rejected: <XCircle size={14} />
    };
    return icons[status as keyof typeof icons] || <AlertTriangle size={14} />;
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

  const handleApprove = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'approved' as const } : item
    ));
    console.log('Approved item:', id);
  };

  const handleReject = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'rejected' as const } : item
    ));
    console.log('Rejected item:', id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Modération
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez les signalements et modérez le contenu de la plateforme
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">En attente</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {items.filter(i => i.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Approuvés</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {items.filter(i => i.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rejetés</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {items.filter(i => i.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Priorité élevée</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {items.filter(i => i.priority === 'high').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48">
              <select
                value={filterType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Tous les types</option>
                <option value="user">Utilisateur</option>
                <option value="product">Produit</option>
                <option value="review">Avis</option>
                <option value="message">Message</option>
              </select>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={filterStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>
          </div>
        </div>

        {/* Moderation Items */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Chargement...</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                        {item.type}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {item.status}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {item.description}
                    </p>
                    {item.content && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {item.content}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Signalé par: {item.reportedBy}</span>
                      <span>{formatDate(item.reportedAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {item.status === 'pending' && (
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        onClick={() => console.log('View details:', item)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye size={14} />
                        Voir
                      </Button>
                      <Button
                        onClick={() => handleApprove(item.id)}
                        size="sm"
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={14} />
                        Approuver
                      </Button>
                      <Button
                        onClick={() => handleReject(item.id)}
                        size="sm"
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700"
                      >
                        <XCircle size={14} />
                        Rejeter
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
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

export default ModerationPage;
