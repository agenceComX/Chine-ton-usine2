import { productService } from '../lib/services/productServiceMinimal';

// 🛠️ Scripts de maintenance pour Firebase

/**
 * Réinitialise complètement la base de données produits
 */
export const resetProductsDatabase = async () => {
  try {
    console.log('🔄 Réinitialisation de la base de données produits...');
    
    // 1. Supprimer tous les produits existants
    const existingProducts = await productService.getAllProducts();
    console.log(`🗑️ Suppression de ${existingProducts.length} produits existants...`);
    
    for (const product of existingProducts) {
      if (product.id) {
        await productService.deleteProduct(product.id);
      }
    }
    
    // 2. Réinitialiser avec les données de démonstration
    console.log('📝 Ajout des nouvelles données de démonstration...');
    await productService.initializeWithSampleData();
    
    console.log('✅ Base de données réinitialisée avec succès !');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    return { success: false, error };
  }
};

/**
 * Ajoute des produits supplémentaires pour les tests
 */
export const addTestProducts = async () => {
  try {
    console.log('📦 Ajout de produits de test supplémentaires...');
    
    const additionalProducts = [
      {
        name: 'iPhone 15 Pro Max',
        price: 1199,
        originalPrice: 1299,
        discount: 8,
        brand: 'Apple',
        category: 'Électronique',
        image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
        description: 'Le dernier iPhone avec puce A17 Pro',
        isNew: true,
        isPopular: true,
        stock: 25,
        rating: 4.8,
        reviewCount: 890,
        features: ['5G', 'A17 Pro', 'Titanium', 'Action Button']
      },
      {
        name: 'PlayStation 5 Console',
        price: 499,
        brand: 'Sony',
        category: 'Électronique',
        image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=400&fit=crop',
        description: 'Console de jeu nouvelle génération',
        isPopular: true,
        stock: 10,
        rating: 4.9,
        reviewCount: 2341,
        features: ['4K Gaming', 'Ray Tracing', 'SSD Ultra Rapide']
      },
      {
        name: 'Robe Élégante Zara',
        price: 89,
        originalPrice: 129,
        discount: 31,
        brand: 'Zara',
        category: 'Mode',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
        description: 'Robe élégante pour toutes occasions',
        isNew: true,
        stock: 45,
        rating: 4.3,
        reviewCount: 156,
        features: ['Coton bio', 'Taille ajustable', 'Livraison gratuite']
      }
    ];
    
    for (const product of additionalProducts) {
      await productService.addProduct(product);
    }
    
    console.log(`✅ ${additionalProducts.length} produits de test ajoutés !`);
    return { success: true, count: additionalProducts.length };
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des produits de test:', error);
    return { success: false, error };
  }
};

/**
 * Vérifie l'état de la base de données
 */
export const checkDatabaseStatus = async () => {
  try {
    console.log('📊 Vérification de l\'état de la base de données...');
    
    const products = await productService.getAllProducts();
    const categories = await productService.getCategories();
    const brands = await productService.getBrands();
    const features = await productService.getFeatures();
    
    const status = {
      products: {
        total: products.length,
        byCategory: categories.filter(c => c !== 'Toutes les catégories').map(category => ({
          name: category,
          count: products.filter(p => p.category === category).length
        })),
        byBrand: brands.map(brand => ({
          name: brand,
          count: products.filter(p => p.brand === brand).length
        })),
        newest: products.filter(p => p.isNew).length,
        popular: products.filter(p => p.isPopular).length,
        withDiscount: products.filter(p => p.discount && p.discount > 0).length
      },
      categories: categories.length - 1, // -1 pour exclure "Toutes les catégories"
      brands: brands.length,
      features: features.length
    };
    
    console.log('📊 État de la base de données:', status);
    return { success: true, status };
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
    return { success: false, error };
  }
};

/**
 * Nettoie les données corrompues ou incomplètes
 */
export const cleanupDatabase = async () => {
  try {
    console.log('🧹 Nettoyage des données corrompues...');
    
    const products = await productService.getAllProducts();
    let cleanedCount = 0;
    
    for (const product of products) {
      // Vérifier les champs obligatoires
      if (!product.name || !product.price || !product.brand || !product.category) {
        console.log(`🗑️ Suppression du produit corrompu: ${product.id}`);
        if (product.id) {
          await productService.deleteProduct(product.id);
          cleanedCount++;
        }
      }
    }
    
    console.log(`✅ ${cleanedCount} produits corrompus supprimés`);
    return { success: true, cleanedCount };
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    return { success: false, error };
  }
};

export default {
  resetProductsDatabase,
  addTestProducts,
  checkDatabaseStatus,
  cleanupDatabase
};
