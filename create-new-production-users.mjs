import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Configuration Firebase Admin SDK
const serviceAccountPath = './firebase-service-account.json';

// Données des 4 utilisateurs de production à créer
const PRODUCTION_USERS = [
    {
        email: 'admin@chine-ton-usine.com',
        password: 'AdminSecure2024!',
        name: 'Administrateur Principal',
        role: 'admin',
        company: 'Chine Ton Usine',
        language: 'fr',
        currency: 'EUR'
    },
    {
        email: 'supplier@chine-ton-usine.com',
        password: 'SupplierSecure2024!',
        name: 'Fournisseur Principal',
        role: 'supplier',
        company: 'Guangzhou Manufacturing Co.',
        language: 'fr',
        currency: 'CNY'
    },
    {
        email: 'client@chine-ton-usine.com',
        password: 'ClientSecure2024!',
        name: 'Client Premium',
        role: 'client',
        company: 'Entreprise France SAS',
        language: 'fr',
        currency: 'EUR'
    },
    {
        email: 'influencer@chine-ton-usine.com',
        password: 'InfluencerSecure2024!',
        name: 'Influenceur Business',
        role: 'influencer',
        company: 'Digital Marketing Pro',
        language: 'fr',
        currency: 'EUR'
    }
];

/**
 * Initialise Firebase Admin SDK
 * Gère automatiquement le service account ou les variables d'environnement
 */
function initializeFirebaseAdmin() {
    try {
        // Vérifier si Firebase Admin est déjà initialisé
        if (admin.apps.length === 0) {
            let serviceAccount;

            try {
                // Essayer de charger le fichier de service account
                serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
                console.log('✅ Service account chargé depuis le fichier');
            } catch (error) {
                console.warn('⚠️  Fichier de service account non trouvé, utilisation des variables d\'environnement...');

                // Fallback: utiliser les variables d'environnement
                serviceAccount = {
                    type: "service_account",
                    project_id: process.env.FIREBASE_PROJECT_ID || "chine-ton-usine-2c999",
                    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                    client_email: process.env.FIREBASE_CLIENT_EMAIL,
                    client_id: process.env.FIREBASE_CLIENT_ID,
                    auth_uri: "https://accounts.google.com/o/oauth2/auth",
                    token_uri: "https://oauth2.googleapis.com/token",
                    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
                };
            }

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: process.env.FIREBASE_PROJECT_ID || 'chine-ton-usine-2c999'
            });

            console.log('✅ Firebase Admin SDK initialisé avec succès');
        }

        return {
            auth: admin.auth(),
            firestore: admin.firestore()
        };

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de Firebase Admin:', error.message);
        throw error;
    }
}

/**
 * Vérifie si un utilisateur existe déjà dans Firebase Authentication
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
 */
async function createAuthenticationUser(auth, userData) {
    try {
        console.log(`🔐 Création de l'utilisateur Auth: ${userData.email}`);

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await checkUserExists(auth, userData.email);
        if (existingUser) {
            console.log(`ℹ️  Utilisateur ${userData.email} existe déjà (UID: ${existingUser.uid})`);
            return existingUser;
        }

        // Créer l'utilisateur
        const userRecord = await auth.createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.name,
            emailVerified: true, // Activé automatiquement pour la production
            disabled: false
        });

        console.log(`✅ Utilisateur Auth créé: ${userData.email} (UID: ${userRecord.uid})`);
        return userRecord;

    } catch (error) {
        console.error(`❌ Erreur lors de la création de l'utilisateur Auth ${userData.email}:`, error.message);
        throw error;
    }
}

/**
 * Crée le document Firestore pour l'utilisateur avec structure complète
 */
