import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ShoppingBag, User, Coins, Sun, Moon, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { UserLanguage, UserCurrency } from '../types';
import NotificationCenter from './NotificationCenter';
import { useNotifications } from '../hooks/useNotifications';

const NavbarSimple: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, getLanguageName, availableLanguages } = useLanguage();
  const { currency, setCurrency, currencyNames } = useCurrency();
  const { isDarkMode, toggleTheme } = useTheme();

  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Refs pour éviter les conflits
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  const { unreadCount, refresh: refreshNotifications } = useNotifications({
    pollInterval: user ? 30000 : 0,
    autoRefresh: !!user
  });

  // Gestion avec événements isolés
  const handleLanguageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🌐 Language button clicked - current state:', isLanguageMenuOpen);
    console.log('🔔 Notification center state:', isNotificationCenterOpen);
    
    setIsLanguageMenuOpen(prev => !prev);
    setIsCurrencyMenuOpen(false);
    setIsNotificationCenterOpen(false);
  };

  const handleNotificationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔔 Notification button clicked');
    
    setIsNotificationCenterOpen(prev => !prev);
    setIsLanguageMenuOpen(false);
    setIsCurrencyMenuOpen(false);
  };

  const handleLanguageChange = (newLanguage: UserLanguage) => {
    console.log('🌍 Changing language to:', newLanguage);
    setLanguage(newLanguage);
    setIsLanguageMenuOpen(false);
  };

  // Fermeture au clic extérieur
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

  // Debug des états
  useEffect(() => {
    console.log('🎛️ Navbar states:', {
      language: isLanguageMenuOpen,
      notification: isNotificationCenterOpen,
      currency: isCurrencyMenuOpen
    });
  }, [isLanguageMenuOpen, isNotificationCenterOpen, isCurrencyMenuOpen]);

  return (
    <>
      <nav className="bg-gradient-to-br from-blue-600 via-blue-500 to-orange-400 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-white" />
                <span className="ml-2 text-xl font-bold text-white font-display">Chine ton usine</span>
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              {/* Language selector avec isolation complète */}
              <div className="relative" ref={languageDropdownRef}>
                <button
                  type="button"
                  onClick={handleLanguageClick}
                  className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                  title="Changer la langue"
                  aria-label="Sélecteur de langue"
                >
                  <Globe className="h-5 w-5" />
                </button>

                {isLanguageMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    {availableLanguages.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleLanguageChange(code)}
                        className={`${
                          language === code ? 'bg-gray-100 dark:bg-gray-600' : ''
                        } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none`}
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
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCurrencyMenuOpen(!isCurrencyMenuOpen);
                    setIsLanguageMenuOpen(false);
                    setIsNotificationCenterOpen(false);
                  }}
                  className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                  title="Changer la devise"
                >
                  <Coins className="h-5 w-5" />
                </button>

                {isCurrencyMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    {Object.entries(currencyNames).map(([code, name]) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          setCurrency(code as UserCurrency);
                          setIsCurrencyMenuOpen(false);
                        }}
                        className={`${
                          currency === code ? 'bg-gray-100 dark:bg-gray-600' : ''
                        } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications - séparé complètement */}
              {user && (
                <button
                  type="button"
                  onClick={handleNotificationClick}
                  className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer relative p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse absolute -top-1 -right-1">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                title="Changer le thème"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* User */}
              {user && (
                <Link
                  to={user.role === 'supplier' ? `/supplier/${user.id}` : "/profile"}
                  className="flex items-center space-x-2 text-white hover:text-orange-200 transition-colors cursor-pointer p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-300"
                  title="Mon profil"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}

              {/* Login/Logout */}
              {user ? (
                <button
                  type="button"
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
      </nav>

      {/* Notification Center avec debug */}
      {user && isNotificationCenterOpen && (
        <div>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={() => {
              console.log('🌑 Overlay clicked - closing notification center');
              setIsNotificationCenterOpen(false);
            }}
          />
          <NotificationCenter
            isOpen={true}
            onClose={() => {
              console.log('❌ NotificationCenter onClose called');
              setIsNotificationCenterOpen(false);
            }}
            onUnreadCountChange={() => refreshNotifications()}
          />
        </div>
      )}
    </>
  );
};

export default NavbarSimple;
