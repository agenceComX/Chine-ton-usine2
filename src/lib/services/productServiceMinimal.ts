// Version temporaire simplifiée pour test de build
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
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebaseClient';

export interface Product {
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  brand: string;
  category: string;
  image: string;
  images?: string[];
  videos?: string[];
  documents?: string[];
  description?: string;
  features?: string[];
  isNew?: boolean;
  isPopular?: boolean;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductQueryOptions {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limitCount?: number;
  startAfter?: QueryDocumentSnapshot;
}

export class ProductService {
  private readonly collectionName = 'products';

  async getProducts(options: ProductQueryOptions = {}): Promise<{ products: Product[], hasMore: boolean, lastDoc?: QueryDocumentSnapshot }> {
    try {
      const {
        category,
        brand,
        minPrice,
        maxPrice,
        searchTerm,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        limitCount = 20,
        startAfter: startAfterDoc
      } = options;

      let q = query(collection(db, this.collectionName));

      if (category && category !== 'Toutes les catégories') {
        q = query(q, where('category', '==', category));
      }

      if (brand) {
        q = query(q, where('brand', '==', brand));
      }

      if (minPrice !== undefined) {
        q = query(q, where('price', '>=', minPrice));
      }

      if (maxPrice !== undefined) {
        q = query(q, where('price', '<=', maxPrice));
      }

      q = query(q, orderBy(sortBy, sortOrder));
      q = query(q, limit(limitCount + 1));

      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const snapshot = await getDocs(q);
      const docs = snapshot.docs;
      const hasMore = docs.length > limitCount;
      
      if (hasMore) {
        docs.pop();
      }

      const products: Product[] = docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
      } as Product));

      let filteredProducts = products;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredProducts = products.filter(product =>
          product.name.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
        );
      }

      return {
        products: filteredProducts,
        hasMore: hasMore && filteredProducts.length === limitCount,
        lastDoc: hasMore ? docs[docs.length - 1] : undefined
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      throw error;
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || new Date()
        } as Product;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      throw error;
    }
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const productData = {
        ...product,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, this.collectionName), productData);
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  }

  // Méthodes simplifiées sans médias pour éviter les problèmes de build
  async getAllProducts(): Promise<Product[]> {
    const result = await this.getProducts({ limitCount: 1000 });
    return result.products;
  }

  async getCategories(): Promise<string[]> {
    try {
      const snapshot = await getDocs(collection(db, this.collectionName));
      const categories = new Set<string>();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.category) {
          categories.add(data.category);
        }
      });
      
      return Array.from(categories).sort();
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  }

  async getBrands(): Promise<string[]> {
    try {
      const snapshot = await getDocs(collection(db, this.collectionName));
      const brands = new Set<string>();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.brand) {
          brands.add(data.brand);
        }
      });
      
      return Array.from(brands).sort();
    } catch (error) {
      console.error('Erreur lors de la récupération des marques:', error);
      throw error;
    }
  }

  async getFeatures(): Promise<string[]> {
    try {
      const snapshot = await getDocs(collection(db, this.collectionName));
      const features = new Set<string>();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.features && Array.isArray(data.features)) {
          data.features.forEach((feature: string) => features.add(feature));
        }
      });
      
      return Array.from(features).sort();
    } catch (error) {
      console.error('Erreur lors de la récupération des fonctionnalités:', error);
      throw error;
    }
  }
  async initializeWithSampleData(): Promise<void> {
    // Méthode vide pour compatibilité
    console.log('initializeWithSampleData appelée - version simplifiée');
  }

  // Méthodes manquantes pour compatibilité
  async deleteProduct(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return await this.createProduct(product);
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.getProduct(id);
  }

  async searchProducts(searchTerm: string): Promise<Product[]> {
    const result = await this.getProducts({ searchTerm, limitCount: 100 });
    return result.products;
  }
}

export const productService = new ProductService();
