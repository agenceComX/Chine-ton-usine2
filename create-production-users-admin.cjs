/**
 * Script de création automatique des 4 utilisateurs de production
 * Utilise Firebase Admin SDK pour une sécurité maximale
 * 
 * PRÉREQUIS:
 * 1. npm install firebase-admin
 * 2. Télécharger le fichier serviceAccountKey.json depuis Firebase Console
 * 3. Configurer le chemin vers le fichier de service account
 * 
 * FONCTIONNALITÉS:
 * - Création dans Firebase Authentication
 * - Enregistrement des métadonnées dans Firestore
 * - Gestion complète des erreurs
 * - Vérification des doublons
 * - Génération automatique des timestamps
 */

const admin = require('firebase-admin');
const path = require('path');

// Configuration du projet
const CONFIG = {
    // Chemin vers votre fichier de clé de service JSON
    // Téléchargez-le depuis: Firebase Console > Paramètres > Comptes de service
    serviceAccountPath: './serviceAccountKey.json',

    // Projet Firebase
    projectId: 'chine-ton-usine',

    // Collection Firestore pour les utilisateurs
    usersCollection: 'users'
};

// Données des 4 utilisateurs de production
const PRODUCTION_USERS = [
    {
        email: 'admin@chinetonusine.com',
        password: 'Admin2024!Secure',
        userData: {
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
                canManageOrders: true
            },
            settings: {
                notifications: true,
                emailAlerts: true,
                theme: 'light',
                timezone: 'Europe/Paris'
            }
        }
    },
    {
        email: 'fournisseur@chinetonusine.com',
        password: 'Supplier2024!Secure',
        userData: {
            name: 'Fournisseur Demo',
            role: 'supplier',
            company: 'Supplier Corp',
            language: 'fr',
            currency: 'EUR',
            isActive: true,
            businessInfo: {
                businessType: 'manufacturer',
                certifications: ['ISO9001', 'CE'],
                specialties: ['electronics', 'textiles'],
                minimumOrder: 100
            },
            settings: {
                notifications: true,
                emailAlerts: true,
                theme: 'light',
                timezone: 'Asia/Shanghai'
            }
        }
    },
    {
        email: 'client@chinetonusine.com',
        password: 'Client2024!Secure',
        userData: {
            name: 'Client Demo',
            role: 'customer',
            company: 'Client Corp',
            language: 'fr',
            currency: 'EUR',
            isActive: true,
            preferences: {
                preferredCategories: ['electronics', 'fashion'],
                priceRange: { min: 10, max: 1000 },
                shippingMethod: 'express'
            },
            settings: {
                notifications: true,
                emailAlerts: false,
                theme: 'light',
                timezone: 'Europe/Paris'
            }
        }
    },
    {
        email: 'influenceur@chinetonusine.com',
        password: 'Influencer2024!Secure',
        userData: {
            name: 'Influenceur Demo',
            role: 'influencer',
            company: 'Influence Agency',
            language: 'fr',
            currency: 'EUR',
            isActive: true,
            influencerInfo: {
                platforms: ['instagram', 'tiktok', 'youtube'],
                followers: 50000,
                niche: ['fashion', 'lifestyle'],
                engagementRate: 3.5
            },
            settings: {
                notifications: true,
                emailAlerts: true,
                theme: 'dark',
                timezone: 'Europe/Paris'
            }
        }
    }
];

/**
 * Initialise Firebase Admin SDK
 * @returns {Object} Instance Firebase Admin
 */
function initializeFirebaseAdmin() {
    try {
        // Vérifier si Firebase Admin est déjà initialisé
        if (admin.apps.length === 0) {
            // Charger le fichier de service account
            const serviceAccount = require(path.resolve(CONFIG.serviceAccountPath));

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: CONFIG.projectId
            });

            console.log('✅ Firebase Admin SDK initialisé avec succès');
            console.log(`📊 Projet: ${CONFIG.projectId}`);
        }

        return {
            auth: admin.auth(),
            firestore: admin.firestore()
        };
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation Firebase Admin:');
        console.error('   - Vérifiez le fichier serviceAccountKey.json');
        console.error('   - Vérifiez les permissions du service account');
        console.error('   - Détails:', error.message);
        throw error;
    }
}

/**
 * Vérifie si un utilisateur existe déjà dans Authentication
 * @param {Object} auth - Instance Firebase Auth
 * @param {string} email - Email à vérifier
 * @returns {Object|null} Utilisateur existant ou null
 */
async function checkUserExists(auth, email) {
    try {
        const userRecord = await auth.getUserByEmail(email);
        return userRecord;
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            return null;
        }
        throw error;
    }
}

