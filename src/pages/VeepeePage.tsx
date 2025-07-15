import React, { useState } from 'react';
import { Search, User, ShoppingBag, Heart, Bell, Menu, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const VeepeePage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  // Données des catégories de produits
  const brandCategories = [
    { name: 'Accueil', active: true },
    { name: 'Électronique', active: false },
    { name: 'Textile', active: false },
    { name: 'Maison', active: false },
    { name: 'Machinerie', active: false },
    { name: 'Automobile', active: false },
    { name: 'Jouets', active: false },
    { name: 'Beauté', active: false },
    { name: 'Sport', active: false },
    { name: 'Alimentaire', active: false },
    { name: 'Médical', active: false },
    { name: 'Sourcing Pro', active: false }
  ];  const productCards = [
    {
      id: 1,
      brand: 'ÉLECTRONIQUE',
      category: 'TECHNOLOGIE',
      title: 'Composants & Gadgets',
      bgColor: 'bg-gradient-to-br from-blue-200 via-blue-300 to-orange-300',
      textColor: 'text-gray-800'
    },
    {
      id: 2,
      brand: 'TEXTILE',
      category: 'MODE & VÊTEMENTS',
      title: 'Fabrication Premium',
      bgColor: 'bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200',
      textColor: 'text-gray-800'
    },
    {
      id: 3,
      brand: 'MACHINERIE',
      category: 'ÉQUIPEMENT INDUSTRIEL',
      title: 'Performance & Innovation',
      bgColor: 'bg-gradient-to-br from-gray-700 via-gray-800 to-black',
      textColor: 'text-white'
    },    {
      id: 4,
      brand: 'MAISON & JARDIN',
      category: 'DÉCORATION & MOBILIER',
      title: 'Design & Confort',
      bgColor: 'bg-gradient-to-br from-orange-200 via-orange-300 to-blue-300',
      textColor: 'text-gray-800',
      badge: 'Nouveau'
    },
    {
      id: 5,
      brand: 'JOUETS & ENFANTS',
      category: 'ÉDUCATIF & LUDIQUE',
      title: 'Qualité Certifiée',
      bgColor: 'bg-gradient-to-br from-blue-200 via-sky-200 to-cyan-200',
      textColor: 'text-gray-800'
    },
    {
      id: 6,
      brand: 'AUTO & MOTO',
      category: 'PIÈCES & ACCESSOIRES',
      title: 'Pièces de Qualité',
      bgColor: 'bg-gradient-to-br from-gray-900 via-slate-800 to-black',
      textColor: 'text-white'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recherche:', searchQuery);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header avec barre de recherche */}
      <header className="relative">        {/* Image de fond montagne avec overlay */}
        <div 
          className="h-96 bg-cover bg-center relative overflow-hidden"
          style={{            background: `
              linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(255, 154, 0, 0.4)),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.8) 0%, rgba(255, 154, 0, 0.8) 40%, rgba(37, 99, 235, 0.9) 100%),
              radial-gradient(circle at 15% 20%, rgba(255, 154, 0, 0.9) 0%, transparent 50%),
              linear-gradient(to right, 
                rgba(37, 99, 235, 1) 0%, 
                rgba(59, 130, 246, 0.95) 20%, 
                rgba(29, 78, 216, 0.9) 40%,
                rgba(59, 130, 246, 0.95) 60%,
                rgba(37, 99, 235, 1) 80%,
                rgba(29, 78, 216, 0.9) 100%
              )
              `
          }}
        >
          {/* Effet de soleil */}          <div 
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
          </svg>          {/* Navigation en haut */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-10 backdrop-blur-sm">            <div className="flex items-center space-x-4">
              <Menu className="h-6 w-6 text-white hover:text-orange-200 transition-colors cursor-pointer" />
              <span className="text-white text-sm font-medium">Menu</span>
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 hover:text-orange-200 transition-colors cursor-pointer">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center space-x-2 hover:text-orange-200 transition-colors cursor-pointer">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center space-x-2 hover:text-orange-200 transition-colors cursor-pointer">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center space-x-2 hover:text-orange-200 transition-colors cursor-pointer">
                <Bell className="h-5 w-5 text-white" />                <span className="bg-orange-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">3</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-orange-200 transition-colors cursor-pointer">
                <User className="h-5 w-5 text-white" />
              </div>
              <button className="bg-white text-gray-800 px-6 py-2 rounded-full text-sm font-bold hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                S'identifier
              </button>
            </div>
          </div>          {/* Logo et titre au centre */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
            <div className="flex items-center mb-4">              <h1 className="text-6xl font-bold text-white" style={{ fontFamily: 'serif' }}>
                Chine ton usine
              </h1>
              <div className="ml-2 w-4 h-4 bg-orange-400 rounded-sm transform rotate-45"></div>
            </div>
            <div className="text-white text-lg mb-2 font-light tracking-wide">
              ÇA VA VOUS 
              <span className="bg-orange-500 text-white px-2 py-1 mx-2 rounded font-bold transform -skew-x-12">
                PLAIRE
              </span>
            </div>
            <p className="text-white text-sm opacity-90 mb-8">
              Coup de foudre inévitable.
            </p>

            {/* Barre de recherche */}
            <form onSubmit={handleSearch} className="mt-8 w-full max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Recherchez un produit, une marque..."
                  className="w-full px-6 py-3 rounded-full text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
                >
                  <Search className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Navigation des catégories */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center space-x-8 py-3 overflow-x-auto">
              {brandCategories.map((category, index) => (
                <button
                  key={index}
                  className={`whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors ${
                    category.active
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Section des cartes produits */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCards.map((card) => (            <div
              key={card.id}
              className={`${card.bgColor} rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group relative`}
            >
              {card.badge && (                <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full z-10 font-semibold">
                  {card.badge}
                </div>
              )}
              
              <div className="p-8 h-72 flex flex-col justify-between">
                <div>
                  <div className={`text-xs font-bold ${card.textColor} mb-2 uppercase tracking-widest opacity-80`}>
                    {card.category}
                  </div>
                  <h3 className={`text-3xl font-bold ${card.textColor} mb-3 leading-tight`}>
                    {card.brand}
                  </h3>
                  <p className={`${card.textColor} text-sm opacity-90 leading-relaxed`}>
                    {card.title}
                  </p>
                </div>
                  <div className="flex items-center justify-between mt-6">
                  <span className={`text-xs font-bold ${card.textColor} uppercase tracking-wider opacity-80`}>
                    Explorer
                  </span>
                  <div className={`w-10 h-10 ${card.textColor === 'text-white' ? 'bg-white bg-opacity-20' : 'bg-black bg-opacity-10'} rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all transform group-hover:scale-110`}>
                    <ShoppingBag className={`w-5 h-5 ${card.textColor === 'text-white' ? 'text-white' : 'text-gray-700'}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>        {/* Section "Ça va vous plaire" */}
        <div className="mt-20 text-center">          <div className="relative inline-block">
            <h2 className="text-5xl font-bold text-gray-800 mb-4 relative">
              ÇA VA VOUS 
              <span className="bg-gradient-to-r from-blue-500 to-orange-600 text-white px-4 py-2 mx-3 rounded-lg font-bold transform -skew-x-6 inline-block shadow-lg">
                PLAIRE
              </span>
            </h2>            <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-400 rounded-sm transform rotate-45"></div>          </div>
          <p className="text-white text-xl font-semibold tracking-wide">
            Coup de foudre inévitable.
          </p>{/* Bouton CTA */}
          <div className="mt-8">
            <button className="bg-gradient-to-r from-blue-500 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-blue-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Découvrir tous les fournisseurs
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VeepeePage;
