import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

async function createAdminDocument() {
    console.log('🔄 CRÉATION DOCUMENT ADMIN');
    console.log('='.repeat(40));

    try {
        // Initialisation Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // UID temporaire pour l'admin (sera corrigé lors de la première connexion)
        const adminUID = 'admin-temp-uid-to-update';

        console.log('✅ Firebase initialisé avec succès');
        console.log('🔄 Création du document admin...');

        // Données de l'admin
        const adminData = {
            email: 'admin@chinetonusine.com',
            role: 'admin',
            name: 'Administrateur Principal',
            company: 'ChineTonUsine',
            isActive: true,
            createdAt: new Date(),
            lastLoginAt: null,
            isTemporaryUID: true, // Flag pour indiquer que l'UID doit être mis à jour
            settings: {
                notifications: true,
                language: 'fr',
                theme: 'light'
            }
        };

        await setDoc(doc(db, 'users', adminUID), adminData);
        console.log(`✅ Document admin créé avec UID temporaire: ${adminUID}`);

        console.log('\n💡 IMPORTANT:');
        console.log('   - L\'admin doit se connecter une fois pour synchroniser son vrai UID');
        console.log('   - Le document temporaire sera mis à jour automatiquement');
        console.log('\n🎉 Création terminée avec succès !');

    } catch (error) {
        console.error('❌ Erreur lors de la création:', error);
        process.exit(1);
    }
}

createAdminDocument();
