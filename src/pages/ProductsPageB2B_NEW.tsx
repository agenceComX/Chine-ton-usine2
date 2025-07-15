import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, MessageCircle, ShoppingCart, Filter, X, Plus, Minus, Star, MapPin, Clock, Shield } from 'lucide-react';
import { useProducts, useProductFilters } from '../hooks/useProducts';
import { ProductListItem } from '../services/productService';
import { useFavorites } from '../context/FavoritesContext';
import { useQuote } from '../context/QuoteContext';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = ['Toutes', 'Électronique', 'Mode', 'Bagagerie', 'Maison', 'Accessoires'];

const ProductsPageB2B: React.FC = () => {
    // Récupération des produits depuis Firebase
    const { products, loading, error } = useProducts();
    const { filteredProducts, filters, updateFilters } = useProductFilters(products);

    // Contextes pour favoris et devis
    const { toggleFavorite, isFavorite } = useFavorites();
    const { addToQuote, getItemQuantity } = useQuote();

    // États locaux
    const [selectedProduct, setSelectedProduct] = useState<ProductListItem | null>(null);
    const [showQuickView, setShowQuickView] = useState(false);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [showFilters, setShowFilters] = useState(false);

    // Fonctions utilitaires
    const updateQuantity = (productId: string, quantity: number) => {
        const product = products.find(p => p.id === productId);
        if (product && quantity >= product.moq) {
            setQuantities(prev => ({ ...prev, [productId]: quantity }));
        }
    };

    const getQuantity = (productId: string) => {
        const product = products.find(p => p.id === productId);
        return quantities[productId] || product?.moq || 0;
    };

    const calculateTotal = (product: ProductListItem, quantity: number) => {
        let price = product.price * quantity;
        if (product.discount && quantity >= product.discount.minQty) {
            price = price * (1 - product.discount.percentage / 100);
        }
        return price;
    };

    const openQuickView = (product: ProductListItem) => {
        setSelectedProduct(product);
        setShowQuickView(true);
        document.body.style.overflow = 'hidden';
    };

    const closeQuickView = () => {
        setShowQuickView(false);
        setSelectedProduct(null);
        document.body.style.overflow = 'unset';
    };

    // Fonction pour ajouter au devis
    const handleAddToQuote = (product: ProductListItem) => {
        const quantity = getQuantity(product.id!);
        addToQuote(product, quantity);

        // Notification de succès (optionnel)
        console.log(`Produit ${product.name} ajouté au devis avec quantité: ${quantity}`);
    };

    // Fermer avec la touche Échap
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showQuickView) {
                closeQuickView();
            }
        };

        if (showQuickView) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showQuickView]);

    // Fermer en cliquant en dehors du modal
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeQuickView();
        }
    };

    const clearFilters = () => {
        updateFilters({
            category: 'Toutes',
            priceRange: { min: 0, max: 10 },
            moqRange: { min: 0, max: 500 }
        });
    };

    // Affichage du chargement
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Affichage des erreurs
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Erreur</h2>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* En-tête avec filtres */}
            <div className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Produits B2B
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                {filteredProducts.length} produits disponibles
                            </p>
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Filter size={20} />
                            Filtres
                        </button>
                    </div>

                    {/* Panneau de filtres */}
                    {showFilters && (
                        <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Filtres
                                </h3>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Catégorie */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Catégorie
                                    </label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => updateFilters({ category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Prix */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Prix (€)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.priceRange.min}
                                            onChange={(e) => updateFilters({
                                                priceRange: { ...filters.priceRange, min: Number(e.target.value) }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.priceRange.max}
                                            onChange={(e) => updateFilters({
                                                priceRange: { ...filters.priceRange, max: Number(e.target.value) }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* MOQ */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        MOQ (Quantité minimum)
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.moqRange?.min || 0}
                                            onChange={(e) => updateFilters({
                                                moqRange: { ...filters.moqRange, min: Number(e.target.value) }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.moqRange?.max || 1000}
                                            onChange={(e) => updateFilters({
                                                moqRange: { ...filters.moqRange, max: Number(e.target.value) }
                                            })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Grille de produits */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => {
                        const quantity = getQuantity(product.id!);
                        const total = calculateTotal(product, quantity);
                        const hasDiscount = product.discount && quantity >= product.discount.minQty;
                        const isProductInQuote = getItemQuantity(product.id!) > 0;

                        return (
                            <div
                                key={product.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 overflow-hidden group"
                            >
                                {/* Image du produit */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                    />

                                    {/* Boutons en overlay */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => toggleFavorite(product.id!)}
                                            className={`p-2 rounded-full transition-all duration-300 ${isFavorite(product.id!)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                                                }`}
                                        >
                                            <Heart size={18} fill={isFavorite(product.id!) ? 'currentColor' : 'none'} />
                                        </button>

                                        <button
                                            onClick={() => openQuickView(product)}
                                            className="p-2 bg-white text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-500 transition-all duration-300"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </div>

                                    {/* Badge de réduction */}
                                    {hasDiscount && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            -{product.discount!.percentage}%
                                        </div>
                                    )}

                                    {/* Badge vérifié */}
                                    {product.supplier.verified && (
                                        <div className="absolute bottom-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                            <Shield size={12} />
                                            Vérifié
                                        </div>
                                    )}
                                </div>

                                {/* Contenu de la carte */}
                                <div className="p-6">
                                    {/* Titre et prix */}
                                    <div className="mb-4">
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center justify-between">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {product.price.toFixed(2)}€
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                MOQ: {product.moq}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations fournisseur */}
                                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {product.supplier.name}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <MapPin size={12} className="text-gray-400" />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {product.supplier.location}
                                            </span>
                                            <div className="flex items-center gap-1 ml-auto">
                                                <Star size={12} className="text-yellow-400 fill-current" />
                                                <span className="text-xs text-gray-600 dark:text-gray-300">
                                                    {product.supplier.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sélecteur de quantité */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Quantité
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(product.id!, Math.max(product.moq, quantity - 10))}
                                                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                                            >
                                                <Minus size={16} />
                                            </button>

                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => updateQuantity(product.id!, Math.max(product.moq, Number(e.target.value)))}
                                                min={product.moq}
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                                            />

                                            <button
                                                onClick={() => updateQuantity(product.id!, quantity + 10)}
                                                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Prix total */}
                                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                {total.toFixed(2)}€
                                            </div>
                                        </div>
                                        {hasDiscount && (
                                            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                                Réduction de {product.discount!.percentage}% appliquée
                                            </div>
                                        )}
                                    </div>

                                    {/* Boutons d'action */}
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handleAddToQuote(product)}
                                            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${isProductInQuote
                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                        >
                                            <ShoppingCart size={18} />
                                            {isProductInQuote ? 'Déjà dans le devis' : 'Ajouter au devis'}
                                        </button>

                                        <button className="w-full py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                                            <MessageCircle size={16} />
                                            Contacter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Message si aucun produit */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <ShoppingCart size={64} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Aucun produit trouvé
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Essayez de modifier vos filtres ou de rechercher autre chose
                        </p>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Effacer les filtres
                        </button>
                    </div>
                )}
            </div>

            {/* Modal aperçu rapide */}
            {showQuickView && selectedProduct && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {selectedProduct.name}
                                </h2>
                                <button
                                    onClick={closeQuickView}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                className="w-full h-64 object-cover rounded-lg mb-4"
                            />

                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {selectedProduct.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Prix unitaire</span>
                                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                        {selectedProduct.price.toFixed(2)}€
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">MOQ</span>
                                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                                        {selectedProduct.moq}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    to={`/product/${selectedProduct.id}`}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
                                    onClick={closeQuickView}
                                >
                                    Voir détails
                                </Link>
                                <button
                                    onClick={() => handleAddToQuote(selectedProduct)}
                                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                                >
                                    Ajouter au devis
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPageB2B;
