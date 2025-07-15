import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, ShoppingBag, Search, User, Coins, Sun, Moon, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { UserLanguage, UserCurrency, UserRole } from '../types';
import axios from 'axios';
import { popularSearches, searchKeywords } from '../data/searchSuggestions';
import NotificationCenter from './NotificationCenter';
import { useNotifications } from '../hooks/useNotifications';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, getLanguageName, availableLanguages } = useLanguage();
  const { currency, setCurrency, currencyNames } = useCurrency();
  const { isDarkMode, toggleTheme } = useTheme();

  // Debug: vérifier l'état de l'utilisateur
  React.useEffect(() => {
    console.log('🔍 Navbar - État utilisateur:', user);
  }, [user]);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Hook personnalisé pour les notifications - uniquement si l'utilisateur est connecté
  const { unreadCount, refresh: refreshNotifications } = useNotifications({
    pollInterval: user ? 30000 : 0, // Rafraîchir toutes les 30 secondes si connecté, sinon désactiver
    autoRefresh: !!user // Auto-refresh uniquement si connecté
  });
  const location = useLocation();
  const navigate = useNavigate();

  const toggleLanguageMenu = () => {
    console.log('🌐 Toggle Language Menu clicked');
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
    setIsCurrencyMenuOpen(false);
    setIsNotificationCenterOpen(false);
  };

  const toggleCurrencyMenu = () => {
    setIsCurrencyMenuOpen(!isCurrencyMenuOpen);
    setIsLanguageMenuOpen(false);
    setIsNotificationCenterOpen(false);
  };

  const toggleNotificationCenter = () => {
    console.log('🔔 Toggle Notification Center clicked');
    setIsNotificationCenterOpen(!isNotificationCenterOpen);
    setIsLanguageMenuOpen(false);
    setIsCurrencyMenuOpen(false);
  };

  const handleNotificationCountChange = () => {
    // Le compteur est maintenant géré par le hook useNotifications
    // Cette fonction peut être utilisée pour des actions supplémentaires
    refreshNotifications();
  };

  const handleLanguageChange = (newLanguage: UserLanguage) => {
    setLanguage(newLanguage);
    setIsLanguageMenuOpen(false);
  };

  const handleCurrencyChange = (newCurrency: UserCurrency) => {
    setCurrency(newCurrency);
    setIsCurrencyMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const fetchSuggestions = async () => {
        if (import.meta.env.DEV) {
          // Mock suggestions côté front
          const query = searchQuery.toLowerCase();
          const allSuggestions = [...popularSearches, ...searchKeywords];
          const filtered = allSuggestions.filter(s => s.toLowerCase().includes(query));
          setSuggestions(filtered.slice(0, 7));
        } else {
          try {
            const response = await axios.get(`/api/suggestions?q=${encodeURIComponent(searchQuery)}`);
            setSuggestions(Array.isArray(response.data) ? response.data : []);
          } catch (error) {
            console.error('Error fetching suggestions:', error);
          }
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-dropdown') && !target.closest('.currency-dropdown')) {
        setIsLanguageMenuOpen(false);
        setIsCurrencyMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getDashboardPath = (role: UserRole | undefined) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'supplier':
        return '/supplier/dashboard';
      case 'sourcer':
      case 'influencer':
        return '/sourcer/dashboard';
      case 'customer':
      default:
        return '/dashboard';
    }
  };

  const dashboardPath = getDashboardPath(user?.role);

  return (
    <nav className="bg-gradient-to-br from-blue-600 via-blue-500 to-orange-400 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white font-display">Chine ton usine</span>
            </Link>
          </div>

          {/* Right side - Navigation, Icons and buttons */}
          <div className="flex items-center space-x-6">
            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex items-center space-x-6">
              <Link
                to="/"
                className={`${isActive('/')
                  ? 'text-orange-200 font-semibold'
                  : 'text-white hover:text-orange-200'} 
                  transition-colors text-sm font-medium font-reading`}
              >
                {t('home')}
              </Link>
              <Link
                to="/products"
                className={`${isActive('/products')
                  ? 'text-orange-200 font-semibold'
                  : 'text-white hover:text-orange-200'} 
                  transition-colors text-sm font-medium font-reading`}
              >
                {t('discover')}
              </Link>
              {/* Onglet Conteneurs visible uniquement pour les fournisseurs connectés */}
              {user && user.role === 'supplier' && (
                <Link
                  to="/containers" className={`${isActive('/containers')
                    ? 'text-orange-200 font-semibold'
                    : 'text-white hover:text-orange-200'} 
                      transition-colors text-sm font-medium font-reading`}
                >
                  {t('containers')}
                </Link>
              )}
              {user && (
                <Link
                  to={dashboardPath}
                  className={`${isActive(dashboardPath)
                    ? 'text-orange-200 font-semibold'
                    : 'text-white hover:text-orange-200'} 
                    transition-colors text-sm font-medium font-reading`}
                >
                  {t('dashboard')}
                </Link>
              )}
            </div>

            {/* Search */}
            <div className="relative flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer">
              <Search className="h-5 w-5" />
              <form onSubmit={handleSearch} className="hidden lg:block">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder') || 'Rechercher...'}
                  className="ml-2 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/80 dark:bg-gray-700/90 backdrop-blur-sm placeholder-gray-600 dark:placeholder-gray-400 text-gray-900 dark:text-white"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setSuggestions([]);
                        }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </form>
            </div>

            {/* Language selector */}
            <div className="relative language-dropdown">
              <button
                onClick={toggleLanguageMenu}
                className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer"
              >
                <Globe className="h-5 w-5" />
              </button>

              {isLanguageMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {availableLanguages.map((code) => (
                    <button
                      key={code}
                      onClick={() => handleLanguageChange(code as UserLanguage)}
                      className={`${language === code ? 'bg-gray-100 dark:bg-gray-600' : ''} block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600`}
                    >
                      {getLanguageName(code)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency selector */}
            <div className="relative currency-dropdown">
              <button
                onClick={toggleCurrencyMenu}
                className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer"
              >
                <Coins className="h-5 w-5" />
              </button>

              {isCurrencyMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {Object.entries(currencyNames).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => handleCurrencyChange(code as UserCurrency)}
                      className={`${currency === code ? 'bg-gray-100 dark:bg-gray-600' : ''} block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications - Affiché uniquement pour les utilisateurs connectés */}
            {user && (
              <>
                <div
                  className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer relative"
                  onClick={toggleNotificationCenter}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse absolute -top-2 -right-2">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
              </>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User */}
            {user ? (
              <Link
                to={user.role === 'supplier' ? `/supplier/${user.id}` : "/profile"}
                className="flex items-center space-x-2 text-gray-800 hover:text-orange-600 transition-colors cursor-pointer"
                title={user.role === 'supplier' ? t('mySupplierProfile') || 'Mon profil fournisseur' : t('myProfile') || 'Mon profil'}
              >
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <div className="flex items-center space-x-2 text-gray-800 hover:text-orange-600 transition-colors cursor-pointer">
                <User className="h-5 w-5" />
              </div>
            )}

            {/* Login/Logout button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={logout}
                  className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-display"
                >
                  {t('logout')}
                </button>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-3 py-2 rounded-full text-xs font-semibold hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  title="Déconnexion complète"
                >
                  ✕
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-gray-800 px-6 py-2 rounded-full text-sm font-semibold hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-display"
              >
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Notification Center - Affiché uniquement pour les utilisateurs connectés */}
      {user && (
        <NotificationCenter
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
          onUnreadCountChange={handleNotificationCountChange}
        />
      )}
    </nav>
  );
};

export default Navbar;