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
    limit as firestoreLimit,
    QueryDocumentSnapshot,
    DocumentData
} from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

// Types pour les produits (identiques à ceux utilisés dans les pages)
export interface ProductImage {
    id: string;
    url: string;
    alt: string;
}

export interface ProductVariant {
    id: string;
    name: string;
    type: 'color' | 'size' | 'material';
    value: string;
    price?: number;
    available: boolean;
}

export interface Supplier {
    id: string;
    name: string;
    location: string;
    rating: number;
    verified: boolean;
    responseTime: string;
    avatar?: string;
}

export interface Product {
    id?: string; // Optionnel car généré par Firebase
    name: string;
    description: string;
    longDescription: string;
    price: number;
    moq: number;
    category: string;
    images: ProductImage[];
    variants: ProductVariant[];
    supplier: Supplier;
    stock: number;
    tags: string[];
    deliveryTime: {
        min: number;
        max: number;
        unit: 'days' | 'weeks';
    };
    specifications: Record<string, string>;
    discount?: {
        minQty: number;
        percentage: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
    active?: boolean; // Pour masquer/afficher des produits
}

// Interface simplifiée pour la liste des produits
export interface ProductListItem {
    id: string;
    name: string;
    price: number;
    moq: number;
    category: string;
    image: string; // URL de l'image principale
    supplier: {
        name: string;
        location: string;
        rating: number;
        verified: boolean;
    };
    description: string;
    variants: string[]; // Noms simplifiés des variantes
    stock: number;
    tags: string[];
    discount?: {
        minQty: number;
        percentage: number;
    };
}

const PRODUCTS_COLLECTION = 'products';

// Convertir un document Firestore en objet Product
const convertFirestoreProduct = (doc: QueryDocumentSnapshot<DocumentData>): Product => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    } as Product;
};

