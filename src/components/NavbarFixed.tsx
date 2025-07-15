import React, { useState, useEffect, useRef } from 'react';
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
import { notificationService } from '../services/notificationService';

const NavbarFixed: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, getLanguageName, availableLanguages } = useLanguage();
  const { currency, setCurrency, currencyNames } = useCurrency();
  const { isDarkMode, toggleTheme } = useTheme();

  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Refs pour les dropdowns
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  // Hook personnalisé pour les notifications - uniquement si l'utilisateur est connecté
  const { unreadCount, refresh: refreshNotifications } = useNotifications({
    pollInterval: user ? 30000 : 0,
    autoRefresh: !!user
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Gestion des événements avec preventDefault pour éviter les conflits
  const handleLanguageMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🌐 Language menu toggle clicked');
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
    setIsCurrencyMenuOpen(false);
    setIsNotificationCenterOpen(false);
  };

  const handleCurrencyMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('💰 Currency menu toggle clicked');
    setIsCurrencyMenuOpen(!isCurrencyMenuOpen);
    setIsLanguageMenuOpen(false);
    setIsNotificationCenterOpen(false);
  };

  const handleNotificationToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔔 Notification center toggle clicked');
    setIsNotificationCenterOpen(!isNotificationCenterOpen);
    setIsLanguageMenuOpen(false);
    setIsCurrencyMenuOpen(false);
  };

  const handleLanguageChange = (newLanguage: UserLanguage) => {
    console.log('🌍 Language changing to:', newLanguage);
    setLanguage(newLanguage);
    setIsLanguageMenuOpen(false);
  };

  const handleCurrencyChange = (newCurrency: UserCurrency) => {
    console.log('💱 Currency changing to:', newCurrency);
    setCurrency(newCurrency);
    setIsCurrencyMenuOpen(false);
  };

  // Fermeture des dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCurrencyMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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
            <Link to="/" className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white font-display">Chine ton usine</span>
            </Link>
          </div>

          {/* Right side - Navigation */}
          <div className="flex items-center space-x-4">
            {/* Language selector */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={handleLanguageMenuToggle}
                className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer p-2"
                title="Changer la langue"
              >
                <Globe className="h-5 w-5" />
              </button>

              {isLanguageMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  {availableLanguages.map((code) => (
                    <button
                      key={code}
                      onClick={() => handleLanguageChange(code)}
                      className={`${language === code ? 'bg-gray-100 dark:bg-gray-600' : ''
                        } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600`}
                    >
                      {getLanguageName(code)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency selector */}
            <div className="relative" ref={currencyDropdownRef}>
              <button
                onClick={handleCurrencyMenuToggle}
                className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer p-2"
                title="Changer la devise"
              >
                <Coins className="h-5 w-5" />
              </button>

              {isCurrencyMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  {Object.entries(currencyNames).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => handleCurrencyChange(code as UserCurrency)}
                      className={`${currency === code ? 'bg-gray-100 dark:bg-gray-600' : ''
                        } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications - Affiché uniquement pour les utilisateurs connectés */}
            {user && (
              <div
                className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer relative p-2"
                onClick={handleNotificationToggle}
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse absolute -top-2 -right-2">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer p-2"
              title="Changer le thème"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User profile link */}
            {user ? (
              <Link
                to={user.role === 'supplier' ? `/supplier/${user.id}` : "/profile"}
                className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer p-2"
                title={user.role === 'supplier' ? 'Mon profil fournisseur' : 'Mon profil'}
              >
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <div className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer p-2">
                <User className="h-5 w-5" />
              </div>
            )}

            {/* Login/Logout button */}
            {user ? (
              <button
                onClick={logout}
                className="bg-white text-gray-800 px-6 py-2 rounded-full text-sm font-semibold hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-display"
              >
                {t('logout')}
              </button>
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

      {/* Notification Center */}
      {user && (
        <NotificationCenter
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
          onUnreadCountChange={() => refreshNotifications()}
        />
      )}
    </nav>
  );
};

export default NavbarFixed;
