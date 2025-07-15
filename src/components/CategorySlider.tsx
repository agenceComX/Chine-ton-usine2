import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

const categories: Category[] = [
  { id: 'electronics', name: 'Électronique', icon: '📱' },
  { id: 'fashion', name: 'Mode', icon: '👔' },
  { id: 'home', name: 'Maison', icon: '🏠' },
  { id: 'beauty', name: 'Beauté', icon: '💄' },
  { id: 'sports', name: 'Sport', icon: '⚽' },
  { id: 'automotive', name: 'Auto', icon: '🚗' },
  { id: 'tools', name: 'Outils', icon: '🔧' },
  { id: 'toys', name: 'Jouets', icon: '🧸' },
  { id: 'books', name: 'Livres', icon: '📚' },
  { id: 'music', name: 'Musique', icon: '🎵' },
  { id: 'garden', name: 'Jardin', icon: '🌱' },
  { id: 'food', name: 'Alimentation', icon: '🍎' },
];

const CategorySlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navigate = useNavigate();

  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 100);
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 100);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  React.useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center py-3">
          {/* Scroll Left Button */}
          <button
            onClick={scrollLeft}
            className={`absolute left-0 z-10 bg-white shadow-md rounded-full p-2 transition-all duration-200 ${
              canScrollLeft
                ? 'text-gray-600 hover:text-orange-600 hover:shadow-lg'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Categories Container */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto scrollbar-hide space-x-6 mx-10 scroll-smooth"
            onScroll={checkScrollButtons}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="flex flex-col items-center min-w-max group transition-all duration-200 hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-400 rounded-full flex items-center justify-center text-white text-lg font-semibold shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:from-blue-600 group-hover:to-orange-500">
                  {category.icon || category.name[0].toUpperCase()}
                </div>
                <span className="mt-2 text-xs font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-200 text-center">
                  {category.name}
                </span>
              </button>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={scrollRight}
            className={`absolute right-0 z-10 bg-white shadow-md rounded-full p-2 transition-all duration-200 ${
              canScrollRight
                ? 'text-gray-600 hover:text-orange-600 hover:shadow-lg'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategorySlider;
