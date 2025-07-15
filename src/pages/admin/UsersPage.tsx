import React, { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, Search, Eye, Shield, Mail, Calendar, RefreshCw, Activity } from 'lucide-react';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import AdminLayout from '../../layouts/AdminLayout';
import CreateUserModal from '../../components/admin/CreateUserModal';
// 🚨 COMPOSANTS DE TEST DÉSACTIVÉS - ils utilisent des services avec Auth Firebase
// import UserCreationTest from '../../components/admin/UserCreationTest';
// import AdminTestPanel from '../../components/admin/AdminTestPanel';
import AdminDiagnosticPanel from '../../components/admin/AdminDiagnosticPanel';
import AdminCreationPanel from '../../components/admin/AdminCreationPanel';
import UserResetPanel from '../../components/admin/UserResetPanel';
import UltimateUserPanel from '../../components/admin/UltimateUserPanel';
import QuickAdminLogin from '../../components/admin/QuickAdminLogin';
// 🚨 IMPORTS DE SERVICES SÉCURISÉS UNIQUEMENT (Firestore seulement, pas Auth)
import { finalUserCreationService } from '../../services/finalUserCreationService';
import { safeInitializationService } from '../../lib/services/safeInitializationService';
import { useUserSync } from '../../hooks/useUserSync';
// Types pour la création d'utilisateur
import type { CreateUserData } from '../../types';
import { useToast } from '../../components/ToastNotification';
// Imports Firebase pour la création manuelle
import { db, auth } from '../../lib/firebaseClient';
import { doc, setDoc } from 'firebase/firestore';

