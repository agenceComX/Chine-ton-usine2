import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  X, 
  Eye, 
  Download,
  Trash2
} from 'lucide-react';
import Button from './Button';
import { MediaFile, mediaStorageService, formatFileSize } from '../lib/services/mediaStorageService';
import { productService } from '../lib/services/productServiceMinimal';

interface ProductMediaManagerProps {
  productId: string;
  onMediaUpdate?: (media: { images: MediaFile[]; videos: MediaFile[]; documents: MediaFile[] }) => void;
  className?: string;
}

interface UploadProgress {
  fileIndex: number;
  progress: number;
  fileName: string;
}

const ProductMediaManager: React.FC<ProductMediaManagerProps> = ({
  productId,
  onMediaUpdate,
  className = ''
}) => {
  const [media, setMedia] = useState<{
    images: MediaFile[];
    videos: MediaFile[];
    documents: MediaFile[];
  }>({ images: [], videos: [], documents: [] });

  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'documents'>('images');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Charger les médias existants
  useEffect(() => {
    loadMedia();
  }, [productId]);

  const loadMedia = async () => {
    try {
      const productMedia = await productService.getProductMedia(productId);
      setMedia(productMedia);
      onMediaUpdate?.(productMedia);
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error);
    }
  };

  const handleFileUpload = async (files: FileList | File[], type: 'images' | 'videos' | 'documents') => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress([]);

    try {
      const fileArray = Array.from(files);
      
      // Valider les fichiers selon le type
      const validFiles = fileArray.filter(file => validateFileType(file, type));
      
      if (validFiles.length === 0) {
        alert('Aucun fichier valide sélectionné');
        return;
      }

      if (validFiles.length !== fileArray.length) {
        alert(`${fileArray.length - validFiles.length} fichier(s) ignoré(s) - type non supporté`);
      }

      let uploadedFiles: MediaFile[] = [];

      // Upload selon le type
      switch (type) {
        case 'images':
          uploadedFiles = await productService.optimizeAndUploadImages(
            productId,
            validFiles,
            { maxWidth: 1920, maxHeight: 1080, quality: 0.9 },
            (fileIndex, progress) => {
              setUploadProgress(prev => {
                const newProgress = [...prev];
                newProgress[fileIndex] = {
                  fileIndex,
                  progress,
                  fileName: validFiles[fileIndex]?.name || ''
                };
                return newProgress;
              });
            }
          );
          break;

        case 'videos':
          uploadedFiles = await productService.addProductVideos(
            productId,
            validFiles,
            (fileIndex, progress) => {
              setUploadProgress(prev => {
                const newProgress = [...prev];
                newProgress[fileIndex] = {
                  fileIndex,
                  progress,
                  fileName: validFiles[fileIndex]?.name || ''
                };
                return newProgress;
              });
            }
          );
          break;

        case 'documents':
          uploadedFiles = await productService.addProductDocuments(
            productId,
            validFiles,
            (fileIndex, progress) => {
              setUploadProgress(prev => {
                const newProgress = [...prev];
                newProgress[fileIndex] = {
                  fileIndex,
                  progress,
                  fileName: validFiles[fileIndex]?.name || ''
                };
                return newProgress;
              });
            }
          );
          break;
      }

      // Recharger les médias
      await loadMedia();
      
      alert(`${uploadedFiles.length} fichier(s) uploadé(s) avec succès !`);

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload des fichiers');
    } finally {
      setIsUploading(false);
      setUploadProgress([]);
    }
  };

  const validateFileType = (file: File, type: 'images' | 'videos' | 'documents'): boolean => {
    switch (type) {
      case 'images':
        return file.type.startsWith('image/');
      case 'videos':
        return file.type.startsWith('video/');
      case 'documents':
        return mediaStorageService.validateFileType(file, [
          '.pdf', '.doc', '.docx', '.txt', '.xlsx', '.xls', '.ppt', '.pptx'
        ]);
      default:
        return false;
    }
  };

  const handleRemoveFile = async (filePath: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return;

    try {
      await productService.removeProductMedia(productId, filePath);
      await loadMedia();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du fichier');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files, activeTab);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files, activeTab);
    }
  };

  const getTabIcon = (tab: 'images' | 'videos' | 'documents') => {
    switch (tab) {
      case 'images': return <ImageIcon className="w-5 h-5" />;
      case 'videos': return <Video className="w-5 h-5" />;
      case 'documents': return <FileText className="w-5 h-5" />;
    }
  };

  const getTabData = () => {
    return media[activeTab] || [];
  };

  const getAcceptedTypes = () => {
    switch (activeTab) {
      case 'images': return 'image/*';
      case 'videos': return 'video/*';
      case 'documents': return '.pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx';
      default: return '*/*';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header avec onglets */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1 p-4">
          {(['images', 'videos', 'documents'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {getTabIcon(tab)}
              <span className="capitalize">{tab}</span>
              <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full">
                {media[tab]?.length || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Zone d'upload */}
      <div className="p-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${dragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }
          `}
          onClick={() => document.getElementById(`file-input-${activeTab}`)?.click()}
        >
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Ajouter des {activeTab}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-gray-400">
              {activeTab === 'images' && 'Formats: JPG, PNG, GIF, WEBP | Max 10MB par image'}
              {activeTab === 'videos' && 'Formats: MP4, MOV, AVI, WEBM | Max 100MB par vidéo'}
              {activeTab === 'documents' && 'Formats: PDF, DOC, XLS, PPT | Max 50MB par document'}
            </p>
          </div>

          <input
            id={`file-input-${activeTab}`}
            type="file"
            multiple
            accept={getAcceptedTypes()}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Barre de progression upload */}
        {isUploading && uploadProgress.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Upload en cours...</h4>
            {uploadProgress.map((progress, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {progress.fileName}
                  </span>
                  <span className="text-sm text-gray-500">
                    {progress.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liste des fichiers */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({getTabData().length})
          </h3>
          
          {getTabData().length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('Supprimer tous les fichiers de cette catégorie ?')) {
                  // Implémenter la suppression en masse si nécessaire
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Tout supprimer
            </Button>
          )}
        </div>

        {getTabData().length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📁</div>
            <p>Aucun fichier dans cette catégorie</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getTabData().map((file) => (
              <div
                key={file.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
              >
                {/* Prévisualisation */}
                <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-gray-400 dark:text-gray-500">
                      {file.type === 'video' && <Video className="w-12 h-12" />}
                      {file.type === 'document' && <FileText className="w-12 h-12" />}
                    </div>
                  )}
                </div>

                {/* Informations du fichier */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {file.name}
                  </h4>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <div>Taille: {formatFileSize(file.size)}</div>
                    <div>Ajouté: {file.uploadedAt.toLocaleDateString()}</div>
                    {file.metadata?.width && file.metadata?.height && (
                      <div>Dimensions: {file.metadata.width}x{file.metadata.height}</div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewUrl(file.url)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFile(file.path)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de prévisualisation */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            {previewUrl.includes('image') || previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={previewUrl}
                alt="Prévisualisation"
                className="max-w-full max-h-full object-contain"
              />
            ) : previewUrl.includes('video') || previewUrl.match(/\.(mp4|mov|avi|webm)$/i) ? (
              <video
                src={previewUrl}
                controls
                className="max-w-full max-h-full"
              >
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            ) : (
              <div className="bg-white p-8 rounded-lg">
                <p className="text-gray-600">Prévisualisation non disponible pour ce type de fichier.</p>
                <Button
                  onClick={() => window.open(previewUrl, '_blank')}
                  className="mt-4"
                >
                  Ouvrir dans un nouvel onglet
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMediaManager;