async function createFirestoreDocument(firestore, userRecord, userData) {
    try {
        console.log(`📄 Création du document Firestore pour: ${userData.email}`);

        const now = new Date().toISOString();

        // Structure complète du document utilisateur
        const userDoc = {
            // Identifiants principaux
            uid: userRecord.uid,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            company: userData.company,
            language: userData.language,
            currency: userData.currency,

            // Métadonnées système
            createdAt: now,
            updatedAt: now,
            isActive: true,
            emailVerified: userRecord.emailVerified || true,

            // Structure future - initialisée mais vide
            favorites: [],
            messages: [],
            browsingHistory: [],

            // Préférences utilisateur
            preferences: {
                notifications: {
                    email: true,
                    push: true,
                    marketing: false
                },
                theme: 'light',
                timezone: 'Europe/Paris',
                language: userData.language
            },

            // Profil spécifique selon le rôle
            profile: generateRoleSpecificProfile(userData.role),

            // Statistiques d'usage
            stats: {
                lastLogin: null,
                loginCount: 0,
                lastActivity: null,
                accountCreated: now
            },

            // Sécurité et permissions
            security: {
                twoFactorEnabled: false,
                lastPasswordChange: now,
                loginAttempts: 0,
                accountLocked: false
            },

            // Informations de contact
            contact: {
                phone: null,
                address: null,
                website: null,
                socialMedia: {}
            }
        };

        // Sauvegarder dans Firestore avec merge pour ne pas écraser
        await firestore.collection('users').doc(userRecord.uid).set(userDoc, { merge: true });

        console.log(`✅ Document Firestore créé/mis à jour: ${userData.email}`);
        return userDoc;

    } catch (error) {
        console.error(`❌ Erreur lors de la création du document Firestore ${userData.email}:`, error.message);
        throw error;
    }
}

/**
 * Génère un profil spécifique selon le rôle de l'utilisateur
 */
function generateRoleSpecificProfile(role) {
    const baseProfile = {
        avatar: null,
        bio: null,
        expertise: [],
        certifications: []
    };

    switch (role) {
        case 'admin':
            return {
                ...baseProfile,
                permissions: ['read', 'write', 'delete', 'admin', 'manage_users', 'system_config'],
                department: 'Administration',
                level: 'superadmin',
                adminInfo: {
                    canManageUsers: true,
                    canManageSystem: true,
                    canViewReports: true,
                    canManageContent: true
                }
            };

        case 'supplier':
            return {
                ...baseProfile,
                permissions: ['read', 'write', 'manage_products'],
                supplierInfo: {
                    businessLicense: null,
                    certifications: [],
                    specialties: [],
                    minOrderQuantity: null,
                    paymentTerms: null,
                    shippingMethods: [],
                    factoryLocation: null,
                    yearEstablished: null,
                    employeeCount: null
                },
                verificationStatus: 'pending',
                businessType: 'manufacturer'
            };

        case 'client':
            return {
                ...baseProfile,
                permissions: ['read', 'write', 'place_orders'],
                clientInfo: {
                    businessType: null,
                    annualVolume: null,
                    preferredCategories: [],
                    buyingFrequency: null,
                    budgetRange: null,
                    targetMarkets: [],
                    importExperience: null
                },
                loyaltyLevel: 'standard',
                creditStatus: 'good'
            };

        case 'influencer':
            return {
                ...baseProfile,
                permissions: ['read', 'write', 'create_content'],
                influencerInfo: {
                    socialMedia: {
                        instagram: null,
                        youtube: null,
                        tiktok: null,
                        linkedin: null,
                        facebook: null
                    },
                    audience: {
                        size: null,
                        demographics: null,
                        engagement: null,
                        geography: []
                    },
                    niche: [],
                    collaborationTypes: ['sponsored', 'affiliate', 'review'],
                    rates: {
                        postRate: null,
                        storyRate: null,
                        videoRate: null
                    }
                },
                verificationStatus: 'pending',
                contentCategories: []
            };

        default:
            return baseProfile;
    }
}

/**
 * Valide la configuration avant l'exécution
 */
function validateConfiguration() {
    console.log('🔍 Validation de la configuration...');

    // Vérifier que tous les utilisateurs ont les champs requis
    for (const user of PRODUCTION_USERS) {
        if (!user.email || !user.password || !user.name || !user.role) {
            throw new Error(`Configuration incomplète pour l'utilisateur: ${user.email || 'email manquant'}`);
        }

        // Vérifier le format email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            throw new Error(`Format email invalide: ${user.email}`);
        }

        // Vérifier la force du mot de passe
        if (user.password.length < 8) {
            throw new Error(`Mot de passe trop faible pour: ${user.email}`);
        }

        // Vérifier que le rôle est valide
        const validRoles = ['admin', 'supplier', 'client', 'influencer'];
        if (!validRoles.includes(user.role)) {
            throw new Error(`Rôle invalide pour ${user.email}: ${user.role}`);
        }
    }

    console.log('✅ Configuration validée');
}

/**
 * Crée un utilisateur complet (Authentication + Firestore)
 */
