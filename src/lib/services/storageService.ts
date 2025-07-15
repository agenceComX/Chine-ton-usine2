import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage';
import { app } from '../firebaseClient';

class StorageService {
  private storage = getStorage(app);

  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Erreur lors de l\'upload du fichier:', error);
      throw error;
    }
  }

  async uploadProductImage(file: File, productId: string): Promise<string> {
    const path = `products/${productId}/${file.name}`;
    return this.uploadFile(file, path);
  }

  async uploadUserAvatar(file: File, userId: string): Promise<string> {
    const path = `avatars/${userId}/${file.name}`;
    return this.uploadFile(file, path);
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      throw error;
    }
  }

  async listFiles(path: string): Promise<string[]> {
    try {
      const storageRef = ref(this.storage, path);
      const result = await listAll(storageRef);
      const urls = await Promise.all(
        result.items.map(item => getDownloadURL(item))
      );
      return urls;
    } catch (error) {
      console.error('Erreur lors de la liste des fichiers:', error);
      throw error;
    }
  }

  async getProductImages(productId: string): Promise<string[]> {
    return this.listFiles(`products/${productId}`);
  }

  async getUserAvatar(userId: string): Promise<string | null> {
    try {
      const urls = await this.listFiles(`avatars/${userId}`);
      return urls[0] || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'avatar:', error);
      return null;
    }
  }
}

export const storageService = new StorageService(); 