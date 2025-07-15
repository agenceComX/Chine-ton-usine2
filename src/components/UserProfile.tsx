import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, ShieldCheck, Globe, Package, Heart, Edit3, Save, X, Camera, Eye, EyeOff, Smartphone, Mail, Phone, MapPin, Clock, ChevronRight, Bell, KeyRound, CheckCircle, Shield, Download, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getProductById } from '../data/products';
import ProductCard from './ProductCard';
import { storage } from '../lib/firebaseClient';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../styles/profile-animations.css';

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const Section = ({ icon, title, children, collapsible = false, defaultExpanded = true }: SectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div
        className={`flex items-center justify-between p-4 ${collapsible ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''} transition-colors duration-200`}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white mr-3">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
        </div>
        {collapsible && (
          <div className="text-gray-400 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            <ChevronRight size={20} />
          </div>
        )}
      </div>
      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

const UserProfile: React.FC = () => {
  const { user: baseUser, loading, updateUser } = useAuth();
  const { t } = useLanguage();
  const [tab, setTab] = useState('infos');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  // Cast pour accéder aux propriétés étendues non typées
  const user = baseUser as Record<string, any>;

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  // Animation notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
  };

  // Fonctions pour la gestion du profil
  const handleClickChangePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', t('userProfile.fileTooLarge'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      showNotification('error', t('userProfile.invalidFileType'));
      return;
    }

    try {
      setUploadStatus('uploading');

      // Créer un aperçu local
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload vers Firebase Storage
      const storageRef = ref(storage, `avatars/${user.id}-${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Mettre à jour le profil utilisateur (cast pour éviter l'erreur de type)
      await updateUser({ ...user, avatar: downloadURL } as any);

      setUploadStatus('success');
      showNotification('success', t('userProfile.photoUploadSuccess'));
    } catch (error) {
      console.error('Erreur upload:', error);
      setUploadStatus('error');
      showNotification('error', t('userProfile.photoUploadError'));
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateUser(editedUser);
      setIsEditing(false);
      showNotification('success', t('userProfile.profileUpdateSuccess'));
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      showNotification('error', t('userProfile.profileUpdateError'));
    }
  };

  const handleCancelEdit = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  // Fonctions utilitaires pour la validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const getFieldValidationClass = (field: string, value: string): string => {
    if (!isEditing || !value) return '';

    let isValid = true;
    switch (field) {
      case 'email':
        isValid = validateEmail(value);
        break;
      case 'phone':
        isValid = validatePhone(value);
        break;
      case 'name':
        isValid = value.trim().length >= 2;
        break;
      default:
        return '';
    }

    return isValid
      ? 'ring-2 ring-green-500 border-green-500'
      : 'ring-2 ring-red-500 border-red-500';
  };

  const getValidationIcon = (field: string, value: string) => {
    if (!isEditing || !value) return null;

    let isValid = true;
    switch (field) {
      case 'email':
        isValid = validateEmail(value);
        break;
      case 'phone':
        isValid = validatePhone(value);
        break;
      case 'name':
        isValid = value.trim().length >= 2;
        break;
      default:
        return null;
    }

    return isValid
      ? <CheckCircle size={16} className="text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
      : <X size={16} className="text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />;
  };

  // Données fictives pour illustration
  const fakeOrders = [
    { id: 'cmd-001', status: 'Livré', total: 1200, date: '2024-06-01' },
    { id: 'cmd-002', status: 'En cours', total: 850, date: '2024-06-10' },
  ];
  const fakeMessages = [
    { id: 'msg-001', from: 'Fournisseur A', content: 'Votre commande a été expédiée.', date: '2024-06-02' },
    { id: 'msg-002', from: 'Sourcer B', content: 'Avez-vous reçu le devis ?', date: '2024-06-11' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-300 animate-pulse">{t('userProfile.loading')}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="text-gray-600 dark:text-gray-300">
            {t('userProfile.mustBeLoggedIn')}
          </div>
        </div>
      </div>
    );
  }
  // Avatar fallback avec vérification de type
  const avatar = preview || user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      {/* Notification Toast améliorée */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 border-l-4 backdrop-blur-sm ${notification.type === 'success'
          ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-500 shadow-green-500/20' :
          notification.type === 'error'
            ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-500 shadow-red-500/20' :
            'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-500 shadow-blue-500/20'
          } animate-slide-in-right max-w-sm`}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {notification.type === 'error' && <X className="w-5 h-5 text-red-500" />}
              {notification.type === 'info' && <Bell className="w-5 h-5 text-blue-500" />}
            </div>
            <div className="font-medium text-sm">{notification.message}</div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec avatar amélioré */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 h-32 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12">
              {/* Avatar avec bouton de changement */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={avatar}
                    alt="avatar"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {uploadStatus === 'uploading' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleClickChangePhoto}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
                >
                  <Camera size={16} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </div>

              {/* Informations utilisateur */}
              <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {user.name}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <User size={14} className="mr-1" />
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                      <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Globe className="w-4 h-4 mr-1" />
                        {user.language || 'Français'}
                      </span>
                      <span className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 mr-1" />
                        {user.country || 'France'}
                      </span>
                    </div>
                  </div>

                  {/* Bouton d'édition */}
                  <div className="hidden sm:flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                        >
                          <Save size={16} className="mr-2" />
                          {t('userProfile.saveChanges')}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                        >
                          <X size={16} className="mr-2" />
                          {t('userProfile.cancelEdit')}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                      >
                        <Edit3 size={16} className="mr-2" />
                        {t('userProfile.editProfile')}
                      </button>
                    )}
                  </div>
                </div>

                {/* Stats rapides */}
                <div className="flex justify-center sm:justify-start gap-6 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {user.favorites?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">{t('userProfile.favoriteProducts')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {fakeOrders.length}
                    </div>
                    <div className="text-sm text-gray-500">{t('userProfile.recentOrders')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {fakeMessages.length}
                    </div>
                    <div className="text-sm text-gray-500">Messages</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs avec animations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden">
          <div className="flex">
            {[
              { id: 'infos', label: t('userProfile.personalInfo'), icon: <User size={18} /> },
              { id: 'settings', label: t('userProfile.preferences'), icon: <Settings size={18} /> },
              { id: 'security', label: t('userProfile.security'), icon: <ShieldCheck size={18} /> }
            ].map((tabItem) => (
              <button
                key={tabItem.id}
                onClick={() => setTab(tabItem.id)}
                className={`flex-1 flex items-center justify-center px-6 py-4 font-medium transition-all duration-300 relative overflow-hidden ${tab === tabItem.id
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
              >
                <div className="flex items-center gap-2 relative z-10">
                  {tabItem.icon}
                  <span className="hidden sm:inline">{tabItem.label}</span>
                </div>
                {tab === tabItem.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform transition-transform duration-300 animate-slide-in-bottom"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des tabs avec animations */}
        <div className="space-y-6">
          {tab === 'infos' && (
            <div className="animate-fade-in">
              {/* Informations personnelles avec édition inline */}
              <Section icon={<User className="w-5 h-5" />} title={t('userProfile.personalInfo')}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: t('userProfile.name'), key: 'name', type: 'text', icon: <User size={16} />, required: true },
                    { label: t('userProfile.email'), key: 'email', type: 'email', icon: <Mail size={16} />, required: true },
                    { label: t('userProfile.phone'), key: 'phone', type: 'tel', icon: <Phone size={16} /> },
                    { label: t('userProfile.country'), key: 'country', type: 'text', icon: <MapPin size={16} /> },
                    { label: t('userProfile.city'), key: 'city', type: 'text', icon: <MapPin size={16} /> },
                    { label: t('userProfile.postalCode'), key: 'zipCode', type: 'text', icon: <MapPin size={16} /> }
                  ].map((field) => (
                    <div key={field.key} className="group stagger-item hover-lift">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="text-blue-500">{field.icon}</div>
                          {field.label}
                          {field.required && <span className="text-red-500">*</span>}
                        </div>
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            type={field.type}
                            value={editedUser[field.key] || ''}
                            onChange={(e) => setEditedUser({ ...editedUser, [field.key]: e.target.value })}
                            className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover-glow ${getFieldValidationClass(field.key, editedUser[field.key])}`}
                            placeholder={`${t('form.required')} ${field.label.toLowerCase()}`}
                            required={field.required}
                          />
                          {getValidationIcon(field.key, editedUser[field.key])}
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200">
                            {user[field.key] || '—'}
                          </div>
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Boutons d'édition mobiles */}
                <div className="flex sm:hidden justify-center gap-3 mt-6">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 hover-lift"
                      >
                        <Save size={16} className="mr-2" />
                        {t('userProfile.saveChanges')}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 hover-lift"
                      >
                        <X size={16} className="mr-2" />
                        {t('userProfile.cancelEdit')}
                      </button>
                    </>
                  ) : (<button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover-lift"
                  >
                    <Edit3 size={16} className="mr-2" />
                    {t('userProfile.editProfile')}
                  </button>
                  )}
                </div>
              </Section>

              {/* Statistiques du profil */}
              <Section icon={<Package className="w-5 h-5" />} title={t('userProfile.accountStats')}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: t('userProfile.totalOrders'), value: fakeOrders.length, color: 'from-blue-500 to-blue-600', icon: <Package size={20} /> },
                    { label: t('userProfile.favoriteProducts'), value: user.favorites?.length || 0, color: 'from-red-500 to-pink-600', icon: <Heart size={20} /> },
                    { label: 'Messages', value: fakeMessages.length, color: 'from-green-500 to-emerald-600', icon: <Mail size={20} /> },
                    { label: 'Connexions', value: '24', color: 'from-purple-500 to-indigo-600', icon: <Clock size={20} /> }
                  ].map((stat, index) => (
                    <div key={stat.label} className="stagger-item interactive-card bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-3 animate-float`} style={{ animationDelay: `${index * 0.2}s` }}>
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </div>
                      <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${stat.color} rounded-full animate-shimmer`} style={{ width: `${Math.min(stat.value * 10, 100)}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Favoris avec animations améliorées */}
              <Section icon={<Heart className="w-5 h-5" />} title="Produits favoris" collapsible={true}>
                {user.favorites?.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="animate-bounce-gentle">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    </div>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">Aucun produit favori</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Explorez notre catalogue et ajoutez vos produits préférés !
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.favorites?.slice(0, 6).map((id: string, index: number) => {
                      const product = getProductById(id);
                      return product ? (
                        <div key={id} className="stagger-item hover-lift" style={{ animationDelay: `${index * 100}ms` }}>
                          <ProductCard product={product} />
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </Section>

              {/* Messages récents améliorés */}
              <Section icon={<Mail className="w-5 h-5" />} title="Messages récents" collapsible={true}>
                {fakeMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="animate-pulse-soft">
                      <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    </div>
                    <p className="text-lg text-gray-500 dark:text-gray-400">Aucun message</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fakeMessages.map((msg, index) => (
                      <div
                        key={msg.id}
                        className="stagger-item interactive-card p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {msg.from.charAt(0)}
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">{msg.from}</span>
                              <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Clock size={12} />
                                {msg.date}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                            Nouveau
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{msg.content}</p>
                        <div className="flex gap-2 mt-3">
                          <button className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
                            Répondre
                          </button>
                          <button className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
                            Marquer lu
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              {/* Activité récente améliorée */}
              <Section icon={<Clock className="w-5 h-5" />} title="Activité récente" collapsible={true} defaultExpanded={false}>
                <div className="space-y-3">
                  {[
                    { action: 'Connexion réussie', time: '2 heures', icon: <User size={16} />, color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' },
                    { action: 'Commande #CMD-001 passée', time: '1 jour', icon: <Package size={16} />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' },
                    { action: 'Profil mis à jour', time: '3 jours', icon: <Edit3 size={16} />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400' },
                    { action: 'Nouveau message reçu', time: '5 jours', icon: <Mail size={16} />, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400' },
                  ].map((activity, index) => (
                    <div key={index} className="stagger-item flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover-lift">
                      <div className={`p-2 rounded-full ${activity.color}`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Clock size={10} />
                          Il y a {activity.time}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-soft"></div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {tab === 'settings' && (
            <div className="animate-fade-in">
              {/* Préférences linguistiques et régionales */}
              <Section icon={<Globe className="w-5 h-5" />} title="Préférences linguistiques et régionales">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <Globe size={16} className="text-blue-500" />
                        Langue préférée
                      </div>
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover-glow">
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="zh">中文</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-green-500" />
                        Devise préférée
                      </div>
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 hover-glow">
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollar US ($)</option>
                      <option value="CNY">Yuan chinois (¥)</option>
                      <option value="GBP">Livre sterling (£)</option>
                    </select>
                  </div>
                </div>
              </Section>

              {/* Notifications améliorées */}
              <Section icon={<Bell className="w-5 h-5" />} title="Préférences de notification">
                <div className="space-y-4">
                  {[
                    {
                      id: 'email-orders',
                      title: 'Nouvelles commandes',
                      description: 'Recevoir un email pour chaque nouvelle commande',
                      enabled: true
                    },
                    {
                      id: 'email-messages',
                      title: 'Nouveaux messages',
                      description: 'Notifications pour les messages de fournisseurs',
                      enabled: true
                    },
                    {
                      id: 'email-marketing',
                      title: 'Actualités et promotions',
                      description: 'Recevoir les dernières nouvelles et offres',
                      enabled: false
                    },
                    {
                      id: 'push-mobile',
                      title: 'Notifications mobiles',
                      description: 'Notifications push sur l\'application mobile',
                      enabled: true
                    }
                  ].map((notif) => (
                    <div key={notif.id} className="interactive-card flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{notif.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{notif.description}</p>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => showNotification('info', `Notification ${notif.title} ${notif.enabled ? 'désactivée' : 'activée'}`)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${notif.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notif.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {tab === 'security' && (
            <div className="animate-fade-in space-y-6">
              {/* Changement de mot de passe avec validation */}
              <Section icon={<KeyRound className="w-5 h-5" />} title="Changer le mot de passe">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="stagger-item">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <KeyRound size={16} className="text-gray-500" />
                          Mot de passe actuel
                        </div>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white hover-glow transition-all duration-200"
                          placeholder="Entrez votre mot de passe actuel"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="stagger-item">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <KeyRound size={16} className="text-blue-500" />
                          Nouveau mot de passe
                        </div>
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white hover-glow transition-all duration-200"
                        placeholder="Entrez un nouveau mot de passe"
                      />
                      {/* Indicateur de force du mot de passe */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Force du mot de passe</span>
                          <span>Moyen</span>
                        </div>
                        <div className="progress-bar h-2">
                          <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 space-y-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle size={12} className="text-green-500" />
                            <span>Au moins 8 caractères</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <X size={12} className="text-red-500" />
                            <span>Contient au moins une majuscule</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle size={12} className="text-green-500" />
                            <span>Contient au moins un chiffre</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="stagger-item">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          Confirmer le nouveau mot de passe
                        </div>
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white hover-glow transition-all duration-200"
                        placeholder="Confirmez votre nouveau mot de passe"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => showNotification('success', 'Mot de passe mis à jour avec succès !')}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 hover-lift"
                    >
                      <KeyRound size={16} />
                      Mettre à jour le mot de passe
                    </button>
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200">
                      <Eye size={16} />
                      Générer un mot de passe
                    </button>
                  </div>
                </div>
              </Section>

              {/* Authentification à deux facteurs améliorée */}
              <Section icon={<Smartphone className="w-5 h-5" />} title="Authentification à deux facteurs (2FA)">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500 rounded-full">
                        <CheckCircle size={24} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800 dark:text-green-200">2FA activée</h4>
                        <p className="text-sm text-green-600 dark:text-green-300">
                          Votre compte est protégé par l'authentification à deux facteurs
                        </p>
                        <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                          Activée le 15 juin 2024
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle size={14} className="mr-1" />
                        Sécurisé
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="interactive-card p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Smartphone size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Application mobile</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Google Authenticator</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Configurée</span>
                        <button className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors">
                          Reconfigurer
                        </button>
                      </div>
                    </div>

                    <div className="interactive-card p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                          <Mail size={16} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Codes de secours</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">8 codes disponibles</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Prêts</span>
                        <button className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full transition-colors">
                          Voir les codes
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => showNotification('error', '2FA désactivée. Votre compte est moins sécurisé.')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm"
                    >
                      <X size={16} />
                      Désactiver 2FA
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 text-sm">
                      <Settings size={16} />
                      Paramètres avancés
                    </button>
                  </div>
                </div>
              </Section>

              {/* Section de sécurité avancée - Nouvelles fonctionnalités */}
              <Section icon={<Shield className="w-5 h-5" />} title="Sécurité du compte">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Score de sécurité */}
                  <div className="interactive-card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-200">Score de sécurité</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-16 relative">
                          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="2"
                            />
                            <path
                              d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2"
                              strokeDasharray="85, 100"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">85%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Très bon</span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">85/100</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Votre compte est bien sécurisé. Activez les alertes email pour améliorer davantage.
                      </div>
                    </div>
                  </div>

                  {/* Alertes de sécurité */}
                  <div className="interactive-card p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Bell size={18} className="text-orange-500" />
                      Alertes de sécurité
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Connexions suspectes</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Alertes par email</p>
                        </div>
                        <button
                          onClick={() => showNotification('success', 'Alertes de connexion activées')}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Changements de profil</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Modifications importantes</p>
                        </div>
                        <button
                          onClick={() => showNotification('info', 'Alertes de profil désactivées')}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Nouvelles sessions</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Connexions depuis nouveaux appareils</p>
                        </div>
                        <button
                          onClick={() => showNotification('success', 'Alertes de session activées')}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Gestion des données personnelles */}
              <Section icon={<User className="w-5 h-5" />} title="Données personnelles et confidentialité">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="interactive-card p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-3">
                        <Download size={20} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Exporter mes données</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Téléchargez toutes vos données personnelles
                      </p>
                      <button
                        onClick={() => showNotification('info', 'Export des données en cours... Vous recevrez un email.')}
                        className="w-full px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg text-sm transition-colors"
                      >
                        Demander l'export
                      </button>
                    </div>

                    <div className="interactive-card p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full w-fit mx-auto mb-3">
                        <Eye size={20} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Données collectées</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Voir quelles données nous stockons
                      </p>
                      <button
                        onClick={() => showNotification('info', 'Ouverture de la page des données collectées')}
                        className="w-full px-3 py-2 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800 text-orange-700 dark:text-orange-300 rounded-lg text-sm transition-colors"
                      >
                        Voir les détails
                      </button>
                    </div>

                    <div className="interactive-card p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                      <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full w-fit mx-auto mb-3">
                        <Trash2 size={20} className="text-red-600 dark:text-red-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Supprimer le compte</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Suppression définitive de toutes les données
                      </p>
                      <button
                        onClick={() => showNotification('error', 'Action sensible ! Contactez le support pour cette demande.')}
                        className="w-full px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm transition-colors"
                      >
                        Demander la suppression
                      </button>
                    </div>
                  </div>

                  {/* Paramètres de confidentialité */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Settings size={18} />
                      Paramètres de confidentialité
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Profil public</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Votre profil est visible par les autres utilisateurs</p>
                        </div>
                        <button
                          onClick={() => showNotification('info', 'Visibilité du profil modifiée')}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Statistiques d'utilisation</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Partager les données d'usage pour améliorer le service</p>
                        </div>
                        <button
                          onClick={() => showNotification('success', 'Partage des statistiques activé')}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Communications marketing</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Recevoir des emails promotionnels et newsletters</p>
                        </div>
                        <button
                          onClick={() => showNotification('info', 'Communications marketing désactivées')}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;