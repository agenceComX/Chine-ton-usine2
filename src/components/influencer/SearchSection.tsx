import React, { useState } from 'react';
import { Search, Filter, MapPin, Users, DollarSign, Star, X } from 'lucide-react';

interface InfluencerProfile {
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
    languages: string[];
    description: string;
}

const SearchSection: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        country: '',
        minFollowers: '',
        maxPrice: '',
        verified: false
    });
    const [showFilters, setShowFilters] = useState(false);

    const influencers: InfluencerProfile[] = [
        {
            id: '1',
            name: 'Emma Laurent',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b123?w=400',
            followers: 250000,
            country: 'France',
            category: 'Mode & Beauté',
            pricePerPost: 1500,
            pricePerStory: 500,
            engagement: 4.2,
            verified: true,
            languages: ['Français', 'Anglais'],
            description: 'Influenceuse mode et beauté, spécialisée dans les produits de luxe'
        },
        {
            id: '2',
            name: 'Marco Silva',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            followers: 180000,
            country: 'Espagne',
            category: 'Sport',
            pricePerPost: 1200,
            pricePerStory: 400,
            engagement: 5.1,
            verified: false,
            languages: ['Espagnol', 'Anglais'],
            description: 'Coach sportif et nutritionniste, expert en fitness'
        },
        {
            id: '3',
            name: 'Sophie Chen',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            followers: 320000,
            country: 'Singapour',
            category: 'Technologie',
            pricePerPost: 2000,
            pricePerStory: 600,
            engagement: 3.8,
            verified: true,
            languages: ['Anglais', 'Mandarin'],
            description: 'Tech reviewer et entrepreneure dans l\'IoT'
        },
        {
            id: '4',
            name: 'Alex Johnson',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            followers: 95000,
            country: 'États-Unis',
            category: 'Lifestyle',
            pricePerPost: 800,
            pricePerStory: 300,
            engagement: 6.2,
            verified: false,
            languages: ['Anglais'],
            description: 'Créateur de contenu lifestyle et voyages'
        },
        {
            id: '5',
            name: 'Luca Rossi',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
            followers: 420000,
            country: 'Italie',
            category: 'Cuisine',
            pricePerPost: 2500,
            pricePerStory: 800,
            engagement: 4.5,
            verified: true,
            languages: ['Italien', 'Français', 'Anglais'],
            description: 'Chef cuisinier et critique gastronomique'
        }
    ];

    const categories = ['Mode & Beauté', 'Sport', 'Technologie', 'Lifestyle', 'Cuisine', 'Voyage'];
    const countries = ['France', 'Espagne', 'Singapour', 'États-Unis', 'Italie', 'Allemagne'];

    const formatFollowers = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    const filteredInfluencers = influencers.filter(influencer => {
        const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            influencer.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filters.category || influencer.category === filters.category;
        const matchesCountry = !filters.country || influencer.country === filters.country;
        const matchesFollowers = !filters.minFollowers || influencer.followers >= parseInt(filters.minFollowers);
        const matchesPrice = !filters.maxPrice || influencer.pricePerPost <= parseInt(filters.maxPrice);
        const matchesVerified = !filters.verified || influencer.verified;

        return matchesSearch && matchesCategory && matchesCountry && matchesFollowers && matchesPrice && matchesVerified;
    });

    const clearFilters = () => {
        setFilters({
            category: '',
            country: '',
            minFollowers: '',
            maxPrice: '',
            verified: false
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Rechercher un influenceur
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredInfluencers.length} résultat(s) trouvé(s)
                </div>
            </div>

            {/* Barre de recherche */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Filter size={20} />
                    Filtres
                </button>
            </div>

            {/* Filtres */}
            {showFilters && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Filtres de recherche
                        </h3>
                        <button
                            onClick={clearFilters}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-sm"
                        >
                            Réinitialiser
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Catégorie
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pays
                            </label>
                            <select
                                value={filters.country}
                                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="">Tous les pays</option>
                                {countries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Followers minimum
                            </label>
                            <input
                                type="number"
                                placeholder="Ex: 50000"
                                value={filters.minFollowers}
                                onChange={(e) => setFilters({ ...filters, minFollowers: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Prix maximum (€)
                            </label>
                            <input
                                type="number"
                                placeholder="Ex: 2000"
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={filters.verified}
                                onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                Comptes vérifiés uniquement
                            </span>
                        </label>
                    </div>
                </div>
            )}

            {/* Résultats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInfluencers.map((influencer) => (
                    <div
                        key={influencer.id}
                        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                    >
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
                            <div className="mb-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                    {influencer.name}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                                    <MapPin size={14} />
                                    <span>{influencer.country}</span>
                                    <span className="mx-1">•</span>
                                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs">
                                        {influencer.category}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                {influencer.description}
                            </p>

                            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
                                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                                        {formatFollowers(influencer.followers)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Engagement</div>
                                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                                        {influencer.engagement}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Post</div>
                                    <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                                        {influencer.pricePerPost}€
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                    Contacter
                                </button>
                                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                                    Voir plus
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredInfluencers.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Search size={64} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Aucun influenceur trouvé
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Essayez de modifier vos critères de recherche
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            clearFilters();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Réinitialiser la recherche
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchSection;
