import { Product } from '../types';
import { products as initialProducts } from '../data/products';

const STORAGE_KEY = 'global_products_list';

/**
 * Service centralisé de gestion des produits
 * Permet de synchroniser les produits entre la gestion fournisseur et la découverte
 */
class ProductsService {
  private static instance: ProductsService;
  private listeners: Array<() => void> = [];

  static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  /**
   * Écouter les changements dans la liste des produits
   */
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    // Retourner une fonction pour se désabonner
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notifier tous les listeners d'un changement
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Erreur lors de la notification d\'un listener:', error);
      }
    });
  }

  /**
   * Obtenir tous les produits (initiaux + ajoutés par fournisseurs)
   */
  getAllProducts(): Product[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      console.log('🔍 ProductsService: localStorage contenu:', saved ? 'Données présentes' : 'Aucune donnée');

      if (saved) {
        const parsedProducts = JSON.parse(saved);
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          console.log('🔍 ProductsService: Produits chargés depuis localStorage:', parsedProducts.length);
          return parsedProducts;
        } else {
          console.log('⚠️ ProductsService: localStorage contient un tableau vide ou invalide');
        }
      }
    } catch (error) {
      console.error('❌ ProductsService: Erreur lors du chargement depuis localStorage:', error);
    }

    // Première fois ou erreur : initialiser avec les produits par défaut
    console.log('� ProductsService: Initialisation avec produits par défaut:', initialProducts?.length || 'ERREUR D\'IMPORT');

    // Vérifier que les produits initiaux sont bien importés
    if (!initialProducts || !Array.isArray(initialProducts) || initialProducts.length === 0) {
      console.error('❌ ProductsService: ERREUR CRITIQUE - Aucun produit initial trouvé !');
      return [];
    }

    this.saveProducts(initialProducts);
    return initialProducts;
  }
  /**
   * Sauvegarder la liste complète des produits
   */
  saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      // Notifier tous les composants d'un changement
      this.notifyListeners();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des produits globaux:', error);
    }
  }

  /**
   * Ajouter un nouveau produit
   */
  addProduct(product: Product): void {
    const currentProducts = this.getAllProducts();
    const updatedProducts = [product, ...currentProducts];
    this.saveProducts(updatedProducts);
  }

  /**
   * Mettre à jour un produit existant
   */
  updateProduct(productId: string, updatedProduct: Partial<Product>): void {
    const currentProducts = this.getAllProducts();
    const updatedProducts = currentProducts.map(p =>
      p.id === productId ? { ...p, ...updatedProduct } : p
    );
    this.saveProducts(updatedProducts);
  }

  /**
   * Forcer la réinitialisation avec les produits par défaut
   */
  forceReset(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🔄 ProductsService: localStorage effacé, réinitialisation forcée');
    this.saveProducts(initialProducts);
  }
  deleteProduct(productId: string): void {
    const currentProducts = this.getAllProducts();
    const updatedProducts = currentProducts.filter(p => p.id !== productId);
    this.saveProducts(updatedProducts);
  }

  /**
   * Obtenir les produits d'un fournisseur spécifique
   * (pour la gestion côté fournisseur)
   */
  getSupplierProducts(supplierId?: string): Product[] {
    const allProducts = this.getAllProducts();

    // Si pas de supplierId spécifié, retourner tous les produits pour la démo
    if (!supplierId) {
      return allProducts;
    }

    // Filtrer par supplierId si disponible dans les données
    return allProducts.filter(product =>
      (product as any).supplierId === supplierId
    );
  }

  /**
   * Obtenir un produit par son ID (recherche dans tous les produits)
   */
  getProductById(id: string): Product | undefined {
    const allProducts = this.getAllProducts();
    return allProducts.find(product => product.id === id);
  }

  /**
   * Réinitialiser aux produits par défaut
   */
  resetToDefault(): void {
    this.saveProducts(initialProducts);
  }

  /**
   * Synchroniser les données des fournisseurs avec la base globale
   */
  syncSupplierProducts(supplierProducts: Product[]): void {
    const allProducts = this.getAllProducts();

    // Récupérer les IDs des produits du fournisseur
    const supplierProductIds = supplierProducts.map(p => p.id);

    // Garder les produits qui ne viennent pas du fournisseur
    const otherProducts = allProducts.filter(p => !supplierProductIds.includes(p.id));

    // Combiner avec les nouveaux produits du fournisseur
    const syncedProducts = [...supplierProducts, ...otherProducts];

    this.saveProducts(syncedProducts);
  }
}

export const productsService = ProductsService.getInstance();
