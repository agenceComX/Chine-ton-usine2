import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

async function checkUsers() {
    console.log('🔍 VÉRIFICATION DE LA COLLECTION USERS');
    console.log('='.repeat(50));

    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        console.log('📊 Récupération de tous les documents users...');
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);

        if (snapshot.empty) {
            console.log('✅ COLLECTION USERS COMPLÈTEMENT VIDE');
            console.log('🎯 Aucun document trouvé');
            console.log('🔥 Suppression réussie');
        } else {
            console.log(`⚠️  ${snapshot.size} document(s) encore présent(s):`);
            snapshot.forEach((doc) => {
                const data = doc.data();
                console.log(`   - ${doc.id}: ${data.email || data.name || 'non défini'}`);
            });
        }

    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error);
    }
}

checkUsers();
