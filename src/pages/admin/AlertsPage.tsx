import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, Bell, Search, MoreVertical, X, Check } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';

interface Alert {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    source: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: 'system' | 'security' | 'user' | 'order' | 'payment' | 'supplier';
}

const AlertsPage: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    // Données fictives pour démonstration
    const mockAlerts: Alert[] = [
        {
            id: '1',
            type: 'error',
            title: 'Échec de paiement critique',
            message: 'Plusieurs échecs de paiement détectés pour le fournisseur Shanghai Electronics Co.',
            timestamp: new Date('2024-06-15T10:30:00'),
            isRead: false,
            source: 'Payment Gateway',
            priority: 'critical',
            category: 'payment'
        },
        {
            id: '2',
            type: 'warning',
            title: 'Stock faible détecté',
            message: 'Le produit "Composants électroniques" a un stock inférieur au seuil minimum.',
            timestamp: new Date('2024-06-15T09:15:00'),
            isRead: false,
            source: 'Inventory System',
            priority: 'high',
            category: 'system'
        },
        {
            id: '3',
            type: 'info',
            title: 'Nouveau fournisseur inscrit',
            message: 'Beijing Manufacturing Ltd. s\'est inscrit et attend validation.',
            timestamp: new Date('2024-06-15T08:45:00'),
            isRead: true,
            source: 'User Management',
            priority: 'medium',
            category: 'supplier'
        },
        {
            id: '4',
            type: 'warning',
            title: 'Tentative de connexion suspecte',
            message: 'Plusieurs tentatives de connexion échouées depuis l\'IP 192.168.1.100.',
            timestamp: new Date('2024-06-14T23:30:00'),
            isRead: false,
            source: 'Security Monitor',
            priority: 'high',
            category: 'security'
        },
        {
            id: '5',
            type: 'success',
            title: 'Sauvegarde terminée',
            message: 'La sauvegarde quotidienne de la base de données s\'est terminée avec succès.',
            timestamp: new Date('2024-06-14T22:00:00'),
            isRead: true,
            source: 'Backup System',
            priority: 'low',
            category: 'system'
        },
        {
            id: '6',
            type: 'error',
            title: 'Erreur de synchronisation',
            message: 'Échec de synchronisation avec l\'API externe du fournisseur Guangzhou Tech.',
            timestamp: new Date('2024-06-14T16:20:00'),
            isRead: false,
            source: 'API Gateway',
            priority: 'medium',
            category: 'system'
        }
    ];

    useEffect(() => {
        setLoading(true);
        // Simuler le chargement
        setTimeout(() => {
            setAlerts(mockAlerts);
            setLoading(false);
        }, 1000);
    }, []);

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'info':
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getPriorityBadge = (priority: string) => {
        const colors = {
            critical: 'bg-red-600 text-white',
            high: 'bg-orange-500 text-white',
            medium: 'bg-yellow-500 text-black',
            low: 'bg-gray-400 text-white'
        };
        return colors[priority as keyof typeof colors] || colors.low;
    };

    const markAsRead = (alertId: string) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === alertId ? { ...alert, isRead: true } : alert
        ));
    };

    const markAllAsRead = () => {
        setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
    };

    const deleteAlert = (alertId: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    };

    // Filtrage des alertes
    const filteredAlerts = alerts.filter(alert => {
        const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || alert.type === filterType;
        const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
        const matchesReadStatus = !showUnreadOnly || !alert.isRead;

        return matchesSearch && matchesType && matchesPriority && matchesReadStatus;
    });

    const unreadCount = alerts.filter(alert => !alert.isRead).length;
    const criticalCount = alerts.filter(alert => alert.priority === 'critical').length;

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                {/* En-tête */}
                <div className="flex items-center justify-between">
                    <BackButton to="/admin/dashboard" label="Retour au tableau de bord" variant="ghost" />
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Bell className="w-4 h-4" />
                            <span>{unreadCount} non lues</span>
                            {criticalCount > 0 && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                    {criticalCount} critiques
                                </span>
                            )}
                        </div>
                        <Button onClick={markAllAsRead} variant="outline" size="sm">
                            <Check className="w-4 h-4 mr-1" />
                            Tout marquer comme lu
                        </Button>
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Centre d'Alertes
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Surveillez et gérez toutes les alertes système en temps réel
                    </p>
                </div>

                {/* Statistiques rapides */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Critiques</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{criticalCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <AlertTriangle className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avertissements</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {alerts.filter(a => a.type === 'warning').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Info className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Informations</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {alerts.filter(a => a.type === 'info').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Bell className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Non lues</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{unreadCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres et recherche */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Rechercher dans les alertes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="all">Tous les types</option>
                                <option value="error">Erreurs</option>
                                <option value="warning">Avertissements</option>
                                <option value="info">Informations</option>
                                <option value="success">Succès</option>
                            </select>

                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="all">Toutes priorités</option>
                                <option value="critical">Critique</option>
                                <option value="high">Élevée</option>
                                <option value="medium">Moyenne</option>
                                <option value="low">Faible</option>
                            </select>

                            <label className="flex items-center gap-2 px-3 py-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={showUnreadOnly}
                                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-gray-700 dark:text-gray-300">Non lues seulement</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Liste des alertes */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">Chargement des alertes...</p>
                        </div>
                    ) : filteredAlerts.length === 0 ? (
                        <div className="p-8 text-center">
                            <Bell className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune alerte</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {alerts.length === 0 ? 'Aucune alerte pour le moment.' : 'Aucune alerte ne correspond aux filtres appliqués.'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredAlerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!alert.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3 flex-1">
                                            <div className="flex-shrink-0 mt-1">
                                                {getAlertIcon(alert.type)}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`text-sm font-medium ${!alert.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                        {alert.title}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(alert.priority)}`}>
                                                        {alert.priority.toUpperCase()}
                                                    </span>
                                                    {!alert.isRead && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            Nouveau
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {alert.message}
                                                </p>

                                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                    <span>📍 {alert.source}</span>
                                                    <span>🏷️ {alert.category}</span>
                                                    <span>⏰ {alert.timestamp.toLocaleString('fr-FR')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            {!alert.isRead && (
                                                <button
                                                    onClick={() => markAsRead(alert.id)}
                                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Marquer comme lu"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => deleteAlert(alert.id)}
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Supprimer"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>

                                            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AlertsPage;
