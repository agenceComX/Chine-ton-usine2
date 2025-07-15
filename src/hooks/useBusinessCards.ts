import React from 'react';
import { businessCardService, SavedBusinessCard } from '../services/businessCardService';

// Hook pour utiliser le service dans les composants React
export const useBusinessCards = (supplierId: string) => {
    const [cards, setCards] = React.useState<SavedBusinessCard[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // Charger les cartes
    const loadCards = async () => {
        try {
            setLoading(true);
            const supplierCards = await businessCardService.getSupplierCards(supplierId);
            setCards(supplierCards);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des cartes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Sauvegarder une carte
    const saveCard = async (cardData: Omit<SavedBusinessCard, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'shares'>) => {
        try {
            const newCard = await businessCardService.saveCard(cardData);
            setCards(prev => [...prev, newCard]);
            return newCard;
        } catch (err) {
            setError('Erreur lors de la sauvegarde');
            throw err;
        }
    };

    // Mettre à jour une carte
    const updateCard = async (cardId: string, updates: Partial<SavedBusinessCard>) => {
        try {
            const updatedCard = await businessCardService.updateCard(cardId, updates);
            if (updatedCard) {
                setCards(prev => prev.map(card =>
                    card.id === cardId ? updatedCard : card
                ));
            }
            return updatedCard;
        } catch (err) {
            setError('Erreur lors de la mise à jour');
            throw err;
        }
    };

    // Supprimer une carte
    const deleteCard = async (cardId: string) => {
        try {
            const success = await businessCardService.deleteCard(cardId);
            if (success) {
                setCards(prev => prev.filter(card => card.id !== cardId));
            }
            return success;
        } catch (err) {
            setError('Erreur lors de la suppression');
            throw err;
        }
    };

    React.useEffect(() => {
        if (supplierId) {
            loadCards();
        }
    }, [supplierId]);

    return {
        cards,
        loading,
        error,
        loadCards,
        saveCard,
        updateCard,
        deleteCard
    };
};
