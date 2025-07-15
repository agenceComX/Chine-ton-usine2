import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import Button from './Button';
import FileUpload from './FileUpload';
import { useLanguage } from '../context/LanguageContext';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], metadata: DocumentMetadata) => Promise<void>;
}

interface DocumentMetadata {
  category: string;
  type: 'contract' | 'invoice' | 'certificate' | 'manual' | 'other';
  description: string;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const { t } = useLanguage();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<DocumentMetadata>({
    category: '',
    type: 'other',
    description: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    'Contrats',
    'Factures',
    'Certifications',
    'Manuels',
    'Légal',
    'Marketing',
    'Technique',
    'RH',
    'Autre'
  ];

  const documentTypes = [
    { value: 'contract', label: 'Contrat' },
    { value: 'invoice', label: 'Facture' },
    { value: 'certificate', label: 'Certificat' },
    { value: 'manual', label: 'Manuel' },
    { value: 'other', label: 'Autre' }
  ];

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      await onUpload(selectedFiles, metadata);
      
      // Reset form
      setSelectedFiles([]);
      setMetadata({
        category: '',
        type: 'other',
        description: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      alert('Erreur lors du téléchargement des documents');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCustomUpload = async (files: File[]): Promise<void> => {
    // Cette fonction sera appelée par le composant FileUpload
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Documents uploadés:', files);
        resolve();
      }, 1000);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-2xl sm:w-full">
          {/* Header */}          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('supplier.documents.uploadDocument')}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Métadonnées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégorie *
                </label>
                <select
                  value={metadata.category}
                  onChange={(e) => setMetadata(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type de document *
                </label>
                <select
                  value={metadata.type}
                  onChange={(e) => setMetadata(prev => ({ ...prev, type: e.target.value as DocumentMetadata['type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (optionnel)
              </label>
              <textarea
                value={metadata.description}
                onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Description du document..."
              />
            </div>

            {/* Upload de fichiers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fichiers *
              </label>
              <FileUpload
                onFileSelect={handleFileSelect}
                onUpload={handleCustomUpload}
                maxFiles={5}
                maxSizePerFile={20}
                acceptedTypes={['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png']}
              />
            </div>

            {/* Information sur les formats acceptés */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Formats acceptés
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Documents: PDF, DOC, DOCX, TXT</li>
                <li>• Images: JPG, JPEG, PNG</li>
                <li>• Taille maximum: 20 MB par fichier</li>
                <li>• Maximum 5 fichiers par upload</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">            <Button
              onClick={onClose}
              variant="outline"
              disabled={isUploading}
            >
              {t('product.modal.cancel')}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || !metadata.category || isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Télécharger ({selectedFiles.length} fichier{selectedFiles.length > 1 ? 's' : ''})
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadModal;
