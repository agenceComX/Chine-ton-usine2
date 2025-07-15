import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Input from '../components/Input';
import Button from '../components/Button';
import '../styles/auth-design.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('customer'); // Rôle par défaut
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Liste des emails d'administrateurs
  const adminEmails = [
    'admin@example.com',
    'admin@chinetonusine.com',
    'administrator@chinetonusine.com'
  ];

  // Détecter si l'email est celui d'un administrateur
  const isAdminEmail = (emailToCheck: string) => {
    return adminEmails.includes(emailToCheck.toLowerCase().trim());
  };

  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error(t('emptyFields'));
      }

      // Déterminer le rôle automatiquement pour les admins
      const userRole = isAdminEmail(email) ? 'admin' : selectedRole;

      // Connexion de démonstration basée sur le rôle déterminé
      // Pour simplifier, nous utiliserons une connexion fictive
      const demoUser = {
        id: `demo_${userRole}_${Date.now()}`,
        email: email.trim(),
        name: `Utilisateur ${userRole}`,
        role: userRole as 'customer' | 'supplier' | 'sourcer' | 'admin',
        favorites: [],
        browsingHistory: [],
        messages: [],
        subscription: 'free' as const
      };

      // Stocker l'utilisateur dans le localStorage pour la démo
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      
      // Simuler le login avec le contexte
      await login(email.trim(), password.trim());

      // Redirection basée sur le rôle sélectionné
      switch (selectedRole) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'supplier':
          navigate('/supplier/dashboard', { replace: true });
          break;
        case 'sourcer':
          navigate('/sourcer/dashboard', { replace: true });
          break;
        default:
          navigate('/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion inconnue.';
      setError(errorMessage || t('loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      // Déterminer le rôle pour Google Sign-In aussi
      const userRole = isAdminEmail('user@gmail.com') ? 'admin' : selectedRole;
      
      // Connexion Google simplifiée avec le rôle déterminé
      const demoUser = {
        id: `google_${userRole}_${Date.now()}`,
        email: 'user@gmail.com',
        name: `Utilisateur Google ${userRole}`,
        role: userRole as 'customer' | 'supplier' | 'sourcer' | 'admin',
        favorites: [],
        browsingHistory: [],
        messages: [],
        subscription: 'free' as const
      };

      // Stocker l'utilisateur dans le localStorage pour la démo
      localStorage.setItem('demoUser', JSON.stringify(demoUser));

      // Redirection basée sur le rôle déterminé
      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'supplier':
          navigate('/supplier/dashboard', { replace: true });
          break;
        case 'sourcer':
          navigate('/sourcer/dashboard', { replace: true });
          break;
        default:
          navigate('/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion Google.';
      setError(errorMessage || t('googleLoginError'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
      </button>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {t('login')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          {t('loginDescription')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md p-4">
              <div className="font-medium">{t('loginErrorTitle')}</div>
              <div className="mt-1">{error}</div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Sélecteur de rôle - caché pour les administrateurs */}
            {!isAdminEmail(email) && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('accountType')}
                </label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isLoading}
                >
                  <option value="customer">{t('role.customer')}</option>
                  <option value="supplier">{t('role.supplier')}</option>
                  <option value="sourcer">{t('role.sourcer')}</option>
                </select>
              </div>
            )}

            {/* Message pour les administrateurs */}
            {isAdminEmail(email) && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-sm rounded-md p-4">
                <div className="font-medium">🔐 Connexion Administrateur</div>
                <div className="mt-1">Vous êtes identifié comme administrateur. Aucune sélection de rôle nécessaire.</div>
              </div>
            )}

            <Input
              type="email"
              label={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('emailPlaceholder')}
              disabled={isLoading}
              className="bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
            />

            <Input
              type="password"
              label={t('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('passwordPlaceholder')}
              disabled={isLoading}
              className="bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-orange-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  {t('rememberMe')}
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  {t('forgotPassword')}
                </a>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="justify-center bg-blue-600 hover:bg-blue-500 text-white dark:bg-blue-700 dark:hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? t('loggingIn') : t('loginButton')}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {t('orContinueWith')}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              fullWidth
              className="justify-center"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <img src="/google-icon.svg" alt="Google" className="h-5 w-5 mr-2" />
              {t('signInWithGoogle')}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {t('noAccountQuestion')}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
                tabIndex={isLoading ? -1 : 0}
              >
                {t('registerNow')}
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('agreementPrefix')}{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                {t('termsOfUse')}
              </Link>{' '}
              {t('andOur')}{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                {t('privacyPolicy')}
              </Link>
              {t('agreementSuffix')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;