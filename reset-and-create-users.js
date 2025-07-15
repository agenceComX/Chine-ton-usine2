const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');
const { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, writeBatch } = require('firebase/firestore');

// Configuration Firebase (client)
const firebaseConfig = {
    apiKey: "AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8",
    authDomain: "chine-ton-usine-2c999.firebaseapp.com",
    projectId: "chine-ton-usine-2c999",
    storageBucket: "chine-ton-usine-2c999.firebasestorage.app",
    messagingSenderId: "528021984213",
    appId: "1:528021984213:web:9d5e249e7c6c2ddcd1635c",
    measurementId: "G-23BQZPXP86"
};

// Initialisation Firebase Admin (pour suppression)
let adminApp;
try {
    // Essayer d'utiliser la clé de service si elle existe
    const serviceAccount = require('./serviceAccountKey.json');
    adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: firebaseConfig.projectId
    });
    console.log('✅ Firebase Admin initialisé avec la clé de service');
} catch (error) {
    console.log('⚠️  Clé de service non trouvée, utilisation des credentials par défaut');
    try {
        adminApp = admin.initializeApp({
            projectId: firebaseConfig.projectId
        });
        console.log('✅ Firebase Admin initialisé avec les credentials par défaut');
    } catch (adminError) {
        console.error('❌ Erreur initialisation Firebase Admin:', adminError.message);
        console.log('ℹ️  Continuant avec les méthodes client uniquement...');
    }
}

// Initialisation Firebase Client (pour création)
const clientApp = initializeApp(firebaseConfig);
const clientAuth = getAuth(clientApp);
const clientDb = getFirestore(clientApp);

// Utilisateurs à créer
const usersToCreate = [
    {
        email: 'admin@chinetonusine.com',
        password: 'Admin2024!Secure',
        role: 'admin',
        name: 'Administrateur Principal',
        company: 'ChineTonUsine'
    },
    {
        email: 'fournisseur@chinetonusine.com',
        password: 'Supplier2024!Secure',
        role: 'supplier',
        name: 'Fournisseur Demo',
        company: 'Fournisseur Corp'
    },
    {
        email: 'client@chinetonusine.com',
        password: 'Client2024!Secure',
        role: 'customer',
        name: 'Client Demo',
        company: 'Client Corp'
    },
    {
        email: 'influenceur@chinetonusine.com',
        password: 'Influencer2024!Secure',
        role: 'influencer',
        name: 'Influenceur Demo',
        company: 'Influence Agency'
    }
];

// Fonction pour supprimer tous les utilisateurs (Admin SDK)
async function deleteAllUsersAdmin() {
    if (!adminApp) {
        console.log('⚠️  Admin SDK non disponible, saut de la suppression Auth');
        return;
    }

    try {
        const listUsersResult = await admin.auth(adminApp).listUsers();
        const users = listUsersResult.users;

        if (users.length === 0) {
            console.log('ℹ️  Aucun utilisateur à supprimer dans Auth');
            return;
        }

        console.log(`🗑️  Suppression de ${users.length} utilisateurs dans Auth...`);

        const uids = users.map(user => user.uid);
        const deleteResult = await admin.auth(adminApp).deleteUsers(uids);

        console.log(`✅ ${deleteResult.successCount} utilisateurs supprimés`);
        if (deleteResult.failureCount > 0) {
            console.log(`⚠️  ${deleteResult.failureCount} échecs de suppression`);
        }
    } catch (error) {
        console.error('❌ Erreur lors de la suppression des utilisateurs Auth:', error.message);
    }
}

// Fonction pour supprimer tous les documents Firestore
async function deleteAllFirestoreUsers() {
    try {
        console.log('🗑️  Suppression des utilisateurs dans Firestore...');

        const usersCollection = collection(clientDb, 'users');
        const snapshot = await getDocs(usersCollection);

        if (snapshot.empty) {
            console.log('ℹ️  Aucun utilisateur à supprimer dans Firestore');
            return;
        }

        const batch = writeBatch(clientDb);
        let count = 0;

        snapshot.forEach((doc) => {
            batch.delete(doc.ref);
            count++;
        });

        await batch.commit();
        console.log(`✅ ${count} utilisateurs supprimés de Firestore`);
    } catch (error) {
        console.error('❌ Erreur lors de la suppression Firestore:', error.message);
    }
}

