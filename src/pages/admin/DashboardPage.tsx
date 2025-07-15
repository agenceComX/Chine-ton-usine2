import React, { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../lib/services/userService';
import { User } from '../../types';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import AdminLayout from '../../layouts/AdminLayout';

const AdminDashboardPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'supplier' | 'customer' | 'sourcer'>('customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersData = await userService.getUsers();
      setUsers(usersData);
    } catch (err: unknown) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Mock statistics
  const stats = {
    totalUsers: users.length,
    totalSuppliers: users.filter(u => u.role === 'supplier').length,
    totalCustomers: users.filter(u => u.role === 'customer').length,
    totalAdmins: users.filter(u => u.role === 'admin').length,
    pendingProducts: 45,
    totalOrders: 567,
    monthlyRevenue: 45678.90,
    pendingReviews: 23
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await userService.createUser(email, password, name, role);
      setSuccess(`Utilisateur ${email} créé avec succès`);
      setShowAddUserModal(false);
      resetForm();
      loadUsers();
    } catch (err: unknown) {
      console.error('Erreur lors de la création:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await userService.deleteUser(selectedUser.id);
      setSuccess(`Utilisateur ${selectedUser.email} supprimé avec succès`);
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err: unknown) {
      console.error('Erreur lors de la suppression:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setRole('customer');
    setSelectedUser(null);
    setError('');
    setSuccess('');
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEmail(user.email);
    setName(user.name);
    setRole(user.role);
    setShowEditUserModal(true);
  };

  const openDeleteConfirm = (user: User) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Utilisateurs totaux</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.totalUsers}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Fournisseurs</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.totalSuppliers}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-orange-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Clients</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.totalCustomers}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-red-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Administrateurs</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.totalAdmins}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Gestion des utilisateurs</h3>
          <p className="text-sm text-gray-500 mt-1">{filteredUsers.length} utilisateur(s) trouvé(s)</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
            placeholder="Rechercher par email ou nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
            leftIcon={<Search className="h-5 w-5 text-gray-400" />}
            />
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { value: '', label: 'Tous les rôles' },
              { value: 'customer', label: 'Client' },
              { value: 'supplier', label: 'Fournisseur' },
                { value: 'admin', label: 'Administrateur' },
            ]}
            className="w-full sm:w-40"
          />
          <Button onClick={() => setShowAddUserModal(true)} variant="primary" className="flex items-center justify-center">
            <Plus className="h-5 w-5 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="text-gray-500">Chargement des utilisateurs...</span>
        </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <span className="text-gray-500">Aucun utilisateur trouvé.</span>
        </div>
        ) : (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEditModal(user)} className="text-blue-600 hover:text-blue-900 mr-4">
                        <Pencil className="h-5 w-5" />
                      </button>
                    <button onClick={() => openDeleteConfirm(user)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-5 w-5" />
                        </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ajouter un nouvel utilisateur</h2>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Input
                label="Nom"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Select
                label="Rôle"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'supplier' | 'customer' | 'sourcer')}
                options={[
                  { value: 'customer', label: 'Client' },
                  { value: 'supplier', label: 'Fournisseur' },
                  { value: 'admin', label: 'Administrateur' },
                  { value: 'sourcer', label: 'Sourcer' },
                ]}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={() => {
                  setShowAddUserModal(false);
                  resetForm();
                }}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  Ajouter
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Modifier l'utilisateur</h2>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}
            <form onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              setSuccess('');
              setLoading(true);
              try {
                await userService.updateUser(selectedUser.id, { email, name, role });
                setSuccess('Utilisateur mis à jour avec succès');
                setShowEditUserModal(false);
                resetForm();
                loadUsers();
              } catch (err: unknown) {
                console.error('Erreur lors de la mise à jour:', err);
                setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'utilisateur');
              } finally {
                setLoading(false);
              }
            }} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={true} // Email should not be editable
              />
              <Input
                label="Nom"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Select
                label="Rôle"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'supplier' | 'customer' | 'sourcer')}
                options={[
                  { value: 'customer', label: 'Client' },
                  { value: 'supplier', label: 'Fournisseur' },
                  { value: 'admin', label: 'Administrateur' },
                  { value: 'sourcer', label: 'Sourcer' },
                ]}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={() => {
                  setShowEditUserModal(false);
                  resetForm();
                }}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  Mettre à jour
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Confirmer la suppression</h2>
            <p className="text-gray-700 mb-4">
              Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-semibold">{selectedUser.email}</span> ? Cette action est irréversible.
            </p>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Annuler
              </Button>
              <Button type="button" variant="danger" onClick={handleDeleteUser} disabled={loading}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      default:
        return renderOverview();
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-blue-800 pb-32">
          <header className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-white">Administration</h1>
              <p className="text-blue-100 mt-2">Bienvenue, {currentUser?.name}</p>
            </div>
          </header>
        </div>

      <main className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-5 py-6 sm:px-6">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Vue d'ensemble
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`${
                    activeTab === 'users'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Utilisateurs
                </button>
              </nav>
            </div>
            
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ajouter un nouvel utilisateur</h2>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}
            <form onSubmit={handleAddUser} className="space-y-4">
                    <Input
                label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Input
                label="Mot de passe"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                minLength={6}
                    />
                    <Input
                label="Nom"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                required
                    />
                    <Select
                      label="Rôle"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'admin' | 'supplier' | 'customer' | 'sourcer')}
                      options={[
                        { value: 'customer', label: 'Client' },
                        { value: 'supplier', label: 'Fournisseur' },
                  { value: 'admin', label: 'Administrateur' },
                  { value: 'sourcer', label: 'Sourcer' },
                ]}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={() => {
                      setShowAddUserModal(false);
                      resetForm();
                }}>
                    Annuler
                  </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  Ajouter
                </Button>
                </div>
              </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Modifier l'utilisateur</h2>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}
            <form onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              setSuccess('');
              setLoading(true);
              try {
                await userService.updateUser(selectedUser.id, { email, name, role });
                setSuccess('Utilisateur mis à jour avec succès');
                setShowEditUserModal(false);
                resetForm();
                loadUsers();
              } catch (err: unknown) {
                console.error('Erreur lors de la mise à jour:', err);
                setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'utilisateur');
              } finally {
                setLoading(false);
              }
            }} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={true} // Email should not be editable
              />
              <Input
                label="Nom"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Select
                label="Rôle"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'supplier' | 'customer' | 'sourcer')}
                options={[
                  { value: 'customer', label: 'Client' },
                  { value: 'supplier', label: 'Fournisseur' },
                  { value: 'admin', label: 'Administrateur' },
                  { value: 'sourcer', label: 'Sourcer' },
                ]}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={() => {
                  setShowEditUserModal(false);
                  resetForm();
                }}>
                  Annuler
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  Mettre à jour
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Confirmer la suppression</h2>
            <p className="text-gray-700 mb-4">
              Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-semibold">{selectedUser.email}</span> ? Cette action est irréversible.
            </p>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            {success && <div className="mb-4 text-green-600 text-sm">{success}</div>}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                Annuler
              </Button>
              <Button type="button" variant="danger" onClick={handleDeleteUser} disabled={loading}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;