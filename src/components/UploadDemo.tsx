import React, { useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Package } from 'lucide-react';
import FileUpload from './FileUpload';
import ImageUpload from './ImageUpload';
import Button from './Button';
import { uploadService } from '../services/uploadService';

const UploadDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'files' | 'images'>('files');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleFileUpload = async (files: File[]) => {
    try {
      const results = await uploadService.uploadFiles(
        files,
        {
          folder: 'demo-files',
          maxSize: 10,
          allowedTypes: ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png']
        },
        (fileIndex, progress) => {
          console.log(`Fichier ${fileIndex + 1}: ${progress}%`);
        }
      );

      const successUrls = results
        .filter(result => result.success)
        .map(result => result.url!)
        .filter(Boolean);

      setUploadedFiles(prev => [...prev, ...successUrls]);
      
      alert(`${successUrls.length}/${files.length} fichiers uploadés avec succès !`);
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload');
    }
  };

  const handleImageUpload = async (files: File[]): Promise<string[]> => {
    try {
      const results = await uploadService.uploadImages(
        files,
        {
          folder: 'demo-images',
          maxWidth: 800,
          maxHeight: 600,
          quality: 0.8,
          maxSize: 5
        },
        (fileIndex, progress) => {
          console.log(`Image ${fileIndex + 1}: ${progress}%`);
        }
      );

      const successUrls = results
        .filter(result => result.success)
        .map(result => result.url!)
        .filter(Boolean);

      setUploadedImages(prev => [...prev, ...successUrls]);
      
      return successUrls;
    } catch (error) {
      console.error('Erreur upload images:', error);
      throw error;
    }
  };

  const handleRemoveFile = async (url: string) => {
    try {
      await uploadService.deleteFile(url);
      setUploadedFiles(prev => prev.filter(fileUrl => fileUrl !== url));
      alert('Fichier supprimé avec succès !');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleRemoveImage = async (url: string) => {
    try {
      await uploadService.deleteFile(url);
      setUploadedImages(prev => prev.filter(imageUrl => imageUrl !== url));
    } catch (error) {
      console.error('Erreur suppression image:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Démonstration Upload
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Testez les fonctionnalités d'upload de fichiers et d'images
        </p>
      </div>

      {/* Onglets */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'files'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Upload de fichiers
        </button>
        <button
          onClick={() => setActiveTab('images')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'images'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Upload d'images
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'files' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload de fichiers
            </h2>
            <FileUpload
              onUpload={handleFileUpload}
              maxFiles={5}
              maxSizePerFile={10}
              acceptedTypes={['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png', '.xlsx']}
            />
          </div>

          {/* Liste des fichiers uploadés */}
          {uploadedFiles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Fichiers uploadés ({uploadedFiles.length})</h3>
              <div className="space-y-2">
                {uploadedFiles.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {url.split('/').pop()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(url, '_blank')}
                      >
                        Voir
                      </Button>                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleRemoveFile(url)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'images' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Upload d'images
            </h2>
            <ImageUpload
              onUpload={handleImageUpload}
              maxImages={8}
              maxSizePerImage={5}
              existingImages={uploadedImages}
              onRemoveExisting={handleRemoveImage}
            />
          </div>

          {/* Statistiques */}
          {uploadedImages.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {uploadedImages.length}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Images uploadées</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    100%
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Taux de réussite</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    5MB
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Taille max</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Informations techniques */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Informations techniques
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Mode actuel :</strong> {uploadService['mockMode'] ? 'Simulation' : 'Production'}
          </div>
          <div>
            <strong>URL API :</strong> {uploadService['baseUrl']}
          </div>
          <div>
            <strong>Types supportés :</strong> PDF, DOC, DOCX, TXT, JPG, PNG, XLSX
          </div>
          <div>
            <strong>Taille max :</strong> 10MB par fichier (documents), 5MB (images)
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note :</strong> Actuellement en mode simulation. Les fichiers ne sont pas réellement stockés. 
            Pour activer l'upload réel, configurez votre API et utilisez <code>uploadService.setMockMode(false)</code>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadDemo;
