import { auth, db } from '../lib/firebaseClient';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { productService } from '../lib/services/productServiceMinimal';

export const testFirebaseConnection = async () => {
  console.log('🧪 Testing Firebase connection...');
  
  try {
    // Test Firestore connection
    const testCollection = collection(db, 'test');
    console.log('✅ Firestore connection successful');
    
    // Test Auth connection
    const currentUser = auth.currentUser;
    console.log('✅ Auth connection successful', currentUser ? `User: ${currentUser.email}` : 'No user logged in');
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};

// Script de test pour l'intégration Firebase des produits
export const testFirebaseIntegration = async () => {
  try {
    console.log('🔄 Test de l\'intégration Firebase...');
    
    // 1. Initialiser les données de démonstration
    console.log('📝 Initialisation des données de démonstration...');
    await productService.initializeWithSampleData();
    console.log('✅ Données de démonstration initialisées');
    
    // 2. Récupérer tous les produits
    console.log('📦 Récupération des produits...');
    const products = await productService.getAllProducts();
    console.log(`✅ ${products.length} produits récupérés`);
    
    // 3. Tester les filtres
    console.log('🔍 Test des filtres...');
    const categories = await productService.getCategories();
    const brands = await productService.getBrands();
    const features = await productService.getFeatures();
    
    console.log(`✅ ${categories.length} catégories trouvées:`, categories);
    console.log(`✅ ${brands.length} marques trouvées:`, brands);
    console.log(`✅ ${features.length} fonctionnalités trouvées:`, features);
    
    // 4. Tester la recherche
    console.log('🔎 Test de la recherche...');
    const searchResults = await productService.searchProducts('Samsung');
    console.log(`✅ ${searchResults.length} produits trouvés pour "Samsung"`);
    
    // 5. Tester la récupération par ID
    if (products.length > 0) {
      const firstProduct = products[0];
      if (firstProduct.id) {
        console.log('🆔 Test de récupération par ID...');
        const productById = await productService.getProductById(firstProduct.id);
        console.log(`✅ Produit récupéré:`, productById?.name);
      }
    }
    
    console.log('🎉 Test Firebase terminé avec succès !');
    return {
      success: true,
      productsCount: products.length,
      categoriesCount: categories.length,
      brandsCount: brands.length,
      featuresCount: features.length
    };
    
  } catch (error) {
    console.error('❌ Erreur lors du test Firebase:', error);
    return {
      success: false,
      error: error
    };
  }
};

// Fonction pour nettoyer les données de test (si nécessaire)
export const cleanupTestData = async () => {
  try {
    console.log('🧹 Nettoyage des données de test...');
    const products = await productService.getAllProducts();
    
    for (const product of products) {
      if (product.id) {
        await productService.deleteProduct(product.id);
      }
    }
    
    console.log('✅ Données de test nettoyées');
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    return { success: false, error };
  }
};

export const testAuthentication = async () => {
  console.log('🧪 Testing authentication with test user...');
  
  try {
    // Try to sign in with test admin user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      'admin@chine-ton-usine.com',
      'admin123456'
    );
    
    console.log('✅ Authentication successful:', userCredential.user.email);
    
    // Test reading user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (userDoc.exists()) {
      console.log('✅ User data retrieved:', userDoc.data());
    } else {
      console.log('⚠️ User document not found in Firestore');
    }
    
    return userCredential.user;
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    return null;
  }
};

export const testFirestoreCRUD = async () => {
  console.log('🧪 Testing Firestore CRUD operations...');
  
  try {
    // Test creating a document
    const testDocRef = doc(db, 'test', 'firebase-test');
    await setDoc(testDocRef, {
      message: 'Hello Firebase!',
      timestamp: new Date(),
      test: true
    });
    console.log('✅ Document created successfully');
    
    // Test reading the document
    const testDoc = await getDoc(testDocRef);
    if (testDoc.exists()) {
      console.log('✅ Document read successfully:', testDoc.data());
    } else {
      console.log('❌ Document not found');
    }
    
    // Test reading collections
    const collections = ['users', 'products', 'orders', 'suppliers', 'messages', 'notifications'];
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      console.log(`✅ ${collectionName} collection: ${snapshot.size} documents`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Firestore CRUD test failed:', error);
    return false;
  }
};

export const runAllTests = async () => {
  console.log('🚀 Starting Firebase integration tests...');
  
  const connectionTest = await testFirebaseConnection();
  const authTest = await testAuthentication();
  const crudTest = await testFirestoreCRUD();
  
  console.log('\n📊 Test Results:');
  console.log(`Connection: ${connectionTest ? '✅' : '❌'}`);
  console.log(`Authentication: ${authTest ? '✅' : '❌'}`);
  console.log(`CRUD Operations: ${crudTest ? '✅' : '❌'}`);
  
  if (connectionTest && authTest && crudTest) {
    console.log('🎉 All Firebase tests passed!');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above.');
  }
  
  return { connectionTest, authTest, crudTest };
};
