import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Package, Truck, Compass, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Container } from '../types';
import { containerService } from '../lib/services/containerService';
import ProgressBar from '../components/ProgressBar';
import { PreorderContainerModal } from '../components/PreorderContainerModal';
import ContainerReservationModal from '../components/ContainerReservationModal';

const ContainersPage: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationContainer, setReservationContainer] = useState<Container | null>(null);
  const { t } = useLanguage();
  useEffect(() => {
    const fetchContainers = async () => {
      try {
        setLoading(true);
        const data = await containerService.getContainers();
        setContainers(data);      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des conteneurs.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchContainers();
    // Refresh data every 10 seconds to simulate real-time updates
    const interval = setInterval(fetchContainers, 10000);
    return () => clearInterval(interval);
  }, []);
  const handlePreorder = (container: Container) => {
    setSelectedContainer(container);
    setIsModalOpen(true);
  };

  const handleReserveSpace = (container: Container) => {
    setReservationContainer(container);
    setIsReservationModalOpen(true);
  };

  const handleReservationSubmit = async (containerId: string, quantity: number, estimatedPrice: number) => {
    try {
      // In a real app, this would make an API call to create the reservation
      console.log(`Reservation for container ${containerId}: ${quantity} CBM at ${estimatedPrice}€`);
      alert(`Réservation confirmée!\n${quantity} CBM réservés pour ${estimatedPrice}€`);
      
      // Refresh containers to get updated data
      const data = await containerService.getContainers();
      setContainers(data);
      setIsReservationModalOpen(false);
      setReservationContainer(null);
    } catch (err) {
      console.error('Error creating reservation:', err);
      alert('Erreur lors de la création de la réservation');
    }
  };

  const handlePreorderSubmit = async (containerId: string, quantity: number) => {
    try {
      // In a real app, this would make an API call to create the preorder
      console.log(`Preorder for container ${containerId}: ${quantity} CBM`);
      alert(t('preorder.success'));
      // Refresh containers to get updated data
      const data = await containerService.getContainers();
      setContainers(data);
    } catch (err) {
      console.error('Error creating preorder:', err);
      alert('Erreur lors de la création de la précommande');
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContainer(null);
  };

  const handleCloseReservationModal = () => {
    setIsReservationModalOpen(false);
    setReservationContainer(null);
  };

  const getProgressColor = (container: Container) => {
    const progress = (container.usedCapacity / container.totalCapacity) * 100;
    if (container.status === 'closed') {
      return 'bg-gray-500'; // Gray for closed containers
    } else if (progress >= 90) {
      return 'bg-red-500'; // Red if almost full
    } else if (progress >= 70) {
      return 'bg-orange-500'; // Orange if more than 70% full
    } else {
      return 'bg-green-500'; // Green otherwise
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <p>{t('containers.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 text-red-500">
        <p>{t('containers.error')}: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">{t('containers.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {containers.map((container) => {
          const progress = (container.usedCapacity / container.totalCapacity) * 100;
          const progressColor = getProgressColor(container);

          return (
            <div key={container.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Package className="mr-2 text-blue-600" /> {container.name}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Truck className="mr-2 text-gray-500" />
                  {t('containers.departure')}: <span className="font-medium ml-1">{container.departureLocation}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Compass className="mr-2 text-gray-500" />
                  {t('containers.arrival')}: <span className="font-medium ml-1">{container.arrivalLocation}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Calendar className="mr-2 text-gray-500" />
                  {t('containers.estimatedDeparture')}: <span className="font-medium ml-1">{container.estimatedDepartureDate}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                  {container.status === 'active' ? (
                    <TrendingUp className="mr-2 text-green-600" />
                  ) : (
                    <TrendingDown className="mr-2 text-gray-500" />
                  )}
                  {t('containers.status')}: <span className={`font-medium ml-1 capitalize ${container.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                    {t(`containers.status.${container.status}`)}
                  </span>
                </p>

                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                    {t('containers.capacity')}: {container.usedCapacity} / {container.totalCapacity}
                  </p>
                  <ProgressBar progress={progress} color={progressColor} height="h-3" />
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                {container.status === 'closed' && (
                  <p className="text-red-500 font-semibold">{t('containers.closedMessage')}</p>
                )}                {container.status === 'active' && progress >= 90 && progress < 100 && (
                  <p className="text-orange-500 font-semibold">{t('containers.almostFullMessage')}</p>
                )}
                {container.status === 'active' && progress < 90 && (
                  <p className="text-green-600 font-semibold">{t('containers.availableMessage')}</p>
                )}
              </div>
                {/* Boutons d'action */}
              {container.status === 'active' && progress < 100 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-3">
                  {/* Nouveau bouton de réservation interactif */}
                  <button
                    onClick={() => handleReserveSpace(container)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Package className="w-5 h-5" />
                    <span>Réserver de l'espace</span>
                  </button>
                  
                  {/* Bouton de précommande existant (optionnel) */}
                  <button
                    onClick={() => handlePreorder(container)}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Package className="w-4 h-4" />
                    <span>{t('preorder.button')}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>      {/* Modal de précommande */}
      {selectedContainer && (
        <PreorderContainerModal
          container={selectedContainer}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onPreorder={handlePreorderSubmit}
        />
      )}

      {/* Nouveau modal de réservation interactif */}
      {reservationContainer && (
        <ContainerReservationModal
          container={reservationContainer}
          isOpen={isReservationModalOpen}
          onClose={handleCloseReservationModal}
          onReserve={handleReservationSubmit}
        />
      )}
    </div>
  );
};

export default ContainersPage; 