import { BusinessCardData } from '../components/BusinessCardTemplate';

// Interface pour une carte de visite sauvegardée
export interface SavedBusinessCard {
    id: string;
    name: string;
    data: BusinessCardData;
    supplierId: string;
    createdAt: Date;
    updatedAt: Date;
    isDefault: boolean;
    isPublic: boolean;
    downloads: number;
    shares: number;
    tags: string[];
}

// Service pour gérer les cartes de visite
class BusinessCardService {
    private storageKey = 'businessCards';

    // Obtenir toutes les cartes d'un fournisseur
    async getSupplierCards(supplierId: string): Promise<SavedBusinessCard[]> {
        const cards = this.getStoredCards();
        return cards.filter(card => card.supplierId === supplierId);
    }

    // Obtenir une carte spécifique
    async getCard(cardId: string): Promise<SavedBusinessCard | null> {
        const cards = this.getStoredCards();
        return cards.find(card => card.id === cardId) || null;
    }

    // Sauvegarder une nouvelle carte
    async saveCard(cardData: Omit<SavedBusinessCard, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'shares'>): Promise<SavedBusinessCard> {
        const cards = this.getStoredCards();

        const newCard: SavedBusinessCard = {
            ...cardData,
            id: this.generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
            downloads: 0,
            shares: 0
        };

        // Si c'est la carte par défaut, enlever le statut des autres
        if (newCard.isDefault) {
            cards.forEach(card => {
                if (card.supplierId === newCard.supplierId) {
                    card.isDefault = false;
                }
            });
        }

        cards.push(newCard);
        this.saveToStorage(cards);

        return newCard;
    }

    // Mettre à jour une carte existante
    async updateCard(cardId: string, updates: Partial<SavedBusinessCard>): Promise<SavedBusinessCard | null> {
        const cards = this.getStoredCards();
        const cardIndex = cards.findIndex(card => card.id === cardId);

        if (cardIndex === -1) {
            return null;
        }

        const updatedCard = {
            ...cards[cardIndex],
            ...updates,
            updatedAt: new Date()
        };

        // Si c'est maintenant la carte par défaut, enlever le statut des autres
        if (updates.isDefault && updatedCard.isDefault) {
            cards.forEach((card, index) => {
                if (index !== cardIndex && card.supplierId === updatedCard.supplierId) {
                    card.isDefault = false;
                }
            });
        }

        cards[cardIndex] = updatedCard;
        this.saveToStorage(cards);

        return updatedCard;
    }

    // Supprimer une carte
    async deleteCard(cardId: string): Promise<boolean> {
        const cards = this.getStoredCards();
        const initialLength = cards.length;
        const filteredCards = cards.filter(card => card.id !== cardId);

        if (filteredCards.length < initialLength) {
            this.saveToStorage(filteredCards);
            return true;
        }

        return false;
    }

    // Dupliquer une carte
    async duplicateCard(cardId: string, newName: string): Promise<SavedBusinessCard | null> {
        const originalCard = await this.getCard(cardId);
        if (!originalCard) {
            return null;
        }

        return this.saveCard({
            name: newName,
            data: { ...originalCard.data },
            supplierId: originalCard.supplierId,
            isDefault: false,
            isPublic: originalCard.isPublic,
            tags: [...originalCard.tags]
        });
    }

    // Marquer une carte comme téléchargée
    async incrementDownloads(cardId: string): Promise<void> {
        const cards = this.getStoredCards();
        const card = cards.find(c => c.id === cardId);
        if (card) {
            card.downloads += 1;
            this.saveToStorage(cards);
        }
    }

    // Marquer une carte comme partagée
    async incrementShares(cardId: string): Promise<void> {
        const cards = this.getStoredCards();
        const card = cards.find(c => c.id === cardId);
        if (card) {
            card.shares += 1;
            this.saveToStorage(cards);
        }
    }

    // Obtenir la carte par défaut d'un fournisseur
    async getDefaultCard(supplierId: string): Promise<SavedBusinessCard | null> {
        const cards = await this.getSupplierCards(supplierId);
        return cards.find(card => card.isDefault) || cards[0] || null;
    }

    // Obtenir les cartes publiques d'un fournisseur
    async getPublicCards(supplierId: string): Promise<SavedBusinessCard[]> {
        const cards = await this.getSupplierCards(supplierId);
        return cards.filter(card => card.isPublic);
    }

    // Méthodes privées
    private getStoredCards(): SavedBusinessCard[] {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return this.getInitialCards();

            const cards = JSON.parse(stored);
            // Convertir les dates string en objets Date
            return cards.map((card: any) => ({
                ...card,
                createdAt: new Date(card.createdAt),
                updatedAt: new Date(card.updatedAt)
            }));
        } catch {
            return this.getInitialCards();
        }
    }

    private saveToStorage(cards: SavedBusinessCard[]): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(cards));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des cartes:', error);
        }
    }

    private generateId(): string {
        return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Données initiales pour la démo
    private getInitialCards(): SavedBusinessCard[] {
        return [
            {
                id: 'card_1',
                name: 'Carte principale',
                supplierId: 'supplier-1',
                data: {
                    companyName: 'TechnoMax Solutions',
                    tagline: 'Innovation technologique de qualité',
                    contactPerson: 'Wang Lei',
                    position: 'Directeur Commercial',
                    phone: '+86 755 1234 5678',
                    email: 'wang.lei@technomax.com',
                    website: 'www.technomax-solutions.com',
                    address: '123 Technology Street, Nanshan District, Shenzhen, Chine',
                    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
                    primaryColor: '#3B82F6',
                    secondaryColor: '#1E40AF',
                    textColor: '#FFFFFF',
                    accentColor: '#10B981',
                    template: 'modern',
                    fontSize: 'medium',
                    logoSize: 'medium',
                    layout: 'modern'
                },
                createdAt: new Date('2024-01-15'),
                updatedAt: new Date('2024-02-01'),
                isDefault: true,
                isPublic: true,
                downloads: 45,
                shares: 12,
                tags: ['principale', 'officielle']
            }
        ];
    }
}

// Instance unique du service
export const businessCardService = new BusinessCardService();

export default businessCardService;
