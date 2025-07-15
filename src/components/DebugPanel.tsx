import React from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useQuote } from '../context/QuoteContext';

const DebugPanel: React.FC = () => {
    const { favorites, getFavoriteProducts, clearFavorites } = useFavorites();
    const { items: quoteItems, getTotalItems, getTotalPrice, clearQuote } = useQuote();

    return (
        <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[300px] z-50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Debug Panel</h3>

            {/* Favoris */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Heart size={16} />
                        Favoris ({favorites.size})
                    </h4>
                    <button
                        onClick={clearFavorites}
                        className="text-red-500 hover:text-red-700 text-sm"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {favorites.size === 0 ? 'Aucun favori' : `IDs: ${getFavoriteProducts().join(', ')}`}
                </div>
            </div>

            {/* Devis */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <ShoppingCart size={16} />
                        Devis ({getTotalItems()})
                    </h4>
                    <button
                        onClick={clearQuote}
                        className="text-red-500 hover:text-red-700 text-sm"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    {quoteItems.length === 0 ? 'Aucun produit' : `Total: ${getTotalPrice().toFixed(2)}€`}
                </div>
                {quoteItems.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {quoteItems.map((item) => (
                            <div key={item.productId} className="text-xs text-gray-500 dark:text-gray-400">
                                {item.product.name} - {item.quantity} unités
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* LocalStorage info */}
            <div className="text-xs text-gray-400 dark:text-gray-500">
                <div>Favoris: {localStorage.getItem('chine-ton-usine-favorites') ? '✓' : '✗'}</div>
                <div>Devis: {localStorage.getItem('chine-ton-usine-quote') ? '✓' : '✗'}</div>
            </div>
        </div>
    );
};

export default DebugPanel;
