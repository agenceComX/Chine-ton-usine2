import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Heart, MessageSquare, Package, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { convertCurrency, formatPrice } from '../data/exchangeRates';
import { productsService } from '../services/productsService';
import Button from '../components/Button';
import { Product } from '../types';
import { getProductName } from '../utils/productUtils';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { user, updateUser } = useAuth();
  const { currency } = useCurrency();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSampleForm, setShowSampleForm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
  // Debug log
  // console.log("ProductPage: id from useParams", id); // Debug log
  // console.log("ProductPage: current product state", product); // Debug log

  const isFavorite = user?.favorites?.includes(id || '') || false;
  
  useEffect(() => {
    if (id) {
      const foundProduct = productsService.getProductById(id);
      setProduct(foundProduct || null);
      // console.log("ProductPage: foundProduct in useEffect", foundProduct); // Debug log
    }
  }, [id]);

  useEffect(() => {
    if (user && id && product && !user.browsingHistory.includes(id)) {
      const newHistory = [id, ...user.browsingHistory].slice(0, 10);
      updateUser({ browsingHistory: newHistory });
    }
  }, [user, id, product, updateUser]);
  
  if (!product) {
    // console.log("ProductPage: Product is null or undefined, displaying not found message."); // Debug log
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('notFoundTitle')}</h2>
          <Link to="/search" className="mt-4 inline-block text-blue-700 hover:underline">
            {t('backToSearch')}
          </Link>
        </div>
      </div>
    );
  }
  
  const toggleFavorite = () => {
    if (!user) return;
    
    const newFavorites = isFavorite
      ? user.favorites.filter(favId => favId !== id)
      : [...user.favorites, id || ''];
    
    updateUser({ favorites: newFavorites });
  };
  
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !message.trim()) return;
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      supplierId: product.id,
      supplierName: product.supplier.name,
      content: message,
      date: new Date().toISOString().split('T')[0],
    };
    
    updateUser({ messages: [...user.messages, newMessage] });
    setMessage('');
    setMessageSent(true);
    
    setTimeout(() => {
      setMessageSent(false);
      setShowContactForm(false);
    }, 3000);
  };

  const handleSubmitSampleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !message.trim()) return;
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      supplierId: product.id,
      supplierName: product.supplier.name,
      content: `[${t('sampleRequestPrefix')}] ${message}`,
      date: new Date().toISOString().split('T')[0],
    };
    
    updateUser({ messages: [...user.messages, newMessage] });
    setMessage('');
    setMessageSent(true);
    
    setTimeout(() => {
      setMessageSent(false);
      setShowSampleForm(false);
    }, 3000);
  };
  
  const getDescription = () => {
    if (language === 'fr' && product.description.french) {
      return product.description.french;
    } else if (product.description.english) {
      return product.description.english;
    }
    return product.description.chinese;
  };
  
  const priceCNY = product.price.cny;
  const priceConverted = convertCurrency(priceCNY, currency);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/search" className="inline-flex items-center text-blue-700 hover:underline">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('backToResults')}
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative pb-[75%] bg-gray-100">
                {showVideo && product.video ? (
                  <div className="absolute inset-0 w-full h-full">
                    {product.video.type === 'youtube' && (
                      <iframe
                        src={`${product.video.url}?autoplay=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    )}
                  </div>
                ) : (
                  <>
                    <img 
                      src={product.images[activeImage]} 
                      alt={getProductName(product, language)} 
                      className="absolute inset-0 w-full h-full object-contain p-4"
                    />
                    {product.video && (
                      <button
                        onClick={() => setShowVideo(true)}
                        className="absolute bottom-4 right-4 bg-blue-700 text-white p-2 rounded-full shadow-lg hover:bg-blue-800 transition-colors"
                      >
                        <Play className="h-6 w-6" />
                      </button>
                    )}
                    {product.certifiedCE && (
                      <span className="absolute top-4 right-4 bg-green-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                        CE
                      </span>
                    )}
                  </>
                )}
              </div>
              
              {product.images.length > 1 && (
                <div className="flex p-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveImage(index);
                        setShowVideo(false);
                      }}
                      className={`mr-2 rounded border-2 ${
                        index === activeImage && !showVideo ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${getProductName(product, language)} thumbnail ${index + 1}`} 
                        className="h-16 w-16 object-cover rounded"
                      />
                    </button>
                  ))}
                  {product.video && (
                    <button
                      onClick={() => {
                        setShowVideo(true);
                        setActiveImage(-1);
                      }}
                      className={`mr-2 rounded border-2 relative ${
                        showVideo ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={product.video.thumbnail} 
                        alt="Product video thumbnail" 
                        className="h-16 w-16 object-cover rounded"
                      />
                      <Play className="absolute inset-0 m-auto h-8 w-8 text-white opacity-90" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{getProductName(product, language)}</h1>
              <p className="text-lg text-gray-600 mb-4">{t('category')}: {product.category}</p>
              
              <div className="flex items-center mb-4">
                <p className="text-4xl font-extrabold text-blue-700 mr-4">
                  {formatPrice(priceConverted, currency)}
                </p>
                {product.pricePerUnit && (
                  <span className="text-gray-500 text-sm">/ {t('unit')}</span>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{t('description')}</h3>
                <p className="text-gray-700">{getDescription()}</p>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <Button 
                  variant="primary" 
                  onClick={() => setShowContactForm(true)} 
                  className="flex items-center"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  {t('contactSupplier')}
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowSampleForm(true)} 
                  className="flex items-center"
                >
                  <Package className="h-5 w-5 mr-2" />
                  {t('requestSample')}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={toggleFavorite} 
                  className="flex items-center" 
                >
                  <Heart 
                    className={`h-5 w-5 mr-2 ${
                      isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                  {isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
                </Button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{t('minOrderQuantity')}</h3>
                <p className="text-gray-700">{product.moq} {t('units')}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{t('supplier')}</h3>
                <p className="text-gray-700">{product.supplier.name}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{t('certifications')}</h3>
                <p className="text-gray-700">
                  {product.certifiedCE ? t('ceCertified') : t('notCeCertified')}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{t('specifications')}</h3>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 text-sm font-medium text-gray-500">{t('specs.brand')}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{product.specifications.brand}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-500">{t('specs.origin')}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{product.specifications.origin}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 text-sm font-medium text-gray-500">{t('specs.style')}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{product.specifications.style}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-500">{t('specs.modelNumber')}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{product.specifications.modelNumber}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-2 text-sm font-medium text-gray-500">{t('specs.application')}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{product.specifications.application}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm font-medium text-gray-500">{t('specs.material')}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{product.specifications.material}</td>
                    </tr>
                    {showAllSpecs && product.specifications.additionalSpecs && Object.entries(product.specifications.additionalSpecs).map(([key, value]) => (
                      <tr key={key} className="bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium text-gray-500">{key}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  onClick={() => setShowAllSpecs(!showAllSpecs)}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  {showAllSpecs ? t('hideSpecs') : t('showAllSpecs')}
                  {showAllSpecs ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showContactForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('contactSupplierTitle')}</h2>
            <p className="text-gray-600 mb-4">{t('contactSupplierDescription')}</p>
            <form onSubmit={handleSubmitMessage}>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={6}
                placeholder={t('yourMessagePlaceholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="secondary" onClick={() => setShowContactForm(false)}>
                  {t('cancelButton')}
                </Button>
                <Button type="submit" variant="primary">
                  {t('sendMessageButton')}
                </Button>
              </div>
              {messageSent && <p className="mt-2 text-green-600 text-sm">{t('messageSentConfirmation')}</p>}
            </form>
          </div>
        </div>
      )}

      {showSampleForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t('requestSampleTitle')}</h2>
            <p className="text-gray-600 mb-4">{t('requestSampleDescription')}</p>
            <form onSubmit={handleSubmitSampleRequest}>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={6}
                placeholder={t('yourSampleRequestMessagePlaceholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="secondary" onClick={() => setShowSampleForm(false)}>
                  {t('cancelButton')}
                </Button>
                <Button type="submit" variant="primary">
                  {t('sendRequestButton')}
                </Button>
              </div>
              {messageSent && <p className="mt-2 text-green-600 text-sm">{t('requestSentConfirmation')}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;