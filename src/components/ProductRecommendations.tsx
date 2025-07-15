import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Sparkles } from 'lucide-react';
import ProductRecommendationCard from './ProductRecommendationCard';
import { products } from '../data/products';
import { useLanguage } from '../context/LanguageContext';

const ProductRecommendations: React.FC = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  
  // Sélectionner 8 produits recommandés (mélange des premiers produits)
  const recommendedProducts = products.slice(0, 8);
  
  // Nombre de produits visibles selon la taille d'écran
  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth >= 1280) return 4; // xl
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 768) return 2;  // md
    return 1; // mobile
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Auto-play du carrousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, Math.ceil(recommendedProducts.length / visibleCount) - 1);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, visibleCount, recommendedProducts.length]);
  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, Math.ceil(recommendedProducts.length / visibleCount) - 1);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, Math.ceil(recommendedProducts.length / visibleCount) - 1);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Gestion des gestes tactiles
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    const maxIndex = Math.max(0, Math.ceil(recommendedProducts.length / visibleCount) - 1);

    if (isLeftSwipe && currentIndex < maxIndex) {
      nextSlide();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevSlide();
    }
  };

  const maxIndex = Math.max(0, Math.ceil(recommendedProducts.length / visibleCount) - 1);
  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header de la section */}
        <div className="text-center mb-6 animate-fade-in-up">
          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {t('homepage.recommendations.badge')}
              </span>
              <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 font-display">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              {t('homepage.recommendations.title')}
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-reading">
            {t('homepage.recommendations.subtitle')}
          </p>
        </div>{/* Carrousel de produits */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          role="region"
          aria-label={t('homepage.recommendations.title')}
        >          {/* Conteneur du carrousel */}
          <div 
            className="overflow-hidden rounded-3xl" 
            role="group" 
            aria-live="polite"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ 
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >              {Array.from({ length: Math.ceil(recommendedProducts.length / visibleCount) }, (_, pageIndex) => {
                const startIndex = pageIndex * visibleCount;
                const endIndex = Math.min(startIndex + visibleCount, recommendedProducts.length);
                const pageProducts = recommendedProducts.slice(startIndex, endIndex);
                
                return (
                  <div 
                    key={pageIndex}
                    className="flex-shrink-0 w-full grid gap-6"
                    style={{ 
                      gridTemplateColumns: `repeat(${visibleCount}, 1fr)`,
                      minWidth: '100%'
                    }}
                  >
                    {pageProducts.map((product, index) => (
                      <div key={product.id} className="px-3">
                        <ProductRecommendationCard product={product} index={startIndex + index} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Boutons de navigation */}
          {maxIndex > 0 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 border border-gray-200 dark:border-gray-600"
                aria-label="Produit précédent"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 border border-gray-200 dark:border-gray-600"
                aria-label="Produit suivant"
              >
                <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </button>
            </>
          )}

          {/* Indicateurs de pagination */}
          {maxIndex > 0 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-8'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Aller à la page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <a
            href="/search"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl bg-size-200 hover:bg-right group"
          >
            <span>{t('homepage.recommendations.viewAll')}</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductRecommendations;
