import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Heart,
    ShoppingCart,
    MessageCircle,
    Star,
    MapPin,
    Clock,
    Shield,
    Truck,
    Plus,
    Minus,
    ZoomIn,
    X,
    ArrowLeft
} from 'lucide-react';
import { useProduct, useSimilarProducts } from '../hooks/useProducts';
import { useFavorites } from '../context/FavoritesContext';
import { useQuote } from '../context/QuoteContext';
import { useToast } from '../components/ToastNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { Product, ProductVariant, ProductListItem } from '../services/productService';

const ProductDetailPageB2B: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { product, loading, error } = useProduct(id);
    const { products: similarProducts, loading: similarLoading } = useSimilarProducts(id, product?.category);

    // Contextes pour favoris et devis
    const { toggleFavorite, isFavorite } = useFavorites();
    const { addToQuote, getItemQuantity } = useQuote();
    const { showToast } = useToast();

    // États pour l'interface
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
    const [showImageZoom, setShowImageZoom] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);

    // Initialisation des états quand le produit est chargé
    React.useEffect(() => {
        if (product) {
            setSelectedImageIndex(0);
            setQuantity(product.moq);
        }
    }, [product]);

    // Gestion du loading et des erreurs
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h2>
                    <p className="text-gray-600">{error}</p>
                    <Link to="/products" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Retour aux produits
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
                    <Link to="/products" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Retour aux produits
                    </Link>
                </div>
            </div>
        );
    }

    // Calcul du prix total avec variantes et réductions
    const selectedImage = product.images[selectedImageIndex];
    const variantPriceAddition = Object.values(selectedVariants).reduce((total, variantId) => {
        const variant = product.variants?.find(v => v.id === variantId);
        return total + (variant?.price || 0);
    }, 0);

    const unitPrice = product.price + variantPriceAddition;
    const hasDiscount = product.discount && quantity >= product.discount.minQty;
    const discountedPrice = hasDiscount
        ? unitPrice * (1 - product.discount!.percentage / 100)
        : unitPrice;
    const totalPrice = discountedPrice * quantity;

    // Gestion des variantes
    const handleVariantChange = (type: string, variantId: string) => {
        setSelectedVariants(prev => ({
            ...prev,
            [type]: variantId
        }));
    };

    // Gestion de la quantité
    const updateQuantity = (newQuantity: number) => {
        if (newQuantity >= product.moq) {
            setQuantity(newQuantity);
        }
    };

    // Grouper les variantes par type
    const variantsByType = product.variants?.reduce((acc, variant) => {
        if (!acc[variant.type]) {
            acc[variant.type] = [];
        }
        acc[variant.type].push(variant);
        return acc;
    }, {} as Record<string, ProductVariant[]>) || {};

    // Fonction pour ajouter au devis avec variantes
    const handleAddToQuote = () => {
        const productForQuote: ProductListItem = {
            id: product.id!,
            name: product.name,
            description: product.description,
            price: unitPrice, // Prix unitaire avec variantes
            image: product.images[0].url, // URL de l'image principale
            moq: product.moq,
            category: product.category,
            supplier: {
                name: product.supplier.name,
                location: product.supplier.location,
                rating: product.supplier.rating,
                verified: product.supplier.verified
            },
            variants: product.variants?.map(v => v.name) || [],
            stock: product.stock || 0,
            tags: product.tags || [],
            discount: product.discount
        };

        addToQuote(productForQuote, quantity, selectedVariants);

        // Notification de succès
        showToast(`${product.name} ajouté au devis (${quantity} unités)`, 'success', 'cart');
    };

    // Vérifier si le produit est déjà dans le devis
    const isProductInQuote = getItemQuantity(product.id!) > 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navigation de retour */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Retour aux produits
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Galerie d'images */}
                    <div className="space-y-4">
                        {/* Image principale */}
                        <div className="relative group">
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.alt}
                                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                                onClick={() => setShowImageZoom(true)}
                            />
                            <button
                                onClick={() => setShowImageZoom(true)}
                                className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                            >
                                <ZoomIn size={20} className="text-gray-700 dark:text-gray-300" />
                            </button>
                        </div>

                        {/* Miniatures */}
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((image) => (
                                <button
                                    key={image.id}
                                    onClick={() => setSelectedImageIndex(product.images.indexOf(image))}
                                    className={`relative overflow-hidden rounded-lg transition-all duration-300 ${selectedImageIndex === product.images.indexOf(image)
                                        ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900'
                                        : 'hover:opacity-80'
                                        }`}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.alt}
                                        className="w-full h-20 object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Informations produit */}
                    <div className="space-y-6">
                        {/* En-tête produit */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {product.price.toFixed(2)}€<span className="text-lg text-gray-500 dark:text-gray-400">/unité</span>
                                </div>
                                {hasDiscount && (
                                    <div className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-semibold">
                                        -{product.discount!.percentage}% dès {product.discount!.minQty} pcs
                                    </div>
                                )}
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Fournisseur */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                {product.supplier.avatar && (
                                    <img
                                        src={product.supplier.avatar}
                                        alt={product.supplier.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {product.supplier.name}
                                        </h3>
                                        {product.supplier.verified && (
                                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">
                                                <Shield size={12} />
                                                Vérifié
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            {product.supplier.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star size={14} className="text-yellow-400 fill-current" />
                                            {product.supplier.rating}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            Répond en {product.supplier.responseTime}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Variantes */}
                        {Object.entries(variantsByType).map(([type, variants]) => (
                            <div key={type} className="space-y-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                    {type === 'color' ? 'Couleur' : type === 'size' ? 'Taille' : 'Matériau'}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => variant.available && handleVariantChange(type, variant.id)}
                                            disabled={!variant.available}
                                            className={`px-4 py-2 rounded-lg border transition-all duration-300 ${selectedVariants[type] === variant.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                : variant.available
                                                    ? 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
                                                }`}
                                        >
                                            {type === 'color' && (
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: variant.value }}
                                                    />
                                                    {variant.name}
                                                </div>
                                            )}
                                            {type !== 'color' && (
                                                <span>{variant.name}</span>
                                            )}
                                            {variant.price && (
                                                <span className="ml-1 text-xs text-gray-500">
                                                    +{variant.price.toFixed(2)}€
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Sélecteur de quantité */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Quantité (MOQ: {product.moq})
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(quantity - 10)}
                                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => updateQuantity(Number(e.target.value))}
                                        min={product.moq}
                                        className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
                                    />
                                    <button
                                        onClick={() => updateQuantity(quantity + 10)}
                                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Stock: {product.stock.toLocaleString()} disponibles
                                </div>
                            </div>
                        </div>

                        {/* Prix total */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 dark:text-gray-400">Prix total</span>
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {totalPrice.toFixed(2)}€
                                </div>
                            </div>
                            {hasDiscount && (
                                <div className="text-sm text-green-600 dark:text-green-400">
                                    Réduction de {product.discount!.percentage}% appliquée
                                </div>
                            )}
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {(totalPrice / quantity).toFixed(2)}€ par unité
                            </div>
                        </div>

                        {/* Délai de livraison */}
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Truck size={20} />
                            <span>
                                Livraison estimée: {product.deliveryTime.min}-{product.deliveryTime.max} {product.deliveryTime.unit === 'days' ? 'jours' : 'semaines'}
                            </span>
                        </div>

                        {/* Boutons d'action */}
                        <div className="space-y-3">
                            <button
                                onClick={handleAddToQuote}
                                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 ${isProductInQuote
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                                    }`}
                            >
                                <ShoppingCart size={20} />
                                {isProductInQuote ? 'Déjà dans le devis' : 'Ajouter au devis'}
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setShowContactForm(true)}
                                    className="bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={18} />
                                    Contacter
                                </button>

                                <button
                                    onClick={() => {
                                        toggleFavorite(product.id!);
                                        const isFav = isFavorite(product.id!);
                                        showToast(
                                            isFav ? `${product.name} retiré des favoris` : `${product.name} ajouté aux favoris`,
                                            'success',
                                            'heart'
                                        );
                                    }}
                                    className={`py-3 rounded-xl font-semibold border transition-all duration-300 flex items-center justify-center gap-2 ${isFavorite(product.id!)
                                        ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    <Heart size={18} fill={isFavorite(product.id!) ? 'currentColor' : 'none'} />
                                    {isFavorite(product.id!) ? 'Ajouté' : 'Favoris'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description détaillée */}
                <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Description détaillée
                    </h2>
                    <div className="prose dark:prose-invert max-w-none">
                        {product.longDescription.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                {paragraph.trim()}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Spécifications */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Spécifications techniques
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                <span className="font-medium text-gray-900 dark:text-white">{key}</span>
                                <span className="text-gray-600 dark:text-gray-400">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Caractéristiques
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Produits similaires */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                        Produits similaires
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {similarProducts.map((product) => (
                            <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group"
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                                />
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {product.name}
                                </h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                        {product.price.toFixed(2)}€
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Star size={14} className="text-yellow-400 fill-current" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            4.5
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal zoom image */}
            {showImageZoom && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowImageZoom(false)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.alt}
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setShowImageZoom(false)}
                            className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X size={24} className="text-white" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal formulaire de contact */}
            {showContactForm && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={(e) => e.target === e.currentTarget && setShowContactForm(false)}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Contacter le fournisseur
                            </h3>
                            <button
                                onClick={() => setShowContactForm(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Votre message
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Bonjour, je suis intéressé par ce produit..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Quantité souhaitée
                                </label>
                                <input
                                    type="number"
                                    value={quantity}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Envoyer le message
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailPageB2B;
