import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Users,
    Shield,
    UserPlus,
    Trash2,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    Settings,
    Eye,
    Download
} from 'lucide-react';

interface UserSummary {
    total: number;
    byRole: {
        admin: number;
        supplier: number;
        customer: number;
        sourcer: number;
        influencer: number;
    };
    active: number;
    inactive: number;
}

const ProductionUserManagement: React.FC = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState<UserSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isPurging, setIsPurging] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        name: '',
        role: 'customer' as const,
        company: '',
        phone: ''
    });

    // Vérifier les permissions
    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
                    <p className="text-gray-600">Seuls les administrateurs peuvent accéder à cette page.</p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        loadSummary();
    }, []);

    const loadSummary = async () => {
        try {
            setLoading(true);

            if ((window as any).productionUserService) {
                const summaryData = await (window as any).productionUserService.getUsersSummary();
                setSummary(summaryData);
            } else {
                setMessage({
                    type: 'error',
                    text: 'Service de gestion des utilisateurs non disponible'
                });
            }
        } catch (error: any) {
            console.error('Erreur chargement résumé:', error);
            setMessage({
                type: 'error',
                text: `Erreur: ${error.message}`
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEssentialUsers = async () => {
        setIsCreating(true);
        setMessage(null);

        try {
            if (!(window as any).productionUserService) {
                throw new Error('Service non disponible');
            }

            const result = await (window as any).productionUserService.createEssentialProductionUsers();

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: `${result.created.length} utilisateurs essentiels créés avec succès`
                });

                // Afficher les identifiants dans la console
                console.log('\n🔐 === IDENTIFIANTS CRÉÉS ===');
                result.credentials.forEach((cred: any) => {
                    console.log(`📧 ${cred.email} | 🔑 ${cred.password} | 👤 ${cred.name}`);
                });

                await loadSummary();
            } else {
                setMessage({
                    type: 'warning',
                    text: `Création partielle: ${result.created.length} créés, ${result.failed.length} échecs`
                });
            }

        } catch (error: any) {
            console.error('Erreur création utilisateurs:', error);
            setMessage({
                type: 'error',
                text: `Erreur: ${error.message}`
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handlePurgeUsers = async () => {
        const confirmed = confirm(`
⚠️ ATTENTION: OPÉRATION IRRÉVERSIBLE

Vous allez supprimer TOUS les utilisateurs existants.

Cette action ne peut pas être annulée.

Êtes-vous absolument certain de vouloir continuer ?`);

        if (!confirmed) return;

        setIsPurging(true);
        setMessage(null);

        try {
            if (!(window as any).productionUserService) {
                throw new Error('Service non disponible');
            }

            const result = await (window as any).productionUserService.purgeAllUsers();

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: `${result.deletedCount} utilisateurs supprimés avec succès`
                });
            } else {
                setMessage({
                    type: 'warning',
                    text: `Suppression partielle: ${result.deletedCount} supprimés, ${result.errors.length} erreurs`
                });
            }

            await loadSummary();

        } catch (error: any) {
            console.error('Erreur purge utilisateurs:', error);
            setMessage({
                type: 'error',
                text: `Erreur: ${error.message}`
            });
        } finally {
            setIsPurging(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        setMessage(null);

        try {
            if (!(window as any).productionUserService) {
                throw new Error('Service non disponible');
            }

            const result = await (window as any).productionUserService.createProductionUser({
                email: newUser.email,
                password: newUser.password,
                name: newUser.name,
                role: newUser.role,
                isActive: true,
                additionalData: {
                    company: newUser.company || undefined,
                    phone: newUser.phone || undefined
                }
            });

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: `Utilisateur ${newUser.email} créé avec succès`
                });

                // Réinitialiser le formulaire
                setNewUser({
                    email: '',
                    password: '',
                    name: '',
                    role: 'customer',
                    company: '',
                    phone: ''
                });
                setShowCreateForm(false);

                await loadSummary();
            } else {
                setMessage({
                    type: 'error',
                    text: `Erreur: ${result.error}`
                });
            }

        } catch (error: any) {
            console.error('Erreur création utilisateur:', error);
            setMessage({
                type: 'error',
                text: `Erreur: ${error.message}`
            });
        } finally {
            setIsCreating(false);
        }
    };

    const downloadCredentials = () => {
        const content = `
IDENTIFIANTS CHINE TON USINE - PRODUCTION
=====================================

ADMINISTRATEURS:
• admin@chinetonusine.com | ProductionAdmin2024!
• admin.backup@chinetonusine.com | BackupAdmin2024!
• support@chinetonusine.com | SupportTeam2024!

LIENS:
• Connexion: ${window.location.origin}/login
• Admin: ${window.location.origin}/admin/dashboard

SÉCURITÉ:
• Changez les mots de passe dès la première connexion
• Ne partagez jamais ces identifiants
• Surveillez les connexions suspectes

Date de génération: ${new Date().toLocaleString()}
`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chine-ton-usine-credentials-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement des données...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                                Gestion des Utilisateurs - Production
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Interface sécurisée pour la gestion des comptes utilisateurs
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={downloadCredentials}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger les identifiants
                            </button>
                            <button
                                onClick={loadSummary}
                                disabled={loading}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Actualiser
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg border flex items-start ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                            message.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" /> :
                            <AlertTriangle className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />}
                        <p>{message.text}</p>
                    </div>
                )}

                {/* Statistiques */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                                    <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Administrateurs</p>
                                    <p className="text-3xl font-bold text-gray-900">{summary.byRole.admin}</p>
                                </div>
                                <Shield className="h-8 w-8 text-red-600" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                                    <p className="text-3xl font-bold text-green-600">{summary.active}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Fournisseurs</p>
                                    <p className="text-3xl font-bold text-gray-900">{summary.byRole.supplier}</p>
                                </div>
                                <Settings className="h-8 w-8 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions principales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Création des utilisateurs essentiels */}
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <UserPlus className="h-5 w-5 text-green-600 mr-2" />
                            Utilisateurs Essentiels
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Créer les comptes administrateurs essentiels pour la production (admin principal, backup, support).
                        </p>
                        <button
                            onClick={handleCreateEssentialUsers}
                            disabled={isCreating}
                            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {isCreating ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    Création en cours...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Créer Comptes Essentiels
                                </>
                            )}
                        </button>
                    </div>

                    {/* Purge des utilisateurs */}
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Trash2 className="h-5 w-5 text-red-600 mr-2" />
                            Purge Complète
                        </h3>
                        <p className="text-gray-600 mb-4">
                            ⚠️ <strong>DANGER:</strong> Supprime TOUS les utilisateurs existants. Opération irréversible.
                        </p>
                        <button
                            onClick={handlePurgeUsers}
                            disabled={isPurging}
                            className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {isPurging ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    Suppression en cours...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Purger Tous les Utilisateurs
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Création d'utilisateur individuel */}
                <div className="bg-white rounded-lg shadow border">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <UserPlus className="h-5 w-5 text-blue-600 mr-2" />
                                Créer un Utilisateur
                            </h3>
                            <button
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                {showCreateForm ? <Eye className="h-4 w-4 mr-1" /> : <UserPlus className="h-4 w-4 mr-1" />}
                                {showCreateForm ? 'Masquer' : 'Afficher'}
                            </button>
                        </div>
                    </div>

                    {showCreateForm && (
                        <div className="p-6">
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="utilisateur@exemple.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mot de passe *
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Minimum 8 caractères"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nom complet *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={newUser.name}
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nom Prénom"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rôle *
                                        </label>
                                        <select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="customer">Client</option>
                                            <option value="supplier">Fournisseur</option>
                                            <option value="admin">Administrateur</option>
                                            <option value="sourcer">Sourceur</option>
                                            <option value="influencer">Influenceur</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Entreprise
                                        </label>
                                        <input
                                            type="text"
                                            value={newUser.company}
                                            onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nom de l'entreprise"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Téléphone
                                        </label>
                                        <input
                                            type="tel"
                                            value={newUser.phone}
                                            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="+33 1 23 45 67 89"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {isCreating ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                                Création...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Créer Utilisateur
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductionUserManagement;