interface AdminUser {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'supplier' | 'customer' | 'sourcer' | 'influencer';
  createdAt: Date;
  isActive: boolean;
  lastLogin?: Date;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    total: 0,
    byRole: { admin: 0, supplier: 0, customer: 0, sourcer: 0 },
    active: 0,
    inactive: 0
  });

  const { showToast } = useToast();
  // 🚨 DIAGNOSTIC: Désactivation temporaire du hook useUserSync
  // const { syncUsers, getUserStats } = useUserSync(true); // Activer la synchronisation automatique
  const { getUserStats } = useUserSync(false); // DÉSACTIVÉ pour test - plus de syncUsers

  // Fonction helper pour convertir les dates Firestore en sécurité
  const safeDate = (dateValue: any): Date => {
    if (!dateValue) return new Date();

    try {
      if (dateValue instanceof Date) return dateValue;
      if (typeof dateValue === 'string') return new Date(dateValue);
      if (dateValue.seconds) return new Date(dateValue.seconds * 1000); // Firestore Timestamp
      return new Date(dateValue);
    } catch (error) {
      console.warn('Erreur conversion date:', dateValue, error);
      return new Date();
    }
  };

  // Fonction helper pour convertir un utilisateur Firestore
  const convertFirestoreUser = (user: any): AdminUser => ({
    uid: user.uid,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: safeDate(user.createdAt || user.created_at),
    isActive: user.isActive ?? true,
    lastLogin: user.lastLogin || user.last_login ? safeDate(user.lastLogin || user.last_login) : undefined
  });

  // Load users from Firebase
  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('� Chargement des utilisateurs depuis la base de données');
      // ✅ SERVICE FINAL: Lecture simple depuis la base
      const firebaseUsers = await finalUserCreationService.getAllUsersFromDatabase();
      console.log('� Utilisateurs récupérés:', firebaseUsers.length);

      // Convert to local format avec gestion sécurisée des dates
      const convertedUsers: AdminUser[] = firebaseUsers.map(convertFirestoreUser);
      setUsers(convertedUsers);

      // Charger les statistiques
      const stats = await getUserStats();
      setUserStats(stats);

      // Si aucun utilisateur n'est trouvé, proposer de créer des utilisateurs de test
      if (convertedUsers.length === 0) {
        console.log('🚀 Aucun utilisateur trouvé, utilisation des données de test');
        setUsers(mockUsers);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setError('Erreur lors du chargement des utilisateurs');
      // Fallback sur les données de test si Firebase échoue
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  // Synchronisation manuelle des utilisateurs
  const handleSyncUsers = async () => {
    setSyncLoading(true);
    try {
      console.log('🔄 Rechargement manuel et sécurisé de la liste utilisateurs');

      // Utiliser le service final sécurisé pour recharger
      const users = await finalUserCreationService.getAllUsersFromDatabase();

      // Conversion sécurisée avec la fonction helper
      const convertedUsers: AdminUser[] = users.map(convertFirestoreUser);

      setUsers(convertedUsers);

      showToast(`${users.length} utilisateurs synchronisés`, 'success', 'check');
      console.log('✅ Liste rechargée avec succès');

    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation:', error);
      showToast('Erreur lors de la synchronisation des utilisateurs', 'error');
    } finally {
      setSyncLoading(false);
    }
  };
  // Create test users handler - VERSION SÉCURISÉE (Firestore seulement)
  const handleCreateTestUsers = async () => {
    setLoading(true);
    try {
      console.log('🛡️ Initialisation sécurisée des utilisateurs de test (Firestore seulement)');

      // Utiliser le service sécurisé qui n'utilise QUE Firestore
      await safeInitializationService.initializeTestUsersFirestoreOnly();

      showToast('Utilisateurs de test créés avec succès (Firestore seulement) !', 'success', 'check');

      // Recharger la liste
      await loadUsers();

    } catch (error) {
      console.error('Erreur lors de la création des utilisateurs de test:', error);
      showToast('Erreur lors de la création des utilisateurs de test', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);  // Create user handler - SOLUTION FINALE : Firestore SEULEMENT (pas Firebase Auth)
  const handleCreateUser = async (userData: CreateUserData) => {
    setCreateLoading(true);
    try {
      console.log('🛡️ SOLUTION: Création utilisateur Firestore SEULEMENT - pas de Firebase Auth');
      console.log('👤 Admin connecté avant:', auth.currentUser?.email);

      // Validation des données
      if (!userData.email || !userData.email.includes('@')) {
        showToast('Email invalide', 'error');
        return;
      }

      if (!userData.name || userData.name.trim().length < 2) {
        showToast('Nom trop court', 'error');
        return;
      }

      // Créer l'utilisateur SEULEMENT dans Firestore (pas Firebase Auth)
      const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      const userDocument = {
        uid: uid,
        id: uid,
        email: userData.email.trim(),
        name: userData.name.trim(),
        role: userData.role,
        isActive: userData.isActive ?? true,
        language: 'fr',
        currency: 'EUR',
        favorites: [],
        browsingHistory: [],
        messages: [],
        subscription: 'free',
        createdAt: now,
        updatedAt: now,
        created_at: now,
        updated_at: now,
        // Note: mot de passe stocké pour référence (en production, utiliser Admin SDK)
        temporaryPassword: userData.password,
        authType: 'firestore-only',
        createdBy: 'admin-interface'
      };

      // Sauvegarder dans Firestore SEULEMENT
      await setDoc(doc(db, 'users', uid), userDocument);

      console.log('✅ Utilisateur créé dans Firestore avec succès');
      console.log('👤 Admin connecté après:', auth.currentUser?.email);

      // Afficher succès
      showToast(`✅ Utilisateur ${userData.name} créé avec succès !`, 'success', 'check');

      // Ajouter à la liste locale sans rechargement
      const newUser: AdminUser = {
        uid: userDocument.uid,
        email: userDocument.email,
        name: userDocument.name,
        role: userDocument.role,
        createdAt: new Date(userDocument.createdAt),
        isActive: userDocument.isActive,
      };

      setUsers(prevUsers => [newUser, ...prevUsers]);

      // Fermer le modal
      setIsCreateModalOpen(false);

      console.log('🎉 Processus terminé - Admin toujours connecté !');

    } catch (error: any) {
      console.error('❌ Erreur création utilisateur:', error);
      showToast(error.message || 'Erreur lors de la création', 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  // Mock data for demonstration
  const mockUsers: AdminUser[] = [
    {
      uid: '1',
      email: 'admin@chinetousine.com',
      name: 'Admin Principal',
      role: 'admin',
      createdAt: new Date('2023-01-15'),
      isActive: true,
      lastLogin: new Date('2024-01-15')
    },
    {
      uid: '2',
      email: 'supplier1@example.com',
      name: 'Shanghai Electronics Co.',
      role: 'supplier',
      createdAt: new Date('2023-03-20'),
      isActive: true,
      lastLogin: new Date('2024-01-14')
    },
    {
      uid: '3',
      email: 'client1@example.com',
      name: 'Marie Dupont',
      role: 'customer',
      createdAt: new Date('2023-06-10'),
      isActive: true,
      lastLogin: new Date('2024-01-12')
    },
    {
      uid: '4',
      email: 'sourcer1@example.com',
      name: 'Jean Martin - Sourcer',
      role: 'sourcer',
      createdAt: new Date('2023-08-05'),
      isActive: false,
      lastLogin: new Date('2023-12-20')
    }
  ];

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      supplier: 'bg-blue-100 text-blue-800',
      customer: 'bg-green-100 text-green-800',
      sourcer: 'bg-orange-100 text-orange-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      admin: <Shield size={14} />,
      supplier: <Users size={14} />,
      customer: <Eye size={14} />,
      sourcer: <Search size={14} />
    };
    return icons[role as keyof typeof icons] || <Users size={14} />;
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Non défini';

    try {
      const dateObj = date instanceof Date ? date : new Date(date);

      // Vérifier si la date est valide
      if (isNaN(dateObj.getTime())) {
        return 'Date invalide';
      }

      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(dateObj);
    } catch (error) {
      console.error('Erreur de formatage de date:', error, 'Date reçue:', date);
      return 'Format invalide';
    }
  };
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Bouton retour */}
        <BackButton to="/admin/dashboard" label="Retour au tableau de bord admin" variant="ghost" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez tous les utilisateurs de la plateforme
            </p>
          </div>          <div className="flex gap-2">
            <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
              <Plus size={16} />
              Nouvel utilisateur
            </Button>
            <Button
              onClick={handleSyncUsers}
              variant="outline"
              className="flex items-center gap-2"
              disabled={syncLoading}
            >
              <RefreshCw size={16} className={syncLoading ? 'animate-spin' : ''} />
              {syncLoading ? 'Synchronisation...' : 'Synchroniser'}
            </Button>
            {users.length === 0 && (
              <Button
                onClick={handleCreateTestUsers}
                variant="outline"
                className="flex items-center gap-2"
                disabled={loading}
              >
                <Users size={16} />
                Créer des utilisateurs de test
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{userStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Admins</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {userStats.byRole.admin}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fournisseurs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {userStats.byRole.supplier}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Clients</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {userStats.byRole.customer}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Actifs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {userStats.active}
                </p>
              </div>
            </div>
          </div>
        </div>        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={roleFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Tous les rôles</option>
                <option value="admin">Admin</option>
                <option value="supplier">Fournisseur</option>
                <option value="customer">Client</option>
                <option value="sourcer">Sourcer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
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
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Dernière connexion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date création
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Mail size={12} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {user.lastLogin ? formatDate(user.lastLogin) : 'Jamais'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => console.log('View user:', user)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => console.log('Edit user:', user)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => console.log('Delete user:', user)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Test Component - SÉCURISÉS SEULEMENT (pas de Firebase Auth) */}
        <UltimateUserPanel />
        <UserResetPanel />
        <AdminDiagnosticPanel />
        <AdminCreationPanel />
        <QuickAdminLogin />
        {/* 🚨 COMPOSANTS DÉSACTIVÉS - ils utilisent Firebase Auth et causent la déconnexion */}
        {/* <AdminTestPanel /> */}
        {/* <UserCreationTest /> */}

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateUser={handleCreateUser}
          loading={createLoading}
        />
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
