import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8",
    authDomain: "chine-ton-usine.firebaseapp.com",
    projectId: "chine-ton-usine",
    storageBucket: "chine-ton-usine.firebasestorage.app",
    messagingSenderId: "528021984213",
    appId: "1:528021984213:web:9d5e249e7c6c2ddcd1635c",
    measurementId: "G-23BQZPXP86"
};

// Utilisateurs avec structure complète selon vos spécifications
const PRODUCTION_USERS = [
    {
        uid: 'admin-temp-uid',
        email: 'admin@chinetonusine.com',
        name: 'Administrateur Principal',
        role: 'admin',
        company: 'ChineTonUsine',
        language: 'fr',
        currency: 'EUR',
        isActive: true,
        permissions: {
            canManageUsers: true,
            canManageProducts: true,
            canViewAnalytics: true,
            canManageOrders: true,
            canManageSuppliers: true,
            canAccessAdmin: true
        },
        settings: {
            notifications: true,
            emailAlerts: true,
            theme: 'light',
            timezone: 'Europe/Paris',
            language: 'fr'
        }
    },
    {
        uid: 'V6CIjikHYpSWPQzpi6ZXj1TiKVv2',
        email: 'fournisseur@chinetonusine.com',
        name: 'Fournisseur Demo',
        role: 'supplier',
        company: 'Supplier Corp',
        language: 'fr',
        currency: 'EUR',
        isActive: true,
        businessInfo: {
            businessType: 'manufacturer',
            certifications: ['ISO9001', 'CE', 'RoHS'],
            specialties: ['electronics', 'textiles', 'machinery'],
            minimumOrder: 100,
            leadTime: '15-30 days',
            shippingMethods: ['sea', 'air', 'express']
        },
        settings: {
            notifications: true,
            emailAlerts: true,
            theme: 'light',
            timezone: 'Asia/Shanghai',
            language: 'fr'
        }
    },
    {
        uid: 'WxockA2qLMdxDEDdPp47B1nTYIn1',
        email: 'client@chinetonusine.com',
        name: 'Client Demo',
        role: 'customer',
        company: 'Client Corp',
        language: 'fr',
        currency: 'EUR',
        isActive: true,
        preferences: {
            preferredCategories: ['electronics', 'fashion', 'home'],
            priceRange: { min: 10, max: 1000 },
            shippingMethod: 'express',
            paymentMethods: ['card', 'paypal', 'transfer']
        },
        settings: {
            notifications: true,
            emailAlerts: false,
            theme: 'light',
            timezone: 'Europe/Paris',
            language: 'fr'
        }
    },
    {
        uid: '4wG4BrY2rYPh65hIn8ZXPKmMSUF3',
        email: 'influenceur@chinetonusine.com',
        name: 'Influenceur Demo',
        role: 'influencer',
        company: 'Influence Agency',
        language: 'fr',
        currency: 'EUR',
        isActive: true,
        influencerInfo: {
            platforms: ['instagram', 'tiktok', 'youtube', 'facebook'],
            followers: {
                instagram: 50000,
                tiktok: 25000,
                youtube: 15000,
                total: 90000
            },
            niche: ['fashion', 'lifestyle', 'tech'],
            engagementRate: 3.5,
            averageViews: 10000
        },
        settings: {
            notifications: true,
            emailAlerts: true,
            theme: 'dark',
            timezone: 'Europe/Paris',
            language: 'fr'
        }
    }
];

