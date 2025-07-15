import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, Plus, Minus, Truck, Shield, RotateCcw, Award, Phone } from 'lucide-react';

// Interface pour les produits (même que ProductsPageFixed)
interface SimpleProduct {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    brand: string;
    category: string;
    image: string;
    isNew?: boolean;
    isPopular?: boolean;
    features?: string[];
    description?: string;
    rating?: number;
    reviews?: number;
    images?: string[];
    specifications?: { [key: string]: string };
}

// Données étendues pour la page produit
const getProductById = (id: string): SimpleProduct | null => {
    const products: SimpleProduct[] = [
        {
            id: '1',
            name: 'Smartphone Samsung Galaxy S24',
            price: 599,
            originalPrice: 799,
            discount: 25,
            brand: 'Samsung',
            category: 'Électronique',
            image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop',
            isNew: true,
            features: ['5G', 'Livraison gratuite', '128GB', 'Triple caméra'],
            description: 'Le Samsung Galaxy S24 redéfinit l\'excellence mobile avec son design élégant et ses performances exceptionnelles. Doté d\'un écran Dynamic AMOLED 2X de 6.1 pouces, ce smartphone offre une expérience visuelle immersive avec des couleurs vives et des détails nets.',
            rating: 4.8,
            reviews: 1247,
            images: [
                'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=800&fit=crop'
            ],
            specifications: {
                'Écran': '6.1" Dynamic AMOLED 2X',
                'Processeur': 'Exynos 2400',
                'Mémoire': '8GB RAM',
                'Stockage': '128GB',
                'Caméra': '50MP + 12MP + 10MP',
                'Batterie': '4000mAh',
                'OS': 'Android 14'
            }
        },
        {
            id: '2',
            name: 'Casque Sony WH-1000XM4',
            price: 279,
            originalPrice: 349,
            discount: 20,
            brand: 'Sony',
            category: 'Électronique',
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
            isPopular: true,
            features: ['Bluetooth', 'Noise Cancelling', '30h autonomie', 'Charge rapide'],
            description: 'Le casque sans fil Sony WH-1000XM4 avec réduction de bruit leader de l\'industrie vous offre une expérience audio exceptionnelle. Profitez d\'une qualité sonore premium et d\'un confort optimal pour de longues sessions d\'écoute.',
            rating: 4.9,
            reviews: 892,
            images: [
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
                'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop'
            ],
            specifications: {
                'Type': 'Casque circum-auriculaire',
                'Connectivité': 'Bluetooth 5.0, Jack 3.5mm',
                'Autonomie': '30 heures',
                'Réduction de bruit': 'Oui (ANC)',
                'Poids': '254g',
                'Charge': 'USB-C',
                'Assistant vocal': 'Google Assistant, Alexa'
            }
        },
        // ... autres produits similaires
    ];

    return products.find(p => p.id === id) || null;
};

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<SimpleProduct | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const foundProduct = getProductById(id);
            setProduct(foundProduct);
            setIsLoading(false);
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Produit non trouvé</h1>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Retour aux produits
                    </button>
                </div>
            </div>
        );
    }

    const handleQuantityChange = (change: number) => {
        setQuantity(prev => Math.max(1, prev + change));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 page-transition-in">
            {/* Header de navigation */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/products')}
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Retour aux produits</span>
                        </button>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <span>{product.category}</span> <span className="mx-2">{'>'}</span> <span className="text-gray-900 dark:text-white">{product.name}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Section Images */}
                    <div className="space-y-4">
                        {/* Image principale */}
                        <div className="aspect-square bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={product.images?.[selectedImage] || product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>

                        {/* Miniatures */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex space-x-3">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === index
                                            ? 'border-blue-500 scale-105'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                            }`}
                                    >
                                        <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Section Détails */}
                    <div className="space-y-6">
                        {/* En-tête produit */}
                        <div>
                            {/* Badges */}
                            <div className="flex space-x-2 mb-3">
                                {product.isNew && (
                                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                                        ✨ Nouveau
                                    </span>
                                )}
                                {product.isPopular && (
                                    <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
                                        🔥 Populaire
                                    </span>
                                )}
                                {product.discount && (
                                    <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                                        -{product.discount}% OFF
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {product.name}
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-1">{product.brand}</p>
                            <p className="text-blue-600 dark:text-blue-400 font-medium">{product.category}</p>
                        </div>

                        {/* Rating */}
                        {product.rating && (
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < Math.floor(product.rating!)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
                                        {product.rating}
                                    </span>
                                </div>
                                <span className="text-gray-500 dark:text-gray-400">
                                    ({product.reviews} avis)
                                </span>
                            </div>
                        )}

                        {/* Prix */}
                        <div className="flex items-center space-x-4">
                            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                {product.price}€
                            </span>
                            {product.originalPrice && (
                                <span className="text-2xl text-gray-500 line-through">
                                    {product.originalPrice}€
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {product.description}
                            </p>
                        )}

                        {/* Caractéristiques */}
                        {product.features && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    Caractéristiques principales
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.features.map((feature) => (
                                        <span
                                            key={feature}
                                            className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantité et Actions */}
                        <div className="space-y-4">
                            {/* Sélecteur de quantité */}
                            <div className="flex items-center space-x-4">
                                <span className="text-lg font-medium text-gray-900 dark:text-white">Quantité:</span>
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-4 py-2 text-lg font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex space-x-4">
                                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2">
                                    <Phone className="h-5 w-5" />
                                    <span>Contacter le fournisseur</span>
                                </button>
                                <button
                                    onClick={() => navigate(`/supplier/supplier-${product?.brand.toLowerCase()}`)}
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6m-6 4h6" />
                                    </svg>
                                    <span>Voir fournisseur</span>
                                </button>
                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={`p-4 rounded-lg border-2 transition-colors ${isFavorite
                                        ? 'border-red-500 bg-red-50 text-red-500'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-red-300'
                                        }`}
                                >
                                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                                </button>
                                <button className="p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-300 transition-colors">
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Informations de livraison */}
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                            <div className="flex items-center space-x-3">
                                <Truck className="h-5 w-5 text-green-600" />
                                <span className="text-gray-700 dark:text-gray-300">Livraison gratuite dès 50€</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Shield className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-700 dark:text-gray-300">Garantie 2 ans</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <RotateCcw className="h-5 w-5 text-orange-600" />
                                <span className="text-gray-700 dark:text-gray-300">Retour gratuit 30 jours</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Award className="h-5 w-5 text-purple-600" />
                                <span className="text-gray-700 dark:text-gray-300">Produit certifié</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spécifications techniques */}
                {product.specifications && (
                    <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Spécifications techniques
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(product.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{key}</span>
                                    <span className="text-gray-900 dark:text-white">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