/**
 * Crée un utilisateur dans Firebase Authentication
 * @param {Object} auth - Instance Firebase Auth
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @param {Object} userData - Données additionnelles
 * @returns {Object} Utilisateur créé
 */
async function createAuthUser(auth, email, password, userData) {
    try {
        console.log(`🔐 Création de l'utilisateur Auth: ${email}`);

        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: userData.name,
            emailVerified: true, // Email vérifié automatiquement
            disabled: false
        });

        console.log(`✅ Utilisateur Auth créé avec UID: ${userRecord.uid}`);
        return userRecord;
    } catch (error) {
        console.error(`❌ Erreur création Auth pour ${email}:`, error.message);
        throw error;
    }
}

/**
 * Crée ou met à jour un document utilisateur dans Firestore
 * @param {Object} firestore - Instance Firestore
 * @param {string} uid - UID de l'utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {Object} userData - Données utilisateur
 * @returns {Object} Document créé
 */
async function createFirestoreUser(firestore, uid, email, userData) {
    try {
        console.log(`📄 Création du document Firestore pour: ${email}`);

        // Préparation des données complètes
        const firestoreData = {
            // Informations de base
            uid: uid,
            email: email,
            name: userData.name,
            role: userData.role,
            company: userData.company,
            language: userData.language,
            currency: userData.currency,
            isActive: userData.isActive,

            // Timestamps
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            lastLoginAt: null,

            // Données spécifiques au rôle
            ...(userData.permissions && { permissions: userData.permissions }),
            ...(userData.businessInfo && { businessInfo: userData.businessInfo }),
            ...(userData.preferences && { preferences: userData.preferences }),
            ...(userData.influencerInfo && { influencerInfo: userData.influencerInfo }),

            // Paramètres utilisateur
            settings: userData.settings,

            // Structure future (vide pour l'instant)
            favorites: [],
            messages: [],
            browsingHistory: [],

            // Métadonnées
            metadata: {
                version: '1.0',
                source: 'production-setup',
                lastUpdatedBy: 'system'
            }
        };

        // Enregistrement dans Firestore
        const userRef = firestore.collection(CONFIG.usersCollection).doc(uid);
        await userRef.set(firestoreData);

        console.log(`✅ Document Firestore créé pour: ${email}`);
        return firestoreData;
    } catch (error) {
        console.error(`❌ Erreur création Firestore pour ${email}:`, error.message);
        throw error;
    }
}

/**
 * Crée un utilisateur complet (Auth + Firestore)
 * @param {Object} firebase - Instances Firebase
 * @param {Object} userConfig - Configuration utilisateur
 * @returns {Object} Résultat de la création
 */
