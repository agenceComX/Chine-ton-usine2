import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

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

// Utilisateurs à synchroniser
const usersToSync = [
    {
        email: 'admin@chinetonusine.com',
        password: 'admin123',
        role: 'admin',
        name: 'Administrateur Principal',
        company: 'ChineTonUsine'
    },
    {
        email: 'fournisseur@chinetonusine.com',
        password: 'fournisseur123',
        role: 'supplier',
        name: 'Fournisseur Demo',
        company: 'Supplier Corp'
    },
    {
        email: 'client@chinetonusine.com',
        password: 'client123',
        role: 'customer',
        name: 'Client Demo',
        company: 'Client Corp'
    },
    {
        email: 'influenceur@chinetonusine.com',
        password: 'influenceur123',
        role: 'influencer',
        name: 'Influenceur Demo',
        company: 'Influence Agency'
    }
];

async function syncUserToFirestore(userData, auth, db) {
    try {
        console.log(`🔄 Synchronisation: ${userData.email}`);

        // Se connecter pour obtenir l'UID
        const userCredential = await signInWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
        );

        const user = userCredential.user;
        console.log(`✅ Connexion réussie - UID: ${user.uid}`);

        // Vérifier si le document existe déjà
        const userDocRef = doc(db, 'users', user.uid);
        const existingDoc = await getDoc(userDocRef);

        if (existingDoc.exists()) {
            console.log(`ℹ️ Document Firestore existe déjà pour: ${userData.email}`);
        } else {
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

            await setDoc(userDocRef, userDoc);
            console.log(`✅ Document Firestore créé pour: ${userData.email}`);
        }

        // Se déconnecter
        await signOut(auth);

        return {
            success: true,
            uid: user.uid,
            email: userData.email,
            role: userData.role,
            existed: existingDoc.exists()
        };
    } catch (error) {
        console.error(`❌ Erreur synchronisation ${userData.email}:`, error.message);

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

async function syncAllUsers() {
    console.log('🔄 SYNCHRONISATION AUTHENTICATION ↔️ FIRESTORE');
    console.log('='.repeat(60));
    console.log(`📊 Projet: ${firebaseConfig.projectId}`);
    console.log(`🔐 Auth Domain: ${firebaseConfig.authDomain}`);
    console.log('');

    try {
        // Initialisation Firebase
        const app = initializeApp(firebaseConfig, 'sync-users-app');
        const auth = getAuth(app);
        const db = getFirestore(app);

        console.log('✅ Firebase initialisé avec succès');
        console.log(`📝 ${usersToSync.length} utilisateurs à synchroniser\n`);

        const results = [];

        for (const userData of usersToSync) {
            const result = await syncUserToFirestore(userData, auth, db);
            results.push(result);

            // Petite pause entre les synchronisations
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Résumé des résultats
        console.log('\n🎉 SYNCHRONISATION TERMINÉE');
        console.log('='.repeat(35));

        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;
        const existedCount = results.filter(r => r.success && r.existed).length;
        const createdCount = results.filter(r => r.success && !r.existed).length;

        console.log(`✅ Synchronisations réussies: ${successCount}`);
        console.log(`📄 Documents déjà existants: ${existedCount}`);
        console.log(`🆕 Nouveaux documents créés: ${createdCount}`);
        console.log(`❌ Échecs de synchronisation: ${failureCount}`);

        if (failureCount > 0) {
            console.log('\n❌ Détails des échecs:');
            results.filter(r => !r.success).forEach(result => {
                console.log(`   - ${result.email}: ${result.error}`);
            });
        }

        if (successCount > 0) {
            console.log('\n✅ UTILISATEURS SYNCHRONISÉS:');
            console.log('='.repeat(30));
            results.filter(r => r.success).forEach(result => {
                const status = result.existed ? '📄 Existant' : '🆕 Créé';
                console.log(`${status} - ${result.role.toUpperCase()}: ${result.email}`);
            });

            console.log('\n🔐 INFORMATIONS DE CONNEXION:');
            console.log('='.repeat(40));
            usersToSync.forEach(user => {
                const result = results.find(r => r.email === user.email);
                const status = result?.success ? '✅' : '❌';
                console.log(`${status} ${user.role.toUpperCase()}: ${user.email} | ${user.password}`);
            });
        }

        console.log('\n💡 PROCHAINES ÉTAPES:');
        console.log('1. Vérifiez les utilisateurs: npm run users:verify');
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
syncAllUsers()
    .then(() => {
        console.log('\n👋 Synchronisation terminée');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Erreur fatale:', error.message);
        process.exit(1);
    });
