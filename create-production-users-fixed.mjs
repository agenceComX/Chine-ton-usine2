import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Configuration Firebase - PROJET CORRECT
const firebaseConfig = {
    apiKey: "AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8",
    authDomain: "chine-ton-usine.firebaseapp.com",
    projectId: "chine-ton-usine",
    storageBucket: "chine-ton-usine.firebasestorage.app",
    messagingSenderId: "528021984213",
    appId: "1:528021984213:web:9d5e249e7c6c2ddcd1635c",
    measurementId: "G-23BQZPXP86"
};

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
        company: 'Supplier Corp'
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

async function createUser(userData, auth, db) {
    try {
        console.log(`👤 Création de l'utilisateur: ${userData.email}`);

        // Créer l'utilisateur dans Authentication
        const userCredential = await createUserWithEmailAndPassword(
            auth,
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

        await setDoc(doc(db, 'users', user.uid), userDoc);
        console.log(`✅ Document Firestore créé pour: ${userData.email}`);

        // Se déconnecter pour le prochain utilisateur
        await signOut(auth);

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
            await signOut(auth);
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

async function createProductionUsers() {
    console.log('🚀 CRÉATION DES UTILISATEURS DE PRODUCTION');
    console.log('='.repeat(50));
    console.log(`📊 Projet: ${firebaseConfig.projectId}`);
    console.log(`🔐 Auth Domain: ${firebaseConfig.authDomain}`);
    console.log('');

    try {
        // Initialisation Firebase
        const app = initializeApp(firebaseConfig, 'create-users-app');
        const auth = getAuth(app);
        const db = getFirestore(app);

        console.log('✅ Firebase initialisé avec succès');
        console.log(`📝 ${usersToCreate.length} utilisateurs à créer\n`);

        const results = [];

        for (const userData of usersToCreate) {
            const result = await createUser(userData, auth, db);
            results.push(result);

            // Petite pause entre les créations
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Résumé des résultats
        console.log('\n🎉 PROCESSUS TERMINÉ');
        console.log('='.repeat(30));

        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;

        console.log(`✅ Utilisateurs créés avec succès: ${successCount}`);
        console.log(`❌ Échecs de création: ${failureCount}`);

        if (failureCount > 0) {
            console.log('\n❌ Détails des échecs:');
            results.filter(r => !r.success).forEach(result => {
                console.log(`   - ${result.email}: ${result.error}`);
            });
        }

        if (successCount > 0) {
            console.log('\n🔐 INFORMATIONS DE CONNEXION:');
            console.log('='.repeat(40));
            usersToCreate.forEach(user => {
                const result = results.find(r => r.email === user.email);
                const status = result?.success ? '✅' : '❌';
                console.log(`${status} ${user.role.toUpperCase()}: ${user.email} | ${user.password}`);
            });
        }

        console.log('\n💡 PROCHAINES ÉTAPES:');
        console.log('1. Testez la connexion: npm run users:verify');
        console.log('2. Revenez aux règles de production: npm run rules:production');
        console.log('3. Testez votre application web');

    } catch (error) {
        console.error('❌ Erreur fatale:', error.message);
        console.error('\n🔧 Vérifications suggérées:');
        console.error('1. Assurez-vous d\'être authentifié: firebase login');
        console.error('2. Vérifiez les règles: npm run rules:dev');
        console.error('3. Relancez le diagnostic: npm run firebase:check');
        throw error;
    }
}

// Gestion des erreurs
process.on('unhandledRejection', (reason, promise) => {
    console.error('\n❌ Erreur non gérée:', reason?.message || reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('\n❌ Exception non capturée:', error.message);
    process.exit(1);
});

// Exécution
createProductionUsers()
    .then(() => {
        console.log('\n👋 Création des utilisateurs terminée');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Erreur fatale:', error.message);
        process.exit(1);
    });