async function createCompleteUser(firebase, userConfig) {
    const { email, password, userData } = userConfig;

    try {
        console.log(`\n👤 CRÉATION UTILISATEUR: ${email}`);
        console.log('-'.repeat(50));

        // 1. Vérifier si l'utilisateur existe déjà
        console.log('🔍 Vérification de l\'existence...');
        const existingUser = await checkUserExists(firebase.auth, email);

        let authUser;
        if (existingUser) {
            console.log(`⚠️  Utilisateur Auth déjà existant: ${email}`);
            console.log(`   UID existant: ${existingUser.uid}`);
            authUser = existingUser;
        } else {
            // 2. Créer dans Firebase Authentication
            authUser = await createAuthUser(firebase.auth, email, password, userData);
        }

        // 3. Vérifier si le document Firestore existe
        const userDoc = await firebase.firestore.collection(CONFIG.usersCollection).doc(authUser.uid).get();

        let firestoreData;
        if (userDoc.exists) {
            console.log(`⚠️  Document Firestore déjà existant pour: ${email}`);
            console.log('🔄 Mise à jour des données...');

            // Mettre à jour avec les nouvelles données
            const updateData = {
                ...userData,
                uid: authUser.uid,
                email: email,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            await firebase.firestore.collection(CONFIG.usersCollection).doc(authUser.uid).update(updateData);
            firestoreData = updateData;
        } else {
            // 4. Créer le document Firestore
            firestoreData = await createFirestoreUser(firebase.firestore, authUser.uid, email, userData);
        }

        console.log(`✅ Utilisateur complet créé: ${email}`);
        console.log(`   👤 Nom: ${userData.name}`);
        console.log(`   🏢 Rôle: ${userData.role}`);
        console.log(`   🆔 UID: ${authUser.uid}`);

        return {
            success: true,
            email: email,
            uid: authUser.uid,
            role: userData.role,
            name: userData.name,
            authUser: authUser,
            firestoreData: firestoreData
        };

    } catch (error) {
        console.error(`💥 Échec création utilisateur ${email}:`, error.message);
        return {
            success: false,
            email: email,
            error: error.message,
            stack: error.stack
        };
    }
}

/**
 * Fonction principale de création des utilisateurs de production
 */
async function createProductionUsers() {
    console.log('🏭 CRÉATION DES UTILISATEURS DE PRODUCTION');
    console.log('='.repeat(70));
    console.log(`📊 Projet Firebase: ${CONFIG.projectId}`);
    console.log(`👥 Nombre d'utilisateurs à créer: ${PRODUCTION_USERS.length}`);
    console.log(`📄 Collection Firestore: ${CONFIG.usersCollection}`);
    console.log(`⏰ Démarrage: ${new Date().toISOString()}`);

    let firebase;
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    try {
        // Initialisation Firebase
        firebase = initializeFirebaseAdmin();

        console.log('\n🚀 DÉBUT DE LA CRÉATION DES UTILISATEURS');
        console.log('='.repeat(50));

        // Créer chaque utilisateur
        for (let i = 0; i < PRODUCTION_USERS.length; i++) {
            const userConfig = PRODUCTION_USERS[i];
            console.log(`\n📋 Progression: ${i + 1}/${PRODUCTION_USERS.length}`);

            const result = await createCompleteUser(firebase, userConfig);
            results.push(result);

            if (result.success) {
                successCount++;
            } else {
                errorCount++;
            }

            // Pause entre les créations pour éviter les rate limits
            if (i < PRODUCTION_USERS.length - 1) {
                console.log('⏳ Pause de 1 seconde...');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Résumé final
        console.log('\n📊 RÉSUMÉ DE CRÉATION');
        console.log('='.repeat(40));
        console.log(`✅ Succès: ${successCount}/${PRODUCTION_USERS.length}`);
        console.log(`❌ Échecs: ${errorCount}/${PRODUCTION_USERS.length}`);
        console.log(`⏰ Terminé: ${new Date().toISOString()}`);

        // Détails des résultats
        console.log('\n📋 DÉTAILS DES UTILISATEURS CRÉÉS:');
        console.log('-'.repeat(60));

        results.forEach((result, index) => {
            if (result.success) {
                console.log(`${index + 1}. ✅ ${result.email}`);
                console.log(`   👤 ${result.name} (${result.role})`);
                console.log(`   🆔 ${result.uid}`);
            } else {
                console.log(`${index + 1}. ❌ ${result.email}`);
                console.log(`   💥 ${result.error}`);
            }
        });

        // Erreurs détaillées
        const errors = results.filter(r => !r.success);
        if (errors.length > 0) {
            console.log('\n❌ ERREURS DÉTAILLÉES:');
            console.log('-'.repeat(40));
            errors.forEach(error => {
                console.log(`📧 ${error.email}:`);
                console.log(`   ${error.error}`);
            });
        }

        // Instructions finales
        console.log('\n💡 PROCHAINES ÉTAPES:');
        console.log('-'.repeat(30));
        console.log('1. Testez la connexion avec chaque compte');
        console.log('2. Vérifiez les redirections selon le rôle');
        console.log('3. Configurez les règles Firestore pour la production');
        console.log('4. Changez les mots de passe par défaut');

        console.log('\n🎉 CRÉATION DES UTILISATEURS DE PRODUCTION TERMINÉE !');

        return {
            success: errorCount === 0,
            totalCreated: successCount,
            totalErrors: errorCount,
            results: results
        };

    } catch (error) {
        console.error('\n💥 ERREUR CRITIQUE:', error.message);
        console.error('📋 Stack trace:', error.stack);

        console.log('\n🔧 VÉRIFICATIONS À EFFECTUER:');
        console.log('- Fichier serviceAccountKey.json présent et valide');
        console.log('- Permissions du service account correctes');
        console.log('- Connexion internet active');
        console.log('- Projet Firebase accessible');

        throw error;
    }
}

/**
 * Gestion des erreurs globales
 */
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Erreur non gérée:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Exception non capturée:', error.message);
    process.exit(1);
});

// Point d'entrée principal
if (require.main === module) {
    console.log('🚀 Démarrage du script de création des utilisateurs de production...');
    console.log('');

    createProductionUsers()
        .then((result) => {
            console.log('\n🎯 SCRIPT TERMINÉ');
            if (result.success) {
                console.log('✅ Tous les utilisateurs ont été créés avec succès !');
                process.exit(0);
            } else {
                console.log(`⚠️  ${result.totalErrors} erreur(s) rencontrée(s)`);
                process.exit(1);
            }
        })
        .catch((error) => {
            console.error('💥 ÉCHEC CRITIQUE DU SCRIPT:', error.message);
            process.exit(1);
        });
}

// Export pour utilisation en module
module.exports = {
    createProductionUsers,
    PRODUCTION_USERS,
    CONFIG
};
