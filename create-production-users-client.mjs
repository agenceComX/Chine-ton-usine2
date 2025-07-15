/**
 * Script de création des 4 utilisateurs de production - Version Client SDK
 * Plus simple à utiliser, ne nécessite pas de service account
 * 
 * PRÉREQUIS:
 * 1. Règles Firestore en mode développement (temporairement)
 * 2. Configuration Firebase correcte
 * 
 * FONCTIONNALITÉS:
 * - Création automatique dans Firebase Auth
 * - Enregistrement des métadonnées dans Firestore
 * - Gestion complète des erreurs
 * - Structure future préparée
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';

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

// Configuration du script
const CONFIG = {
    usersCollection: 'users',
    batchDelay: 1000, // Délai entre chaque création (ms)
    maxRetries: 3 // Nombre de tentatives en cas d'échec
};

// Définition des 4 utilisateurs de production
const PRODUCTION_USERS = [
    {
        email: 'admin@chinetonusine.com',
        password: 'Admin2024!Secure',
        profile: {
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
                canManageSuppliers: true
            },
            settings: {
                notifications: true,
                emailAlerts: true,
                theme: 'light',
                timezone: 'Europe/Paris',
                language: 'fr'
            },
            features: {
                dashboardAccess: true,
                analyticsAccess: true,
                adminPanel: true
            }
        }
    },
    {
        email: 'fournisseur@chinetonusine.com',
        password: 'Supplier2024!Secure',
        profile: {
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
            },
            features: {
                productManagement: true,
                orderTracking: true,
                inventoryManagement: true
            }
        }
    },
    {
        email: 'client@chinetonusine.com',
        password: 'Client2024!Secure',
        profile: {
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
                paymentMethods: ['card', 'paypal', 'transfer'],
                communicationLanguage: 'french'
            },
            settings: {
                notifications: true,
                emailAlerts: false,
                theme: 'light',
                timezone: 'Europe/Paris',
                language: 'fr'
            },
            features: {
                wishlist: true,
                orderHistory: true,
                recommendations: true
            }
        }
    },
    {
        email: 'influenceur@chinetonusine.com',
        password: 'Influencer2024!Secure',
        profile: {
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
                averageViews: 10000,
                collaborationTypes: ['sponsored', 'affiliate', 'gifted']
            },
            settings: {
                notifications: true,
                emailAlerts: true,
                theme: 'dark',
                timezone: 'Europe/Paris',
                language: 'fr'
            },
            features: {
                contentCreation: true,
                campaignManagement: true,
                analyticsAccess: true
            }
        }
    }
];

/**
 * Initialise Firebase et retourne les instances nécessaires
 */
function initializeFirebase() {
    try {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        console.log('✅ Firebase initialisé avec succès');
        console.log(`📊 Projet: ${firebaseConfig.projectId}`);

        return { auth, db };
    } catch (error) {
        console.error('❌ Erreur d\'initialisation Firebase:', error.message);
        throw error;
    }
}

/**
 * Vérifie si un utilisateur existe déjà dans Firestore
 */
async function checkUserExistsInFirestore(db, email) {
    try {
        const usersRef = collection(db, CONFIG.usersCollection);
        const snapshot = await getDocs(usersRef);

        const existingUser = snapshot.docs.find(doc => {
            const data = doc.data();
            return data.email === email;
        });

        return existingUser ? existingUser.data() : null;
    } catch (error) {
        console.error(`❌ Erreur vérification Firestore pour ${email}:`, error.message);
        return null;
    }
}

/**
 * Crée un utilisateur dans Firebase Authentication
 */
async function createAuthenticationUser(auth, email, password, profile) {
    try {
        console.log(`🔐 Création Auth: ${email}`);

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Mettre à jour le profil avec le nom
        await updateProfile(user, {
            displayName: profile.name
        });

        console.log(`✅ Utilisateur Auth créé: ${email} (UID: ${user.uid})`);
        return user;
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            console.log(`⚠️  Email déjà utilisé: ${email}`);
            // Récupérer l'utilisateur existant si possible
            return null;
        }
        throw error;
    }
}

/**
 * Crée le document utilisateur dans Firestore avec structure complète
 */
