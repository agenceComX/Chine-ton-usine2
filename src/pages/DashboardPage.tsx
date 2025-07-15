import React, { useState } from 'react';
import { MessageSquare, Clock, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getProductById } from '../data/products';
import { subscriptions } from '../data/subscriptions';
import ProductCard from '../components/ProductCard';
import SubscriptionCard from '../components/SubscriptionCard';
import { Link } from 'react-router-dom';
import { Product, Message } from '../types';
import { getProductName } from '../utils/productUtils';

const DashboardPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('favorites');
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('auth.loginRequiredTitle')}</h2>
          <Link to="/login" className="mt-4 inline-block text-blue-700 hover:underline">
            {t('auth.loginButton')}
          </Link>
        </div>
      </div>
    );
  }
  
  const getFavoriteProducts = () => {
    return user.favorites
      .map((id: string) => getProductById(id))
      .filter((product: Product | undefined) => product !== undefined) as Product[];
  };
  
  const getHistoryProducts = () => {
    return user.browsingHistory
      .map((id: string) => getProductById(id))
      .filter((product: Product | undefined) => product !== undefined) as Product[];
  };
  
  const handleUpgradeSubscription = (subscriptionId: string) => {
    updateUser({ subscription: subscriptionId as 'free' | 'premium' });
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'favorites': {
        const favoriteProducts = getFavoriteProducts();
        return (
          <div className="mt-6">
            {favoriteProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteProducts.map((product: Product) => (
                  <ProductCard key={product!.id} product={product!} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Heart className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  {t('dashboard.noFavorites')}
                </p>
                <Link
                  to="/search"
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
                >
                  {t('dashboard.browseProducts')}
                </Link>
              </div>
            )}
          </div>
        );
      }
        
      case 'messages':
        return (
          <div className="mt-6">
            {user.messages.length > 0 ? (
              <div className="space-y-4">
                {user.messages.map((message: Message) => {
                  const product = getProductById(message.supplierId);
                  return (
                    <div key={message.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{message.supplierName}</h3>
                        <span className="text-sm text-gray-500">{message.date}</span>
                      </div>
                      {product && (
                        <Link to={`/product/${product.id}`} className="text-sm text-blue-700 hover:underline">
                          {getProductName(product, language)}
                        </Link>
                      )}
                      <p className="mt-2 text-gray-600">{message.content}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  {t('dashboard.noMessages')}
                </p>
                <Link
                  to="/search"
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
                >
                  {t('dashboard.contactSupplier')}
                </Link>
              </div>
            )}
          </div>
        );
        
      case 'history': {
        const historyProducts = getHistoryProducts();
        return (
          <div className="mt-6">
            {historyProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {historyProducts.map((product: Product) => (
                  <ProductCard key={product!.id} product={product!} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  {t('dashboard.noHistory')}
                </p>
                <Link
                  to="/search"
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
                >
                  {t('dashboard.browseProducts')}
                </Link>
              </div>
            )}
          </div>
        );
      }
        
      case 'subscription':
        return (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
              {t('subscription.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptions.map(subscription => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  isCurrentPlan={user.subscription === subscription.id}
                  onSelectPlan={handleUpgradeSubscription}
                />
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {t('dashboard.title')}
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3">
              <span className="text-blue-800 font-bold text-xl">
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.email}</h2>
              <p className="text-sm text-gray-500">
                {t('dashboard.subscription')}: {user.subscription === 'premium' ? t('subscription.premium') : t('subscription.free')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('favorites')}
                className={`${
                  activeTab === 'favorites'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-1 text-center`}
              >
                {t('dashboard.favorites')}
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`${
                  activeTab === 'messages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-1 text-center`}
              >
                {t('dashboard.messages')}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-1 text-center`}
              >
                {t('dashboard.history')}
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`${
                  activeTab === 'subscription'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-1 text-center`}
              >
                {t('dashboard.subscription')}
              </button>
            </nav>
          </div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;