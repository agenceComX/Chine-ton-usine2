import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/auth-design.css';

const LoginPageNew: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Rôle par défaut pour la connexion universelle
  const DEFAULT_ROLE = 'customer';

  // Liste des emails d'administrateurs
  const adminEmails = [
    'admin@example.com',
    'admin@chinetonusine.com',
    'administrator@chinetonusine.com'
  ];

  const isAdminEmail = (emailToCheck: string) => {
    return adminEmails.includes(emailToCheck.toLowerCase().trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {      if (!email.trim() || !password.trim()) {
        throw new Error(t('emptyFields'));
      }

      // Connexion universelle : admin si email admin, sinon rôle par défaut
      const userRole = isAdminEmail(email) ? 'admin' : DEFAULT_ROLE;

      const demoUser = {
        id: `demo_${userRole}_${Date.now()}`,
        email: email.trim(),
        name: `Utilisateur ${userRole}`,
        role: userRole as 'customer' | 'supplier' | 'sourcer' | 'admin',
        favorites: [],
        browsingHistory: [],
        messages: [],
        subscription: 'free' as const
      };      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      await login(email.trim(), password.trim());

      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          navigate('/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion inconnue.';
      setError(errorMessage || t('loginError', 'Erreur de connexion'));
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      // Connexion universelle pour Google aussi
      const userRole = isAdminEmail('user@gmail.com') ? 'admin' : DEFAULT_ROLE;
      
      const demoUser = {
        id: `google_${userRole}_${Date.now()}`,
        email: 'user@gmail.com',
        name: `Utilisateur Google ${userRole}`,
        role: userRole as 'customer' | 'supplier' | 'sourcer' | 'admin',
        favorites: [],
        browsingHistory: [],
        messages: [],
        subscription: 'free' as const
      };      localStorage.setItem('demoUser', JSON.stringify(demoUser));

      switch (userRole) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        default:
          navigate('/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion Google.';
      setError(errorMessage || t('googleLoginError', 'Erreur connexion Google'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-main-container">
      {/* Background animé */}
      <div className="auth-animated-background">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>

      {/* Carte principale */}
      <div className="auth-card">
        {/* Colonne visuelle */}
        <div className="auth-visual-column">
          <div className="auth-visual-content">
            <h1 className="auth-visual-title">
              {t('welcome.back', 'Bon retour !')}
            </h1>
            <p className="auth-visual-subtitle">
              {t('welcome.back.subtitle', 'Connectez-vous pour accéder à votre espace et découvrir les dernières opportunités commerciales avec la Chine.')}
            </p>
            
            <div className="auth-visual-illustration">
              <div className="illustration-circle"></div>
              <div className="illustration-circle"></div>
              <div className="illustration-center">
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne formulaire */}
        <div className="auth-form-column">
          <div className="auth-form-header">
            <h2 className="auth-form-title">{t('login', 'Connexion')}</h2>
            <p className="auth-form-subtitle">{t('loginDescription', 'Accédez à votre compte')}</p>
          </div>

          {error && (
            <div className="auth-error">
              <strong>{t('loginErrorTitle', 'Erreur de connexion')}</strong>
              <div>{error}</div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  className="auth-input"
                  placeholder={t('email', 'Email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div className="auth-input-icon">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="auth-form-group">
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  className="auth-input"
                  placeholder={t('password', 'Mot de passe')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div className="auth-input-icon">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18,8h-1V6c0-2.76-2.24-5-5-5S7,3.24,7,6v2H6c-1.1,0-2,0.9-2,2v10c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V10 C20,8.9,19.1,8,18,8z M12,17c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.1,17,12,17z M15.1,8H8.9V6c0-1.71,1.39-3.1,3.1-3.1 s3.1,1.39,3.1,3.1V8z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Sélecteur de rôle */}
            <div className="auth-form-group">
              <select
                className="auth-input"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={isLoading}
              >
                <option value="customer">{t('role.customer', 'Client')}</option>
                <option value="supplier">{t('role.supplier', 'Fournisseur')}</option>
                <option value="sourcer">{t('role.sourcer', 'Sourceur')}</option>
              </select>
            </div>

            <button
              type="submit"
              className={`auth-submit-btn ${isLoading ? 'auth-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? t('loggingIn', 'Connexion...') : t('loginButton', 'Se connecter')}
            </button>

            <div className="auth-divider">
              <span>{t('orContinueWith', 'Ou continuer avec')}</span>
            </div>

            <button
              type="button"
              className="auth-submit-btn"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              style={{ background: '#4285f4' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('signInWithGoogle', 'Continuer avec Google')}
            </button>
          </form>

          <div className="auth-divider">
            <span>{t('noAccountQuestion', 'Pas encore de compte ?')}</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register" className="auth-link">
              {t('registerNow', 'Créer un compte')}
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--auth-text-light)' }}>
              {t('agreementPrefix', 'En continuant, vous acceptez nos')}{' '}
              <Link to="/terms" className="auth-link">
                {t('termsOfUse', 'Conditions d\'utilisation')}
              </Link>{' '}
              {t('andOur', 'et notre')}{' '}
              <Link to="/privacy" className="auth-link">
                {t('privacyPolicy', 'Politique de confidentialité')}
              </Link>
              {t('agreementSuffix', '.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageNew;
