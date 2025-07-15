import { firebaseAuthService } from '../auth/services/firebaseAuthService';
import { UserRole } from '../../types';
import { 
  productsService, 
  ordersService, 
  suppliersService, 
  messagesService,
  FirestoreProduct,
  FirestoreOrder,
  FirestoreSupplier,
  FirestoreMessage
} from './firestoreCrudService';

export interface TestUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  company?: string;
}

// Utilisateurs de test à créer pour chaque rôle
export const TEST_USERS: TestUser[] = [
  {
    email: 'admin@chinetonusine.com',
    password: 'Admin123!',
    name: 'Administrateur Principal',
    role: 'admin',
    company: 'ChineTonUsine Admin'
  },
  {
    email: 'supplier@technomax.com',
    password: 'Supplier123!',
    name: 'Wang Lei - TechnoMax',
    role: 'supplier',
    company: 'TechnoMax Solutions'
  },
  {
    email: 'supplier2@guangzhou.com',
    password: 'Supplier123!',
    name: 'Li Ming - Guangzhou Electronics',
    role: 'supplier',
    company: 'Guangzhou Electronics Co.'
  },
  {
    email: 'client@entreprise.fr',
    password: 'Client123!',
    name: 'Marie Dubois',
    role: 'customer',
    company: 'Entreprise Solutions France'
  },
  {
    email: 'client2@trading.fr',
    password: 'Client123!',
    name: 'Pierre Martin',
    role: 'customer',
    company: 'French Trading Company'
  },
  {
    email: 'sourcer@procurement.com',
    password: 'Sourcer123!',
    name: 'Sophie Bernard - Procurement',
    role: 'sourcer',
    company: 'Global Procurement Services'
  },
  {
    email: 'influencer@social.com',
    password: 'Influencer123!',
    name: 'Alex Thomson - Influencer',
    role: 'influencer',
    company: 'Social Media Influence'
  }
];