// Fonction pour créer un utilisateur
async function createUser(userData) {
    try {
        console.log(`👤 Création de l'utilisateur: ${userData.email}`);

        // Créer l'utilisateur dans Authentication
        const userCredential = await createUserWithEmailAndPassword(
            clientAuth,
            userData.email,
            userData.password
        );

        const user = userCredential.user;
        console.log(`✅ Utilisateur créé dans Auth: ${user.uid}`);

        // Créer le document utilisateur dans Firestore
        const userDoc = {
            id: user.uid,
            uid: user.uid,
            email: userData.email,
            role: userData.role,
            name: userData.name,
            company: userData.company,
            subscription: 'free',
            favorites: [],
            browsingHistory: [],
            messages: [],
            language: 'fr',
            currency: 'EUR',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: null
        };

        await setDoc(doc(clientDb, 'users', user.uid), userDoc);
        console.log(`✅ Document Firestore créé pour: ${userData.email}`);

        // Se déconnecter pour le prochain utilisateur
        await signOut(clientAuth);

        return {
            success: true,
            uid: user.uid,
            email: userData.email,
            role: userData.role
        };
    } catch (error) {
        console.error(`❌ Erreur création ${userData.email}:`, error.message);

        // Tenter de se déconnecter en cas d'erreur
        try {
            await signOut(clientAuth);
        } catch (signOutError) {
            // Ignorer les erreurs de déconnexion
        }

        return {
            success: false,
            email: userData.email,
            error: error.message
        };
    }
}

// Fonction pour valider les utilisateurs créés
async function validateUsers() {
    console.log('\n🔍 Validation des utilisateurs créés...');

    try {
        const usersCollection = collection(clientDb, 'users');
        const snapshot = await getDocs(usersCollection);

        const users = [];
        snapshot.forEach((doc) => {
            const userData = doc.data();
            users.push({
                uid: doc.id,
                email: userData.email,
                role: userData.role,
                name: userData.name,
                company: userData.company,
                createdAt: userData.createdAt
            });
        });

        console.log(`\n📊 Résumé des utilisateurs (${users.length} total):`);
        console.log('='.repeat(60));

        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.role.toUpperCase()}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Nom: ${user.name}`);
            console.log(`   Entreprise: ${user.company}`);
            console.log(`   UID: ${user.uid}`);
            console.log(`   Créé: ${new Date(user.createdAt).toLocaleString()}`);
            console.log('');
        });

        return users;
    } catch (error) {
        console.error('❌ Erreur lors de la validation:', error.message);
        return [];
    }
}

// Fonction principale
async function main() {
    console.log('🚀 Début de la réinitialisation et création des utilisateurs');
    console.log('='.repeat(60));

    try {
        // Étape 1: Supprimer tous les utilisateurs existants
        console.log('\n📝 ÉTAPE 1: Suppression des utilisateurs existants');
        await deleteAllUsersAdmin();
        await deleteAllFirestoreUsers();

        // Petite pause pour s'assurer que les suppressions sont complètes
        console.log('⏳ Pause de 2 secondes...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Étape 2: Créer les nouveaux utilisateurs
        console.log('\n📝 ÉTAPE 2: Création des nouveaux utilisateurs');
        const results = [];

        for (const userData of usersToCreate) {
            const result = await createUser(userData);
            results.push(result);

            // Petite pause entre les créations
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Étape 3: Validation
        console.log('\n📝 ÉTAPE 3: Validation');
        const validatedUsers = await validateUsers();

        // Résumé final
        console.log('\n🎉 PROCESSUS TERMINÉ');
        console.log('='.repeat(60));

        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;

        console.log(`✅ Utilisateurs créés avec succès: ${successCount}`);
        console.log(`❌ Échecs de création: ${failureCount}`);
        console.log(`📊 Total validé dans Firestore: ${validatedUsers.length}`);

        if (failureCount > 0) {
            console.log('\n❌ Détails des échecs:');
            results.filter(r => !r.success).forEach(result => {
                console.log(`   - ${result.email}: ${result.error}`);
            });
        }

        console.log('\n🔐 Informations de connexion:');
        console.log('='.repeat(40));
        usersToCreate.forEach(user => {
            console.log(`${user.role.toUpperCase()}: ${user.email} | ${user.password}`);
        });

    } catch (error) {
        console.error('❌ Erreur fatale:', error.message);
        console.error(error.stack);
    } finally {
        // Nettoyage
        try {
            if (adminApp) {
                await adminApp.delete();
            }
        } catch (error) {
            // Ignorer les erreurs de nettoyage
        }

        console.log('\n👋 Script terminé');
        process.exit(0);
    }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Erreur non gérée:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Exception non capturée:', error);
    process.exit(1);
});

// Lancement du script
if (require.main === module) {
    main();
}

module.exports = { main, deleteAllUsersAdmin, deleteAllFirestoreUsers, createUser, validateUsers };
