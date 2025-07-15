export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  progress?: number;
}

export interface UploadOptions {
  folder?: string;
  maxSize?: number; // en MB
  allowedTypes?: string[];
  fileName?: string;
}

class UploadService {
  private baseUrl = '/api/upload'; // URL de votre API d'upload
  private mockMode = true; // Activer le mode simulation

  /**
   * Upload un seul fichier
   */
  async uploadFile(
    file: File, 
    options: UploadOptions = {},
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    try {
      // Validation du fichier
      const validation = this.validateFile(file, options);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      if (this.mockMode) {
        return this.simulateUpload(file, options, onProgress);
      }

      // Upload réel avec FormData
      const formData = new FormData();
      formData.append('file', file);
      
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      
      if (options.fileName) {
        formData.append('fileName', options.fileName);
      }

      // XMLHttpRequest pour suivre le progrès
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress?.(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve({
                success: true,
                url: response.url,
                progress: 100
              });
            } catch (error) {
              resolve({
                success: false,
                error: 'Erreur lors du traitement de la réponse du serveur'
              });
            }
          } else {
            resolve({
              success: false,
              error: `Erreur HTTP: ${xhr.status}`
            });
          }
        });

        xhr.addEventListener('error', () => {
          resolve({
            success: false,
            error: 'Erreur réseau lors de l\'upload'
          });
        });

        xhr.open('POST', this.baseUrl);
        xhr.send(formData);
      });

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Upload multiple fichiers
   */
  async uploadFiles(
    files: File[],
    options: UploadOptions = {},
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await this.uploadFile(
        file,
        options,
        (progress) => onProgress?.(i, progress)
      );
      results.push(result);
    }

    return results;
  }

  /**
   * Upload d'images avec redimensionnement automatique
   */
  async uploadImages(
    files: File[],
    options: UploadOptions & {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    } = {},
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<UploadResult[]> {
    const processedFiles: File[] = [];

    // Redimensionner les images si nécessaire
    for (const file of files) {
      if (file.type.startsWith('image/') && (options.maxWidth || options.maxHeight)) {
        try {
          const resizedFile = await this.resizeImage(file, {
            maxWidth: options.maxWidth || 1920,
            maxHeight: options.maxHeight || 1080,
            quality: options.quality || 0.9
          });
          processedFiles.push(resizedFile);
        } catch (error) {
          console.error('Erreur lors du redimensionnement:', error);
          processedFiles.push(file); // Utiliser l'original en cas d'erreur
        }
      } else {
        processedFiles.push(file);
      }
    }

    return this.uploadFiles(
      processedFiles,
      { ...options, folder: options.folder || 'images' },
      onProgress
    );
  }

  /**
   * Supprimer un fichier uploadé
   */
  async deleteFile(url: string): Promise<boolean> {
    if (this.mockMode) {
      // Simulation de suppression
      console.log('Simulation: suppression du fichier', url);
      return true;
    }

    try {
      const response = await fetch(`${this.baseUrl}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }
  }

  /**
   * Validation des fichiers
   */
  private validateFile(file: File, options: UploadOptions): { valid: boolean; error?: string } {
    // Vérifier la taille
    const maxSize = (options.maxSize || 50) * 1024 * 1024; // Convertir MB en bytes
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Le fichier ${file.name} dépasse la taille maximale de ${options.maxSize || 50}MB`
      };
    }

    // Vérifier le type
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!options.allowedTypes.includes(fileExtension) && !options.allowedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `Le type de fichier ${fileExtension} n'est pas autorisé`
        };
      }
    }

    return { valid: true };
  }
  /**
   * Simulation d'upload pour les tests
   */
  private simulateUpload(
    file: File,
    options: UploadOptions,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Pour les images, créer un data URL pour l'affichage réel
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target?.result as string;
              resolve({
                success: true,
                url: dataUrl, // Data URL pour affichage immédiat
                progress: 100
              });
            };
            reader.onerror = () => {
              // Fallback avec image de placeholder
              const randomId = Math.random().toString(36).substr(2, 9);
              resolve({
                success: true,
                url: `https://picsum.photos/400/300?random=${randomId}`,
                progress: 100
              });
            };
            reader.readAsDataURL(file);
          } else {
            // Pour les autres fichiers, générer une URL fictive
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substr(2, 9);
            const extension = file.name.split('.').pop();
            const folder = options.folder || 'uploads';
            const fileName = options.fileName || `${timestamp}-${randomId}.${extension}`;
            
            resolve({
              success: true,
              url: `https://example.com/${folder}/${fileName}`,
              progress: 100
            });
          }
        } else {
          onProgress?.(progress);
        }
      }, 150 + Math.random() * 200); // Délai variable pour simuler la réalité
    });
  }

  /**
   * Redimensionner une image
   */
  private resizeImage(
    file: File,
    options: { maxWidth: number; maxHeight: number; quality: number }
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions
        let { width, height } = img;
        const { maxWidth, maxHeight } = options;

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
          options.quality
        );
      };

      img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Activer/désactiver le mode simulation
   */
  setMockMode(enabled: boolean) {
    this.mockMode = enabled;
  }

  /**
   * Configurer l'URL de base de l'API
   */
  setBaseUrl(url: string) {
    this.baseUrl = url;
  }
}

// Instance singleton
export const uploadService = new UploadService();

// Helper pour formater la taille des fichiers
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper pour valider les types d'images
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

// Helper pour obtenir une URL de prévisualisation
export const getPreviewUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('Le fichier n\'est pas une image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsDataURL(file);
  });
};
