import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Package, Plus, Edit, Trash2, Ship, MapPin } from 'lucide-react';
import { Container, ContainerStatus } from '../../types';
import { containerService } from '../../lib/services/containerService';
import AdminLayout from '../../layouts/AdminLayout';

const ContainersManagementPage: React.FC = () => {
  const { t } = useLanguage();
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingContainer, setEditingContainer] = useState<Container | null>(null);

  // Nouvel état pour le formulaire de création/édition
  const [formData, setFormData] = useState({
    name: '',
    departureLocation: '',
    arrivalLocation: '',
    estimatedDepartureDate: '',
    totalCapacity: 1000,
    usedCapacity: 0,
    status: 'active' as ContainerStatus
  });

  useEffect(() => {
    loadContainers();
  }, []);

  const loadContainers = async () => {
    try {
      setLoading(true);
      const data = await containerService.getContainers();
      setContainers(data);
    } catch (error) {
      console.error('Error loading containers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContainer = () => {
    setFormData({
      name: '',
      departureLocation: '',
      arrivalLocation: '',
      estimatedDepartureDate: '',
      totalCapacity: 1000,
      usedCapacity: 0,
      status: 'active'
    });
    setEditingContainer(null);
    setShowCreateModal(true);
  };

  const handleEditContainer = (container: Container) => {
    setFormData({
      name: container.name,
      departureLocation: container.departureLocation,
      arrivalLocation: container.arrivalLocation,
      estimatedDepartureDate: container.estimatedDepartureDate,
      totalCapacity: container.totalCapacity,
      usedCapacity: container.usedCapacity,
      status: container.status
    });
    setEditingContainer(container);
    setShowCreateModal(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContainer) {
        // Update existing container
        console.log('Updating container:', editingContainer.id, formData);
        // En production, ceci ferait un appel API pour mettre à jour
      } else {
        // Create new container
        console.log('Creating new container:', formData);
        // En production, ceci ferait un appel API pour créer
      }
      
      setShowCreateModal(false);
      loadContainers(); // Refresh the list
      
      // Show success message
      alert(editingContainer 
        ? 'Conteneur mis à jour avec succès' 
        : 'Conteneur créé avec succès'
      );
    } catch (error) {
      console.error('Error saving container:', error);
      alert('Erreur lors de la sauvegarde du conteneur');
    }
  };

  const handleDeleteContainer = async (containerId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce conteneur ?')) {
      try {
        console.log('Deleting container:', containerId);
        // En production, ceci ferait un appel API pour supprimer
        alert('Conteneur supprimé avec succès');
        loadContainers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting container:', error);
        alert('Erreur lors de la suppression du conteneur');
      }
    }
  };
  const getProgressColor = (container: Container) => {
    const progress = (container.usedCapacity / container.totalCapacity) * 100;
    if (container.status === 'closed') return 'bg-gray-500';
    if (progress >= 90) return 'bg-red-500';
    if (progress >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('containers.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez les conteneurs et leurs capacités
            </p>
          </div>
          <button
            onClick={handleCreateContainer}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau conteneur</span>
          </button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {containers.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Ship className="w-8 h-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Actifs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {containers.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-gray-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fermés</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {containers.filter(c => c.status === 'closed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Capacité totale</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {containers.reduce((sum, c) => sum + c.totalCapacity, 0)} CBM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des conteneurs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Liste des conteneurs
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Itinéraire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Capacité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Départ estimé
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {containers.map((container) => {
                  const progress = (container.usedCapacity / container.totalCapacity) * 100;
                  const progressColor = getProgressColor(container);
                  
                  return (
                    <tr key={container.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {container.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {container.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {container.departureLocation}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          → {container.arrivalLocation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {container.usedCapacity} / {container.totalCapacity} CBM
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className={`${progressColor} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          container.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {t(`containers.status.${container.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(container.estimatedDepartureDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => handleEditContainer(container)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteContainer(container.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de création/édition */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
              {editingContainer ? 'Modifier le conteneur' : 'Nouveau conteneur'}
            </h3>
            
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom du conteneur
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lieu de départ
                  </label>
                  <input
                    type="text"
                    value={formData.departureLocation}
                    onChange={(e) => setFormData({ ...formData, departureLocation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lieu d'arrivée
                  </label>
                  <input
                    type="text"
                    value={formData.arrivalLocation}
                    onChange={(e) => setFormData({ ...formData, arrivalLocation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date de départ estimée
                  </label>
                  <input
                    type="date"
                    value={formData.estimatedDepartureDate}
                    onChange={(e) => setFormData({ ...formData, estimatedDepartureDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Capacité totale (CBM)
                  </label>
                  <input
                    type="number"
                    value={formData.totalCapacity}
                    onChange={(e) => setFormData({ ...formData, totalCapacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Capacité utilisée (CBM)
                  </label>
                  <input
                    type="number"
                    value={formData.usedCapacity}
                    onChange={(e) => setFormData({ ...formData, usedCapacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    min="0"
                    max={formData.totalCapacity}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Statut
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ContainerStatus })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="active">Actif</option>
                    <option value="closed">Fermé</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingContainer ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ContainersManagementPage;
