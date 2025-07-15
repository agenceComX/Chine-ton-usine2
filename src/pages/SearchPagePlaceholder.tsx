import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SortAsc, Globe } from 'lucide-react';

const SearchPagePlaceholder: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-green-900 flex items-center justify-center">
            <div className="max-w-2xl mx-auto px-4 text-center">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 border border-gray-200 dark:border-gray-700">
                    <div className="text-6xl mb-6">🔍</div>

                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Nouvelle Page Recherche
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        Cette page est en cours de développement pour vous offrir des fonctionnalités de recherche avancées.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                            <Search className="w-6 h-6 text-green-600 dark:text-green-400" />
                            <span className="text-green-800 dark:text-green-200 font-medium">Recherche intelligente</span>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            <span className="text-blue-800 dark:text-blue-200 font-medium">Filtres personnalisés</span>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                            <SortAsc className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            <span className="text-purple-800 dark:text-purple-200 font-medium">Tri avancé</span>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                            <Globe className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            <span className="text-orange-800 dark:text-orange-200 font-medium">Recherche globale</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                            Retour à l'accueil
                        </Link>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                            Implémentez votre propre version de cette page selon vos besoins spécifiques.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPagePlaceholder;
