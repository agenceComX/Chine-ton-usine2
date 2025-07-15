import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Search, Filter, Eye, Star } from 'lucide-react';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import Input from '../../components/Input';
import ProductModal from '../../components/ProductModal';
import { useToastContext } from '../../context/useToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { products } from '../../data/products';
import { Product } from '../../types';
import { productsService } from '../../services/productsService';

const STORAGE_KEY = 'supplier_products_list';

const SupplierProductsPage: React.FC = () => {
  const { t } = useLanguage();
  
  // Charger les produits depuis localStorage ou utiliser les données par défaut
  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedProducts = JSON.parse(saved);
        // Vérifier que les données sont valides
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          return parsedProducts;
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
    return products;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { success, error } = useToastContext();

  // Sauvegarder automatiquement dans localStorage ET synchroniser avec le service global
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(productsList));
      // Synchroniser avec le service global pour que les produits apparaissent dans la recherche
      productsService.syncSupplierProducts(productsList);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des produits:', error);
    }
  }, [productsList]);

  // Filtrage des produits
  const filteredProducts = productsList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));
  
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleSaveProduct = (productData: any) => {
    try {
      if (editingProduct) {
        // Modifier le produit existant
        setProductsList(prev => prev.map(p => 
          p.id === editingProduct.id 
            ? { 
                ...p, 
                name: productData.name, 
                category: productData.category,
                images: productData.images || p.images,
                description: {
                  ...p.description,
                  fr: productData.description || (p.description as { fr?: string }).fr || ''
                }
              }
            : p
        ));
        success(`${t('supplier.products.success.updated')} "${productData.name}"`);
      } else {
        // Créer un produit simple pour la démonstration
        const newProduct: Product = {
          ...products[0], // Copier toute la structure existante
          id: `prod_${Date.now()}`,
          name: productData.name,
          category: productData.category,
          description: {
            ...(products[0].description as { fr?: string }),
            fr: productData.description || `Description de ${productData.name}`
          },
          images: productData.images && productData.images.length > 0 
            ? productData.images 
            : ['/api/placeholder/100/100'],
          moq: productData.minOrder || 1,
          price: {
            cny: productData.price || 0,
            unitCny: productData.price || 0
          },
          specifications: {
            ...(products[0].specifications || {}),
            brand: productData.brand || 'Marque inconnue',
            origin: productData.origin || 'Origine inconnue',
            material: productData.material || 'Matériau non spécifié',
            modelNumber: productData.modelNumber || productData.sku || ''
          }
        };
        
        setProductsList(prev => [newProduct, ...prev]);
        success(`${t('supplier.products.success.added')} "${productData.name}"`);
      }
      
      setShowAddModal(false);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      error(t('supplier.products.error.save'));
    }
  };

  const handleDeleteProduct = (productId: string) => {    if (confirm(t('supplier.products.confirm.delete'))) {
      setProductsList(prev => prev.filter(p => p.id !== productId));
      success(t('supplier.products.success.deleted'));
    }
  };

  const handleResetToDefault = () => {    if (confirm(t('supplier.products.confirm.reset'))) {
      setProductsList(products);
      localStorage.removeItem(STORAGE_KEY);
      // Réinitialiser aussi le service global
      productsService.resetToDefault();
      success(t('supplier.products.success.reset'));
    }
  };

  return (
    <div className="p-6">      {/* Bouton retour */}
      <BackButton to="/supplier/dashboard" label={t('supplier.products.back')} variant="ghost" className="mb-6" />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('supplier.products.title')}</h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">{t('supplier.products.subtitle')}</p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {t('supplier.products.autosave')}
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              {t('supplier.products.synced')}
            </div>
          </div>
        </div>
      </div>

      {/* Actions et filtres */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />              <Input
                placeholder={t('supplier.products.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('supplier.products.allCategories')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">            <Button onClick={handleAddProduct} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {t('supplier.products.addProduct')}
            </Button>
            <Button 
              onClick={handleResetToDefault} 
              variant="outline" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <Package className="w-4 h-4" />
              {t('supplier.products.resetDefault')}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-500" />            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('supplier.products.stats.total')}</p>
              <p className="text-2xl font-bold text-gray-900">{productsList.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-500" />            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('supplier.products.stats.views')}</p>
              <p className="text-2xl font-bold text-gray-900">12,453</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-500" />            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('supplier.products.stats.rating')}</p>
              <p className="text-2xl font-bold text-gray-900">4.2/5</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Filter className="w-8 h-8 text-purple-500" />            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('supplier.products.stats.inStock')}</p>
              <p className="text-2xl font-bold text-gray-900">{Math.floor(productsList.length * 0.8)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">          <h2 className="text-lg font-semibold text-gray-900">
            {t('supplier.products.list.title')} ({filteredProducts.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('supplier.products.table.product')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('supplier.products.table.category')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('supplier.products.table.price')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('supplier.products.table.stock')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('supplier.products.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={product.images?.[0] || '/api/placeholder/100/100'}
                        alt={product.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          MOQ: {product.moq} pcs
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ¥{product.price.cny} CNY
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {t('supplier.products.inStock')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout/édition */}
      <ProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default SupplierProductsPage;
