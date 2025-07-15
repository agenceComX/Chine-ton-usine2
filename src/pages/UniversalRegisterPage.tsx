import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UniversalAuthService } from '../lib/auth/services/universalAuthService';
import '../styles/auth-design.css';

const UniversalRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validation des données d'inscription
      const validationResult = UniversalAuthService.validateRegisterData({
        name,
        email,
        password,
        confirmPassword
      });

      if (!validationResult.isValid) {
        throw new Error(validationResult.error || t('registrationError'));
      }

      // Détermination automatique du rôle
      const userRole = UniversalAuthService.determineUserRole(email);

      // Création d'un utilisateur démo pour test
      const demoUser = UniversalAuthService.createDemoUser(email, userRole, name);

      localStorage.setItem('demoUser', JSON.stringify(demoUser));

      // Inscription avec le rôle déterminé
      await register(email, password, name, userRole);

      // Redirection basée sur le rôle
      const redirectRoute = UniversalAuthService.getRedirectRoute(userRole);
      navigate(redirectRoute);

      console.log('✅ Inscription universelle réussie:', { 
        email, 
        name, 
        role: userRole, 
        redirect: redirectRoute 
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('registrationError');
      setError(errorMessage);
      console.error('❌ Erreur d\'inscription universelle:', err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="auth-main-container">
      {/* Background animé spectaculaire */}
      <div className="auth-animated-background">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        
        {/* Particules d'énergie */}
        <div className="energy-pulse"></div>
        <div className="energy-pulse"></div>
        <div className="energy-pulse"></div>
        
        {/* Forme morphique */}
        <div className="morphing-shape"></div>
      </div>

      {/* Carte principale avec effet glassmorphism */}
      <div className="auth-card auth-card-glassmorphism auth-spectacular-entrance">
        {/* Colonne visuelle */}        <div className="auth-visual-column auth-visual-spectacular">
          <div className="auth-visual-content">
            <h2 className="auth-visual-title typing-animation">
              {t('joinUs')}
            </h2>
            <p className="auth-visual-subtitle">
              {t('registerSubtitle')}
            </p>
            
            {/* Message informatif sur l'inscription universelle */}
            <div className="auth-info-badge">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 text-blue-300">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-blue-100">
                  🌟 Connexion Universelle
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-2">
                Connectez-vous simplement avec votre email et mot de passe. Votre rôle sera automatiquement attribué.
              </p>
            </div>
            
            <div className="auth-visual-illustration">
              <div className="illustration-circle"></div>
              <div className="illustration-circle"></div>
              <div className="illustration-center">
                <div className="w-6 h-6 text-white">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne formulaire */}
        <div className="auth-form-column auth-form-spectacular">
          <div className="auth-form-header">
            <h1 className="auth-form-title">{t('createAccount')}</h1>
            <p className="auth-form-subtitle">{t('signUpSubtitle')}</p>
          </div>

          {/* Navigation des onglets */}
          <div className="auth-tab-navigation">
            <Link to="/login" className="auth-tab-btn">
              {t('signIn')}
            </Link>
            <button className="auth-tab-btn active">
              {t('signUp')}
            </button>
            <div className="auth-tab-indicator register-active"></div>
          </div>

          {error && (
            <div className="auth-error">
              <strong>{t('registrationErrorTitle')}</strong>
              <div>{error}</div>
            </div>
          )}

          {/* Message d'information pour l'inscription universelle */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 text-sm rounded-md p-4 mb-4">
            <div className="font-medium">🚀 Inscription Universelle</div>
            <div className="mt-1">Créez votre compte facilement. Votre rôle sera automatiquement attribué (Client par défaut, Admin si email admin).</div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  className="auth-input"
                  placeholder={t('fullName')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <div className="auth-input-icon">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="auth-form-group">
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  className="auth-input"
                  placeholder={t('email')}
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
                  placeholder={t('password')}
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

            <div className="auth-form-group">
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  className="auth-input"
                  placeholder={t('confirmPassword')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            <button
              type="submit"
              className={`auth-submit-btn ${isLoading ? 'auth-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? t('creatingAccount') : t('createMyAccount')}
            </button>
          </form>

          <div className="auth-divider">
            <span>{t('hasAccountQuestion')}</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/login" className="auth-link">
              {t('loginNow')}
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>            <p className="auth-agreement-text">
              {t('agreementPrefix')}{' '}
              <Link to="/terms" className="auth-link">{t('termsOfService')}</Link>
              {' '}{t('and')}{' '}
              <Link to="/privacy" className="auth-link">{t('privacyPolicy')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalRegisterPage;