// Convertir un Product en données pour Firestore
const convertProductForFirestore = (product: Omit<Product, 'id'>) => {
    return {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

// Service pour gérer les produits
export class ProductService {

    // Récupérer tous les produits actifs
    static async getAllProducts(): Promise<ProductListItem[]> {
        try {
            const q = query(
                collection(db, PRODUCTS_COLLECTION)
            );

            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => {
                const product = convertFirestoreProduct(doc);
                return {
                    id: product.id!,
                    name: product.name,
                    price: product.price,
                    moq: product.moq,
                    category: product.category,
                    image: product.images[0]?.url || '',
                    supplier: product.supplier,
                    description: product.description,
                    variants: product.variants?.map(v => v.name) || [],
                    stock: product.stock,
                    tags: product.tags || [],
                    discount: product.discount
                };
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
            throw new Error('Impossible de charger les produits');
        }
    }

    // Récupérer les produits par catégorie
    static async getProductsByCategory(category: string): Promise<ProductListItem[]> {
        try {
            const q = query(
                collection(db, PRODUCTS_COLLECTION),
                where('category', '==', category),
                where('active', '==', true),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => {
                const product = convertFirestoreProduct(doc);
                return {
                    id: product.id!,
                    name: product.name,
                    price: product.price,
                    moq: product.moq,
                    category: product.category,
                    image: product.images[0]?.url || '',
                    supplier: product.supplier,
                    description: product.description,
                    variants: product.variants.map(v => v.name),
                    stock: product.stock,
                    tags: product.tags,
                    discount: product.discount
                };
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des produits par catégorie:', error);
            throw new Error('Impossible de charger les produits de cette catégorie');
        }
    }

    // Récupérer un produit par son ID
    static async getProductById(productId: string): Promise<Product | null> {
        try {
            const docRef = doc(db, PRODUCTS_COLLECTION, productId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return convertFirestoreProduct(docSnap as QueryDocumentSnapshot<DocumentData>);
            } else {
                return null;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du produit:', error);
            throw new Error('Impossible de charger le produit');
        }
    }

    // Rechercher des produits
    static async searchProducts(searchTerm: string): Promise<ProductListItem[]> {
        try {
            // Recherche simple par nom (Firebase ne supporte pas la recherche full-text native)
            const q = query(
                collection(db, PRODUCTS_COLLECTION),
                where('active', '==', true),
                orderBy('name')
            );

            const querySnapshot = await getDocs(q);

            const allProducts = querySnapshot.docs.map(doc => {
                const product = convertFirestoreProduct(doc);
                return {
                    id: product.id!,
                    name: product.name,
                    price: product.price,
                    moq: product.moq,
                    category: product.category,
                    image: product.images[0]?.url || '',
                    supplier: product.supplier,
                    description: product.description,
                    variants: product.variants.map(v => v.name),
                    stock: product.stock,
                    tags: product.tags,
                    discount: product.discount
                };
            });

            // Filtrer côté client (pour une recherche plus avancée, utilisez Algolia ou Elasticsearch)
            const searchTermLower = searchTerm.toLowerCase();
            return allProducts.filter(product =>
                product.name.toLowerCase().includes(searchTermLower) ||
                product.description.toLowerCase().includes(searchTermLower) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
            );
        } catch (error) {
            console.error('Erreur lors de la recherche de produits:', error);
            throw new Error('Impossible de rechercher les produits');
        }
    }

    // Récupérer les produits similaires
    static async getSimilarProducts(productId: string, category: string, limitCount: number = 3): Promise<ProductListItem[]> {
        try {
            const q = query(
                collection(db, PRODUCTS_COLLECTION),
                where('category', '==', category),
                where('active', '==', true),
                orderBy('createdAt', 'desc'),
                firestoreLimit(limitCount + 1) // +1 pour exclure le produit actuel
            );

            const querySnapshot = await getDocs(q);

            const products = querySnapshot.docs
                .map(doc => {
                    const product = convertFirestoreProduct(doc);
                    return {
                        id: product.id!,
                        name: product.name,
                        price: product.price,
                        moq: product.moq,
                        category: product.category,
                        image: product.images[0]?.url || '',
                        supplier: product.supplier,
                        description: product.description,
                        variants: product.variants.map(v => v.name),
                        stock: product.stock,
                        tags: product.tags,
                        discount: product.discount
                    };
                })
                .filter(product => product.id !== productId) // Exclure le produit actuel
                .slice(0, limitCount); // Limiter au nombre demandé

            return products;
        } catch (error) {
            console.error('Erreur lors de la récupération des produits similaires:', error);
            throw new Error('Impossible de charger les produits similaires');
        }
    }

    // Ajouter un nouveau produit (pour l'espace fournisseur)
    static async addProduct(product: Omit<Product, 'id'>): Promise<string> {
        try {
            const productData = convertProductForFirestore(product);
            const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
                ...productData,
                active: true,
            });
            return docRef.id;
        } catch (error) {
            console.error('Erreur lors de l\'ajout du produit:', error);
            throw new Error('Impossible d\'ajouter le produit');
        }
    }

    // Mettre à jour un produit
    static async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
        try {
            const docRef = doc(db, PRODUCTS_COLLECTION, productId);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du produit:', error);
            throw new Error('Impossible de mettre à jour le produit');
        }
    }

    // Supprimer un produit (soft delete)
    static async deleteProduct(productId: string): Promise<void> {
        try {
            const docRef = doc(db, PRODUCTS_COLLECTION, productId);
            await updateDoc(docRef, {
                active: false,
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error('Erreur lors de la suppression du produit:', error);
            throw new Error('Impossible de supprimer le produit');
        }
    }

    // Supprimer définitivement un produit
    static async permanentDeleteProduct(productId: string): Promise<void> {
        try {
            const docRef = doc(db, PRODUCTS_COLLECTION, productId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Erreur lors de la suppression définitive du produit:', error);
            throw new Error('Impossible de supprimer définitivement le produit');
        }
    }
}

export default ProductService;
