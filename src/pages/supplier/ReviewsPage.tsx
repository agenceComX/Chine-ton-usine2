import React, { useState, useEffect } from 'react';
import { Star, Search, MessageSquare, ThumbsUp, Calendar, User, Package } from 'lucide-react';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import SupplierLayout from '../../layouts/SupplierLayout';

interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  isVerified: boolean;
  helpfulVotes: number;
  totalVotes: number;
  hasResponse: boolean;
  response?: {
    content: string;
    createdAt: Date;
  };
  images?: string[];
}

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [error, setError] = useState('');

  // Mock data for demonstration
  const mockReviews: Review[] = [
    {
      id: '1',
      productId: 'prod1',
      productName: 'Smartphone Android 128GB',
      customerName: 'Marie Dupont',
      customerId: 'cust1',
      rating: 5,
      title: 'Excellent produit, livraison rapide !',
      comment: 'Très satisfaite de mon achat. Le smartphone correspond exactement à la description et la livraison a été très rapide. Je recommande ce fournisseur.',
      createdAt: new Date('2024-01-12'),
      isVerified: true,
      helpfulVotes: 12,
      totalVotes: 14,
      hasResponse: true,
      response: {
        content: 'Merci beaucoup Marie pour votre avis positif ! Nous sommes ravis que vous soyez satisfaite de votre achat.',
        createdAt: new Date('2024-01-13')
      }
    },
    {
      id: '2',
      productId: 'prod2',
      productName: 'Écouteurs Bluetooth',
      customerName: 'Jean Martin',
      customerId: 'cust2',
      rating: 4,
      title: 'Bonne qualité sonore',
      comment: 'Les écouteurs ont une très bonne qualité sonore et l\'autonomie est correcte. Petit bémol sur le design qui pourrait être amélioré.',
      createdAt: new Date('2024-01-10'),
      isVerified: true,
      helpfulVotes: 8,
      totalVotes: 10,
      hasResponse: false
    },
    {
      id: '3',
      productId: 'prod3',
      productName: 'T-shirt coton bio',
      customerName: 'Sophie Bernard',
      customerId: 'cust3',
      rating: 3,
      title: 'Qualité moyenne',
      comment: 'Le t-shirt est correct mais la qualité du coton n\'est pas exceptionnelle. Le prix reste abordable.',
      createdAt: new Date('2024-01-08'),
      isVerified: false,
      helpfulVotes: 3,
      totalVotes: 8,
      hasResponse: true,
      response: {
        content: 'Merci pour votre retour Sophie. Nous prenons note de vos remarques sur la qualité du coton.',
        createdAt: new Date('2024-01-09')
      }
    },
    {
      id: '4',
      productId: 'prod1',
      productName: 'Smartphone Android 128GB',
      customerName: 'Pierre Dubois',
      customerId: 'cust4',
      rating: 2,
      title: 'Déçu de la batterie',
      comment: 'Le smartphone fonctionne bien mais la batterie se décharge très rapidement. Pas ce qui était annoncé.',
      createdAt: new Date('2024-01-06'),
      isVerified: true,
      helpfulVotes: 5,
      totalVotes: 12,
      hasResponse: true,
      response: {
        content: 'Nous sommes désolés pour ce problème Pierre. Contactez-nous en privé pour que nous puissions vous aider à résoudre ce problème de batterie.',
        createdAt: new Date('2024-01-07')
      }
    },
    {
      id: '5',
      productId: 'prod4',
      productName: 'Crème hydratante anti-âge',
      customerName: 'Lucie Moreau',
      customerId: 'cust5',
      rating: 5,
      title: 'Résultats visibles rapidement',
      comment: 'J\'utilise cette crème depuis 3 semaines et je vois déjà des résultats. Ma peau est plus hydratée et plus ferme.',
      createdAt: new Date('2024-01-04'),
      isVerified: true,
      helpfulVotes: 18,
      totalVotes: 20,
      hasResponse: false
    }
  ];

  // Load reviews
  const loadReviews = async () => {
    setLoading(true);
    try {
      // Using mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setReviews(mockReviews);
    } catch (err: unknown) {
      console.error('Erreur lors du chargement:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des avis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === '' || review.rating.toString() === ratingFilter;
    const matchesVerified = verifiedFilter === '' || 
                          (verifiedFilter === 'verified' && review.isVerified) ||
                          (verifiedFilter === 'unverified' && !review.isVerified);
    return matchesSearch && matchesRating && matchesVerified;
  });

  const renderStars = (rating: number, size: number = 16) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={size}
        className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();
  const totalReviews = reviews.length;

  return (    <SupplierLayout>
      <div className="space-y-6">
        {/* Bouton retour */}
        <BackButton to="/supplier/dashboard" label="Retour au tableau de bord" variant="ghost" />

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Avis Clients
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Consultez et répondez aux avis de vos clients
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Note moyenne</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {getAverageRating()}
                  </p>
                  <div className="flex">{renderStars(Math.round(parseFloat(getAverageRating())))}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total avis</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalReviews}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <ThumbsUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avis positifs</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {reviews.filter(r => r.rating >= 4).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sans réponse</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {reviews.filter(r => !r.hasResponse).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Répartition des notes
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{rating}</span>
                  <Star size={14} className="text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: totalReviews > 0 ? `${(distribution[rating - 1] / totalReviews) * 100}%` : '0%'
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                  {distribution[rating - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher dans les avis..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
                />
              </div>
            </div>            <div className="w-full sm:w-48">
              <select
                value={ratingFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRatingFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Toutes les notes</option>
                <option value="5">5 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="2">2 étoiles</option>
                <option value="1">1 étoile</option>
              </select>
            </div>            <div className="w-full sm:w-48">
              <select
                value={verifiedFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setVerifiedFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Tous les avis</option>
                <option value="verified">Vérifiés</option>
                <option value="unverified">Non vérifiés</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Chargement...</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mr-3">
                      <span className="text-white font-medium text-sm">
                        {review.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {review.customerName}
                        </h3>
                        {review.isVerified && (
                          <span className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 text-xs px-2 py-1 rounded-full">
                            Vérifié
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">{renderStars(review.rating, 14)}</div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {review.rating}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Package size={12} />
                        {review.productName}
                        <span>•</span>
                        <Calendar size={12} />
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {review.title}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                {/* Helpful Votes */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <ThumbsUp size={14} />
                    <span>{review.helpfulVotes} sur {review.totalVotes} trouvent cet avis utile</span>
                  </div>
                </div>

                {/* Supplier Response */}
                {review.hasResponse && review.response ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        Réponse du fournisseur
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(review.response.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {review.response.content}
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => console.log('Respond to review:', review.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare size={14} />
                      Répondre
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </SupplierLayout>
  );
};

export default ReviewsPage;
