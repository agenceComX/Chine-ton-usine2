import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Users, ShoppingCart, Wallet, Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/Button';
import ProductRecommendations from '../components/ProductRecommendations';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Animation de chargement
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Animation progressive des cartes
    const interval = setInterval(() => {
      setVisibleCards(prev => prev < 6 ? prev + 1 : prev);
    }, 200);

    const timer = setTimeout(() => clearInterval(interval), 1200);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Recherche:', searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section avec paysage chinois stylisé */}
      <div className="relative overflow-hidden">
        <div className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-blue-400 via-blue-600 to-purple-800 flex items-center justify-center">
          {/* Effet de soleil */}
          <div 
            className="absolute top-16 left-48 w-20 h-20 rounded-full opacity-80"
            style={{
              background: 'radial-gradient(circle, rgba(255, 154, 0, 0.9) 0%, rgba(255, 167, 38, 0.7) 40%, transparent 70%)',
              filter: 'blur(1px)'
            }}
          ></div>
          
          {/* Montagnes en couches */}
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="mountain1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#4682B4', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#191970', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="mountain2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#483D8B', stopOpacity: 0.9}} />
                <stop offset="100%" style={{stopColor: '#2F1B69', stopOpacity: 0.9}} />
              </linearGradient>
              <linearGradient id="mountain3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#6495ED', stopOpacity: 0.7}} />
                <stop offset="100%" style={{stopColor: '#4169E1', stopOpacity: 0.7}} />
              </linearGradient>
            </defs>
            
            {/* Montagne arrière */}
            <path d="M0,400 L200,180 L400,220 L600,140 L800,160 L1000,100 L1200,140 L1200,400 Z" fill="url(#mountain3)" />
            
            {/* Montagne moyenne */}
            <path d="M0,400 L150,200 L350,240 L550,160 L750,180 L950,120 L1200,160 L1200,400 Z" fill="url(#mountain2)" />
            
            {/* Montagne avant */}
            <path d="M0,400 L100,220 L300,200 L500,280 L700,150 L900,180 L1100,140 L1200,180 L1200,400 Z" fill="url(#mountain1)" />
          </svg>

          {/* Logo et titre au centre */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
            <div className={`flex items-center mb-4 transform transition-all duration-1000 delay-300 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-6xl font-bold text-white animate-pulse font-display">
                {t('homepage.title')}
              </h1>
              <div className="ml-2 w-4 h-4 bg-orange-400 rounded-sm transform rotate-45 animate-bounce"></div>
            </div>
            <div className={`text-white text-lg mb-2 font-medium tracking-wide transform transition-all duration-1000 delay-500 font-reading text-readable ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              {t('homepage.subtitle')} 
              <span className="bg-orange-500 text-white px-2 py-1 mx-2 rounded font-bold transform -skew-x-12 animate-pulse hover:animate-bounce transition-all font-display">
                {t('homepage.subtitle.highlight')}
              </span>
            </div>
            <p className={`text-white text-base mb-8 font-medium transform transition-all duration-1000 delay-700 font-reading text-readable ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              {t('homepage.tagline')}
            </p>

            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className={`relative max-w-md w-full px-4 transform transition-all duration-1000 delay-900 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('homepage.search.placeholder')}
                className="w-full px-6 py-4 text-gray-800 bg-white/95 backdrop-blur-sm rounded-full border-2 border-white/50 focus:outline-none focus:ring-4 focus:ring-orange-300 focus:border-orange-400 shadow-2xl font-reading text-readable transition-all duration-300 hover:shadow-3xl"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-orange-500 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-display"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

        {/* Navigation par catégories - Déplacée sous l'image */}
        <div className="bg-white dark:bg-gray-900 py-12 border-b border-gray-100 dark:border-gray-800 relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-display">
                Explorez par catégorie
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-reading">
                Trouvez rapidement ce que vous cherchez
              </p>
            </div>
            <div className="overflow-x-auto">
              <div className="flex space-x-6 pb-4 min-w-max justify-center">
                {[
                  { name: t('homepage.categories.home'), icon: '🏠', id: '' },
                  { name: t('homepage.categories.electronics'), icon: '📱', id: 'electronics' },
                  { name: t('homepage.categories.fashion'), icon: '👔', id: 'fashion' },
                  { name: t('homepage.categories.home.category'), icon: '🏡', id: 'home' },
                  { name: t('homepage.categories.beauty'), icon: '💄', id: 'beauty' },
                  { name: t('homepage.categories.sports'), icon: '⚽', id: 'sports' },
                  { name: t('homepage.categories.automotive'), icon: '🚗', id: 'automotive' },
                  { name: t('homepage.categories.tools'), icon: '🔧', id: 'tools' },
                  { name: 'Machinerie', icon: '⚙️', id: 'machinery' },
                  { name: t('homepage.categories.toys'), icon: '🧸', id: 'toys' },
                  { name: t('homepage.categories.books'), icon: '📚', id: 'books' },
                  { name: t('homepage.categories.music'), icon: '🎵', id: 'music' },
                  { name: t('homepage.categories.garden'), icon: '🌱', id: 'garden' }
                ].map((category, index) => (
                  <Link
                    key={category.id}
                    to={`/search?category=${category.id}`}
                    className="flex flex-col items-center space-y-3 p-4 rounded-xl group hover:bg-gradient-to-br hover:from-blue-50 hover:to-orange-50 dark:hover:from-gray-800 dark:hover:to-gray-700 transition-all duration-300 min-w-0 flex-shrink-0 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                      index === 0 
                      ? 'bg-gradient-to-br from-blue-500 to-orange-400 text-white' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 group-hover:from-blue-500 group-hover:to-orange-400 group-hover:text-white group-hover:scale-110'
                    }`}>
                      {category.icon}
                    </div>
                    <span className="mt-2 text-sm font-semibold text-center transition-colors duration-300 font-reading text-readable dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 max-w-20 leading-tight">
                      {category.name}
                    </span>
                  </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section des cartes produits - Déplacée en haut */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Carte Électronique */}
            <div className={`bg-gradient-to-br from-blue-200 via-blue-300 to-orange-300 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 cursor-pointer group relative ${
              visibleCards >= 1 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '200ms' }}>
              <div className="p-8 h-72 flex flex-col justify-between relative overflow-hidden">
                {/* Effet de brillance animé */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-widest opacity-80 transform transition-all duration-300 group-hover:scale-110 font-display">
                    {t('homepage.cards.technology')}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-3 leading-tight transform transition-all duration-300 group-hover:scale-105 font-display">
                    {t('homepage.cards.electronics')}
                  </h3>
                  <p className="text-gray-800 text-base opacity-90 leading-relaxed font-reading text-readable">
                    {t('homepage.cards.electronics.description')}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-sm font-semibold text-gray-800 uppercase tracking-wider opacity-80 transition-all duration-300 group-hover:opacity-100 font-display">
                    {t('homepage.cards.explore')}
                  </span>
                  <div className="w-10 h-10 bg-black bg-opacity-10 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-12 active:scale-90">
                    <ShoppingBag className="w-5 h-5 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Textile */}
            <div className={`bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:-rotate-1 cursor-pointer group relative ${
              visibleCards >= 2 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '400ms' }}>
              <div className="p-8 h-72 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-widest opacity-80 transform transition-all duration-300 group-hover:scale-110 font-display">
                    {t('homepage.cards.fashion.title')}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-3 leading-tight transform transition-all duration-300 group-hover:scale-105 font-display">
                    {t('homepage.cards.textile')}
                  </h3>
                  <p className="text-gray-800 text-base opacity-90 leading-relaxed font-reading text-readable">
                    {t('homepage.cards.textile.description')}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider opacity-80 transition-all duration-300 group-hover:opacity-100">
                    {t('homepage.cards.explore')}
                  </span>
                  <div className="w-10 h-10 bg-black bg-opacity-10 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-12 active:scale-90">
                    <ShoppingBag className="w-5 h-5 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Machinerie */}
            <div className={`bg-gradient-to-br from-green-200 via-emerald-300 to-teal-300 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 cursor-pointer group relative ${
              visibleCards >= 3 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '600ms' }}>
              <div className="p-8 h-72 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-widest opacity-80 transform transition-all duration-300 group-hover:scale-110 font-display">
                    {t('homepage.cards.industrial')}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-3 leading-tight transform transition-all duration-300 group-hover:scale-105 font-display">
                    {t('homepage.cards.machinery')}
                  </h3>
                  <p className="text-gray-800 text-base opacity-90 leading-relaxed font-reading text-readable">
                    {t('homepage.cards.machinery.description')}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider opacity-80 transition-all duration-300 group-hover:opacity-100">
                    {t('homepage.cards.explore')}
                  </span>
                  <div className="w-10 h-10 bg-black bg-opacity-10 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-12 active:scale-90">
                    <ShoppingBag className="w-5 h-5 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Maison & Jardin */}
            <div className={`bg-gradient-to-br from-orange-200 via-orange-300 to-blue-300 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:-rotate-1 cursor-pointer group relative ${
              visibleCards >= 4 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '800ms' }}>
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full z-10 font-semibold animate-pulse">
                {t('homepage.cards.new')}
              </div>
              <div className="p-8 h-72 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-widest opacity-80 transform transition-all duration-300 group-hover:scale-110 font-display">
                    {t('homepage.cards.decoration')}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-3 leading-tight transform transition-all duration-300 group-hover:scale-105 font-display">
                    {t('homepage.cards.home.garden')}
                  </h3>
                  <p className="text-gray-800 text-base opacity-90 leading-relaxed font-reading text-readable">
                    {t('homepage.cards.home.garden.description')}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider opacity-80 transition-all duration-300 group-hover:opacity-100">
                    {t('homepage.cards.explore')}
                  </span>
                  <div className="w-10 h-10 bg-black bg-opacity-10 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-12 active:scale-90">
                    <ShoppingBag className="w-5 h-5 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Jouets & Enfants */}
            <div className={`bg-gradient-to-br from-blue-200 via-sky-200 to-cyan-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 cursor-pointer group relative ${
              visibleCards >= 5 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '1000ms' }}>
              <div className="p-8 h-72 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-widest opacity-80 transform transition-all duration-300 group-hover:scale-110 font-display">
                    {t('homepage.cards.educational')}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-3 leading-tight transform transition-all duration-300 group-hover:scale-105 font-display">
                    {t('homepage.cards.toys.children')}
                  </h3>
                  <p className="text-gray-800 text-base opacity-90 leading-relaxed font-reading text-readable">
                    {t('homepage.cards.toys.description')}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider opacity-80 transition-all duration-300 group-hover:opacity-100">
                    {t('homepage.cards.explore')}
                  </span>
                  <div className="w-10 h-10 bg-black bg-opacity-10 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-12 active:scale-90">
                    <ShoppingBag className="w-5 h-5 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Auto & Moto */}
            <div className={`bg-gradient-to-br from-purple-200 via-violet-300 to-indigo-300 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:-rotate-1 cursor-pointer group relative ${
              visibleCards >= 6 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
            }`}
            style={{ transitionDelay: '1200ms' }}>
              <div className="p-8 h-72 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2 uppercase tracking-widest opacity-80 transform transition-all duration-300 group-hover:scale-110 font-display">
                    {t('homepage.cards.parts')}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-3 leading-tight transform transition-all duration-300 group-hover:scale-105 font-display">
                    {t('homepage.cards.auto.moto')}
                  </h3>
                  <p className="text-gray-800 text-base opacity-90 leading-relaxed font-reading text-readable">
                    {t('homepage.cards.auto.description')}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider opacity-80 transition-all duration-300 group-hover:opacity-100">
                    {t('homepage.cards.explore')}
                  </span>
                  <div className="w-10 h-10 bg-black bg-opacity-10 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-12 active:scale-90">
                    <ShoppingBag className="w-5 h-5 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section "Ça va vous plaire" */}
          <div className={`mt-20 text-center transform transition-all duration-1000 delay-1500 ${
            isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
          }`}>
            <div className="relative inline-block group">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 relative transition-all duration-300 group-hover:scale-105 font-display">
                {t('homepage.cta.title')} 
                <span className="bg-gradient-to-r from-blue-500 to-orange-600 bg-clip-text text-transparent font-bold mx-3 transition-all duration-300 hover:scale-110 font-display">
                  {t('homepage.cta.highlight')}
                </span>
              </h2>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-400 rounded-sm transform rotate-45 animate-pulse"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-xl font-medium mb-8 animate-fade-in-up font-reading text-readable">
              {t('homepage.cta.subtitle')}
            </p>
            {/* Bouton CTA */}
            <div className="mt-8">
              <Link to="/search">
                <button className="bg-gradient-to-r from-blue-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-2xl active:scale-95 focus:ring-4 focus:ring-blue-300 focus:outline-none font-display">
                  {t('homepage.cta.button')}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section avantages rapides */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 dark:from-blue-700 dark:via-blue-600 dark:to-orange-600 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Livraison Rapide</h3>
              <p className="text-white/90 font-reading">Expédition sous 24-48h partout en France</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Paiement Sécurisé</h3>
              <p className="text-white/90 font-reading">Transactions protégées et garanties</p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Support 24/7</h3>
              <p className="text-white/90 font-reading">Une équipe dédiée à votre service</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section unifiée "Comment ça marche ?" + Recommandations */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up font-display">
              {t('homepage.how.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up font-reading text-readable" style={{ animationDelay: '200ms' }}>
              {t('homepage.how.subtitle')}
            </p>
          </div>

          {/* 3 étapes principales */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-16">
            {/* Étape 1 */}
            <div className="text-center group animate-fade-in-scale" style={{ animationDelay: '400ms' }}>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 animate-float">
                <Search className="h-8 w-8 text-blue-600 dark:text-blue-200 icon-bounce" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors duration-300 font-display">
                {t('homepage.how.step1.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300 font-reading text-readable">
                {t('homepage.how.step1.description')}
              </p>
            </div>

            {/* Étape 2 */}
            <div className="text-center group animate-fade-in-scale" style={{ animationDelay: '600ms' }}>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 animate-float" style={{ animationDelay: '1s' }}>
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-200 icon-bounce" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors duration-300 font-display">
                {t('homepage.how.step2.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300 font-reading text-readable">
                {t('homepage.how.step2.description')}
              </p>
            </div>

            {/* Étape 3 */}
            <div className="text-center group animate-fade-in-scale" style={{ animationDelay: '800ms' }}>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 animate-float" style={{ animationDelay: '2s' }}>
                <ShoppingCart className="h-8 w-8 text-blue-600 dark:text-blue-200 icon-bounce" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors duration-300 font-display">
                {t('homepage.how.step3.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300 font-reading text-readable">
                {t('homepage.how.step3.description')}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mb-16">
            <Link to="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-display">
                {t('homepage.how.cta')}
              </Button>
            </Link>
          </div>

          {/* Section Recommandations intégrée */}
          <ProductRecommendations />
        </div>
      </div>

      {/* Optimisez vos commandes */}
      <div className="bg-white dark:bg-gray-900 pt-0 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 font-display">
              {t('homepage.optimize.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Recherchez des offres */}
            <div className="flex items-start space-x-4 group animate-slide-in-left" style={{ animationDelay: '200ms' }}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 animate-float">
                <Search className="h-6 w-6 text-blue-600 dark:text-blue-200 icon-bounce" />
              </div>
              <div className="transform transition-all duration-300 group-hover:translate-x-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-300 font-display">
                  {t('homepage.optimize.search.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300 font-reading text-readable">
                  {t('homepage.optimize.search.description')}
                </p>
              </div>
            </div>

            {/* Identifiez le bon fournisseur */}
            <div className="flex items-start space-x-4 group animate-slide-in-right" style={{ animationDelay: '400ms' }}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 animate-float" style={{ animationDelay: '1s' }}>
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-200 icon-bounce" />
              </div>
              <div className="transform transition-all duration-300 group-hover:translate-x-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-300 font-display">
                  {t('homepage.optimize.identify.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300 font-reading text-readable">
                  {t('homepage.optimize.identify.description')}
                </p>
              </div>
            </div>

            {/* Payez en toute confiance */}
            <div className="flex items-start space-x-4 group animate-slide-in-left" style={{ animationDelay: '600ms' }}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 animate-float" style={{ animationDelay: '2s' }}>
                <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-200 icon-bounce" />
              </div>
              <div className="transform transition-all duration-300 group-hover:translate-x-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-300 font-display">
                  {t('homepage.optimize.pay.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300 font-reading text-readable">
                  {t('homepage.optimize.pay.description')}
                </p>
              </div>
            </div>

            {/* Gérez facilement */}
            <div className="flex items-start space-x-4 group animate-slide-in-right" style={{ animationDelay: '800ms' }}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 animate-float" style={{ animationDelay: '3s' }}>
                <Settings className="h-6 w-6 text-blue-600 dark:text-blue-200 icon-bounce" />
              </div>
              <div className="transform transition-all duration-300 group-hover:translate-x-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors duration-300 font-display">
                  {t('homepage.optimize.manage.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300 font-reading text-readable">
                  {t('homepage.optimize.manage.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Découvrez tous nos fournisseurs - Repositionnée et améliorée */}
      <div className="bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 py-16 md:py-24 relative overflow-hidden">
        {/* Éléments décoratifs de fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-400 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-orange-100 dark:from-blue-900 dark:to-orange-900 px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Réseau global
              </span>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-display">
            {t('homepage.discover.title')} 
            <span className="bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent font-display block md:inline mt-2 md:mt-0">
              {t('homepage.discover.highlight')}
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-reading text-readable max-w-2xl mx-auto">
            {t('homepage.discover.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/search">
              <Button className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-display">
                {t('homepage.discover.button')}
              </Button>
            </Link>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex -space-x-2 mr-3">
                <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-orange-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-purple-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                  +
                </div>
              </div>
              <span className="font-reading">Plus de 1000 fournisseurs vérifiés</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section processus détaillé */}
      <div className="bg-white dark:bg-gray-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 font-display">
              {t('homepage.process.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-reading text-readable">
              {t('homepage.process.subtitle')}
            </p>
          </div>

          {/* Process steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110">
                <Search className="h-8 w-8 text-blue-600 dark:text-blue-200" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-display">
                {t('homepage.process.step1.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-reading text-readable">
                {t('homepage.process.step1.description')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-200" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-display">
                {t('homepage.process.step2.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-reading text-readable">
                {t('homepage.process.step2.description')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110">
                <ShoppingCart className="h-8 w-8 text-blue-600 dark:text-blue-200" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-display">
                {t('homepage.process.step3.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-reading text-readable">
                {t('homepage.process.step3.description')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110">
                <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-200" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-display">
                {t('homepage.process.step4.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-reading text-readable">
                {t('homepage.process.step4.description')}
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-display">
                {t('homepage.process.cta')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Section finale CTA */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 dark:from-blue-700 dark:via-blue-600 dark:to-orange-600 py-20 md:py-32 min-h-[50vh] flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-fade-in-up font-display">
            {t('homepage.final.title')}
          </h2>
          <p className="text-xl text-white/90 mb-12 animate-fade-in-up font-reading" style={{ animationDelay: '200ms' }}>
            {t('homepage.final.subtitle')}
          </p>
          <Link to="/register">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-4 text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 shadow-2xl hover:shadow-3xl button-pulse font-display">
              {t('homepage.final.button')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;