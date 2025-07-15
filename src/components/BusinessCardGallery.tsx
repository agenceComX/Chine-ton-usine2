import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit3,
    Copy,
    Trash2,
    Download,
    Share2,
    Star,
    MoreHorizontal,
    Grid,
    List,
    Search,
    Filter
} from 'lucide-react';
import BusinessCardTemplate, { BusinessCardData, defaultBusinessCardData } from './BusinessCardTemplate';
import BusinessCardEditor from './BusinessCardEditor';
import { SavedBusinessCard } from '../services/businessCardService';
import { useBusinessCards } from '../hooks/useBusinessCards';
import { useSupplierData } from '../hooks/useAuth';

interface BusinessCardGalleryProps {
    supplierId?: string;
}

const BusinessCardGallery: React.FC<BusinessCardGalleryProps> = ({ supplierId }) => {
    // Utiliser les données d'authentification pour obtenir l'ID du fournisseur
    const { user } = useSupplierData(supplierId || '');
    const currentSupplierId = supplierId || user?.supplierId || 'supplier-1';

    // Utiliser le hook pour gérer les cartes
    const { cards, loading, error, saveCard, updateCard, deleteCard } = useBusinessCards(currentSupplierId);

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<SavedBusinessCard | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    // Simuler le chargement des cartes sauvegardées
    useEffect(() => {
        if (!loading) {
            setTimeout(() => setIsLoaded(true), 300);
        }
    }, [loading]);

    // Filtrer les cartes par recherche
    const filteredCards = cards.filter(card =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.data.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.data.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Créer une nouvelle carte
    const handleCreateNew = () => {
        setEditingCard(null);
        setIsEditorOpen(true);
    };

    // Éditer une carte existante
    const handleEdit = (card: SavedBusinessCard) => {
        setEditingCard(card);
        setIsEditorOpen(true);
    };

    // Sauvegarder une carte
    const handleSave = async (data: BusinessCardData) => {
        try {
            if (editingCard) {
                // Mise à jour d'une carte existante
                await updateCard(editingCard.id, { data });
            } else {
                // Création d'une nouvelle carte
                await saveCard({
                    name: `Nouvelle carte ${cards.length + 1}`,
                    data,
                    supplierId: currentSupplierId,
                    isDefault: cards.length === 0,
                    isPublic: true,
                    tags: []
                });
            }
            setIsEditorOpen(false);
            setEditingCard(null);
        } catch (err) {
            console.error('Erreur lors de la sauvegarde:', err);
        }
    };

    // Dupliquer une carte
    const handleDuplicate = async (card: SavedBusinessCard) => {
        try {
            await saveCard({
                name: `${card.name} (copie)`,
                data: { ...card.data },
                supplierId: currentSupplierId,
                isDefault: false,
                isPublic: card.isPublic,
                tags: [...card.tags]
            });
        } catch (err) {
            console.error('Erreur lors de la duplication:', err);
        }
    };

    // Supprimer une carte
    const handleDelete = async (cardId: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
            try {
                await deleteCard(cardId);
            } catch (err) {
                console.error('Erreur lors de la suppression:', err);
            }
        }
    };

    // Définir comme carte par défaut
    const handleSetDefault = async (cardId: string) => {
        try {
            await updateCard(cardId, { isDefault: true });
        } catch (err) {
            console.error('Erreur lors de la mise à jour:', err);
        }
    };

    // Télécharger une carte
    const handleDownload = async (card: SavedBusinessCard) => {
        try {
            await updateCard(card.id, { downloads: card.downloads + 1 });
            // Ici on implémenterait le téléchargement réel avec html2canvas
            alert('Téléchargement démarré...');
        } catch (err) {
            console.error('Erreur lors du téléchargement:', err);
        }
    };

    // Partager une carte
    const handleShare = async (card: SavedBusinessCard) => {
        try {
            await updateCard(card.id, { shares: card.shares + 1 });

            if (navigator.share) {
                navigator.share({
                    title: `Carte de visite - ${card.name}`,
                    text: `Découvrez ma carte de visite professionnelle`,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(`Carte de visite partagée: ${card.name}`);
                alert('Lien de partage copié dans le presse-papiers !');
            }
        } catch (err) {
            console.error('Erreur lors du partage:', err);
        }
    };

    if (loading || !isLoaded) {
        return (
            <div className="min-h-96 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement de vos cartes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-96 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️</div>
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Mes Cartes de Visite
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Créez et gérez vos cartes de visite personnalisées
                            </p>
                        </div>
                        <button
                            onClick={handleCreateNew}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Nouvelle carte</span>
                        </button>
                    </div>

                    {/* Search and filters */}
                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une carte..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <Filter className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded transition-colors ${viewMode === 'grid'
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Grid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded transition-colors ${viewMode === 'list'
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {filteredCards.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <Plus className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {searchQuery ? 'Aucune carte trouvée' : 'Aucune carte de visite'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {searchQuery
                                    ? 'Essayez de modifier votre recherche'
                                    : 'Créez votre première carte de visite personnalisée'
                                }
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={handleCreateNew}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Créer ma première carte
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredCards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        {/* Preview */}
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
                                            <div className="flex justify-center">
                                                <BusinessCardTemplate
                                                    data={card.data}
                                                    scale={0.4}
                                                    className="pointer-events-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                                                        <span>{card.name}</span>
                                                        {card.isDefault && (
                                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                        )}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {card.data.contactPerson} • {card.data.position}
                                                    </p>
                                                </div>
                                                <div className="relative">
                                                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                                                <span>Modifiée le {card.updatedAt.toLocaleDateString()}</span>
                                                <div className="flex items-center space-x-3">
                                                    <span>{card.downloads} ⬇</span>
                                                    <span>{card.shares} 📤</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEdit(card)}
                                                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-3 rounded text-sm font-medium transition-colors"
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(card)}
                                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Télécharger"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleShare(card)}
                                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Partager"
                                                >
                                                    <Share2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDuplicate(card)}
                                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Dupliquer"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredCards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center space-x-6">
                                            {/* Preview */}
                                            <div className="flex-shrink-0">
                                                <BusinessCardTemplate
                                                    data={card.data}
                                                    scale={0.3}
                                                    className="pointer-events-none"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                                                            <span>{card.name}</span>
                                                            {card.isDefault && (
                                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                            )}
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-400">
                                                            {card.data.companyName} • {card.data.contactPerson}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            Créée le {card.createdAt.toLocaleDateString()} • Modifiée le {card.updatedAt.toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(card)}
                                                            className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                            <span>Modifier</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownload(card)}
                                                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                            title="Télécharger"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleShare(card)}
                                                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                            title="Partager"
                                                        >
                                                            <Share2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDuplicate(card)}
                                                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                            title="Dupliquer"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </button>
                                                        {!card.isDefault && (
                                                            <button
                                                                onClick={() => handleDelete(card.id)}
                                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                                title="Supprimer"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                                                        <span>{card.downloads} téléchargements</span>
                                                        <span>{card.shares} partages</span>
                                                        <span>Template: {card.data.template}</span>
                                                    </div>
                                                    {!card.isDefault && (
                                                        <button
                                                            onClick={() => handleSetDefault(card.id)}
                                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                        >
                                                            Définir par défaut
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Editor Modal */}
            {isEditorOpen && (
                <BusinessCardEditor
                    initialData={editingCard?.data || defaultBusinessCardData}
                    onSave={handleSave}
                    onClose={() => {
                        setIsEditorOpen(false);
                        setEditingCard(null);
                    }}
                />
            )}
        </div>
    );
};

export default BusinessCardGallery;
