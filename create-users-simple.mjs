import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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

// Utilisateurs simples pour test
const testUsers = [
    {
        email: 'admin@chinetonusine.com',
        password: 'Admin123!',
        name: 'Administrateur Principal',
        role: 'admin',
        company: 'ChineTonUsine'
    },
    {
        email: 'fournisseur@chinetonusine.com',
        password: 'Fournisseur123!',
        name: 'Fournisseur Demo',
        role: 'supplier',
        company: 'Supplier Corp'
    },
    {
        email: 'client@chinetonusine.com',
        password: 'Client123!',
        name: 'Client Demo',
        role: 'customer',
        company: 'Client Corp'
    },
    {
        email: 'influenceur@chinetonusine.com',
        password: 'Influenceur123!',
        name: 'Influenceur Demo',
        role: 'influencer',
        company: 'Influence Agency'
    }
];

async function createUsersSimple() {
    console.log('🚀 CRÉATION SIMPLE DES 4 UTILISATEURS');
    console.log('='.repeat(50));

    try {
        // Initialisation
        console.log('📊 Initialisation Firebase...');
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        console.log('✅ Firebase initialisé');

        let successCount = 0;
        let errorCount = 0;

        // Création de chaque utilisateur
        for (const userData of testUsers) {
            try {
                console.log(`\n👤 Création: ${userData.email}`);

                // 1. Créer dans Auth
                console.log('🔐 Création dans Authentication...');
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    userData.email,
                    userData.password
                );
                const user = userCredential.user;
                console.log(`✅ Auth créé: ${user.uid}`);

                // 2. Créer dans Firestore
                console.log('📄 Création dans Firestore...');
                const firestoreData = {
                    uid: user.uid,
                    email: userData.email,
                    name: userData.name,
                    role: userData.role,
                    company: userData.company,
                    language: 'fr',
                    currency: 'EUR',
                    isActive: true,
                    createdAt: serverTimestamp(),
                    lastLoginAt: null,
                    settings: {
                        notifications: true,
                        language: 'fr',
                        theme: 'light'
                    },
                    favorites: [],
                    messages: [],
                    browsingHistory: []
                };

                await setDoc(doc(db, 'users', user.uid), firestoreData);
                console.log(`✅ Firestore créé pour: ${userData.email}`);

                successCount++;

            } catch (error) {
                console.error(`❌ Erreur pour ${userData.email}:`, error.message);
                if (error.code === 'auth/email-already-in-use') {
                    console.log('   → Utilisateur déjà existant');
                }
                errorCount++;
            }

            // Pause entre créations
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('\n📊 RÉSUMÉ:');
        console.log(`✅ Succès: ${successCount}`);
        console.log(`❌ Erreurs: ${errorCount}`);
        console.log('🎉 Création terminée !');

    } catch (error) {
        console.error('💥 Erreur critique:', error.message);
    }
}

createUsersSimple();
