import React, { useState, useEffect } from 'react';
import { Database, Server, HardDrive, Activity, Download, Upload, RefreshCw, AlertCircle, CheckCircle, Clock, Trash2 } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';

interface DatabaseStats {
    totalSize: string;
    tables: number;
    records: number;
    connections: number;
    uptime: string;
    lastBackup: Date;
    nextBackup: Date;
}

interface BackupFile {
    id: string;
    name: string;
    size: string;
    date: Date;
    type: 'manual' | 'automatic';
    status: 'completed' | 'failed' | 'in_progress';
}

interface TableInfo {
    name: string;
    records: number;
    size: string;
    lastUpdated: Date;
    status: 'healthy' | 'warning' | 'error';
}

const DatabasePage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [backupLoading, setBackupLoading] = useState(false);
    const [stats, setStats] = useState<DatabaseStats>({
        totalSize: '2.4 GB',
        tables: 15,
        records: 45672,
        connections: 8,
        uptime: '15 jours 8h 32m',
        lastBackup: new Date('2024-06-15T02:00:00'),
        nextBackup: new Date('2024-06-16T02:00:00')
    });

    const [backups, setBackups] = useState<BackupFile[]>([
        {
            id: '1',
            name: 'backup_20240615_020000.sql',
            size: '2.1 GB',
            date: new Date('2024-06-15T02:00:00'),
            type: 'automatic',
            status: 'completed'
        },
        {
            id: '2',
            name: 'backup_manual_20240614_143000.sql',
            size: '2.0 GB',
            date: new Date('2024-06-14T14:30:00'),
            type: 'manual',
            status: 'completed'
        },
        {
            id: '3',
            name: 'backup_20240614_020000.sql',
            size: '1.9 GB',
            date: new Date('2024-06-14T02:00:00'),
            type: 'automatic',
            status: 'completed'
        }
    ]);

    const [tables, setTables] = useState<TableInfo[]>([
        {
            name: 'users',
            records: 1250,
            size: '45 MB',
            lastUpdated: new Date('2024-06-15T10:30:00'),
            status: 'healthy'
        },
        {
            name: 'products',
            records: 8940,
            size: '320 MB',
            lastUpdated: new Date('2024-06-15T09:45:00'),
            status: 'healthy'
        },
        {
            name: 'orders',
            records: 15680,
            size: '180 MB',
            lastUpdated: new Date('2024-06-15T11:20:00'),
            status: 'healthy'
        },
        {
            name: 'suppliers',
            records: 456,
            size: '12 MB',
            lastUpdated: new Date('2024-06-15T08:15:00'),
            status: 'healthy'
        },
        {
            name: 'logs',
            records: 18560,
            size: '890 MB',
            lastUpdated: new Date('2024-06-15T11:30:00'),
            status: 'warning'
        }
    ]);

    const createBackup = async () => {
        setBackupLoading(true);
        try {
            // Simuler la création d'une sauvegarde
            await new Promise(resolve => setTimeout(resolve, 3000));

            const newBackup: BackupFile = {
                id: Date.now().toString(),
                name: `backup_manual_${new Date().toISOString().replace(/[:.]/g, '_').slice(0, -5)}.sql`,
                size: '2.4 GB',
                date: new Date(),
                type: 'manual',
                status: 'completed'
            };

            setBackups(prev => [newBackup, ...prev]);

            // Mettre à jour les stats
            setStats(prev => ({
                ...prev,
                lastBackup: new Date()
            }));

        } catch (error) {
            console.error('Erreur lors de la création de la sauvegarde:', error);
        } finally {
            setBackupLoading(false);
        }
    };

    const deleteBackup = (backupId: string) => {
        setBackups(prev => prev.filter(backup => backup.id !== backupId));
    };

    const downloadBackup = (backup: BackupFile) => {
        // Simuler le téléchargement
        console.log('Téléchargement de la sauvegarde:', backup.name);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy':
                return 'text-green-500';
            case 'warning':
                return 'text-orange-500';
            case 'error':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle className="w-4 h-4" />;
            case 'warning':
                return <AlertCircle className="w-4 h-4" />;
            case 'error':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                {/* En-tête */}
                <BackButton to="/admin/dashboard" label="Retour au tableau de bord" variant="ghost" />

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Gestion de la Base de Données
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Surveillez et gérez votre base de données, créez des sauvegardes et analysez les performances
                    </p>
                </div>

                {/* Statistiques générales */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <HardDrive className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Taille totale</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalSize}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Database className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tables</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.tables}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Activity className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Enregistrements</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {stats.records.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Server className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Connexions</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.connections}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statut du serveur */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Statut du Serveur
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</span>
                                <span className="text-sm text-gray-900 dark:text-white">{stats.uptime}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Dernière sauvegarde</span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                    {stats.lastBackup.toLocaleString('fr-FR')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Prochaine sauvegarde</span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                    {stats.nextBackup.toLocaleString('fr-FR')}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <p className="text-sm font-medium text-green-600">Serveur en ligne</p>
                                <p className="text-xs text-gray-500">Toutes les connexions fonctionnent</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gestion des sauvegardes */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Sauvegardes
                            </h2>
                            <Button
                                onClick={createBackup}
                                disabled={backupLoading}
                                className="flex items-center gap-2"
                            >
                                {backupLoading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Création en cours...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Créer une sauvegarde
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Nom du fichier
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Taille
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {backups.map((backup) => (
                                    <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {backup.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {backup.size}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {backup.date.toLocaleString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${backup.type === 'automatic'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}>
                                                {backup.type === 'automatic' ? 'Automatique' : 'Manuelle'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${backup.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : backup.status === 'failed'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {backup.status === 'completed' ? 'Terminé' :
                                                    backup.status === 'failed' ? 'Échec' : 'En cours'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => downloadBackup(backup)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Télécharger"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteBackup(backup.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* État des tables */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            État des Tables
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Table
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Enregistrements
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Taille
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Dernière mise à jour
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Statut
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {tables.map((table) => (
                                    <tr key={table.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {table.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {table.records.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {table.size}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {table.lastUpdated.toLocaleString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`flex items-center gap-1 ${getStatusColor(table.status)}`}>
                                                {getStatusIcon(table.status)}
                                                <span className="capitalize text-sm">{table.status}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default DatabasePage;
