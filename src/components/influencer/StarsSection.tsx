import React, { useState } from 'react';
import { Star, MapPin, Users, DollarSign, Instagram, MessageCircle, Eye } from 'lucide-react';

interface InfluencerStar {
    id: string;
    name: string;
    image: string;
    followers: number;
    country: string;
    category: string;
    pricePerPost: number;
    pricePerStory: number;
    engagement: number;
    verified: boolean;
    description: string;
}

const StarsSection: React.FC = () => {
    const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerStar | null>(null);
    const [showContactModal, setShowContactModal] = useState(false);

    const influencerStars: InfluencerStar[] = [
        {
            id: '1',
            name: 'Cristiano Ronaldo',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
            followers: 615000000,
            country: 'Portugal',
            category: 'Sport',
            pricePerPost: 50000,
            pricePerStory: 15000,
            engagement: 3.2,
            verified: true,
            description: 'Footballeur professionnel, capitaine de l\'équipe du Portugal'
        },
        {
            id: '2',
            name: 'Kim Kardashian',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b123?w=400',
            followers: 365000000,
            country: 'États-Unis',
            category: 'Mode & Beauté',
            pricePerPost: 45000,
            pricePerStory: 12000,
            engagement: 2.8,
            verified: true,
            description: 'Entrepreneur, influenceuse mode et beauté'
        },
        {
            id: '3',
            name: 'Neymar Jr',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            followers: 220000000,
            country: 'Brésil',
            category: 'Sport',
            pricePerPost: 35000,
            pricePerStory: 10000,
            engagement: 4.1,
            verified: true,
            description: 'Footballeur professionnel au PSG'
        },
        {
            id: '4',
            name: 'Lionel Messi',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            followers: 485000000,
            country: 'Argentine',
            category: 'Sport',
            pricePerPost: 55000,
            pricePerStory: 18000,
            engagement: 3.5,
            verified: true,
            description: 'Footballeur professionnel, 7 fois Ballon d\'Or'
        },
        {
            id: '5',
            name: 'Beyoncé',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            followers: 315000000,
            country: 'États-Unis',
            category: 'Musique',
            pricePerPost: 40000,
            pricePerStory: 11000,
            engagement: 2.5,
            verified: true,
            description: 'Chanteuse, danseuse et actrice internationale'
        },
        {
            id: '6',
            name: 'Paris Saint-Germain',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
            followers: 55000000,
            country: 'France',
            category: 'Sport',
            pricePerPost: 25000,
            pricePerStory: 8000,
            engagement: 5.2,
            verified: true,
            description: 'Club de football professionnel français'
        }
    ];

    const formatFollowers = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    const handleContact = (influencer: InfluencerStar) => {
        setSelectedInfluencer(influencer);
        setShowContactModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Influenceurs stars
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {influencerStars.length} célébrités disponibles
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {influencerStars.map((influencer) => (
                    <div
                        key={influencer.id}
                        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        {/* Image et badge vérifié */}
                        <div className="relative">
                            <img
                                src={influencer.image}
                                alt={influencer.name}
                                className="w-full h-48 object-cover"
                            />
                            {influencer.verified && (
                                <div className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full">
                                    <Star size={16} fill="currentColor" />
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            {/* Nom et localisation */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                    {influencer.name}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <MapPin size={16} />
                                    <span>{influencer.country}</span>
                                    <span className="mx-2">•</span>
                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs">
                                        {influencer.category}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                {influencer.description}
                            </p>

                            {/* Statistiques */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                                        <Users size={14} />
                                        <span className="text-xs">Followers</span>
                                    </div>
                                    <div className="font-bold text-gray-900 dark:text-white">
                                        {formatFollowers(influencer.followers)}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                                        <Eye size={14} />
                                        <span className="text-xs">Engagement</span>
                                    </div>
                                    <div className="font-bold text-gray-900 dark:text-white">
                                        {influencer.engagement}%
                                    </div>
                                </div>
                            </div>

                            {/* Tarifs */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">Post Instagram</span>
                                        <div className="font-bold text-blue-600 dark:text-blue-400">
                                            {influencer.pricePerPost.toLocaleString()}€
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400">Story</span>
                                        <div className="font-bold text-blue-600 dark:text-blue-400">
                                            {influencer.pricePerStory.toLocaleString()}€
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleContact(influencer)}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={16} />
                                    Contacter
                                </button>
                                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <Instagram size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de contact */}
            {showContactModal && selectedInfluencer && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Contacter {selectedInfluencer.name}
                        </h3>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Type de collaboration
                                </label>
                                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                                    <option>Post Instagram</option>
                                    <option>Story Instagram</option>
                                    <option>Campagne complète</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Budget proposé
                                </label>
                                <input
                                    type="number"
                                    placeholder="Montant en €"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Message
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Décrivez votre projet..."
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowContactModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Envoyer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StarsSection;
