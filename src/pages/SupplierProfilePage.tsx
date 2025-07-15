import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
    ArrowLeft,
    Star,
    MapPin,
    Phone,
    Mail,
    Globe,
    Building,
    Calendar,
    Package,
    Award,
    Shield,
    MessageCircle,
    Heart,
    Share2,
    MoreHorizontal,
    Clock,
    Truck,
    CheckCircle,
    Eye,
    ThumbsUp,
    FileText,
    Download,
    ExternalLink,
    CreditCard
} from 'lucide-react';
import BusinessCardGallery from '../components/BusinessCardGallery';
import SupplierBusinessCard from '../components/SupplierBusinessCard';
import { useSupplierData } from '../hooks/useAuth';

// Interface pour les informations du fournisseur
interface SupplierProfile {
    id: string;
    name: string;
    logo: string;
    coverImage: string;
    description: string;
    location: {
        city: string;
        country: string;
        address: string;
    };
    contact: {
        phone: string;
        email: string;
        website: string;
    };
    rating: number;
    totalReviews: number;
    yearEstablished: number;
    employeeCount: string;
    specialties: string[];
    certifications: string[];
    products: {
        total: number;
        categories: string[];
    };
    stats: {
        ordersCompleted: number;
        responseTime: string;
        onTimeDelivery: number;
    };
    gallery: string[];
    verified: boolean;
    goldSupplier: boolean;
}

// Données de test pour le fournisseur
const mockSupplier: SupplierProfile = {
    id: 'supplier-1',
    name: 'TechnoMax Solutions',
    logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    description: 'Fabricant leader d\'équipements électroniques de haute qualité depuis plus de 15 ans. Nous nous spécialisons dans les smartphones, ordinateurs portables et accessoires technologiques avec une expertise reconnue mondialement.',
    location: {
        city: 'Shenzhen',
        country: 'Chine',
        address: '123 Technology Street, Nanshan District'
    },
    contact: {
        phone: '+86 755 1234 5678',
        email: 'contact@technomax.com',
        website: 'www.technomax-solutions.com'
    },
    rating: 4.8,
    totalReviews: 1247,
    yearEstablished: 2008,
    employeeCount: '500-1000',
    specialties: [
        'Smartphones',
        'Ordinateurs portables',
        'Accessoires électroniques',
        'Équipements audio',
        'Composants électroniques'
    ],
    certifications: [
        'ISO 9001:2015',
        'CE Certification',
        'FCC Approved',
        'RoHS Compliant',
        'ISO 14001'
    ],
    products: {
        total: 856,
        categories: ['Électronique', 'Audio', 'Informatique', 'Accessoires']
    },
    stats: {
        ordersCompleted: 5420,
        responseTime: '< 2h',
        onTimeDelivery: 98.5
    },
    gallery: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
    ],
    verified: true,
    goldSupplier: true
};

