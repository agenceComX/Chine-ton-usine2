import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Configuration Firebase Admin SDK
// Assurez-vous d'avoir votre clé de service Firebase dans le projet
const serviceAccountPath = './firebase-service-account.json';

// Données des utilisateurs de production à créer
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
 */
function initializeFirebaseAdmin() {
    try {
        // Vérifier si Firebase Admin est déjà initialisé
        if (admin.apps.length === 0) {
            let serviceAccount;

            try {
                // Essayer de charger le fichier de service account
                serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
            } catch (error) {
                console.warn('⚠️  Fichier de service account non trouvé, utilisation des variables d\'environnement...');

                // Fallback: utiliser les variables d'environnement ou configuration par défaut
                serviceAccount = {
                    type: "service_account",
                    project_id: "chine-ton-usine",
                    // Ajoutez ici vos credentials ou utilisez les variables d'environnement
                };
            }

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: 'chine-ton-usine'
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
 * Crée un utilisateur dans Firebase Authentication
 */
async function createAuthUser(auth, userData) {
    try {
        console.log(`🔐 Création de l'utilisateur Auth: ${userData.email}`);

        // Vérifier si l'utilisateur existe déjà
        try {
            const existingUser = await auth.getUserByEmail(userData.email);
            console.log(`ℹ️  Utilisateur ${userData.email} existe déjà (UID: ${existingUser.uid})`);
            return existingUser;
        } catch (error) {
            if (error.code !== 'auth/user-not-found') {
                throw error;
            }
            // L'utilisateur n'existe pas, on peut le créer
        }

        // Créer l'utilisateur
        const userRecord = await auth.createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.name,
            emailVerified: true, // En production, vous pouvez définir à false et envoyer un email de vérification
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
 * Crée ou met à jour le document Firestore pour l'utilisateur
 */
async function createFirestoreDocument(firestore, userRecord, userData) {
    try {
        console.log(`📄 Création du document Firestore pour: ${userData.email}`);

        const userDoc = {
            // Informations principales
            uid: userRecord.uid,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            company: userData.company,
            language: userData.language,
            currency: userData.currency,

            // Métadonnées système
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
            emailVerified: userRecord.emailVerified || false,

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
                timezone: 'Europe/Paris'
            },

            // Informations de profil étendues selon le rôle
            profile: getProfileByRole(userData.role),

            // Statistiques d'usage
            stats: {
                lastLogin: null,
                loginCount: 0,
                lastActivity: null
            }
        };

        // Sauvegarder dans Firestore
        await firestore.collection('users').doc(userRecord.uid).set(userDoc, { merge: true });

        console.log(`✅ Document Firestore créé/mis à jour: ${userData.email}`);
        return userDoc;

    } catch (error) {
        console.error(`❌ Erreur lors de la création du document Firestore ${userData.email}:`, error.message);
        throw error;
    }
}

/**
 * Génère un profil spécifique selon le rôle
 */
function getProfileByRole(role) {
    const baseProfile = {
        avatar: null,
        phone: null,
        address: null,
        bio: null
    };

    switch (role) {
        case 'admin':
            return {
                ...baseProfile,
                permissions: ['read', 'write', 'delete', 'admin'],
                department: 'Administration',
                level: 'superadmin'
            };

        case 'supplier':
            return {
                ...baseProfile,
                supplierInfo: {
                    businessLicense: null,
                    certifications: [],
                    specialties: [],
                    minOrderQuantity: null,
                    paymentTerms: null
                },
                verificationStatus: 'pending'
            };

        case 'client':
            return {
                ...baseProfile,
                clientInfo: {
                    businessType: null,
                    annualVolume: null,
                    preferredCategories: [],
                    buyingFrequency: null
                },
                loyaltyLevel: 'standard'
            };

        case 'influencer':
            return {
                ...baseProfile,
                influencerInfo: {
                    socialMedia: {
                        instagram: null,
                        youtube: null,
                        tiktok: null,
                        linkedin: null
                    },
                    audience: {
                        size: null,
                        demographics: null,
                        engagement: null
                    },
                    niche: []
                },
                verificationStatus: 'pending'
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
    }

    console.log('✅ Configuration validée');
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
    console.log('🛡️  Sécurité: Gestion d\'erreurs activée');

    let successCount = 0;
    let errorCount = 0;
    const results = [];

    try {
        // Validation préalable
        validateConfiguration();

        // Initialisation Firebase Admin
        const { auth, firestore } = initializeFirebaseAdmin();

        console.log('\n📋 TRAITEMENT DES UTILISATEURS');
        console.log('-'.repeat(40));

        // Traitement de chaque utilisateur
        for (const userData of PRODUCTION_USERS) {
            try {
                console.log(`\n👤 Traitement: ${userData.name} (${userData.role})`);

                // 1. Créer l'utilisateur dans Firebase Auth
                const userRecord = await createAuthUser(auth, userData);

                // 2. Créer le document Firestore
                const firestoreDoc = await createFirestoreDocument(firestore, userRecord, userData);

                // 3. Enregistrer le succès
                results.push({
                    email: userData.email,
                    uid: userRecord.uid,
                    role: userData.role,
                    status: 'success',
                    createdAt: firestoreDoc.createdAt
                });

                successCount++;
                console.log(`✅ ${userData.email} traité avec succès`);

                // Pause courte entre les créations pour éviter les limits
                await new Promise(resolve => setTimeout(resolve, 500));

            } catch (userError) {
                console.error(`❌ Erreur pour ${userData.email}:`, userError.message);

                results.push({
                    email: userData.email,
                    role: userData.role,
                    status: 'error',
                    error: userError.message
                });

                errorCount++;
            }
        }

        // Affichage du résumé final
        console.log('\n📊 RÉSUMÉ FINAL');
        console.log('='.repeat(40));
        console.log(`✅ Utilisateurs créés avec succès: ${successCount}`);
        console.log(`❌ Erreurs rencontrées: ${errorCount}`);
        console.log(`📋 Total traité: ${PRODUCTION_USERS.length}`);

        // Affichage détaillé des résultats
        console.log('\n📋 DÉTAIL DES RÉSULTATS');
        console.log('-'.repeat(40));
        results.forEach(result => {
            if (result.status === 'success') {
                console.log(`✅ ${result.email} (${result.role}) - UID: ${result.uid}`);
            } else {
                console.log(`❌ ${result.email} (${result.role}) - Erreur: ${result.error}`);
            }
        });

        // Messages finaux
        if (successCount === PRODUCTION_USERS.length) {
            console.log('\n🎉 CRÉATION COMPLÈTE RÉUSSIE !');
            console.log('💡 Tous les utilisateurs de production sont prêts');
            console.log('🔐 N\'oubliez pas de changer les mots de passe par défaut en production');
            console.log('🛡️  Pensez à activer la vérification email si nécessaire');
        } else {
            console.log('\n⚠️  CRÉATION PARTIELLE');
            console.log('🔄 Vous pouvez relancer le script pour terminer la création');
        }

        console.log('\n🎯 Prochaines étapes recommandées :');
        console.log('1. Tester la connexion de chaque utilisateur');
        console.log('2. Vérifier les redirections selon les rôles');
        console.log('3. Configurer les règles Firestore en mode production');
        console.log('4. Activer les sécurités avancées (2FA, etc.)');

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
        .then(() => {
            console.log('\n🏁 Script terminé avec succès');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Échec du script:', error.message);
            process.exit(1);
        });
}

export { createProductionUsers, PRODUCTION_USERS };
