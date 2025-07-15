import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';
import '../styles/auth-design.css';

const RegisterPageNew: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (!name.trim()) {
        throw new Error(t('nameRequired', 'Le nom est requis'));
      }

      if (!email.trim()) {
        throw new Error(t('emailRequired', 'L\'email est requis'));
      }

      if (role !== 'supplier' && role !== 'sourcer' && role !== 'influencer') {
        if (password.length < 6) {
          throw new Error(t('passwordMinLength', 'Le mot de passe doit contenir au moins 6 caractères'));
        }
        
        if (password !== confirmPassword) {
          throw new Error(t('passwordsDoNotMatch', 'Les mots de passe ne correspondent pas'));
        }
      }
      
      const { user, error: registerError } = await register(
        email.trim(), 
        (role === 'supplier' || role === 'sourcer' || role === 'influencer') ? 'temp-password' : password.trim(),
        name.trim(), 
        role
      );
      
      if (registerError) {
        throw new Error(registerError);
      }
      
      if (user) {
        switch (user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'supplier':
            alert(t('supplier.registration.message', 'Votre demande a été envoyée pour validation'));
            navigate('/login');
            break;
          case 'sourcer':
          case 'influencer':
            alert(t('sourcer.registration.message', 'Votre demande a été envoyée pour validation'));
            navigate('/login');
            break;
          default:
            navigate('/dashboard');
        }
      }
    } catch (err: unknown) {
      console.error('Erreur d\'inscription:', err);
      setError(err instanceof Error ? err.message : t('registrationError', 'Erreur d\'inscription'));
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
              {isLoginMode ? t('welcome.back', 'Bon retour !') : t('welcome.join', 'Rejoignez-nous !')}
            </h1>
            <p className="auth-visual-subtitle">
              {isLoginMode 
                ? t('welcome.back.subtitle', 'Connectez-vous pour accéder à votre espace')
                : t('welcome.join.subtitle', 'Créez votre compte et découvrez toutes les opportunités d\'affaires avec la Chine')
              }
            </p>
            
            <div className="auth-visual-illustration">
              <div className="illustration-circle"></div>
              <div className="illustration-circle"></div>
              <div className="illustration-center">
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  {isLoginMode ? (
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  ) : (
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  )}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne formulaire */}
        <div className="auth-form-column">
          <div className="auth-form-header">
            <h2 className="auth-form-title">
              {isLoginMode ? t('login', 'Connexion') : t('createAccount', 'Créer un compte')}
            </h2>
            <p className="auth-form-subtitle">
              {isLoginMode 
                ? t('loginDescription', 'Accédez à votre compte')
                : t('registerDescription', 'Rejoignez notre plateforme')
              }
            </p>
          </div>

          {/* Navigation des onglets */}
          <div className="auth-tab-navigation">
            <button
              className={`auth-tab-btn ${isLoginMode ? 'active' : ''}`}
              onClick={() => setIsLoginMode(true)}
              type="button"
            >
              {t('login', 'Connexion')}
            </button>
            <button
              className={`auth-tab-btn ${!isLoginMode ? 'active' : ''}`}
              onClick={() => setIsLoginMode(false)}
              type="button"
            >
              {t('register', 'Inscription')}
            </button>
            <div className={`auth-tab-indicator ${isLoginMode ? '' : 'register-active'}`}></div>
          </div>

          {error && (
            <div className="auth-error">
              <strong>{isLoginMode ? t('loginErrorTitle', 'Erreur de connexion') : t('registrationErrorTitle', 'Erreur d\'inscription')}</strong>
              <div>{error}</div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Champs d'inscription */}
            {!isLoginMode && (
              <div className="auth-form-group">
                <div className="auth-input-wrapper">
                  <input
                    type="text"
                    className="auth-input"
                    placeholder={t('fullName', 'Nom complet')}
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
            )}

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

            {/* Type de compte pour l'inscription */}
            {!isLoginMode && (
              <div className="auth-form-group">
                <select
                  className="auth-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  disabled={isLoading}
                >
                  <option value="customer">{t('role.customer', 'Client')}</option>
                  <option value="supplier">{t('role.supplier', 'Fournisseur')}</option>
                  <option value="influencer">{t('role.influencer', 'Influenceur')}</option>
                </select>
              </div>
            )}

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

            {/* Confirmation mot de passe pour inscription */}
            {!isLoginMode && role !== 'supplier' && role !== 'sourcer' && role !== 'influencer' && (
              <div className="auth-form-group">
                <div className="auth-input-wrapper">
                  <input
                    type="password"
                    className="auth-input"
                    placeholder={t('confirmPassword', 'Confirmer le mot de passe')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <div className="auth-input-icon">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`auth-submit-btn ${isLoading ? 'auth-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading 
                ? (isLoginMode ? t('loggingIn', 'Connexion...') : t('creatingAccount', 'Création...'))
                : (isLoginMode ? t('loginButton', 'Se connecter') : t('createMyAccount', 'Créer mon compte'))
              }
            </button>
          </form>

          <div className="auth-divider">
            <span>
              {isLoginMode 
                ? t('noAccountQuestion', 'Pas encore de compte ?')
                : t('hasAccountQuestion', 'Déjà un compte ?')
              }
            </span>
          </div>

          <div style={{ textAlign: 'center' }}>
            {isLoginMode ? (
              <button 
                type="button"
                onClick={() => setIsLoginMode(false)}
                className="auth-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {t('registerNow', 'Créer un compte')}
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => setIsLoginMode(true)}
                className="auth-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {t('loginButton', 'Se connecter')}
              </button>
            )}
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

export default RegisterPageNew;