const SupplierProfilePage: React.FC = () => {
    const { supplierId } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [supplier, setSupplier] = useState<SupplierProfile | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Utiliser le hook pour les permissions
    const { isOwner, canManageCards } = useSupplierData(supplierId || '');

    useEffect(() => {
        // Simuler le chargement des données
        setTimeout(() => {
            setSupplier(mockSupplier);
            setIsLoaded(true);
        }, 300);
    }, [supplierId]);

    useEffect(() => {
        // Animation d'entrée
        if (supplier) {
            const timer = setTimeout(() => setIsLoaded(true), 100);
            return () => clearTimeout(timer);
        }
    }, [supplier]);

    if (!supplier) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">{t('supplier.loadingProfile')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header avec image de couverture */}
            <div className="relative">
                {/* Cover Image */}
                <div className="h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
                    <img
                        src={supplier.coverImage}
                        alt="Cover"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                    {/* Navigation */}
                    <div className="absolute top-6 left-6 z-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-6 right-6 z-10 flex space-x-3">
                        <button
                            onClick={() => setIsFavorite(!isFavorite)}
                            className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${isFavorite
                                ? 'bg-red-500 text-white'
                                : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                        >
                            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                        </button>
                        <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200">
                            <Share2 className="h-5 w-5" />
                        </button>
                        <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Profile Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
                            {/* Logo */}
                            <div className="relative">
                                <img
                                    src={supplier.logo}
                                    alt={supplier.name}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white p-2 shadow-lg border-4 border-white"
                                />
                                {supplier.verified && (
                                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                                        <CheckCircle className="h-4 w-4" />
                                    </div>
                                )}
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                                        {supplier.name}
                                    </h1>
                                    {supplier.goldSupplier && (
                                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                                            <Award className="h-4 w-4" />
                                            <span>{t('supplier.goldSupplier')}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-4 text-white/90">
                                    <div className="flex items-center space-x-1">
                                        <Star className="h-5 w-5 fill-current text-yellow-400" />
                                        <span className="font-semibold">{supplier.rating}</span>
                                        <span>({supplier.totalReviews} {t('supplier.reviews')})</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>{supplier.location.city}, {supplier.location.country}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{t('supplier.since')} {supplier.yearEstablished}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-3">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                                    <MessageCircle className="h-5 w-5" />
                                    <span>{t('supplier.contact')}</span>
                                </button>
                                <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 flex items-center space-x-2">
                                    <Eye className="h-5 w-5" />
                                    <span>{t('supplier.viewProducts')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`max-w-7xl mx-auto px-6 py-8 transition-all duration-700 ${isLoaded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: t('supplier.overview'), icon: Building },
                                { id: 'products', label: t('supplier.products'), icon: Package },
                                { id: 'business-cards', label: t('supplier.businessCards'), icon: CreditCard },
                                { id: 'certifications', label: t('supplier.certifications'), icon: Award },
                                { id: 'gallery', label: t('supplier.gallery'), icon: Eye },
                                { id: 'reviews', label: t('supplier.reviews'), icon: Star }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-4 px-2 font-medium text-sm transition-all duration-300 relative ${activeTab === tab.id
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Description */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        {t('supplier.aboutCompany')}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {supplier.description}
                                    </p>
                                </div>

                                {/* Specialties */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        {t('supplier.specialties')}
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {supplier.specialties.map((specialty, index) => (
                                            <div
                                                key={index}
                                                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800"
                                            >
                                                <span className="text-blue-700 dark:text-blue-300 font-medium">
                                                    {specialty}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Performance Stats */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        {t('supplier.performance')}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg mb-3">
                                                <Package className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto" />
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {supplier.stats.ordersCompleted.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {t('supplier.ordersCompleted')}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg mb-3">
                                                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto" />
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {supplier.stats.responseTime}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {t('supplier.responseTime')}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg mb-3">
                                                <Truck className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto" />
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {supplier.stats.onTimeDelivery}%
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {t('supplier.onTimeDelivery')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {t('supplier.products')} ({supplier.products.total})
                                    </h2>
                                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                                        {t('supplier.viewAll')} →
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {supplier.products.categories.map((category, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                                        >
                                            <div className="text-2xl mb-2">📱</div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {category}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'business-cards' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {isOwner ? t('supplier.myBusinessCards') : t('supplier.businessCards')}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {isOwner
                                            ? t('supplier.createBusinessCardsDesc')
                                            : t('supplier.viewBusinessCardsDesc')
                                        }
                                    </p>
                                </div>

                                {/* Affichage conditionnel selon les permissions */}
                                {canManageCards ? (
                                    <BusinessCardGallery supplierId={supplierId} />
                                ) : (
                                    <div className="text-center py-8">
                                        <CreditCard className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                            {t('supplier.businessCardsAvailable')}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            {t('supplier.supplierSharesCards')}
                                        </p>
                                        <div className="max-w-md mx-auto">
                                            <SupplierBusinessCard
                                                supplierData={{
                                                    name: supplier.name,
                                                    logo: supplier.logo,
                                                    contact: supplier.contact,
                                                    location: supplier.location
                                                }}
                                                isOwner={isOwner}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'certifications' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    {t('supplier.certificationsAndStandards')}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {supplier.certifications.map((cert, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-lg border border-green-200 dark:border-green-800"
                                        >
                                            <div className="bg-green-500 text-white p-2 rounded-full">
                                                <Shield className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">
                                                    {cert}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {t('supplier.validCertification')}
                                                </div>
                                            </div>
                                            <div className="ml-auto">
                                                <button className="text-blue-600 hover:text-blue-700">
                                                    <ExternalLink className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    {t('supplier.companyGallery')}
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {supplier.gallery.map((image, index) => (
                                        <div
                                            key={index}
                                            className="relative group cursor-pointer rounded-lg overflow-hidden"
                                        >
                                            <img
                                                src={image}
                                                alt={`Gallery ${index + 1}`}
                                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <Eye className="h-8 w-8 text-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    {t('supplier.customerReviews')}
                                </h2>
                                <div className="space-y-6">
                                    {/* Sample review */}
                                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                JD
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <div className="font-semibold text-gray-900 dark:text-white">
                                                        Jean Dupont
                                                    </div>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                                                        ))}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {t('supplier.weeksAgo', { count: 2 })}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {t('supplier.sampleReviewText')}
                                                </p>
                                                <div className="flex items-center space-x-4 mt-3">
                                                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600">
                                                        <ThumbsUp className="h-4 w-4" />
                                                        <span>{t('supplier.helpful')} (12)</span>
                                                    </button>
                                                    <button className="text-sm text-gray-500 hover:text-blue-600">
                                                        {t('supplier.reply')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* Carte de visite du fournisseur */}
                            <SupplierBusinessCard
                                supplierData={{
                                    name: supplier.name,
                                    logo: supplier.logo,
                                    contact: supplier.contact,
                                    location: supplier.location
                                }}
                                isOwner={isOwner}
                                onManageCards={() => setActiveTab('business-cards')}
                            />

                            {/* Contact Info */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t('supplier.contactInfo')}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {t('supplier.address')}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {supplier.location.address}<br />
                                                {supplier.location.city}, {supplier.location.country}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {t('supplier.phone')}
                                            </div>
                                            <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                                                {supplier.contact.phone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {t('supplier.email')}
                                            </div>
                                            <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                                                {supplier.contact.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Globe className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {t('supplier.website')}
                                            </div>
                                            <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                                                {supplier.contact.website}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t('supplier.companyInfo')}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">{t('supplier.foundedIn')}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {supplier.yearEstablished}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">{t('supplier.employees')}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {supplier.employeeCount}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">{t('supplier.products')}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {supplier.products.total}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t('supplier.quickActions')}
                                </h3>
                                <div className="space-y-3">
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                                        <MessageCircle className="h-5 w-5" />
                                        <span>{t('supplier.sendMessage')}</span>
                                    </button>
                                    <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                                        <FileText className="h-5 w-5" />
                                        <span>{t('supplier.requestQuote')}</span>
                                    </button>
                                    <button className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                                        <Download className="h-5 w-5" />
                                        <span>{t('supplier.downloadCatalog')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierProfilePage;
