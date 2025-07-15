import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  WhereFilterOp,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebaseClient';

export interface QueryFilter {
  field: string;
  operator: WhereFilterOp;
  value: any;
}

export interface QueryOptions {
  filters?: QueryFilter[];
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  limitCount?: number;
  startAfterDoc?: QueryDocumentSnapshot;
}

export interface PaginatedResult<T> {
  data: T[];
  lastDoc?: QueryDocumentSnapshot;
  hasMore: boolean;
  total?: number;
}

/**
 * Service CRUD générique pour toutes les collections Firestore
 */
export class FirestoreCrudService<T extends { id?: string }> {
  constructor(private collectionName: string) {}

  /**
   * Crée un nouveau document
   */
  async create(data: Omit<T, 'id'>): Promise<T> {
    try {
      const docData = {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, this.collectionName), docData);
      
      return {
        ...docData,
        id: docRef.id
      } as T;
    } catch (error) {
      console.error(`Erreur lors de la création dans ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Lit un document par ID
   */
  async read(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as T;
      }

      return null;
    } catch (error) {
      console.error(`Erreur lors de la lecture dans ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Met à jour un document
   */
  async update(id: string, data: Partial<Omit<T, 'id'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour dans ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un document
   */
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Erreur lors de la suppression dans ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Liste tous les documents avec options de requête
   */
  async list(options: QueryOptions = {}): Promise<T[]> {
    try {
      let q = collection(db, this.collectionName);
      let queryRef: any = q;

      // Appliquer les filtres
      if (options.filters) {
        for (const filter of options.filters) {
          queryRef = query(queryRef, where(filter.field, filter.operator, filter.value));
        }
      }

      // Appliquer l'ordre
      if (options.orderByField) {
        queryRef = query(queryRef, orderBy(options.orderByField, options.orderDirection || 'asc'));
      }

      // Appliquer la limite
      if (options.limitCount) {
        queryRef = query(queryRef, limit(options.limitCount));
      }

      // Appliquer la pagination
      if (options.startAfterDoc) {
        queryRef = query(queryRef, startAfter(options.startAfterDoc));
      }

      const querySnapshot = await getDocs(queryRef);
      const documents: T[] = [];

      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data()
        } as T);
      });

      return documents;
    } catch (error) {
      console.error(`Erreur lors de la liste dans ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Liste avec pagination
   */
  async listPaginated(options: QueryOptions = {}): Promise<PaginatedResult<T>> {
    try {
      const documents = await this.list(options);
      const hasMore = options.limitCount ? documents.length === options.limitCount : false;
      
      // Obtenir le dernier document pour la pagination
      let lastDoc: QueryDocumentSnapshot | undefined;
      if (documents.length > 0 && hasMore) {
        // Récupérer le dernier document de la requête pour la pagination
        const lastDocData = documents[documents.length - 1];
        if (lastDocData.id) {
          const docRef = doc(db, this.collectionName, lastDocData.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            lastDoc = docSnap as QueryDocumentSnapshot;
          }
        }
      }

      return {
        data: documents,
        lastDoc,
        hasMore
      };
    } catch (error) {
      console.error(`Erreur lors de la pagination dans ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Recherche dans les documents
   */
  async search(searchTerm: string, searchFields: string[]): Promise<T[]> {
    try {
      // Firebase ne supporte pas la recherche full-text native
      // On récupère tous les documents et on filtre côté client
      const allDocuments = await this.list();
      
      const filteredDocuments = allDocuments.filter(doc => {
        return searchFields.some(field => {
          const fieldValue = this.getNestedValue(doc, field);
          if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        });
      });

      return filteredDocuments;
    } catch (error) {
      console.error(`Erreur lors de la recherche dans ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Compte le nombre de documents
   */
  async count(filters?: QueryFilter[]): Promise<number> {
    try {
      const options: QueryOptions = filters ? { filters } : {};
      const documents = await this.list(options);
      return documents.length;
    } catch (error) {
      console.error(`Erreur lors du comptage dans ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Vérifie si un document existe
   */
  async exists(id: string): Promise<boolean> {
    try {
      const doc = await this.read(id);
      return doc !== null;
    } catch (error) {
      console.error(`Erreur lors de la vérification d'existence dans ${this.collectionName}:`, error);
      return false;
    }
  }

  /**
   * Création en lot
   */
  async createBatch(documents: Omit<T, 'id'>[]): Promise<T[]> {
    try {
      const batch = writeBatch(db);
      const results: T[] = [];

      for (const docData of documents) {
        const docRef = doc(collection(db, this.collectionName));
        const dataWithTimestamps = {
          ...docData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        batch.set(docRef, dataWithTimestamps);
        results.push({
          ...dataWithTimestamps,
          id: docRef.id
        } as T);
      }

      await batch.commit();
      return results;
    } catch (error) {
      console.error(`Erreur lors de la création en lot dans ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Suppression en lot
   */
  async deleteBatch(ids: string[]): Promise<void> {
    try {
      const batch = writeBatch(db);

      for (const id of ids) {
        const docRef = doc(db, this.collectionName, id);
        batch.delete(docRef);
      }

      await batch.commit();
    } catch (error) {
      console.error(`Erreur lors de la suppression en lot dans ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Utilitaire pour obtenir une valeur nested dans un objet
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// Services spécialisés pour chaque collection

export interface FirestoreProduct {
  id?: string;
  name: Record<string, string>;
  description: Record<string, string>;
  price: { cny: number; unitCny: number };
  images: string[];
  category: string;
  supplierId: string;
  moq: number;
  certifiedCE: boolean;
  origin?: string;
  material?: string;
  brand?: string;
  modelNumber?: string;
  application?: string;
  style?: string;
  specifications?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface FirestoreOrder {
  id?: string;
  userId: string;
  supplierId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  currency: string;
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FirestoreSupplier {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  location: string;
  rating?: number;
  verified?: boolean;
  products?: string[];
  email?: string;
  phone?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FirestoreMessage {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FirestoreNotification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// Instances des services pour chaque collection
export const productsService = new FirestoreCrudService<FirestoreProduct>('products');
export const ordersService = new FirestoreCrudService<FirestoreOrder>('orders');
export const suppliersService = new FirestoreCrudService<FirestoreSupplier>('suppliers');
export const messagesService = new FirestoreCrudService<FirestoreMessage>('messages');
export const notificationsService = new FirestoreCrudService<FirestoreNotification>('notifications');
