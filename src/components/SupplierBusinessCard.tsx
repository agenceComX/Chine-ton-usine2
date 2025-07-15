import React from 'react';
import { Download, Share2, Eye } from 'lucide-react';
import BusinessCardTemplate, { BusinessCardData, defaultBusinessCardData } from './BusinessCardTemplate';

interface SupplierBusinessCardProps {
    supplierData: {
        name: string;
        logo: string;
        contact: {
            phone: string;
            email: string;
            website: string;
        };
        location: {
            address: string;
            city: string;
            country: string;
        };
    };
    isOwner?: boolean;
    onManageCards?: () => void;
}

const SupplierBusinessCard: React.FC<SupplierBusinessCardProps> = ({
    supplierData,
    isOwner = false,
    onManageCards
}) => {
    // Convertir les données du fournisseur en format carte de visite
    const businessCardData: BusinessCardData = {
        ...defaultBusinessCardData,
        companyName: supplierData.name,
        tagline: 'Solutions manufacturières de qualité',
        contactPerson: 'Contact Commercial',
        position: 'Équipe Ventes',
        phone: supplierData.contact.phone,
        email: supplierData.contact.email,
        website: supplierData.contact.website,
        address: `${supplierData.location.address}, ${supplierData.location.city}, ${supplierData.location.country}`,
        logo: supplierData.logo,
        template: 'professional',
        layout: 'modern'
    };

    const handleDownload = () => {
        alert('Téléchargement de la carte de visite (fonctionnalité à implémenter)');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Carte de visite - ${supplierData.name}`,
                text: `Découvrez les services de ${supplierData.name}`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Lien copié dans le presse-papiers !');
        }
    };

    const handlePreview = () => {
        alert('Aperçu plein écran (fonctionnalité à implémenter)');
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Carte de visite
                </h3>
                {isOwner && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                        Ma carte
                    </span>
                )}
            </div>

            <div className="mb-4 transform scale-75 origin-top-left">
                <div className="w-96 h-56">
                    <BusinessCardTemplate
                        data={businessCardData}
                        scale={0.75}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                    <button
                        onClick={handlePreview}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Aperçu plein écran"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Partager"
                    >
                        <Share2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                        title="Télécharger"
                    >
                        <Download className="h-4 w-4" />
                    </button>
                </div>

                {isOwner && (
                    <button
                        onClick={() => {
                            if (onManageCards) {
                                onManageCards();
                            } else {
                                const url = new URL(window.location.href);
                                url.hash = '#business-cards';
                                window.location.href = url.toString();
                            }
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        Gérer mes cartes →
                    </button>
                )}
            </div>

            {!isOwner && (
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        💡 <strong>Astuce :</strong> Téléchargez cette carte pour avoir toutes les informations de contact à portée de main !
                    </p>
                </div>
            )}
        </div>
    );
};

export default SupplierBusinessCard;
