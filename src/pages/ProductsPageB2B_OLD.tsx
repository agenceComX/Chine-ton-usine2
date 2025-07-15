import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, MessageCircle, ShoppingCart, Filter, X, Plus, Minus, Star, MapPin, Clock, Shield } from 'lucide-react';
import { useProducts, useProductFilters } from '../hooks/useProducts';
import { ProductListItem } from '../services/productService';
import { useFavorites } from '../context/FavoritesContext';
import { useQuote } from '../context/QuoteContext';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = ['Toutes', 'Électronique', 'Mode', 'Bagagerie', 'Maison', 'Accessoires'];

const ProductsPage: React.FC = () => {
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
        stock: 50000,
        tags: ['GPS', 'Étanche', 'Bluetooth', 'Santé'],
        discount: { minQty: 500, percentage: 15 }
    },
    {
        id: '2',
        name: 'Lunettes de Soleil UV400',
        price: 0.50,
        moq: 200,
        category: 'Mode',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        supplier: {
            name: 'Fashion Optics Co.',
            location: 'Guangzhou, Chine',
            rating: 4.5,
            verified: true
        },
        description: 'Lunettes de soleil avec protection UV400, monture en acétate de qualité supérieure. Design moderne et confortable.',
        variants: ['Noir/Noir', 'Tortue/Brun', 'Bleu/Miroir', 'Transparent/Gris'],
        stock: 80000,
        tags: ['UV400', 'Polarisé', 'Léger', 'Mode'],
        discount: { minQty: 1000, percentage: 20 }
    },
    {
        id: '3',
        name: 'Écouteurs Bluetooth Sans Fil',
        price: 2.50,
        moq: 50,
        category: 'Électronique',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
        supplier: {
            name: 'Audio Excellence Ltd',
            location: 'Dongguan, Chine',
            rating: 4.7,
            verified: true
        },
        description: 'Écouteurs true wireless avec réduction de bruit active, boîtier de charge rapide et autonomie 24h. Qualité audio HD.',
        variants: ['Blanc', 'Noir', 'Bleu', 'Rouge'],
        stock: 30000,
        tags: ['ANC', 'Wireless', 'Charge Rapide', 'HD Audio']
    },
    {
        id: '4',
        name: 'Sac à Dos Business Laptop',
        price: 3.20,
        moq: 100,
        category: 'Bagagerie',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        supplier: {
            name: 'Premium Bags Manufacturing',
            location: 'Quanzhou, Chine',
            rating: 4.6,
            verified: false
        },
        description: 'Sac à dos professionnel avec compartiment laptop 15.6", port USB, matériau imperméable et design ergonomique.',
        variants: ['Noir', 'Gris', 'Bleu Marine'],
        stock: 15000,
        tags: ['USB Port', 'Imperméable', '15.6"', 'Ergonomique']
    },
    {
        id: '5',
        name: 'Chargeur Sans Fil Rapide 15W',
        price: 1.80,
        moq: 150,
        category: 'Électronique',
        image: 'https://images.unsplash.com/photo-1609592806003-c8b24c4e16db?w=400&h=400&fit=crop',
        supplier: {
            name: 'PowerTech Solutions',
            location: 'Shenzhen, Chine',
            rating: 4.9,
            verified: true
        },
        description: 'Chargeur sans fil compatible Qi avec charge rapide 15W, LED indicateur, protection surchauffe et design ultra-fin.',
        variants: ['Blanc', 'Noir', 'Transparent'],
        stock: 40000,
        tags: ['Qi', '15W', 'LED', 'Ultra-fin']
    },
    {
        id: '6',
        name: 'Lampe LED Bureau Pliable',
        price: 4.50,
        moq: 80,
        category: 'Maison',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        supplier: {
            name: 'Lighting Innovations',
            location: 'Zhongshan, Chine',
            rating: 4.4,
            verified: true
        },
        description: 'Lampe de bureau LED avec bras articulé, 3 modes de couleur, dimmer tactile et port USB pour recharge.',
        variants: ['Blanc', 'Noir', 'Argent'],
        stock: 12000,
const categories = ['Toutes', 'Électronique', 'Mode', 'Bagagerie', 'Maison', 'Accessoires'];

const ProductsPage: React.FC = () => {
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
    const toggleFavorite = (productId: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productId)) {
                newFavorites.delete(productId);
            } else {
                newFavorites.add(productId);
            }
            return newFavorites;
        });
    };

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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Erreur de chargement
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header avec filtres */}
            <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Catalogue B2B
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {filteredProducts.length} produits disponibles
                            </p>
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium shadow-lg"
                        >
                            <Filter size={20} />
                            <span>Filtres</span>
                        </button>
                    </div>

                    {/* Filtres */}
                    {showFilters && (
                        <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filtres</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Réinitialiser
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
                                            value={moqRange.min}
                                            onChange={(e) => setMoqRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={moqRange.max}
                                            onChange={(e) => setMoqRange(prev => ({ ...prev, max: Number(e.target.value) }))}
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
                        const quantity = getQuantity(product.id);
                        const total = calculateTotal(product, quantity);
                        const hasDiscount = product.discount && quantity >= product.discount.minQty;

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
                                            onClick={() => toggleFavorite(product.id)}
                                            className={`p-2 rounded-full transition-all duration-300 ${favorites.has(product.id)
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                                                }`}
                                        >
                                            <Heart size={18} fill={favorites.has(product.id) ? 'currentColor' : 'none'} />
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
                                                onClick={() => updateQuantity(product.id, Math.max(product.moq, quantity - 10))}
                                                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                                            >
                                                <Minus size={16} />
                                            </button>

                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => updateQuantity(product.id, Math.max(product.moq, Number(e.target.value)))}
                                                min={product.moq}
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                                            />

                                            <button
                                                onClick={() => updateQuantity(product.id, quantity + 10)}
                                                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Prix total */}
                                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Prix total</div>
                                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                            {total.toFixed(2)}€
                                        </div>
                                        {hasDiscount && (
                                            <div className="text-xs text-green-600 dark:text-green-400">
                                                Réduction de {product.discount!.percentage}% appliquée
                                            </div>
                                        )}
                                    </div>

                                    {/* Boutons d'action */}
                                    <div className="space-y-2">
                                        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                            <ShoppingCart size={18} className="inline mr-2" />
                                            Ajouter au devis
                                        </button>

                                        <button className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300">
                                            <MessageCircle size={18} className="inline mr-2" />
                                            Contacter le fournisseur
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal d'aperçu rapide */}
            {showQuickView && selectedProduct && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 shadow-2xl border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Aperçu rapide
                            </h2>
                            <button
                                onClick={closeQuickView}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90 group"
                                title="Fermer (Échap)"
                            >
                                <X size={24} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Image principale */}
                                <div>
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        className="w-full h-96 object-cover rounded-xl"
                                    />

                                    {/* Galerie de variantes */}
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Variantes disponibles
                                        </h4>
                                        <div className="flex gap-2 flex-wrap">
                                            {selectedProduct.variants.map((variant, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                                                >
                                                    {variant}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Détails du produit */}
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        {selectedProduct.name}
                                    </h3>

                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                                        {selectedProduct.price.toFixed(2)}€
                                    </div>

                                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            {selectedProduct.supplier.name}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={16} />
                                                {selectedProduct.supplier.location}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star size={16} className="text-yellow-400 fill-current" />
                                                {selectedProduct.supplier.rating}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={16} />
                                                Stock: {selectedProduct.stock.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            Description
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {selectedProduct.description}
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            Caractéristiques
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProduct.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
                                            Ajouter au devis
                                        </button>
                                        <button className="flex-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300">
                                            Contacter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Indication de fermeture */}
                        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                Cliquez en dehors ou appuyez sur <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">Échap</kbd> pour fermer
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
