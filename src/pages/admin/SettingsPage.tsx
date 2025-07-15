import React, { useState } from 'react';
import { Settings, Save, Globe, Shield, Mail, Database, Bell, Key, Lock, AlertTriangle, Users, Server, Wifi, Activity } from 'lucide-react';
import Button from '../../components/Button';
import AdminLayout from '../../layouts/AdminLayout';

interface PlatformSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  defaultLanguage: string;
  defaultCurrency: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  commissionRate: number;
  minOrderAmount: number;
  // Nouveaux paramètres de sécurité
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSymbols: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  twoFactorRequired: boolean;
  ipWhitelistEnabled: boolean;
  allowedIPs: string[];
  sslRequired: boolean;
  securityAlertsEnabled: boolean;
  bruteForceProtection: boolean;
  captchaEnabled: boolean;
  adminSessionTimeout: number;
}

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  // Mock settings data
  const [settings, setSettings] = useState<PlatformSettings>({
    siteName: 'ChineTonUsine',
    siteDescription: 'Plateforme B2B pour le commerce avec la Chine',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    defaultLanguage: 'fr',
    defaultCurrency: 'EUR',
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    commissionRate: 5.0,
    minOrderAmount: 100,
    // Paramètres de sécurité par défaut
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSymbols: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorRequired: false,
    ipWhitelistEnabled: false,
    allowedIPs: ['192.168.1.0/24'],
    sslRequired: true,
    securityAlertsEnabled: true,
    bruteForceProtection: true,
    captchaEnabled: true,
    adminSessionTimeout: 60
  });

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Paramètres sauvegardés avec succès !');
    } catch (err: unknown) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof PlatformSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: <Settings size={16} /> },
    { id: 'security', label: 'Sécurité', icon: <Shield size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'localization', label: 'Localisation', icon: <Globe size={16} /> },
    { id: 'files', label: 'Fichiers', icon: <Database size={16} /> },
    { id: 'commerce', label: 'Commerce', icon: <Mail size={16} /> },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nom du site
        </label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => updateSetting('siteName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description du site
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => updateSetting('siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Mode maintenance</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Désactive l'accès public au site
          </p>
        </div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
            className="sr-only"
          />
          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
              }`} />
          </div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Inscriptions ouvertes</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Autoriser les nouvelles inscriptions
          </p>
        </div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.registrationEnabled}
            onChange={(e) => updateSetting('registrationEnabled', e.target.checked)}
            className="sr-only"
          />
          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.registrationEnabled ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
              }`} />
          </div>
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications email</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Envoyer des notifications par email
          </p>
        </div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
            className="sr-only"
          />
          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
          </div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications SMS</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Envoyer des notifications par SMS
          </p>
        </div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.smsNotifications}
            onChange={(e) => updateSetting('smsNotifications', e.target.checked)}
            className="sr-only"
          />
          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.smsNotifications ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
              }`} />
          </div>
        </label>
      </div>
    </div>
  );

  const renderLocalizationSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Langue par défaut
        </label>
        <select
          value={settings.defaultLanguage}
          onChange={(e) => updateSetting('defaultLanguage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="es">Español</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Devise par défaut
        </label>
        <select
          value={settings.defaultCurrency}
          onChange={(e) => updateSetting('defaultCurrency', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="EUR">Euro (€)</option>
          <option value="USD">US Dollar ($)</option>
          <option value="CNY">Yuan Chinois (¥)</option>
          <option value="GBP">Livre Sterling (£)</option>
        </select>
      </div>
    </div>
  );

  const renderFileSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Taille maximale des fichiers (MB)
        </label>
        <input
          type="number"
          value={settings.maxFileSize}
          onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value))}
          min="1"
          max="100"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Types de fichiers autorisés
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={settings.allowedFileTypes.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateSetting('allowedFileTypes', [...settings.allowedFileTypes, type]);
                  } else {
                    updateSetting('allowedFileTypes', settings.allowedFileTypes.filter(t => t !== type));
                  }
                }}
                className="mr-2 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{type.toUpperCase()}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCommerceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Taux de commission (%)
        </label>
        <input
          type="number"
          value={settings.commissionRate}
          onChange={(e) => updateSetting('commissionRate', parseFloat(e.target.value))}
          min="0"
          max="100"
          step="0.1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Montant minimum de commande (€)
        </label>
        <input
          type="number"
          value={settings.minOrderAmount}
          onChange={(e) => updateSetting('minOrderAmount', parseInt(e.target.value))}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-8">
      {/* Politiques de mots de passe */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <Key className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">Politiques de mots de passe</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Longueur minimale du mot de passe
            </label>
            <input
              type="number"
              value={settings.passwordMinLength}
              onChange={(e) => updateSetting('passwordMinLength', parseInt(e.target.value))}
              min="6"
              max="32"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">Recommandé: 8 caractères minimum</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Délai d'expiration de session (minutes)
            </label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
              min="5"
              max="480"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">0 = pas d'expiration automatique</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Majuscules requises</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Au moins une lettre majuscule</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.passwordRequireUppercase}
                onChange={(e) => updateSetting('passwordRequireUppercase', e.target.checked)}
                className="sr-only"
              />
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.passwordRequireUppercase ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.passwordRequireUppercase ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Chiffres requis</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Au moins un chiffre</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.passwordRequireNumbers}
                onChange={(e) => updateSetting('passwordRequireNumbers', e.target.checked)}
                className="sr-only"
              />
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.passwordRequireNumbers ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.passwordRequireNumbers ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Symboles requis</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Au moins un caractère spécial</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.passwordRequireSymbols}
                onChange={(e) => updateSetting('passwordRequireSymbols', e.target.checked)}
                className="sr-only"
              />
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.passwordRequireSymbols ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.passwordRequireSymbols ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">2FA obligatoire</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Authentification à deux facteurs</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorRequired}
                onChange={(e) => updateSetting('twoFactorRequired', e.target.checked)}
                className="sr-only"
              />
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.twoFactorRequired ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.twoFactorRequired ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Protection contre les attaques */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl border border-orange-200 dark:border-orange-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-200">Protection contre les attaques</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tentatives de connexion maximum
            </label>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
              min="3"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">Avant verrouillage du compte</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Durée de verrouillage (minutes)
            </label>
            <input
              type="number"
              value={settings.lockoutDuration}
              onChange={(e) => updateSetting('lockoutDuration', parseInt(e.target.value))}
              min="1"
              max="1440"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">Après échecs de connexion</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Protection force brute</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Détection automatique des attaques</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.bruteForceProtection}
                onChange={(e) => updateSetting('bruteForceProtection', e.target.checked)}
                className="sr-only"
              />
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.bruteForceProtection ? 'bg-orange-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.bruteForceProtection ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">CAPTCHA activé</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Après échecs de connexion</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.captchaEnabled}
                onChange={(e) => updateSetting('captchaEnabled', e.target.checked)}
                className="sr-only"
              />
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.captchaEnabled ? 'bg-orange-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.captchaEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Contrôle d'accès et surveillance */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">Contrôle d'accès et surveillance</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Liste blanche IP</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Restreindre l'accès à certaines IP</p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.ipWhitelistEnabled}
                onChange={(e) => updateSetting('ipWhitelistEnabled', e.target.checked)}
                className="sr-only"
              />
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.ipWhitelistEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.ipWhitelistEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </div>
            </label>
          </div>

          {settings.ipWhitelistEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresses IP autorisées (une par ligne)
              </label>
              <textarea
                value={settings.allowedIPs.join('\n')}
                onChange={(e) => updateSetting('allowedIPs', e.target.value.split('\n').filter(ip => ip.trim()))}
                rows={4}
                placeholder="192.168.1.0/24&#10;10.0.0.0/8&#10;172.16.0.0/12"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Formats supportés: IP unique (192.168.1.1) ou plage CIDR (192.168.1.0/24)</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">SSL/HTTPS requis</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Forcer les connexions sécurisées</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.sslRequired}
                  onChange={(e) => updateSetting('sslRequired', e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.sslRequired ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.sslRequired ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Alertes de sécurité</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Notifications en temps réel</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.securityAlertsEnabled}
                  onChange={(e) => updateSetting('securityAlertsEnabled', e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.securityAlertsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.securityAlertsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions administrateur */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200">Sessions administrateur</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Délai d'expiration admin (minutes)
            </label>
            <input
              type="number"
              value={settings.adminSessionTimeout}
              onChange={(e) => updateSetting('adminSessionTimeout', parseInt(e.target.value))}
              min="15"
              max="480"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">Sessions plus courtes pour les comptes administrateur (recommandé: 60 minutes)</p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Recommandations de sécurité</h4>
            </div>
            <ul className="mt-2 text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Activez la 2FA pour tous les comptes administrateur</li>
              <li>• Utilisez des mots de passe complexes avec symboles</li>
              <li>• Limitez les tentatives de connexion à 3-5 maximum</li>
              <li>• Activez la liste blanche IP pour l'accès admin</li>
              <li>• Surveillez régulièrement les alertes de sécurité</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Statistiques de sécurité en temps réel */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statistiques de sécurité (dernières 24h)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">Tentatives bloquées</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">23</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">IP suspectes</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">7</p>
              </div>
              <Wifi className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Sessions actives</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">156</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Connexions sécurisées</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">99.2%</p>
              </div>
              <Lock className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'localization':
        return renderLocalizationSettings();
      case 'files':
        return renderFileSettings();
      case 'commerce':
        return renderCommerceSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Paramètres de la Plateforme
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configurez les paramètres généraux de la plateforme
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save size={16} />
            )}
            Sauvegarder
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${activeTab === tab.id
                      ? 'border-red-500 text-red-600 dark:text-red-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {renderContent()}
          </div>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
