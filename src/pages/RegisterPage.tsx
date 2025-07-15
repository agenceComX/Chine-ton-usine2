import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import FileUploadButton from '../components/FileUploadButton';
import { useLanguage } from '../context/LanguageContext';
import '../styles/animations.css';

const RegisterPage: React.FC = () => {
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
  
  // Nouveaux états pour les champs spécifiques aux influenceurs
  const [socialMediaLinks, setSocialMediaLinks] = useState('');
  const [followerCount, setFollowerCount] = useState('');
  const [influenceCategory, setInfluenceCategory] = useState('');
  const [mainAudience, setMainAudience] = useState('');
  const [engagementRate, setEngagementRate] = useState('');
  const [mediaKit, setMediaKit] = useState<File | null>(null);
  const [influencerMessage, setInfluencerMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (!name.trim()) {
        throw new Error(t('nameRequired'));
      }

      if (!email.trim()) {
        throw new Error(t('emailRequired'));
      }

      // Pour les fournisseurs, sourceurs, et influenceurs, on ne valide pas le mot de passe car l'inscription sera manuelle
      if (role !== 'supplier' && role !== 'sourcer' && role !== 'influencer') {
        if (password.length < 6) {
          throw new Error(t('passwordMinLength'));
        }
        
        if (password !== confirmPassword) {
          throw new Error(t('passwordsDoNotMatch'));
        }
      }
      
      const { user, error: registerError } = await register(
        email.trim(), 
        (role === 'supplier' || role === 'sourcer' || role === 'influencer') ? 'temp-password' : password.trim(), // Mot de passe temporaire pour les fournisseurs, sourceurs et influenceurs
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
            // Pour les fournisseurs, on affiche un message de confirmation plutôt que de rediriger
            alert(t('supplier.registration.message'));
            navigate('/login');
            break;
          case 'sourcer':
          case 'influencer':
            // Pour les sourceurs et influenceurs, on affiche un message de confirmation plutôt que de rediriger
            alert(t('sourcer.registration.message'));
            navigate('/login');
            break;
          default:
            navigate('/dashboard');
        }
      }
    } catch (err: unknown) {
      console.error('Erreur d\'inscription:', err);
      setError(err instanceof Error ? err.message : t('registrationError'));
    } finally {
      setIsLoading(false);
    }

    if (role === 'influencer') {
      console.log('Media Kit:', mediaKit);
      console.log('Influencer Message:', influencerMessage);
      console.log('Social Media Links:', socialMediaLinks);
      console.log('Follower Count:', followerCount);
      console.log('Influence Category:', influenceCategory);
      console.log('Main Audience:', mainAudience);
      console.log('Engagement Rate:', engagementRate);
    }
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 pb-24 sm:px-6 lg:px-8 mb-16">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          {t('createAccount')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('registerDescription')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm rounded-md p-4">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              type="text"
              label={t('fullName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t('yourNamePlaceholder')}
              disabled={isLoading}
            />
            
            <Input
              type="email"
              label={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t('emailPlaceholder')}
              disabled={isLoading}
            />

            <Select
              label={t('accountType')}
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              options={[
                { value: 'customer', label: t('role.customer') },
                { value: 'supplier', label: t('role.supplier') },
                { value: 'influencer', label: t('role.influencer') } // Influenceur affiché mais pas sourceur
              ]}
              disabled={isLoading}
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                {role === 'customer' && t('role.customerTitle')}
                {role === 'supplier' && t('role.supplierTitle')}
                {role === 'sourcer' && t('role.sourcerTitle')}
                {role === 'influencer' && t('role.sourcerTitle')} {/* Utilise le même titre que sourceur */}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {role === 'customer' && t('role.customerDescription')}
                {role === 'supplier' && t('role.supplierDescription')}
                {role === 'sourcer' && t('role.sourcerDescription')}
                {role === 'influencer' && t('role.sourcerDescription')} {/* Utilise la même description que sourceur */}
              </p>
            </div>

            {/* Message personnalisé pour les fournisseurs avec animation */}
            {role === 'supplier' && (
              <div 
                className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-md p-4 supplier-message-enter supplier-message-pulse"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      {t('supplier.registration.title')}
                    </h3>
                    <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                      {t('supplier.registration.message')}
                    </p>
                    <p className="mt-1 text-xs text-orange-600 dark:text-orange-400">
                      {t('supplier.registration.validation')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Message personnalisé pour les sourceurs avec animation */}
            {role === 'sourcer' && (
              <div 
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md p-4 sourcer-message-enter"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {t('sourcer.registration.title')}
                    </h3>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                      {t('sourcer.registration.message')}
                    </p>
                    <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                      {t('sourcer.registration.validation')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Champs de mot de passe conditionnels */}
            {role !== 'supplier' && role !== 'sourcer' && role !== 'influencer' && (
              <div className="space-y-6 password-fields-enter"
                key="password-fields"
              >
                <Input
                  type="password"
                  label={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t('passwordPlaceholder')}
                  minLength={6}
                  disabled={isLoading}
                />
                
                <Input
                  type="password"
                  label={t('confirmPassword')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder={t('passwordPlaceholder')}
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Champs spécifiques pour les influenceurs/sourceurs */}
            {role === 'influencer' && (
              <div className="space-y-6 influencer-fields-enter">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {t('sourcer.registration.title')}
                    </h3>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                      {t('sourcer.registration.message')}
                    </p>
                    <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                      {t('sourcer.registration.validation')}
                    </p>
                  </div>
                </div>
                <Input
                  type="text"
                  label={t('socialMediaLinks')}
                  value={socialMediaLinks}
                  onChange={(e) => setSocialMediaLinks(e.target.value)}
                  placeholder={t('socialMediaLinksPlaceholder')}
                  disabled={isLoading}
                />

                <Input
                  type="number"
                  label={t('followerCount')}
                  value={followerCount}
                  onChange={(e) => setFollowerCount(e.target.value)}
                  placeholder={t('followerCountPlaceholder')}
                  disabled={isLoading}
                />

                <Select
                  label={t('category')}
                  value={influenceCategory}
                  onChange={(e) => setInfluenceCategory(e.target.value)}
                  options={[
                    { value: 'fashion', label: t('fashion') },
                    { value: 'tech', label: t('tech') },
                    { value: 'beauty', label: t('beauty') },
                    { value: 'sports', label: t('sports') },
                  ]}
                  disabled={isLoading}
                />

                <Input
                  type="text"
                  label={t('mainAudience')}
                  value={mainAudience}
                  onChange={(e) => setMainAudience(e.target.value)}
                  placeholder={t('mainAudiencePlaceholder')}
                  disabled={isLoading}
                />

                <Input
                  type="number"
                  label={t('engagementRate')}
                  value={engagementRate}
                  onChange={(e) => setEngagementRate(e.target.value)}
                  placeholder={t('engagementRatePlaceholder')}
                  disabled={isLoading}
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="shareStats"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    disabled={isLoading}
                  />
                  <label htmlFor="shareStats" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {t('shareStatsAgreement')}
                  </label>
                </div>

                <FileUploadButton 
                  id="mediaKit"
                  label={t('fileUpload.title')}
                  accept="application/pdf,image/*"
                  onChange={(file) => setMediaKit(file)}
                  disabled={isLoading}
                  className="mb-4"
                />

                <Input
                  type="textarea"
                  label={t('message')}
                  value={influencerMessage}
                  onChange={(e) => setInfluencerMessage(e.target.value)}
                  placeholder={t('messagePlaceholder')}
                  disabled={isLoading}
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="justify-center"
              disabled={isLoading}
            >
              {isLoading ? t('creatingAccount') : 
               role === 'supplier' ? t('supplier.registration.submitButton') : 
               role === 'sourcer' || role === 'influencer' ? t('sourcer.registration.submitButton') : t('createMyAccount')}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {t('hasAccountQuestion')}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                tabIndex={isLoading ? -1 : 0}
              >
                {t('loginButton')}
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('agreementPrefix')}{' '}
              <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                {t('termsOfUse')}
              </Link>{' '}
              {t('andOur')}{' '}
              <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
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

export default RegisterPage;