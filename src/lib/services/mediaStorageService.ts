import { 
  getStorage, 
  ref, 
  getDownloadURL, 
  deleteObject,
  listAll,
  uploadBytesResumable,
  UploadTaskSnapshot
} from 'firebase/storage';
import { app } from '../firebaseClient';

// Types pour la gestion des fichiers média
export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'other';
  size: number;
  uploadedAt: Date;
  path: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number; // pour les vidéos
    contentType?: string;
  };
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number; // 0-100
  state: 'running' | 'paused' | 'success' | 'canceled' | 'error';
}

export interface UploadOptions {
  folder?: string;
  fileName?: string;
  metadata?: Record<string, any>;
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (downloadURL: string) => void;
  onError?: (error: Error) => void;
}

export interface BatchUploadResult {
  successful: MediaFile[];
  failed: Array<{ file: File; error: string }>;
  totalUploaded: number;
  totalFailed: number;
}

class MediaStorageService {
  private storage = getStorage(app);

  /**
   * Upload un seul fichier avec suivi de progression
   */
  async uploadFile(
    file: File, 
    path: string, 
    options: UploadOptions = {}
  ): Promise<MediaFile> {
    try {
      const storageRef = ref(this.storage, path);
      
      // Utiliser uploadBytesResumable pour le suivi de progression
      const uploadTask = uploadBytesResumable(storageRef, file, {
        customMetadata: options.metadata
      });

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress: UploadProgress = {
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress: Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
              state: snapshot.state as any
            };
            options.onProgress?.(progress);
          },
          (error) => {
            console.error('Erreur lors de l\'upload:', error);
            options.onError?.(error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              const mediaFile: MediaFile = {
                id: this.generateId(),
                name: file.name,
                url: downloadURL,
                type: this.getFileType(file),
                size: file.size,
                uploadedAt: new Date(),
                path: path,
                metadata: await this.extractMetadata(file)
              };

              options.onComplete?.(downloadURL);
              resolve(mediaFile);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Erreur lors de l\'upload du fichier:', error);
      throw error;
    }
  }

  /**
   * Upload multiple fichiers en batch
   */
  async uploadMultipleFiles(
    files: File[],
    basePath: string,
    options: UploadOptions = {}
  ): Promise<BatchUploadResult> {
    const result: BatchUploadResult = {
      successful: [],
      failed: [],
      totalUploaded: 0,
      totalFailed: 0
    };

    const uploadPromises = files.map(async (file, index) => {
      try {
        const fileName = options.fileName 
          ? `${options.fileName}_${index + 1}_${file.name}`
          : `${Date.now()}_${index}_${file.name}`;
        
        const fullPath = `${basePath}/${fileName}`;
        
        const mediaFile = await this.uploadFile(file, fullPath, {
          ...options,
          onProgress: (progress) => {
            // Progress spécifique au fichier
            options.onProgress?.({
              ...progress,
              // Ajouter l'index du fichier si nécessaire
            });
          }
        });

        result.successful.push(mediaFile);
        result.totalUploaded++;
      } catch (error) {
        result.failed.push({
          file,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
        result.totalFailed++;
      }
    });

    await Promise.allSettled(uploadPromises);
    return result;
  }

  /**
   * Upload d'images pour un produit spécifique
   */
  async uploadProductImages(
    files: File[],
    productId: string,
    options: UploadOptions = {}
  ): Promise<BatchUploadResult> {
    const basePath = `products/${productId}/images`;
    return this.uploadMultipleFiles(files, basePath, options);
  }

  /**
   * Upload de vidéos pour un produit spécifique
   */
  async uploadProductVideos(
    files: File[],
    productId: string,
    options: UploadOptions = {}
  ): Promise<BatchUploadResult> {
    const basePath = `products/${productId}/videos`;
    return this.uploadMultipleFiles(files, basePath, options);
  }

  /**
   * Upload de documents pour un produit spécifique
   */
  async uploadProductDocuments(
    files: File[],
    productId: string,
    options: UploadOptions = {}
  ): Promise<BatchUploadResult> {
    const basePath = `products/${productId}/documents`;
    return this.uploadMultipleFiles(files, basePath, options);
  }

  /**
   * Obtenir tous les fichiers média d'un produit
   */
  async getProductMedia(productId: string): Promise<{
    images: MediaFile[];
    videos: MediaFile[];
    documents: MediaFile[];
  }> {
    const [images, videos, documents] = await Promise.all([
      this.listFiles(`products/${productId}/images`),
      this.listFiles(`products/${productId}/videos`),
      this.listFiles(`products/${productId}/documents`)
    ]);

    return { images, videos, documents };
  }

  /**
   * Lister tous les fichiers dans un répertoire
   */
  async listFiles(path: string): Promise<MediaFile[]> {
    try {
      const storageRef = ref(this.storage, path);
      const result = await listAll(storageRef);
        const filePromises = result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        
        return {
          id: this.generateId(),
          name: itemRef.name,
          url,
          type: this.getFileTypeFromPath(itemRef.fullPath),
          size: 0, // La taille n'est pas facilement accessible
          uploadedAt: new Date(), // Date par défaut
          path: itemRef.fullPath,
          metadata: {
            contentType: 'application/octet-stream' // Type par défaut
          }
        } as MediaFile;
      });

      return Promise.all(filePromises);
    } catch (error) {
      console.error('Erreur lors de la liste des fichiers:', error);
      return [];
    }
  }

