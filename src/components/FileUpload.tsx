import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image, File, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './Button';

interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSizePerFile?: number; // en MB
  acceptedTypes?: string[];
  className?: string;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  preview?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUpload,
  maxFiles = 10,
  maxSizePerFile = 50, // 50MB par défaut
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif'],
  className = ''
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="h-6 w-6 text-green-500" />;
    } else if (['pdf'].includes(extension || '')) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else {
      return <File className="h-6 w-6 text-blue-500" />;
    }
  };

  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const validateFile = (file: File): string | null => {
    // Vérifier la taille
    if (file.size > maxSizePerFile * 1024 * 1024) {
      return `Le fichier ${file.name} dépasse la taille maximale de ${maxSizePerFile}MB`;
    }

    // Vérifier le type
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      return `Le type de fichier ${extension} n'est pas autorisé`;
    }

    return null;
  };

  const handleFileSelect = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Vérifier le nombre maximum de fichiers
    if (uploadFiles.length + fileArray.length > maxFiles) {
      alert(`Vous ne pouvez télécharger que ${maxFiles} fichiers au maximum`);
      return;
    }

    // Valider chaque fichier
    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
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

    // Créer les objets UploadFile
    const newUploadFiles: UploadFile[] = [];
    for (const file of validFiles) {
      const preview = await createPreview(file);
      newUploadFiles.push({
        file,
        id: generateId(),
        progress: 0,
        status: 'pending',
        preview
      });
    }

    setUploadFiles(prev => [...prev, ...newUploadFiles]);
    onFileSelect?.(validFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
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
      handleFileSelect(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const simulateUpload = async (uploadFile: UploadFile): Promise<void> => {
    return new Promise((resolve) => {
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'uploading' } : f
      ));

      // Simuler le progrès d'upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setUploadFiles(prev => prev.map(f => 
            f.id === uploadFile.id ? { ...f, progress: 100, status: 'success' } : f
          ));
          
          resolve();
        } else {
          setUploadFiles(prev => prev.map(f => 
            f.id === uploadFile.id ? { ...f, progress } : f
          ));
        }
      }, 200);
    });
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    setIsUploading(true);
    
    try {
      const filesToUpload = uploadFiles.filter(f => f.status === 'pending');
      
      if (onUpload) {
        await onUpload(filesToUpload.map(f => f.file));
      } else {
        // Simulation d'upload si pas de handler fourni
        for (const uploadFile of filesToUpload) {
          await simulateUpload(uploadFile);
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      // Marquer les fichiers en erreur
      setUploadFiles(prev => prev.map(f => 
        f.status === 'uploading' ? { ...f, status: 'error' } : f
      ));
    } finally {
      setIsUploading(false);
    }
  };

  const clearCompleted = () => {
    setUploadFiles(prev => prev.filter(f => f.status !== 'success'));
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'uploading':
        return <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
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
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Déposez vos fichiers ici
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          ou cliquez pour sélectionner des fichiers
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Formats acceptés: {acceptedTypes.join(', ')} | Taille max: {maxSizePerFile}MB par fichier
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Liste des fichiers */}
      {uploadFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Fichiers sélectionnés ({uploadFiles.length})
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={clearCompleted}
                variant="outline"
                size="sm"
                disabled={!uploadFiles.some(f => f.status === 'success')}
              >
                Nettoyer
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !uploadFiles.some(f => f.status === 'pending')}
                size="sm"
              >
                {isUploading ? 'Upload en cours...' : 'Télécharger'}
              </Button>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {uploadFiles.map((uploadFile) => (
              <div
                key={uploadFile.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                {/* Prévisualisation ou icône */}
                <div className="flex-shrink-0">
                  {uploadFile.preview ? (
                    <img
                      src={uploadFile.preview}
                      alt={uploadFile.file.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    getFileIcon(uploadFile.file)
                  )}
                </div>

                {/* Informations du fichier */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(uploadFile.file.size)}
                  </p>
                  
                  {/* Barre de progrès */}
                  {uploadFile.status === 'uploading' && (
                    <div className="mt-1">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${uploadFile.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {Math.round(uploadFile.progress)}%
                      </p>
                    </div>
                  )}
                </div>

                {/* Statut et actions */}
                <div className="flex items-center gap-2">
                  {getStatusIcon(uploadFile.status)}
                  
                  {uploadFile.status === 'pending' && (
                    <button
                      onClick={() => removeFile(uploadFile.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