async function createFirestoreDocument(db, uid, email, profile) {
    try {
        console.log(`📄 Création document Firestore: ${email}`);

        // Structure complète du document utilisateur
        const userData = {
            // Informations de base
            uid: uid,
            email: email,
            name: profile.name,
            role: profile.role,
            company: profile.company,
            language: profile.language,
            currency: profile.currency,
            isActive: profile.isActive,

            // Timestamps
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastLoginAt: null,
            lastActivityAt: null,

            // Données spécifiques au rôle
            ...(profile.permissions && { permissions: profile.permissions }),
            ...(profile.businessInfo && { businessInfo: profile.businessInfo }),
            ...(profile.preferences && { preferences: profile.preferences }),
            ...(profile.influencerInfo && { influencerInfo: profile.influencerInfo }),
            ...(profile.features && { features: profile.features }),

            // Paramètres utilisateur
            settings: profile.settings,

            // Structure future (collections vides pour l'instant)
            favorites: [],
            recentProducts: [],
            savedSearches: [],

            // Historique et activité (structure préparée)
            browsingHistory: [],
            purchaseHistory: [],
            messages: [],
            notifications: [],

            // Données sociales et networking
            connections: [],
            followedSuppliers: [],
            collaborations: profile.role === 'influencer' ? [] : undefined,

            // Données business
            orders: [],
            quotes: [],
            reviews: [],

            // Métadonnées système
            metadata: {
                version: '1.0',
                source: 'production-setup-client',
                createdBy: 'system',
                lastUpdatedBy: 'system',
                migrationStatus: 'complete'
            },

            // Flags et statuts
            flags: {
                isEmailVerified: true,
                isPhoneVerified: false,
                isProfileComplete: true,
                hasAcceptedTerms: true,
                hasAcceptedPrivacy: true
            },

            // Configuration avancée selon le rôle
            ...(profile.role === 'admin' && {
                adminConfig: {
                    accessLevel: 'full',
                    lastAdminLogin: null,
                    adminActions: []
                }
            }),

            ...(profile.role === 'supplier' && {
                supplierConfig: {
                    verificationStatus: 'verified',
                    catalogUpdatedAt: null,
                    productsCount: 0
                }
            }),

            ...(profile.role === 'customer' && {
                customerConfig: {
                    loyaltyPoints: 0,
                    membershipLevel: 'standard',
                    totalSpent: 0
                }
            }),

            ...(profile.role === 'influencer' && {
                influencerConfig: {
                    verificationStatus: 'verified',
                    campaignsCompleted: 0,
                    totalEarnings: 0
                }
            })
        };

        // Enregistrement dans Firestore
        const userRef = doc(db, CONFIG.usersCollection, uid);
        await setDoc(userRef, userData);

        console.log(`✅ Document Firestore créé: ${email}`);
        console.log(`   👤 Nom: ${profile.name}`);
        console.log(`   🏢 Rôle: ${profile.role}`);
        console.log(`   🏛️  Entreprise: ${profile.company}`);

        return userData;
    } catch (error) {
        console.error(`❌ Erreur création Firestore pour ${email}:`, error.message);
        throw error;
    }
}

/**
 * Crée un utilisateur complet (Auth + Firestore) avec gestion d'erreurs
 */
