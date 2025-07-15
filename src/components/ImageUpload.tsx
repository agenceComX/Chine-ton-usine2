import React, { useState, useRef } from 'react';
import { X, Camera, Eye } from 'lucide-react';
import Button from './Button';

interface ImageUploadProps {
  onImageSelect?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<string[]>; // retourne les URLs des images uploadées
  maxImages?: number;
  maxSizePerImage?: number; // en MB
  className?: string;
  existingImages?: string[]; // URLs des images existantes
  onRemoveExisting?: (imageUrl: string) => void;
}

interface UploadImage {
  file?: File;
  id: string;
  preview: string;
  status: 'existing' | 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  progress?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onUpload,
  maxImages = 10,
  maxSizePerImage = 10, // 10MB par défaut
  className = '',
  existingImages = [],
  onRemoveExisting
}) => {
  const [images, setImages] = useState<UploadImage[]>(() => {
    // Initialiser avec les images existantes
    return existingImages.map((url, index) => ({
      id: `existing-${index}`,
      preview: url,
      status: 'existing' as const,
      url
    }));
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateImage = (file: File): string | null => {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return `Le fichier ${file.name} n'est pas une image`;
    }

    // Vérifier la taille
    if (file.size > maxSizePerImage * 1024 * 1024) {
      return `L'image ${file.name} dépasse la taille maximale de ${maxSizePerImage}MB`;
    }

    return null;
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject('Erreur lors de la lecture du fichier');
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Vérifier le nombre maximum d'images
    if (images.length + fileArray.length > maxImages) {
      alert(`Vous ne pouvez télécharger que ${maxImages} images au maximum`);
      return;
    }

    // Valider chaque image
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    for (const file of fileArray) {
      const error = validateImage(file);
      if (error) {
        validationErrors.push(error);
      } else {
        validFiles.push(file);
      }
    }

    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
    }

    if (validFiles.length === 0) return;

    // Créer les objets UploadImage
    const newImages: UploadImage[] = [];
    for (const file of validFiles) {
      try {
        const preview = await createPreview(file);
        newImages.push({
          file,
          id: generateId(),
          preview,
          status: 'pending'
        });
      } catch (error) {
        console.error('Erreur lors de la création de la prévisualisation:', error);
      }
    }

    setImages(prev => [...prev, ...newImages]);
    onImageSelect?.(validFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageSelect(e.target.files);
    }
  };

  const removeImage = (id: string) => {
    const image = images.find(img => img.id === id);
    if (image?.status === 'existing' && image.url && onRemoveExisting) {
      onRemoveExisting(image.url);
    }
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const simulateUpload = async (uploadImage: UploadImage): Promise<string> => {
    return new Promise((resolve) => {
      setImages(prev => prev.map(img => 
        img.id === uploadImage.id ? { ...img, status: 'uploading', progress: 0 } : img
      ));

      // Simuler le progrès d'upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // URL fictive pour l'image uploadée
          const uploadedUrl = `https://example.com/uploads/${uploadImage.file?.name}`;
          
          setImages(prev => prev.map(img => 
            img.id === uploadImage.id 
              ? { ...img, progress: 100, status: 'success', url: uploadedUrl } 
              : img
          ));
          
          resolve(uploadedUrl);
        } else {
          setImages(prev => prev.map(img => 
            img.id === uploadImage.id ? { ...img, progress } : img
          ));
        }
      }, 200);
    });
  };

  const handleUpload = async () => {
    const imagesToUpload = images.filter(img => img.status === 'pending' && img.file);
    if (imagesToUpload.length === 0) return;

    setIsUploading(true);
    
    try {
      if (onUpload) {
        const files = imagesToUpload.map(img => img.file!);
        const uploadedUrls = await onUpload(files);
        
        // Mettre à jour les images avec les URLs uploadées
        setImages(prev => prev.map(img => {
          const index = imagesToUpload.findIndex(uploadImg => uploadImg.id === img.id);
          if (index !== -1) {
            return { ...img, status: 'success', url: uploadedUrls[index] };
          }
          return img;
        }));
      } else {
        // Simulation d'upload si pas de handler fourni
        for (const uploadImage of imagesToUpload) {
          await simulateUpload(uploadImage);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      // Marquer les images en erreur
      setImages(prev => prev.map(img => 
        imagesToUpload.some(uploadImg => uploadImg.id === img.id) 
          ? { ...img, status: 'error' } 
          : img
      ));
    } finally {
      setIsUploading(false);
    }
  };

  const clearCompleted = () => {
    setImages(prev => prev.filter(img => img.status !== 'success'));
  };

  const getStatusOverlay = (image: UploadImage) => {
    switch (image.status) {
      case 'uploading':
        return (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2"></div>
              <p className="text-sm">{Math.round(image.progress || 0)}%</p>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="text-center text-white">
              <svg className="h-8 w-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">Erreur</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone de drop */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
      >
        <div className="flex flex-col items-center">
          <Camera className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Déposez vos images ici
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            ou cliquez pour sélectionner des images
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Formats: JPG, JPEG, PNG, GIF | Taille max: {maxSizePerImage}MB par image | Max {maxImages} images
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Grille des images */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Images ({images.length}/{maxImages})
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={clearCompleted}
                variant="outline"
                size="sm"
                disabled={!images.some(img => img.status === 'success')}
              >
                Nettoyer
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !images.some(img => img.status === 'pending')}
                size="sm"
              >
                {isUploading ? 'Upload en cours...' : `Télécharger (${images.filter(img => img.status === 'pending').length})`}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={image.preview}
                    alt={image.file?.name || 'Image'}
                    className="w-full h-full object-cover"
                  />
                  {getStatusOverlay(image)}
                </div>
                
                {/* Actions */}
                <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPreview(image.preview);
                    }}
                    className="bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-75 transition-colors"
                    title="Prévisualiser"
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Supprimer"
                >
                  <X className="h-3 w-3" />
                </button>

                {/* Informations du fichier */}
                {image.file && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={image.file.name}>
                      {image.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {formatFileSize(image.file.size)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de prévisualisation */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={() => setShowPreview(null)}>
          <div className="relative max-w-4xl max-h-4xl p-4">
            <img
              src={showPreview}
              alt="Prévisualisation"
              className="max-w-full max-h-full object-contain"
            />            <button
              onClick={() => setShowPreview(null)}
              className="absolute top-2 right-2 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