  /**
   * Supprimer un fichier
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      throw error;
    }
  }

  /**
   * Supprimer plusieurs fichiers
   */
  async deleteMultipleFiles(paths: string[]): Promise<{
    successful: string[];
    failed: Array<{ path: string; error: string }>;
  }> {
    const result = {
      successful: [] as string[],
      failed: [] as Array<{ path: string; error: string }>
    };

    const deletePromises = paths.map(async (path) => {
      try {
        await this.deleteFile(path);
        result.successful.push(path);
      } catch (error) {
        result.failed.push({
          path,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    });

    await Promise.allSettled(deletePromises);
    return result;
  }

  /**
   * Supprimer tous les fichiers média d'un produit
   */
  async deleteAllProductMedia(productId: string): Promise<void> {
    const media = await this.getProductMedia(productId);
    const allPaths = [
      ...media.images.map(f => f.path),
      ...media.videos.map(f => f.path),
      ...media.documents.map(f => f.path)
    ];

    if (allPaths.length > 0) {
      await this.deleteMultipleFiles(allPaths);
    }
  }

  /**
   * Redimensionner une image avant upload
   */
  async resizeImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    quality: number = 0.9
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Redimensionner
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir en blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(resizedFile);
            } else {
              reject(new Error('Erreur lors de la création du blob'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Déterminer le type de fichier
   */
  private getFileType(file: File): 'image' | 'video' | 'document' | 'other' {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (
      file.type.includes('pdf') ||
      file.type.includes('document') ||
      file.type.includes('text') ||
      file.type.includes('spreadsheet') ||
      file.type.includes('presentation')
    ) return 'document';
    return 'other';
  }

  /**
   * Déterminer le type de fichier à partir du chemin
   */
  private getFileTypeFromPath(path: string): 'image' | 'video' | 'document' | 'other' {
    if (path.includes('/images/')) return 'image';
    if (path.includes('/videos/')) return 'video';
    if (path.includes('/documents/')) return 'document';
    return 'other';
  }

  /**
   * Extraire les métadonnées du fichier
   */
  private async extractMetadata(file: File): Promise<any> {
    const metadata: any = {
      contentType: file.type
    };

    if (file.type.startsWith('image/')) {
      // Pour les images, obtenir les dimensions
      const dimensions = await this.getImageDimensions(file);
      metadata.width = dimensions.width;
      metadata.height = dimensions.height;
    }

    if (file.type.startsWith('video/')) {
      // Pour les vidéos, obtenir la durée (nécessiterait plus de travail)
      // metadata.duration = await this.getVideoDuration(file);
    }

    return metadata;
  }

  /**
   * Obtenir les dimensions d'une image
   */
  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = () => reject(new Error('Impossible de lire les dimensions de l\'image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Générer un ID unique
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Valider la taille du fichier
   */
  validateFileSize(file: File, maxSizeMB: number = 100): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Valider le type de fichier
   */
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.includes(type);
    });
  }

  /**
   * Obtenir une URL de prévisualisation pour un fichier
   */
  getPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Le fichier n\'est pas une image'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsDataURL(file);
    });
  }
}

// Instance singleton
export const mediaStorageService = new MediaStorageService();

// Helper functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

export const isDocumentFile = (file: File): boolean => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ];
  return documentTypes.includes(file.type);
};
