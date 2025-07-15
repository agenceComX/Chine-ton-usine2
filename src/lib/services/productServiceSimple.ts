// Service produit simplifié pour test
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

// Interface pour les produits Firebase basique
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
  limit?: number;
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
        limit: queryLimit = 20,
        startAfter: startAfterDoc
      } = options;

      let q = query(collection(db, this.collectionName));

      // Filtres
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

      // Tri
      q = query(q, orderBy(sortBy, sortOrder));

      // Pagination
      q = query(q, limit(queryLimit + 1));

      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const snapshot = await getDocs(q);
      const docs = snapshot.docs;
      const hasMore = docs.length > queryLimit;
      
      if (hasMore) {
        docs.pop(); // Retirer le document extra utilisé pour la pagination
      }

      const products: Product[] = docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
      } as Product));

      // Filtrage par terme de recherche (côté client pour la compatibilité)
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
        hasMore: hasMore && filteredProducts.length === queryLimit,
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

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      };
      
      // Retirer les champs undefined
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
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
}

// Créer et exporter l'instance
export const productService = new ProductService();
export default productService;
