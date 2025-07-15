import React, { useState, useEffect } from 'react';
import { Container } from '../types';
import { X, Package, Calendar, Euro, AlertTriangle, CheckCircle } from 'lucide-react';
import '../styles/container-reservation.css';

interface ContainerReservationModalProps {
  container: Container;
  isOpen: boolean;
  onClose: () => void;
  onReserve: (containerId: string, quantity: number, estimatedPrice: number) => void;
}

const ContainerReservationModal: React.FC<ContainerReservationModalProps> = ({
  container,
  isOpen,
  onClose,
  onReserve
}) => {
  const [quantity, setQuantity] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceAnimating, setPriceAnimating] = useState(false);
  const [quantityAnimating, setQuantityAnimating] = useState(false);

  // Calculs en temps réel
  const availableCapacity = container.totalCapacity - container.usedCapacity;
  const pricePerCBM = 150; // Prix par CBM en euros
  const estimatedPrice = quantity * pricePerCBM;
  const reservationDeadline = new Date();
  reservationDeadline.setDate(reservationDeadline.getDate() + 7); // 7 jours pour réserver

  // Pourcentages pour la barre de progression
  const usedPercentage = (container.usedCapacity / container.totalCapacity) * 100;
  const selectedPercentage = (quantity / container.totalCapacity) * 100;
  const availablePercentage = 100 - usedPercentage - selectedPercentage;

  // Animation d'ouverture/fermeture
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuantity(0);
      setError('');
      setIsSubmitting(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Validation en temps réel
  useEffect(() => {
    if (quantity > availableCapacity) {
      setError(`Quantité maximale disponible: ${availableCapacity} CBM`);
    } else if (quantity <= 0) {
      setError('Veuillez sélectionner une quantité');
    } else {
      setError('');
    }
  }, [quantity, availableCapacity]);
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQuantity(value);

    // Animation de la quantité
    setQuantityAnimating(true);
    setTimeout(() => setQuantityAnimating(false), 200);

    // Animation du prix
    setPriceAnimating(true);
    setTimeout(() => setPriceAnimating(false), 300);
  };

  const handleSubmit = async () => {
    if (quantity <= 0 || quantity > availableCapacity) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      onReserve(container.id, quantity, estimatedPrice);
      handleClose();
    } catch (err) {
      setError('Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (<div
    className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    onClick={handleClose}
  >
    <div
      className={`glassmorphism container-reservation-modal rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-500 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Réserver de l'espace
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {container.name}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Informations du conteneur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Départ</p>
            <p className="font-medium text-gray-900 dark:text-white">{container.departureLocation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Arrivée</p>
            <p className="font-medium text-gray-900 dark:text-white">{container.arrivalLocation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Date de départ</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {new Date(container.estimatedDepartureDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Capacité disponible</p>
            <p className="font-medium text-green-600 dark:text-green-400">{availableCapacity} CBM</p>
          </div>
        </div>

        {/* Slider de sélection */}
        <div className="space-y-4">            <div className="flex justify-between items-center">
          <label className="text-lg font-medium text-gray-900 dark:text-white">
            Quantité à réserver
          </label>
          <div className={`text-2xl font-bold text-blue-600 dark:text-blue-400 quantity-display ${quantityAnimating ? 'updating' : ''
            }`}>
            {quantity} CBM
          </div>
        </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max={availableCapacity}
              value={quantity}
              onChange={handleSliderChange}
              className="w-full container-reservation-slider smooth-transition"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(quantity / availableCapacity) * 100}%, var(--modal-slider-track) ${(quantity / availableCapacity) * 100}%, var(--modal-slider-track) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0</span>
              <span>{availableCapacity} CBM</span>
            </div>
          </div>
        </div>

        {/* Barre de progression des capacités */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Répartition de la capacité
          </h3>            <div className="relative w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            {/* Capacité utilisée */}
            <div
              className="absolute top-0 left-0 h-full bg-red-500 progress-bar-segment"
              style={{ width: `${usedPercentage}%` }}
            />
            {/* Capacité sélectionnée */}
            <div
              className="absolute top-0 h-full bg-blue-500 progress-bar-segment"
              style={{
                left: `${usedPercentage}%`,
                width: `${selectedPercentage}%`
              }}
            />
            {/* Capacité disponible */}
            <div
              className="absolute top-0 right-0 h-full bg-green-500 progress-bar-segment"
              style={{ width: `${availablePercentage}%` }}
            />
          </div>

          {/* Légende */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Utilisé ({container.usedCapacity} CBM)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Sélectionné ({quantity} CBM)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Disponible ({availableCapacity - quantity} CBM)
              </span>
            </div>
          </div>
        </div>          {/* Informations dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg info-card smooth-transition hover:shadow-lg">
            <div className="icon-animate">
              <Euro className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prix estimé</p>
              <p className={`text-xl font-bold text-blue-600 dark:text-blue-400 ${priceAnimating ? 'price-animate' : ''
                }`}>
                {estimatedPrice.toLocaleString('fr-FR')} €
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {pricePerCBM}€/CBM
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg info-card smooth-transition hover:shadow-lg">
            <div className="icon-animate">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date limite</p>
              <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {reservationDeadline.toLocaleDateString('fr-FR')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Dans 7 jours
              </p>
            </div>
          </div>
        </div>          {/* Message d'erreur */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg error-message">
            <AlertTriangle className="w-5 h-5 text-red-500 icon-animate" />
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleClose}
          className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Annuler
        </button>          <button
          onClick={handleSubmit}
          disabled={!!error || quantity <= 0 || isSubmitting}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed validation-button smooth-transition flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full button-spinner"></div>
              <span>Réservation...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 icon-animate" />
              <span>Valider la réservation</span>
            </>
          )}
        </button>
      </div>      </div>
  </div>
  );
};

export default ContainerReservationModal;
