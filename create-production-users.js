const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser } = require('firebase/auth');
const { getFirestore, doc, setDoc, collection, getDocs, deleteDoc } = require('firebase/firestore');
const admin = require('firebase-admin');

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC8K5gYQF8VN9N9rjP8Q5_K9X5B5m5_5xc",
    authDomain: "chine-ton-usine-2c999.firebaseapp.com",
    projectId: "chine-ton-usine-2c999",
    storageBucket: "chine-ton-usine-2c999.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789"
};

// Initialisation Firebase Client
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialisation Firebase Admin
let adminApp;
try {
    adminApp = admin.initializeApp({
        projectId: "chine-ton-usine-2c999"
    });
} catch (error) {
    console.log('Admin SDK déjà initialisé');
    adminApp = admin.app();
}

const adminAuth = admin.auth(adminApp);
const adminDb = admin.firestore(adminApp);

// Utilisateurs de production à créer
const productionUsers = [
    {
        email: 'admin@chinetonusine.com',
        password: 'AdminSecure2025!',
        role: 'admin',
        name: 'Administrateur Principal',
        company: 'Chine Ton Usine',
        phone: '+33123456789'
    },
    {
        email: 'fournisseur@chinetonusine.com',
        password: 'FournisseurSecure2025!',
        role: 'supplier',
        name: 'Fournisseur Premium',
        company: 'Usine Partenaire Ltd',
        phone: '+86123456789'
    },
    {
        email: 'client@chinetonusine.com',
        password: 'ClientSecure2025!',
        role: 'customer',
        name: 'Client Enterprise',
        company: 'Entreprise Solutions France',
        phone: '+33987654321'
    },
    {
        email: 'influenceur@chinetonusine.com',
        password: 'InfluenceurSecure2025!',
        role: 'influencer',
        name: 'Influenceur Pro',
        company: 'Social Media Agency',
        phone: '+33555123456'
    }
];

async function deleteAllExistingUsers() {
    console.log('🗑️ Suppression de tous les utilisateurs existants...');

    try {
        // Supprimer de Firestore d'abord
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);

        console.log(`📋 ${usersSnapshot.docs.length} utilisateurs trouvés dans Firestore`);

        for (const userDoc of usersSnapshot.docs) {
            await deleteDoc(doc(db, 'users', userDoc.id));
            console.log(`✅ Utilisateur Firestore supprimé: ${userDoc.id}`);
        }

        // Supprimer de Authentication avec Admin SDK
        const authUsers = await adminAuth.listUsers();
        console.log(`🔐 ${authUsers.users.length} utilisateurs trouvés dans Authentication`);

        for (const user of authUsers.users) {
            await adminAuth.deleteUser(user.uid);
            console.log(`✅ Utilisateur Auth supprimé: ${user.email} (${user.uid})`);
        }

        console.log('✨ Tous les utilisateurs existants ont été supprimés avec succès');
        return true;
    } catch (error) {
        console.error('❌ Erreur lors de la suppression des utilisateurs:', error);
        return false;
    }
}

async function createProductionUser(userData) {
    console.log(`👤 Création de l'utilisateur: ${userData.email} (${userData.role})`);

    try {
        // Créer l'utilisateur dans Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        const user = userCredential.user;

        console.log(`✅ Utilisateur Auth créé: ${user.uid}`);

        // Créer le profil dans Firestore
        const userProfile = {
            id: user.uid,
            email: userData.email,
            role: userData.role,
            name: userData.name,
            company: userData.company,
            phone: userData.phone,
            language: 'fr',
            currency: 'EUR',
            subscription: userData.role === 'admin' ? 'premium' : 'free',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            isActive: true,
            emailVerified: false,
            preferences: {
                notifications: true,
                newsletter: true,
                darkMode: false
            }
        };

        await setDoc(doc(db, 'users', user.uid), userProfile);
        console.log(`✅ Profil Firestore créé pour: ${userData.email}`);

        // Se déconnecter après création
        await signOut(auth);

        return {
            success: true,
            uid: user.uid,
            email: userData.email,
            role: userData.role
        };

    } catch (error) {
        console.error(`❌ Erreur création utilisateur ${userData.email}:`, error.message);
        return {
            success: false,
            email: userData.email,
            error: error.message
        };
    }
}

async function verifyUserCreation() {
    console.log('🔍 Vérification des utilisateurs créés...');

    try {
        // Vérifier Authentication
        const authUsers = await adminAuth.listUsers();
        console.log(`\n📊 RÉSUMÉ AUTHENTICATION (${authUsers.users.length} utilisateurs):`);
        authUsers.users.forEach(user => {
            console.log(`  - ${user.email} (${user.uid}) - Vérifié: ${user.emailVerified}`);
        });

        // Vérifier Firestore
        const usersSnapshot = await getDocs(collection(db, 'users'));
        console.log(`\n📊 RÉSUMÉ FIRESTORE (${usersSnapshot.docs.length} utilisateurs):`);
        usersSnapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log(`  - ${data.email} (${data.role}) - ${data.name} - ${data.company}`);
        });

        return true;
    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error);
        return false;
    }
}

async function main() {
    console.log('🚀 CRÉATION DES UTILISATEURS DE PRODUCTION CHINE TON USINE');
    console.log('=' * 60);

    try {
        // Étape 1: Supprimer tous les utilisateurs existants
        const deletionSuccess = await deleteAllExistingUsers();
        if (!deletionSuccess) {
            throw new Error('Échec de la suppression des utilisateurs existants');
        }

        console.log('\n⏳ Attente de 3 secondes...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Étape 2: Créer les nouveaux utilisateurs
        console.log('👥 Création des 4 nouveaux utilisateurs...');
        const results = [];

        for (const userData of productionUsers) {
            const result = await createProductionUser(userData);
            results.push(result);

            // Petite pause entre les créations
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Étape 3: Afficher les résultats
        console.log('\n📋 RÉSULTATS DE CRÉATION:');
        console.log('=' * 40);

        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        console.log(`✅ Succès: ${successful.length}/4`);
        console.log(`❌ Échecs: ${failed.length}/4`);

        if (successful.length > 0) {
            console.log('\n✅ UTILISATEURS CRÉÉS AVEC SUCCÈS:');
            successful.forEach(user => {
                console.log(`  - ${user.email} (${user.role}) - UID: ${user.uid}`);
            });
        }

        if (failed.length > 0) {
            console.log('\n❌ ÉCHECS DE CRÉATION:');
            failed.forEach(user => {
                console.log(`  - ${user.email}: ${user.error}`);
            });
        }

        // Étape 4: Vérification finale
        console.log('\n' + '=' * 60);
        await verifyUserCreation();

        console.log('\n🎉 MISSION ACCOMPLIE!');
        console.log('Les utilisateurs de production sont prêts pour le déploiement.');

    } catch (error) {
        console.error('\n💥 ERREUR CRITIQUE:', error.message);
        process.exit(1);
    }
}

// Exécution du script
if (require.main === module) {
    main().then(() => {
        console.log('\n✨ Script terminé avec succès');
        process.exit(0);
    }).catch(error => {
        console.error('\n💥 Erreur fatale:', error);
        process.exit(1);
    });
}

module.exports = { main, deleteAllExistingUsers, createProductionUser, verifyUserCreation };
