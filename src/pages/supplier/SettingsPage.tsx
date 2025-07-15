import React, { useState } from 'react';
import SupplierLayout from '../../layouts/SupplierLayout';
import BackButton from '../../components/BackButton';
import { useLanguage } from '../../context/LanguageContext';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Building,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import Button from '../../components/Button';

interface SupplierSettings {
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    website: string;
    description: string;
  };
  profile: {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    position: string;
  };
  notifications: {
    emailOrders: boolean;
    emailMessages: boolean;
    emailReviews: boolean;
    emailMarketing: boolean;
    pushOrders: boolean;
    pushMessages: boolean;
    pushReviews: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    passwordExpiry: number;
    sessionTimeout: number;
  };
  billing: {
    companyName: string;
    taxId: string;
    billingEmail: string;
    paymentMethod: string;
  };
}

const initialSettings: SupplierSettings = {
  company: {
    name: 'TechSupply Pro',
    email: 'contact@techsupplypro.com',
    phone: '+33 1 23 45 67 89',
    address: '123 Avenue des Entreprises',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
    website: 'www.techsupplypro.com',
    description: 'Fournisseur spécialisé dans les équipements technologiques et électroniques de haute qualité.'
  },
  profile: {
    contactName: 'Jean Dupont',
    contactEmail: 'jean.dupont@techsupplypro.com',
    contactPhone: '+33 6 12 34 56 78',
    position: 'Responsable Commercial'
  },
  notifications: {
    emailOrders: true,
    emailMessages: true,
    emailReviews: true,
    emailMarketing: false,
    pushOrders: true,
    pushMessages: true,
    pushReviews: false
  },
  security: {
    twoFactorAuth: true,
    passwordExpiry: 90,
    sessionTimeout: 30
  },
  billing: {
    companyName: 'TechSupply Pro SARL',
    taxId: 'FR12345678901',
    billingEmail: 'facturation@techsupplypro.com',
    paymentMethod: 'Virement bancaire'
  }
};

const SettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<SupplierSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState('company');
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (section: keyof SupplierSettings, field: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Simulation de la sauvegarde
    console.log('Settings saved:', settings);
    setHasChanges(false);
    // Afficher un toast de succès
  };

  const tabs = [
    { id: 'company', label: 'Entreprise', icon: Building },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'billing', label: 'Facturation', icon: CreditCard }
  ];

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Informations de l'entreprise</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              value={settings.company.name}
              onChange={(e) => handleInputChange('company', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={settings.company.email}
              onChange={(e) => handleInputChange('company', 'email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={settings.company.phone}
              onChange={(e) => handleInputChange('company', 'phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site web
            </label>
            <input
              type="url"
              value={settings.company.website}
              onChange={(e) => handleInputChange('company', 'website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adresse
            </label>
            <input
              type="text"
              value={settings.company.address}
              onChange={(e) => handleInputChange('company', 'address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ville
            </label>
            <input
              type="text"
              value={settings.company.city}
              onChange={(e) => handleInputChange('company', 'city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Code postal
            </label>
            <input
              type="text"
              value={settings.company.postalCode}
              onChange={(e) => handleInputChange('company', 'postalCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={settings.company.description}
              onChange={(e) => handleInputChange('company', 'description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notifications par email</h3>
        <div className="space-y-4">
          {[
            { key: 'emailOrders', label: 'Nouvelles commandes', description: 'Recevoir un email pour chaque nouvelle commande' },
            { key: 'emailMessages', label: 'Nouveaux messages', description: 'Recevoir un email pour chaque nouveau message' },
            { key: 'emailReviews', label: 'Nouveaux avis', description: 'Recevoir un email pour chaque nouvel avis' },
            { key: 'emailMarketing', label: 'Marketing', description: 'Recevoir les newsletters et offres promotionnelles' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                  onChange={(e) => handleInputChange('notifications', item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notifications push</h3>
        <div className="space-y-4">
          {[
            { key: 'pushOrders', label: 'Nouvelles commandes', description: 'Recevoir une notification push pour chaque nouvelle commande' },
            { key: 'pushMessages', label: 'Nouveaux messages', description: 'Recevoir une notification push pour chaque nouveau message' },
            { key: 'pushReviews', label: 'Nouveaux avis', description: 'Recevoir une notification push pour chaque nouvel avis' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                  onChange={(e) => handleInputChange('notifications', item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sécurité du compte</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Authentification à deux facteurs</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ajouter une couche de sécurité supplémentaire</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="font-medium text-gray-900 dark:text-white mb-2">{t('supplier.settings.changePassword')}</p>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mot de passe actuel"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              />
              <input
                type="password"
                placeholder="Confirmer le nouveau mot de passe"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
              />
              <Button size="sm">{t('supplier.settings.changePassword')}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return renderCompanySettings();
      case 'profile':
        return renderCompanySettings(); // Simplifié pour l'exemple
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'billing':
        return renderCompanySettings(); // Simplifié pour l'exemple
      default:
        return renderCompanySettings();
    }
  };

  return (
    <SupplierLayout>      <div className="space-y-6">
        {/* Bouton retour */}
        <BackButton to="/supplier/dashboard" label="Retour au tableau de bord" variant="ghost" />

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configurez votre compte et vos préférences
            </p>
          </div>
          {hasChanges && (
            <Button onClick={handleSave} className="mt-4 sm:mt-0">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les modifications
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation des onglets */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-l-4 border-blue-500'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenu de l'onglet */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </SupplierLayout>
  );
};

export default SettingsPage;