async function createCompleteUser(firebase, userConfig, retryCount = 0) {
    const { email, password, profile } = userConfig;
    const maxRetries = CONFIG.maxRetries;

    try {
        console.log(`\n👤 CRÉATION UTILISATEUR: ${email}`);
        console.log(`📋 Rôle: ${profile.role} | Entreprise: ${profile.company}`);
        console.log('-'.repeat(60));

        // 1. Vérifier si l'utilisateur existe déjà dans Firestore
        const existingFirestoreUser = await checkUserExistsInFirestore(firebase.db, email);
        if (existingFirestoreUser) {
            console.log(`⚠️  Utilisateur déjà existant dans Firestore: ${email}`);
            return {
                success: true,
                email: email,
                uid: existingFirestoreUser.uid,
                role: profile.role,
                name: profile.name,
                status: 'already_exists'
            };
        }

        // 2. Créer dans Firebase Authentication
        const authUser = await createAuthenticationUser(firebase.auth, email, password, profile);

        let uid;
        if (authUser) {
            uid = authUser.uid;
        } else {
            // Si l'utilisateur existe déjà dans Auth, on ne peut pas récupérer l'UID facilement
            // avec Client SDK. Dans ce cas, on skip.
            console.log(`⚠️  Impossible de créer ${email} - Utilisateur peut-être existant dans Auth`);
            return {
                success: false,
                email: email,
                error: 'User may already exist in Authentication',
                status: 'auth_exists'
            };
        }

        // 3. Créer le document Firestore
        const firestoreData = await createFirestoreDocument(firebase.db, uid, email, profile);

        console.log(`✅ Utilisateur complet créé avec succès: ${email}`);
        console.log(`   🆔 UID: ${uid}`);
        console.log(`   🎯 Statut: Nouveau utilisateur créé`);

        return {
            success: true,
            email: email,
            uid: uid,
            role: profile.role,
            name: profile.name,
            authUser: authUser,
            firestoreData: firestoreData,
            status: 'created'
        };

    } catch (error) {
        console.error(`❌ Erreur lors de la création de ${email}:`, error.message);

        // Gestion des retry
        if (retryCount < maxRetries) {
            console.log(`🔄 Tentative ${retryCount + 1}/${maxRetries} pour ${email}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return createCompleteUser(firebase, userConfig, retryCount + 1);
        }

        return {
            success: false,
            email: email,
            error: error.message,
            code: error.code,
            status: 'error'
        };
    }
}

/**
 * Fonction principale - Crée tous les utilisateurs de production
 */
async function createAllProductionUsers() {
    console.log('🏭 CRÉATION AUTOMATIQUE DES UTILISATEURS DE PRODUCTION');
    console.log('='.repeat(70));
    console.log(`📊 Projet: ${firebaseConfig.projectId}`);
    console.log(`👥 Utilisateurs à créer: ${PRODUCTION_USERS.length}`);
    console.log(`📄 Collection: ${CONFIG.usersCollection}`);
    console.log(`⏰ Début: ${new Date().toLocaleString('fr-FR')}`);

    let firebase;
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    let existingCount = 0;

    try {
        // Initialisation
        firebase = initializeFirebase();

        console.log('\n🚀 DÉBUT DE LA CRÉATION');
        console.log('='.repeat(50));

        // Traitement de chaque utilisateur
        for (let i = 0; i < PRODUCTION_USERS.length; i++) {
            const userConfig = PRODUCTION_USERS[i];

            console.log(`\n📊 Progression: ${i + 1}/${PRODUCTION_USERS.length}`);

            // Créer l'utilisateur
            const result = await createCompleteUser(firebase, userConfig);
            results.push(result);

            // Comptabiliser les résultats
            if (result.success) {
                if (result.status === 'created') {
                    successCount++;
                } else {
                    existingCount++;
                }
            } else {
                errorCount++;
            }

            // Pause entre les créations
            if (i < PRODUCTION_USERS.length - 1) {
                console.log(`⏳ Pause de ${CONFIG.batchDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, CONFIG.batchDelay));
            }
        }

        // Affichage des résultats
        console.log('\n📊 RÉSUMÉ FINAL');
        console.log('='.repeat(50));
        console.log(`✅ Nouveaux utilisateurs créés: ${successCount}`);
        console.log(`♻️  Utilisateurs déjà existants: ${existingCount}`);
        console.log(`❌ Échecs: ${errorCount}`);
        console.log(`📋 Total traité: ${PRODUCTION_USERS.length}`);
        console.log(`⏰ Fin: ${new Date().toLocaleString('fr-FR')}`);

        // Liste détaillée
        console.log('\n📋 DÉTAIL DES UTILISATEURS:');
        console.log('-'.repeat(60));

        results.forEach((result, index) => {
            const icon = result.success ?
                (result.status === 'created' ? '✅' : '♻️') : '❌';
            const status = result.status || 'unknown';

            console.log(`${index + 1}. ${icon} ${result.email}`);
            console.log(`   👤 ${result.name || 'N/A'} (${result.role || 'N/A'})`);
            console.log(`   🆔 ${result.uid || 'N/A'}`);
            console.log(`   📊 Statut: ${status}`);

            if (!result.success && result.error) {
                console.log(`   ❌ Erreur: ${result.error}`);
            }
        });

        // Conseils finaux
        console.log('\n💡 PROCHAINES ÉTAPES:');
        console.log('-'.repeat(40));
        console.log('1. 🔐 Testez la connexion avec chaque compte');
        console.log('2. 🔄 Vérifiez les redirections selon les rôles');
        console.log('3. 🛡️  Remettez les règles Firestore en mode production');
        console.log('4. 🔑 Changez les mots de passe par défaut');
        console.log('5. 📧 Configurez la vérification email si nécessaire');

        // Instructions de connexion
        console.log('\n🔐 INFORMATIONS DE CONNEXION:');
        console.log('-'.repeat(40));
        PRODUCTION_USERS.forEach(user => {
            console.log(`🔹 ${user.profile.role.toUpperCase()}: ${user.email}`);
            console.log(`   Mot de passe: ${user.password}`);
        });

        console.log('\n🎉 CRÉATION DES UTILISATEURS TERMINÉE !');

        return {
            success: errorCount === 0,
            total: PRODUCTION_USERS.length,
            created: successCount,
            existing: existingCount,
            errors: errorCount,
            results: results
        };

    } catch (error) {
        console.error('\n💥 ERREUR CRITIQUE:', error.message);
        console.error('📋 Vérifiez:');
        console.error('- Configuration Firebase correcte');
        console.error('- Règles Firestore en mode développement');
        console.error('- Connexion internet stable');

        throw error;
    }
}

/**
 * Point d'entrée du script
 */
async function main() {
    console.log('🚀 DÉMARRAGE DU SCRIPT DE CRÉATION');
    console.log(`⏰ ${new Date().toLocaleString('fr-FR')}`);
    console.log('');

    try {
        const result = await createAllProductionUsers();

        if (result.success) {
            console.log('\n🎯 SCRIPT TERMINÉ AVEC SUCCÈS !');
            process.exit(0);
        } else {
            console.log(`\n⚠️  SCRIPT TERMINÉ AVEC ${result.errors} ERREUR(S)`);
            process.exit(1);
        }
    } catch (error) {
        console.error('\n💥 ÉCHEC CRITIQUE DU SCRIPT:', error.message);
        process.exit(1);
    }
}

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

// Export pour utilisation en module
export {
    createAllProductionUsers,
    PRODUCTION_USERS,
    CONFIG,
    initializeFirebase,
    createCompleteUser
};
