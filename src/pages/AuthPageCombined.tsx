import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';
import FileUploadButton from '../components/FileUploadButton';
import SocialNetworkSelector from '../components/SocialNetworkSelector';
import SocialMediaModal, { SocialNetwork, SocialMediaLink } from '../components/SocialMediaModal';
import GoogleSignInButton from '../components/GoogleSignInButton';
import '../styles/auth-design.css';

const AuthPageCombined: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('customer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Détecter automatiquement le mode basé sur l'URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/register') {
      setIsLoginMode(false);
    } else if (path === '/login') {
      setIsLoginMode(true);
    }
  }, [location.pathname]);
  // États spécifiques aux influenceurs
  const [socialMediaLinks, setSocialMediaLinks] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState<SocialNetwork[]>([]);
  const [socialMediaLinksList, setSocialMediaLinksList] = useState<SocialMediaLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followerCount, setFollowerCount] = useState('');
  const [influenceCategory, setInfluenceCategory] = useState('');
  const [mainAudience, setMainAudience] = useState('');
  const [engagementRate, setEngagementRate] = useState('');  const [mediaKit, setMediaKit] = useState<File | null>(null);
  const [influencerMessage, setInfluencerMessage] = useState('');  // États spécifiques aux fournisseurs
  const [companyName, setCompanyName] = useState('');
  const [legalRegistrationNumber, setLegalRegistrationNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [monthlyProductionCapacity, setMonthlyProductionCapacity] = useState('');
  const [productionCountryRegion, setProductionCountryRegion] = useState('');  const [certifications, setCertifications] = useState('');
  const [qualityControlMethods, setQualityControlMethods] = useState('');
  const [presentationVideo, setPresentationVideo] = useState('');
  const [companyMessage, setCompanyMessage] = useState('');
  const [agreeToVerification, setAgreeToVerification] = useState(false);
  const [supplierDocuments, setSupplierDocuments] = useState<File | null>(null);

  const adminEmails = [
    'admin@example.com',
    'admin@chinetonusine.com',
    'administrator@chinetonusine.com'
  ];
  const isAdminEmail = (emailToCheck: string) => {
    return adminEmails.includes(emailToCheck.toLowerCase().trim());
  };

  // Gestion des réseaux sociaux
  const handleNetworkSelection = (networks: SocialNetwork[]) => {
    setSelectedNetworks(networks);
    if (networks.length > 0) {
      setIsModalOpen(true);
    } else {
      setSocialMediaLinksList([]);
      setSocialMediaLinks('');
    }
  };

  const handleSaveLinks = (links: SocialMediaLink[]) => {
    setSocialMediaLinksList(links);
    setIsModalOpen(false);
    
    // Convertir en format string pour la compatibilité avec le backend actuel
    const linksString = links
      .filter(link => link.url.trim())
      .map(link => `${link.network}: ${link.url}`)
      .join(', ');
    setSocialMediaLinks(linksString);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error(t('emptyFields'));
      }

      const userRole = isAdminEmail(email) ? 'admin' : selectedRole;
      
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

      localStorage.setItem('demoUser', JSON.stringify(demoUser));
      await login(email.trim(), password.trim());

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
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage || t('loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!name.trim()) {
        throw new Error(t('nameRequired'));
      }

      if (!email.trim()) {
        throw new Error(t('emailRequired'));
      }      if (selectedRole !== 'supplier' && selectedRole !== 'sourcer' && selectedRole !== 'influencer') {
        if (password.length < 6) {
          throw new Error(t('passwordMinLength'));
        }
        
        if (password !== confirmPassword) {
          throw new Error(t('passwordsDoNotMatch'));
        }
      }

      // Validation spécifique pour les fournisseurs
      if (selectedRole === 'supplier') {
        if (!companyName.trim()) {
          throw new Error(t('supplier.companyName') + ' est requis');
        }
        if (!legalRegistrationNumber.trim()) {
          throw new Error(t('supplier.legalRegistrationNumber') + ' est requis');
        }
        if (!productCategory) {
          throw new Error(t('supplier.productCategory') + ' est requis');
        }
        if (!monthlyProductionCapacity.trim()) {
          throw new Error(t('supplier.monthlyProductionCapacity') + ' est requis');
        }
        if (!productionCountryRegion.trim()) {
          throw new Error(t('supplier.productionCountryRegion') + ' est requis');
        }
        if (!agreeToVerification) {
          throw new Error('Vous devez accepter la vérification de vos informations');
        }
      }

      const { user, error: registerError } = await register(
        email.trim(),
        (selectedRole === 'supplier' || selectedRole === 'sourcer' || selectedRole === 'influencer') ? 'temp-password' : password.trim(),
        name.trim(),
        selectedRole as UserRole
      );      if (registerError) {
        throw new Error(registerError);
      }

      if (user) {
        switch (user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'supplier':
            alert(t('supplier.registration.message'));
            navigate('/login');
            break;
          case 'sourcer':
          case 'influencer':
            alert(t('sourcer.registration.message'));
            navigate('/login');
            break;
          default:
            navigate('/dashboard');
        }
      }      // Log des données influenceur si nécessaire
      if (selectedRole === 'influencer') {
        console.log('Media Kit:', mediaKit);
        console.log('Influencer Message:', influencerMessage);
        console.log('Social Media Links:', socialMediaLinks);
        console.log('Follower Count:', followerCount);
        console.log('Influence Category:', influenceCategory);
        console.log('Main Audience:', mainAudience);
        console.log('Engagement Rate:', engagementRate);
      }

      // Log des données fournisseur si nécessaire
      if (selectedRole === 'supplier') {
        console.log('Supplier Registration Data:');
        console.log('Company Name:', companyName);
        console.log('Legal Registration Number:', legalRegistrationNumber);
        console.log('Website:', website);
        console.log('Product Category:', productCategory);
        console.log('Monthly Production Capacity:', monthlyProductionCapacity);
        console.log('Production Country/Region:', productionCountryRegion);
        console.log('Certifications:', certifications);        console.log('Quality Control Methods:', qualityControlMethods);
        console.log('Presentation Video:', presentationVideo);
        console.log('Company Message:', companyMessage);
        console.log('Supplier Documents:', supplierDocuments);      console.log('Agree to Verification:', agreeToVerification);
      }} catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('registrationError'));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="auth-main-container">
      {/* Background animé spectaculaire avec tous les effets */}
      <div className="auth-animated-background">
        {/* Particules flottantes améliorées */}
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        
        {/* Particules de lumière */}
        <div className="light-particle"></div>
        <div className="light-particle"></div>
        <div className="light-particle"></div>
        
        {/* Orbes lumineuses */}
        <div className="light-orb"></div>
        <div className="light-orb"></div>
        <div className="light-orb"></div>
        <div className="light-orb"></div>
        
        {/* Ondulations */}
        <div className="ripple-effect"></div>
        <div className="ripple-effect"></div>
        <div className="ripple-effect"></div>
        
        {/* Pulsations énergétiques */}
        <div className="energy-pulse"></div>
        <div className="energy-pulse"></div>
        <div className="energy-pulse"></div>
        
        {/* Forme morphique */}
        <div className="morphing-shape"></div>
      </div>      {/* Carte principale avec effet glassmorphism */}
      <div className="auth-card auth-card-glassmorphism auth-spectacular-entrance">
        {/* Colonne visuelle */}
        <div className="auth-visual-column auth-visual-spectacular">
          <div className="auth-visual-content">
            <h2 className="auth-visual-title typing-animation">
              {isLoginMode ? t('welcomeBack') : t('joinUs')}
            </h2>
            <p className="auth-visual-subtitle">
              {isLoginMode 
                ? t('loginSubtitle') 
                : t('registerSubtitle')
              }
            </p>            
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
            <h1 className="auth-form-title">
              {isLoginMode ? t('signIn') : t('createAccount')}
            </h1>
            <p className="auth-form-subtitle">
              {isLoginMode ? t('signInSubtitle') : t('signUpSubtitle')}
            </p>
          </div>

          {/* Navigation des onglets */}          <div className="auth-tab-navigation">
            <button
              className={`auth-tab-btn ${isLoginMode ? 'active' : ''}`}
              onClick={() => {
                setIsLoginMode(true);
                setError('');
                navigate('/login');
              }}
            >
              {t('signIn')}
            </button>
            <button
              className={`auth-tab-btn ${!isLoginMode ? 'active' : ''}`}
              onClick={() => {
                setIsLoginMode(false);
                setError('');
                navigate('/register');
              }}
            >
              {t('signUp')}
            </button>
            <div className={`auth-tab-indicator ${!isLoginMode ? 'register-active' : ''}`}></div>
          </div>

          {error && (
            <div className="auth-error">
              <strong>{isLoginMode ? t('loginErrorTitle') : 'Erreur'}</strong>
              <div>{error}</div>
            </div>
          )}

          <form className="auth-form" onSubmit={isLoginMode ? handleLogin : handleRegister}>
            {/* Nom pour inscription */}
            {!isLoginMode && (
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
            )}

            {/* Email */}
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
            </div>            {/* Type de compte */}
            <div className="auth-form-group">
              <select
                className="auth-input"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={isLoading}
              >
                <option value="customer">{t('role.customer')}</option>
                <option value="supplier">{t('role.supplier')}</option>
                {!isLoginMode && <option value="influencer">{t('role.influencer')}</option>}
              </select>
            </div>

            {/* Messages personnalisés pour inscription uniquement */}
            {!isLoginMode && (
              <>
                {/* Message personnalisé pour les fournisseurs */}
                {selectedRole === 'supplier' && (
                  <div className="auth-info-message auth-supplier-message">
                    <div className="auth-info-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="auth-info-content">
                      <h4 className="auth-info-title">{t('supplier.registration.title')}</h4>
                      <p className="auth-info-text">{t('supplier.registration.message')}</p>
                      <p className="auth-info-subtext">{t('supplier.registration.validation')}</p>
                    </div>
                  </div>
                )}                {/* Message personnalisé pour les influenceurs */}
                {selectedRole === 'influencer' && (
                  <div className="auth-info-message auth-influencer-message">
                    <div className="auth-info-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="auth-info-content">
                      <h4 className="auth-info-title">{t('sourcer.registration.title')}</h4>
                      <p className="auth-info-text">{t('sourcer.registration.message')}</p>
                      <p className="auth-info-subtext">{t('sourcer.registration.validation')}</p>
                    </div>
                  </div>
                )}
              </>
            )}            {/* Mot de passe - masqué pour fournisseurs, sourceurs et influenceurs en mode inscription */}
            {(isLoginMode || (selectedRole !== 'supplier' && selectedRole !== 'sourcer' && selectedRole !== 'influencer')) && (
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
            )}            {/* Confirmation mot de passe */}
            {!isLoginMode && selectedRole !== 'supplier' && selectedRole !== 'sourcer' && selectedRole !== 'influencer' && (
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
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}            {/* Champs spécifiques pour les influenceurs */}
            {!isLoginMode && selectedRole === 'influencer' && (
              <div className="auth-influencer-fields">                {/* Sélecteur de réseaux sociaux */}
                <div className="auth-form-group">
                  <SocialNetworkSelector
                    selectedNetworks={selectedNetworks}
                    onChange={handleNetworkSelection}
                    disabled={isLoading}
                  />
                </div>

                {/* Nombre d'abonnés */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <input
                      type="number"
                      className="auth-input"
                      placeholder={t('followerCount')}
                      value={followerCount}
                      onChange={(e) => setFollowerCount(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="auth-input-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0018.5 7H17c-.8 0-1.5.7-1.5 1.5V10H7V8.5C7 7.7 6.3 7 5.5 7H4c-.8 0-1.5.7-1.5 1.5V22h3v-3h12v3h3z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Catégorie d'influence */}
                <div className="auth-form-group">
                  <select
                    className="auth-input"
                    value={influenceCategory}
                    onChange={(e) => setInfluenceCategory(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">{t('category')}</option>
                    <option value="fashion">{t('fashion')}</option>
                    <option value="tech">{t('tech')}</option>
                    <option value="beauty">{t('beauty')}</option>
                    <option value="sports">{t('sports')}</option>
                  </select>
                </div>

                {/* Audience principale */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <input
                      type="text"
                      className="auth-input"
                      placeholder={t('mainAudience')}
                      value={mainAudience}
                      onChange={(e) => setMainAudience(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="auth-input-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Taux d'engagement */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <input
                      type="number"
                      className="auth-input"
                      placeholder={t('engagementRate')}
                      value={engagementRate}
                      onChange={(e) => setEngagementRate(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="auth-input-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 11H7v9h2v-9zm4-4h-2v13h2V7zm4-3h-2v16h2V4z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Upload du media kit */}
                <div className="auth-form-group">
                  <FileUploadButton 
                    id="mediaKit"
                    label={t('fileUpload.title')}
                    accept="application/pdf,image/*"
                    onChange={(file) => setMediaKit(file)}
                    disabled={isLoading}
                    className="auth-file-upload"
                  />
                </div>

                {/* Message personnel */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <textarea
                      className="auth-input auth-textarea"
                      placeholder={t('messagePlaceholder')}
                      value={influencerMessage}
                      onChange={(e) => setInfluencerMessage(e.target.value)}
                      disabled={isLoading}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Checkbox pour partage de statistiques */}
                <div className="auth-form-group">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      className="auth-checkbox"
                      disabled={isLoading}
                    />
                    <span className="auth-checkbox-text">{t('shareStatsAgreement')}</span>
                  </label>                </div>
              </div>
            )}

            {/* Champs spécifiques pour les fournisseurs */}
            {!isLoginMode && selectedRole === 'supplier' && (
              <div className="auth-supplier-fields">
                {/* Nom de l'entreprise */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <input
                      type="text"
                      className="auth-input"
                      placeholder={t('supplier.companyName')}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <div className="auth-input-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10.07 2.82L8.12 6.39l3.95 2.28.77-1.33zM12 8.44l.82.47L11.25 8l.75-1.3zM10 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM2 12l3.95-2.28L8.12 6.39L10.07 2.82L12 1l1.93 1.82 1.95 3.57 2.17 3.72L22 12v10H2V12z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Numéro d'enregistrement légal */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <input
                      type="text"
                      className="auth-input"
                      placeholder={t('supplier.legalRegistrationNumber')}
                      value={legalRegistrationNumber}
                      onChange={(e) => setLegalRegistrationNumber(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <div className="auth-input-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Site web */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <input
                      type="url"
                      className="auth-input"
                      placeholder={t('supplier.website')}
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="auth-input-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Catégorie de produits */}
                <div className="auth-form-group">
                  <select
                    className="auth-input"
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    required
                    disabled={isLoading}
                  >
                    <option value="">{t('supplier.productCategory')}</option>
                    <option value="textile">{t('supplier.categories.textile')}</option>
                    <option value="electronics">{t('supplier.categories.electronics')}</option>
                    <option value="food">{t('supplier.categories.food')}</option>
                    <option value="machinery">{t('supplier.categories.machinery')}</option>
                    <option value="automotive">{t('supplier.categories.automotive')}</option>
                    <option value="beauty">{t('supplier.categories.beauty')}</option>
                    <option value="home-garden">{t('supplier.categories.homeGarden')}</option>
                    <option value="toys">{t('supplier.categories.toys')}</option>
                    <option value="industrial">{t('supplier.categories.industrial')}</option>
                    <option value="other">{t('supplier.categories.other')}</option>
                  </select>
                </div>

                {/* Capacité de production mensuelle */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <input
                      type="text"
                      className="auth-input"
                      placeholder={t('supplier.monthlyProductionCapacity')}
                      value={monthlyProductionCapacity}
                      onChange={(e) => setMonthlyProductionCapacity(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <div className="auth-input-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Pays et région de production */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <input
                      type="text"
                      className="auth-input"
                      placeholder={t('supplier.productionCountryRegion')}
                      value={productionCountryRegion}
                      onChange={(e) => setProductionCountryRegion(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <div className="auth-input-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <input
                      type="text"
                      className="auth-input"
                      placeholder={t('supplier.certifications')}
                      value={certifications}
                      onChange={(e) => setCertifications(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="auth-input-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  </div>
                </div>                {/* Méthodes de contrôle qualité */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <textarea
                      className="auth-input auth-textarea"
                      placeholder={t('supplier.qualityControlMethods')}
                      value={qualityControlMethods}
                      onChange={(e) => setQualityControlMethods(e.target.value)}
                      disabled={isLoading}
                      rows={3}
                    />
                    <div className="auth-input-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 11H7v9h2v-9zm4-4h-2v13h2V7zm4-3h-2v16h2V4z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Dépôt de documents */}
                <div className="auth-form-group">
                  <FileUploadButton 
                    id="supplierDocuments"
                    label={t('supplier.documents')}
                    accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx"
                    onChange={(file) => setSupplierDocuments(file)}
                    disabled={isLoading}
                    className="auth-file-upload"
                  />
                </div>

                {/* Vidéo de présentation */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <input
                      type="url"
                      className="auth-input"
                      placeholder={t('supplier.presentationVideo')}
                      value={presentationVideo}
                      onChange={(e) => setPresentationVideo(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="auth-input-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message de présentation */}
                <div className="auth-form-group">
                  <div className="auth-input-wrapper">
                    <textarea
                      className="auth-input auth-textarea"
                      placeholder={t('supplier.companyMessage')}
                      value={companyMessage}
                      onChange={(e) => setCompanyMessage(e.target.value)}
                      disabled={isLoading}
                      rows={4}
                    />
                    <div className="auth-input-icon">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                      </svg>
                    </div>
                  </div>
                </div>                {/* Dépôt de documents */}
                <div className="auth-form-group">
                  <FileUploadButton 
                    id="supplierDocuments"
                    label={t('supplier.documents')}
                    accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx"
                    onChange={(file) => setSupplierDocuments(file)}
                    disabled={isLoading}
                    className="auth-file-upload"
                  />
                </div>

                {/* Case à cocher pour accepter la vérification */}
                <div className="auth-form-group">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      className="auth-checkbox"
                      checked={agreeToVerification}
                      onChange={(e) => setAgreeToVerification(e.target.checked)}
                      required
                      disabled={isLoading}
                    />
                    <span className="auth-checkbox-text">{t('supplier.agreeToVerification')}</span>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`auth-submit-btn auth-btn ${isLoading ? 'auth-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading 
                ? (isLoginMode ? t('loggingIn') : t('creatingAccount'))
                : isLoginMode 
                  ? t('loginButton') 
                  : selectedRole === 'supplier'
                    ? t('supplier.registration.submitButton')
                    : (selectedRole === 'influencer')
                      ? t('sourcer.registration.submitButton')
                      : t('createMyAccount')
              }            </button>
          </form>          {/* Boutons de connexion Google */}
          <div className="auth-social-section">
            <div className="auth-social-divider">
              <span>{t('orContinueWith')}</span>
            </div>
            
            <GoogleSignInButton
              onSuccess={() => {
                // La redirection sera gérée automatiquement par l'écouteur onAuthStateChanged
                // dans le contexte d'authentification
                console.log('Connexion Google réussie');
              }}
              onError={(errorMessage) => {
                setError(errorMessage);
              }}
              className="w-full"
              variant="default"
            />
          </div>

          <div className="auth-divider">
            <span>
              {isLoginMode ? t('noAccountQuestion') : t('hasAccountQuestion')}
            </span>
          </div><div style={{ textAlign: 'center' }}>
            <button 
              type="button"
              onClick={() => {
                const newMode = !isLoginMode;
                setIsLoginMode(newMode);
                navigate(newMode ? '/login' : '/register');
              }}
              className="auth-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {isLoginMode ? t('registerNow') : t('loginButton')}
            </button>
          </div><div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--auth-text-light)' }}>
              {t('termsAgreement')}
            </p>          </div>
        </div>
      </div>

      {/* Modal de saisie des liens réseaux sociaux */}
      <SocialMediaModal
        isOpen={isModalOpen}
        selectedNetworks={selectedNetworks}
        existingLinks={socialMediaLinksList}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLinks}
      />
    </div>
  );
};

export default AuthPageCombined;