async function createCompleteUser(auth, firestore, userData) {
    try {
        console.log(`\n👤 Traitement: ${userData.name} (${userData.role})`);
        console.log(`📧 Email: ${userData.email}`);

        // 1. Créer l'utilisateur dans Firebase Authentication
        const userRecord = await createAuthenticationUser(auth, userData);

        // 2. Créer le document Firestore
        const firestoreDoc = await createFirestoreDocument(firestore, userRecord, userData);

        // 3. Retourner le résultat
        return {
            success: true,
            user: {
                uid: userRecord.uid,
                email: userData.email,
                name: userData.name,
                role: userData.role,
                createdAt: firestoreDoc.createdAt
            }
        };

    } catch (error) {
        console.error(`❌ Erreur pour ${userData.email}:`, error.message);
        return {
            success: false,
            email: userData.email,
            error: error.message
        };
    }
}

/**
 * Fonction principale pour créer tous les utilisateurs de production
 */
async function createProductionUsers() {
    console.log('🚀 CRÉATION DES UTILISATEURS DE PRODUCTION');
    console.log('='.repeat(60));
    console.log('🏭 Plateforme: Chine Ton Usine');
    console.log('🔧 Méthode: Firebase Admin SDK');
    console.log('📊 Nombre d\'utilisateurs: 4');
    console.log('🛡️  Sécurité: Gestion d\'erreurs complète');
    console.log('🕒 Date: ' + new Date().toLocaleString('fr-FR'));

    let successCount = 0;
    let errorCount = 0;
    const results = [];

    try {
        // 1. Validation préalable
        validateConfiguration();

        // 2. Initialisation Firebase Admin
        const { auth, firestore } = initializeFirebaseAdmin();

        console.log('\n📋 TRAITEMENT DES UTILISATEURS');
        console.log('-'.repeat(40));

        // 3. Traitement de chaque utilisateur
        for (const userData of PRODUCTION_USERS) {
            const result = await createCompleteUser(auth, firestore, userData);
            results.push(result);

            if (result.success) {
                successCount++;
                console.log(`✅ ${userData.email} créé avec succès`);
            } else {
                errorCount++;
            }

            // Pause courte entre les créations pour éviter les rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 4. Affichage du résumé final
        console.log('\n📊 RÉSUMÉ FINAL');
        console.log('='.repeat(40));
        console.log(`✅ Utilisateurs créés avec succès: ${successCount}`);
        console.log(`❌ Erreurs rencontrées: ${errorCount}`);
        console.log(`📋 Total traité: ${PRODUCTION_USERS.length}`);

        // 5. Détail des résultats
        console.log('\n📋 DÉTAIL DES RÉSULTATS');
        console.log('-'.repeat(40));
        results.forEach(result => {
            if (result.success) {
                console.log(`✅ ${result.user.email} (${result.user.role}) - UID: ${result.user.uid}`);
            } else {
                console.log(`❌ ${result.email} - Erreur: ${result.error}`);
            }
        });

        // 6. Messages finaux
        if (successCount === PRODUCTION_USERS.length) {
            console.log('\n🎉 CRÉATION COMPLÈTE RÉUSSIE !');
            console.log('💡 Tous les utilisateurs de production sont prêts');
            console.log('\n🔑 IDENTIFIANTS DE CONNEXION:');
            console.log('-'.repeat(30));
            PRODUCTION_USERS.forEach(user => {
                console.log(`👤 ${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
            });
            console.log('\n⚠️  IMPORTANT: Changez ces mots de passe par défaut en production !');
        } else {
            console.log('\n⚠️  CRÉATION PARTIELLE');
            console.log('🔄 Vous pouvez relancer le script pour terminer la création');
        }

        console.log('\n🎯 Prochaines étapes recommandées :');
        console.log('1. Tester la connexion de chaque utilisateur');
        console.log('2. Vérifier les redirections selon les rôles');
        console.log('3. Configurer les règles Firestore en mode production');
        console.log('4. Changer les mots de passe par défaut');
        console.log('5. Activer la vérification email si nécessaire');

        return results;

    } catch (error) {
        console.error('\n❌ ERREUR CRITIQUE:', error.message);
        console.error('📋 Stack trace:', error.stack);

        console.log('\n🔧 ACTIONS DE RÉCUPÉRATION SUGGÉRÉES:');
        console.log('1. Vérifier la configuration Firebase Admin SDK');
        console.log('2. Contrôler les permissions du service account');
        console.log('3. Vérifier la connectivité internet');
        console.log('4. Consulter les logs Firebase pour plus de détails');

        process.exit(1);
    }
}

// Exécution du script
if (import.meta.url === `file://${process.argv[1]}`) {
    createProductionUsers()
        .then((results) => {
            console.log('\n🏁 Script terminé avec succès');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Échec du script:', error.message);
            process.exit(1);
        });
}

export { createProductionUsers, PRODUCTION_USERS };