class InitializationService {
  private isInitialized = false;
  /**
   * Initialise la base de données avec les utilisateurs de test
   */
  async initializeDatabase(): Promise<void> {
    if (this.isInitialized) {
      console.log('Base de données déjà initialisée');
      return;
    }

    try {
      console.log('🚀 Initialisation de la base de données Firebase...');
      
      // Créer les utilisateurs de test
      const userResults = await this.createTestUsers();
      
      // Créer les données de test pour les collections
      await this.createTestData();
      
      // Afficher les résultats
      const successful = userResults.filter(r => r.success).length;
      const failed = userResults.filter(r => !r.success).length;
      
      console.log(`✅ Initialisation terminée: ${successful} utilisateurs créés, ${failed} erreurs`);
      
      if (failed > 0) {
        console.warn('⚠️ Certains utilisateurs n\'ont pas pu être créés (ils existent peut-être déjà)');
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
      throw error;
    }
  }

  /**
   * Crée tous les utilisateurs de test
   */
  private async createTestUsers(): Promise<Array<{email: string, success: boolean, error?: string}>> {
    const results = [];
    
    for (const testUser of TEST_USERS) {
      try {
        console.log(`Création de l'utilisateur: ${testUser.email} (${testUser.role})`);
        
        const result = await firebaseAuthService.signUp(
          testUser.email,
          testUser.password,
          testUser.name,
          testUser.role
        );
        
        if (result.error) {
          // L'utilisateur existe peut-être déjà
          if (result.error.includes('email-already-in-use')) {
            console.log(`ℹ️ Utilisateur ${testUser.email} existe déjà`);
            results.push({ email: testUser.email, success: true });
          } else {
            console.error(`❌ Erreur pour ${testUser.email}:`, result.error);
            results.push({ email: testUser.email, success: false, error: result.error });
          }
        } else {
          console.log(`✅ Utilisateur ${testUser.email} créé avec succès`);
          results.push({ email: testUser.email, success: true });
          
          // Mettre à jour les informations supplémentaires si nécessaire
          if (testUser.company && result.user) {
            await firebaseAuthService.updateUser(result.user.id, {
              company: testUser.company
            });
          }
        }
        
        // Petit délai pour éviter de surcharger Firebase
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Erreur inattendue pour ${testUser.email}:`, error);
        results.push({ 
          email: testUser.email, 
          success: false, 
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }
    
    return results;
  }

  /**
   * Vérifie si l'initialisation est nécessaire
   */
  async checkInitializationStatus(): Promise<boolean> {
    try {
      // Vérifier si au moins l'admin existe
      const adminExists = await this.checkUserExists('admin@chinetonusine.com');
      return adminExists;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut d\'initialisation:', error);
      return false;
    }
  }

  /**
   * Vérifie si un utilisateur existe
   */
  private async checkUserExists(email: string): Promise<boolean> {
    try {
      // Tenter de se connecter pour vérifier l'existence
      const result = await firebaseAuthService.signIn(email, 'test');
      // Si on arrive ici sans erreur, l'utilisateur existe
      if (result.user) {
        await firebaseAuthService.signOut(); // Se déconnecter immédiatement
        return true;
      }
      return false;
    } catch (error) {
      // Si erreur de mot de passe incorrect, l'utilisateur existe
      if (error instanceof Error && error.message.includes('wrong-password')) {
        return true;
      }
      // Si erreur d'utilisateur non trouvé, il n'existe pas
      return false;
    }
  }

  /**
   * Affiche les informations de connexion des utilisateurs de test
   */
  displayTestCredentials(): void {
    console.log('\n🔑 INFORMATIONS DE CONNEXION DES UTILISATEURS DE TEST:');
    console.log('=' .repeat(60));
    
    TEST_USERS.forEach(user => {
      console.log(`📧 ${user.role.toUpperCase()}: ${user.email}`);
      console.log(`🔒 Mot de passe: ${user.password}`);
      console.log(`👤 Nom: ${user.name}`);
      if (user.company) {
        console.log(`🏢 Entreprise: ${user.company}`);
      }
      console.log('-'.repeat(40));
    });
    
    console.log('\n💡 Utilisez ces identifiants pour tester les différents rôles de l\'application.');
  }
  /**
   * Remet à zéro le statut d'initialisation (pour les tests)
   */
  resetInitializationStatus(): void {
    this.isInitialized = false;
  }

  /**
   * Crée les données de test pour toutes les collections
   */
  private async createTestData(): Promise<void> {
    try {
      console.log('📦 Création des données de test...');

      // Créer des fournisseurs de test
      await this.createTestSuppliers();
      
      // Créer des produits de test
      await this.createTestProducts();
      
      // Créer des commandes de test
      await this.createTestOrders();
        // Créer des messages de test
      await this.createTestMessages();

      console.log('✅ Données de test créées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la création des données de test:', error);
      throw error;
    }
  }

  /**
   * Crée des fournisseurs de test
   */
  private async createTestSuppliers(): Promise<void> {
    const testSuppliers: Omit<FirestoreSupplier, 'id'>[] = [
      {
        userId: 'supplier-1', // Sera remplacé par l'ID réel du fournisseur
        name: 'TechnoMax Solutions',
        description: 'Fabricant leader d\'équipements électroniques et de composants high-tech',
        location: 'Shenzhen, Guangdong, Chine',
        rating: 4.8,
        verified: true,
        email: 'supplier@technomax.com',
        phone: '+86 755 1234 5678',
        website: 'www.technomax-solutions.com'
      },
      {
        userId: 'supplier-2',
        name: 'Guangzhou Electronics Co.',
        description: 'Spécialiste en composants électroniques et appareils grand public',
        location: 'Guangzhou, Guangdong, Chine',
        rating: 4.6,
        verified: true,
        email: 'supplier2@guangzhou.com',
        phone: '+86 20 8765 4321',
        website: 'www.guangzhou-electronics.com'
      }
    ];

    try {
      await suppliersService.createBatch(testSuppliers);
      console.log('✅ Fournisseurs de test créés');
    } catch (error) {
      console.log('ℹ️ Fournisseurs de test déjà existants ou erreur:', error);
    }
  }

  /**
   * Crée des produits de test
   */
  private async createTestProducts(): Promise<void> {
    const testProducts: Omit<FirestoreProduct, 'id'>[] = [
      {
        name: {
          fr: 'Smartphone Android 12"',
          en: 'Android 12" Smartphone',
          zh: '安卓12英寸智能手机'
        },
        description: {
          fr: 'Smartphone haute performance avec écran 6.7 pouces, processeur octa-core et appareil photo 108MP',
          en: 'High-performance smartphone with 6.7-inch display, octa-core processor and 108MP camera',
          zh: '配备6.7英寸显示屏、八核处理器和1.08亿像素摄像头的高性能智能手机'
        },
        price: { cny: 2800, unitCny: 2800 },
        images: [
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500'
        ],
        category: 'Électronique',
        supplierId: 'supplier-1',
        moq: 100,
        certifiedCE: true,
        origin: 'Chine',
        material: 'Aluminium, Verre',
        brand: 'TechnoMax',
        modelNumber: 'TM-SM-2024-001',
        application: 'Communication, Multimédia',
        style: 'Moderne',
        specifications: {
          ecran: '6.7 pouces AMOLED',
          processeur: 'Snapdragon 8 Gen 2',
          memoire: '12GB RAM, 256GB Stockage',
          batterie: '5000mAh',
          systeme: 'Android 13'
        }
      },
      {
        name: {
          fr: 'Écouteurs Bluetooth Premium',
          en: 'Premium Bluetooth Headphones',
          zh: '高级蓝牙耳机'
        },
        description: {
          fr: 'Écouteurs sans fil avec réduction de bruit active et autonomie de 30h',
          en: 'Wireless headphones with active noise cancellation and 30h battery life',
          zh: '具有主动降噪和30小时电池续航的无线耳机'
        },
        price: { cny: 450, unitCny: 450 },
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500'
        ],
        category: 'Audio',
        supplierId: 'supplier-2',
        moq: 50,
        certifiedCE: true,
        origin: 'Chine',
        material: 'Plastique ABS, Métal',
        brand: 'Guangzhou Audio',
        modelNumber: 'GA-BT-2024-002',
        application: 'Musique, Appels',
        style: 'Moderne',
        specifications: {
          connexion: 'Bluetooth 5.3',
          autonomie: '30 heures',
          reductionBruit: 'ANC actif',
          poids: '280g',
          compatibilite: 'iOS, Android, PC'
        }
      }
    ];

    try {
      await productsService.createBatch(testProducts);
      console.log('✅ Produits de test créés');
    } catch (error) {
      console.log('ℹ️ Produits de test déjà existants ou erreur:', error);
    }
  }

  /**
   * Crée des commandes de test
   */
  private async createTestOrders(): Promise<void> {
    const testOrders: Omit<FirestoreOrder, 'id'>[] = [
      {
        userId: 'client-1',
        supplierId: 'supplier-1',
        products: [
          { productId: 'product-1', quantity: 100, price: 2800 },
          { productId: 'product-2', quantity: 50, price: 450 }
        ],
        status: 'processing',
        totalAmount: 302500, // 100*2800 + 50*450
        currency: 'CNY',
        shippingAddress: '123 Rue de la Paix, 75001 Paris, France',
        trackingNumber: 'TRK123456789',
        estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        userId: 'client-2',
        supplierId: 'supplier-2',
        products: [
          { productId: 'product-2', quantity: 25, price: 450 }
        ],
        status: 'shipped',
        totalAmount: 11250, // 25*450
        currency: 'CNY',
        shippingAddress: '456 Avenue des Champs, 69000 Lyon, France',
        trackingNumber: 'TRK987654321',
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    try {
      await ordersService.createBatch(testOrders);
      console.log('✅ Commandes de test créées');
    } catch (error) {
      console.log('ℹ️ Commandes de test déjà existantes ou erreur:', error);
    }
  }

  /**
   * Crée des messages de test
   */
  private async createTestMessages(): Promise<void> {
    const testMessages: Omit<FirestoreMessage, 'id'>[] = [
      {
        senderId: 'client-1',
        receiverId: 'supplier-1',
        content: 'Bonjour, je suis intéressé par vos smartphones. Pouvez-vous me confirmer la disponibilité pour une commande de 100 unités ?',
        isRead: false
      },
      {
        senderId: 'supplier-1',
        receiverId: 'client-1',
        content: 'Bonjour ! Oui, nous avons bien 100 unités en stock. Le délai de livraison est de 14 jours ouvrés. Souhaitez-vous procéder à la commande ?',
        isRead: true
      },
      {
        senderId: 'client-2',
        receiverId: 'supplier-2',
        content: 'Votre commande #ORD-2024-002 a été expédiée avec le numéro de suivi TRK987654321',
        isRead: false
      }
    ];

    try {
      await messagesService.createBatch(testMessages);
      console.log('✅ Messages de test créés');
    } catch (error) {
      console.log('ℹ️ Messages de test déjà existants ou erreur:', error);
    }
  }
}

export const initializationService = new InitializationService();