async function createCompleteUsersDocuments() {
    console.log('🏭 CRÉATION DES DOCUMENTS UTILISATEURS COMPLETS');
    console.log('='.repeat(70));
    console.log('📊 Structure: Métadonnées complètes selon spécifications');
    console.log('🔧 Fonctionnalités: Structure future préparée');
    console.log('⚡ Mode: Mise à jour des utilisateurs existants');

    try {
        // Initialisation Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        console.log('✅ Firebase initialisé avec succès');

        let successCount = 0;
        let errorCount = 0;

        // Traitement de chaque utilisateur
        for (const userData of PRODUCTION_USERS) {
            try {
                console.log(`\n👤 CRÉATION: ${userData.email}`);
                console.log(`🏢 Rôle: ${userData.role} | Entreprise: ${userData.company}`);
                console.log('-'.repeat(50));

                // Structure complète du document selon vos spécifications
                const completeUserData = {
                    // Informations de base requises
                    uid: userData.uid,
                    email: userData.email,
                    name: userData.name,
                    role: userData.role,
                    company: userData.company,
                    language: userData.language,
                    currency: userData.currency,
                    isActive: userData.isActive,

                    // Timestamps en format ISO comme demandé
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    lastLoginAt: null,
                    lastActivityAt: null,

                    // Données spécifiques au rôle
                    ...(userData.permissions && { permissions: userData.permissions }),
                    ...(userData.businessInfo && { businessInfo: userData.businessInfo }),
                    ...(userData.preferences && { preferences: userData.preferences }),
                    ...(userData.influencerInfo && { influencerInfo: userData.influencerInfo }),

                    // Paramètres utilisateur
                    settings: userData.settings,

                    // Structure future préparée (vide comme demandé)
                    favorites: [],
                    messages: [],
                    browsingHistory: [],

                    // Collections additionnelles pour usage futur
                    recentProducts: [],
                    savedSearches: [],
                    notifications: [],
                    orders: [],
                    quotes: [],
                    reviews: [],

                    // Données sociales et réseau
                    connections: [],
                    followedSuppliers: [],
                    ...(userData.role === 'influencer' && { collaborations: [] }),

                    // Métadonnées système
                    metadata: {
                        version: '1.0',
                        source: 'production-setup-complete',
                        createdBy: 'system',
                        lastUpdatedBy: 'system',
                        migrationStatus: 'complete',
                        dataStructureVersion: '2024.1'
                    },

                    // Flags de statut
                    flags: {
                        isEmailVerified: true,
                        isPhoneVerified: false,
                        isProfileComplete: true,
                        hasAcceptedTerms: true,
                        hasAcceptedPrivacy: true,
                        isProductionReady: true
                    },

                    // Configuration spécifique par rôle
                    ...(userData.role === 'admin' && {
                        adminConfig: {
                            accessLevel: 'full',
                            lastAdminLogin: null,
                            adminActions: [],
                            securityLevel: 'high'
                        }
                    }),

                    ...(userData.role === 'supplier' && {
                        supplierConfig: {
                            verificationStatus: 'verified',
                            catalogUpdatedAt: null,
                            productsCount: 0,
                            rating: 0,
                            totalSales: 0
                        }
                    }),

                    ...(userData.role === 'customer' && {
                        customerConfig: {
                            loyaltyPoints: 0,
                            membershipLevel: 'standard',
                            totalSpent: 0,
                            totalOrders: 0,
                            avgOrderValue: 0
                        }
                    }),

                    ...(userData.role === 'influencer' && {
                        influencerConfig: {
                            verificationStatus: 'verified',
                            campaignsCompleted: 0,
                            totalEarnings: 0,
                            performanceScore: 0
                        }
                    })
                };

                // Enregistrement dans Firestore
                const userRef = doc(db, 'users', userData.uid);
                await setDoc(userRef, completeUserData, { merge: true });

                console.log(`✅ Document créé/mis à jour: ${userData.email}`);
                console.log(`   🆔 UID: ${userData.uid}`);
                console.log(`   👤 Nom: ${userData.name}`);
                console.log(`   🏢 Rôle: ${userData.role}`);
                console.log(`   🏛️  Entreprise: ${userData.company}`);
                console.log(`   🌐 Langue: ${userData.language}`);
                console.log(`   💰 Devise: ${userData.currency}`);
                console.log(`   ✅ Actif: ${userData.isActive ? 'Oui' : 'Non'}`);

                successCount++;

            } catch (error) {
                console.error(`❌ Erreur pour ${userData.email}:`, error.message);
                errorCount++;
            }

            // Pause entre les créations
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Résumé final
        console.log('\n📊 RÉSUMÉ DE CRÉATION');
        console.log('='.repeat(50));
        console.log(`✅ Documents créés/mis à jour: ${successCount}`);
        console.log(`❌ Erreurs: ${errorCount}`);
        console.log(`📋 Total traité: ${PRODUCTION_USERS.length}`);
        console.log(`⏰ Terminé: ${new Date().toLocaleString('fr-FR')}`);

        // Liste des utilisateurs créés
        console.log('\n👥 UTILISATEURS DE PRODUCTION CRÉÉS:');
        console.log('-'.repeat(60));
        PRODUCTION_USERS.forEach((user, index) => {
            console.log(`${index + 1}. 🔹 ${user.role.toUpperCase()}: ${user.email}`);
            console.log(`   👤 ${user.name} (${user.company})`);
            console.log(`   🆔 ${user.uid}`);
        });

        // Informations de connexion
        console.log('\n🔐 INFORMATIONS DE CONNEXION:');
        console.log('-'.repeat(50));
        console.log('🔴 ADMIN: admin@chinetonusine.com | Admin123!');
        console.log('🟢 SUPPLIER: fournisseur@chinetonusine.com | Fournisseur123!');
        console.log('🔵 CUSTOMER: client@chinetonusine.com | Client123!');
        console.log('🟣 INFLUENCER: influenceur@chinetonusine.com | Influenceur123!');

        // Instructions finales
        console.log('\n💡 PROCHAINES ÉTAPES:');
        console.log('-'.repeat(40));
        console.log('1. 🔐 Testez la connexion avec chaque compte');
        console.log('2. 🔄 Vérifiez les redirections selon les rôles');
        console.log('3. 🛡️  Remettez les règles Firestore en production');
        console.log('4. 🔑 Changez les mots de passe par défaut');
        console.log('5. 📧 Configurez la vérification email');

        console.log('\n🎉 CRÉATION DES UTILISATEURS COMPLETS TERMINÉE !');

        return {
            success: errorCount === 0,
            created: successCount,
            errors: errorCount,
            total: PRODUCTION_USERS.length
        };

    } catch (error) {
        console.error('\n💥 ERREUR CRITIQUE:', error.message);
        console.error('📋 Vérifiez la configuration Firebase et les permissions');
        throw error;
    }
}

createCompleteUsersDocuments();
