import React, { useState, useEffect } from 'react';
import { X, Save, Package, DollarSign, Tag } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import ImageUpload from './ImageUpload';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';
import { uploadService } from '../services/uploadService';
import { getProductName } from '../utils/productUtils';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (product: ProductFormData & { id?: string }) => void;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  sku: string;
  minOrder: number;
  tags: string[];
  brand: string;
  origin: string;
  material: string;
  modelNumber: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  category?: string;
  stock?: string;
  sku?: string;
  minOrder?: string;
  brand?: string;
  origin?: string;
  material?: string;
  modelNumber?: string;
}

const categories = [
  'Électronique',
  'Vêtements',
  'Maison & Jardin',
  'Automobiles',
  'Beauté',
  'Sports',
  'Jouets',
  'Livres',
  'Industrie',
  'Autre'
];

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave
}) => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    images: [],
    stock: 0,
    sku: '',
    minOrder: 1,
    tags: [],
    brand: '',
    origin: '',
    material: '',
    modelNumber: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  // Initialiser le formulaire avec les données du produit à éditer
  useEffect(() => {
    if (product) {      // Extraire la description française ou utiliser la première disponible
      let description = '';
      if (typeof product.description === 'string') {
        description = product.description;
      } else {
        description = product.description.fr || 
                     product.description.en ||
                     Object.values(product.description)[0] || '';
      }      setFormData({
        name: getProductName(product, language),
        description,
        price: typeof product.price === 'number' ? product.price : product.price.cny,
        category: product.category,
        images: product.images || [],
        stock: 100, // Valeur par défaut
        sku: product.id || '',
        minOrder: product.moq || 1,
        tags: [],
        brand: String(product.specifications?.brand || ''),
        origin: String(product.specifications?.origin || ''),
        material: String(product.specifications?.material || ''),
        modelNumber: String(product.specifications?.modelNumber || '')
      });
    } else {
      // Reset pour nouveau produit
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        images: [],
        stock: 0,
        sku: '',
        minOrder: 1,
        tags: [],
        brand: '',
        origin: '',
        material: '',
        modelNumber: ''
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du produit est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }    if (!formData.sku.trim()) {
      newErrors.sku = 'L\'ID Produit est requis';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Le stock ne peut pas être négatif';
    }

    if (formData.minOrder <= 0) {
      newErrors.minOrder = 'La commande minimum doit être supérieure à 0';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'La marque est requise';
    }

    if (!formData.origin.trim()) {
      newErrors.origin = 'L\'origine est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (files: File[]): Promise<string[]> => {
    try {
      const results = await uploadService.uploadImages(
        files,
        {
          folder: 'products',
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.8,
          maxSize: 5 // 5MB max par image
        }
      );      const uploadedUrls = results
        .filter(result => result.success)
        .map(result => result.url!)
        .filter(Boolean);

      // Mettre à jour les images du formulaire
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));

      return uploadedUrls;
    } catch (error) {
      console.error('Erreur lors de l\'upload des images:', error);
      throw error;
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      // Supprimer du serveur si c'est une nouvelle image
      if (imageUrl.includes('example.com')) {
        await uploadService.deleteFile(imageUrl);
      }

      // Retirer de la liste locale
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img !== imageUrl)
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
    }
  };
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {      const productData = {
        ...formData,
        id: product?.id
      };

      onSave(productData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-blue-500" />            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {product ? t('product.modal.editTitle') : t('product.modal.addTitle')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('product.modal.productName')} *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('product.modal.productNamePlaceholder')}
                error={errors.name}
              />
            </div>            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('product.modal.productId')} *
              </label>
              <Input
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder={t('product.modal.productIdPlaceholder')}
                error={errors.sku}
              />
            </div>
          </div>          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('product.modal.description')} *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('product.modal.descriptionPlaceholder')}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Prix et catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('product.modal.factoryPrice')} *
              </label>              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('product.modal.factoryPricePlaceholder')}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Stock et commande minimum */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock disponible
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commande minimum *
              </label>
              <input
                type="number"
                min="1"
                value={formData.minOrder}
                onChange={(e) => setFormData(prev => ({ ...prev, minOrder: parseInt(e.target.value) || 1 }))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.minOrder ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1"
              />
              {errors.minOrder && (
                <p className="text-red-500 text-sm mt-1">{errors.minOrder}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>            <div className="flex gap-2 mb-2">              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder={t('product.modal.addTag')}
                onKeyDown={handleTagKeyDown}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                <Tag className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Spécifications techniques */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Spécifications techniques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque *
                </label>
                <Input
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="Ex: Apple, Samsung..."
                  error={errors.brand}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origine *
                </label>
                <Input
                  value={formData.origin}
                  onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                  placeholder="Ex: Chine, France..."
                  error={errors.origin}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matériau
                </label>
                <Input
                  value={formData.material}
                  onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                  placeholder="Ex: Plastique, Métal..."
                  error={errors.material}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de modèle
                </label>
                <Input
                  value={formData.modelNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, modelNumber: e.target.value }))}
                  placeholder="Ex: IP15P-128"
                  error={errors.modelNumber}
                />
              </div>
            </div>
          </div>

          {/* Upload d'images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images du produit
            </label>
            <ImageUpload
              onUpload={handleImageUpload}
              maxImages={8}
              maxSizePerImage={5}
              existingImages={formData.images}
              onRemoveExisting={handleRemoveImage}
              className="border-2 border-dashed border-gray-300 rounded-lg"
            />            <p className="text-sm text-gray-500 mt-2">
              {t('product.modal.maxImages')}
            </p>
          </div>          {/* Footer */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              {t('product.modal.cancel')}
            </Button>            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Sauvegarde...' : t('product.modal.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
