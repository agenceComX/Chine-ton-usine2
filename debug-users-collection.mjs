import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8",
    authDomain: "chine-ton-usine.firebaseapp.com",
    projectId: "chine-ton-usine",
    storageBucket: "chine-ton-usine.firebasestorage.app",
    messagingSenderId: "528021984213",
    appId: "1:528021984213:web:9d5e249e7c6c2ddcd1635c",
    measurementId: "G-23BQZPXP86"
};

async function debugUsersCollection() {
    console.log('🔍 DEBUG COMPLET DE LA COLLECTION USERS');
    console.log('='.repeat(60));
    console.log(`📊 Projet: ${firebaseConfig.projectId}`);
    console.log(`🌐 Auth Domain: ${firebaseConfig.authDomain}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);

    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Test 1: getDocs simple
        console.log('\n🧪 TEST 1: getDocs() simple');
        console.log('-'.repeat(40));
        try {
            const snapshot1 = await getDocs(collection(db, 'users'));
            console.log(`📋 Résultat: ${snapshot1.size} document(s)`);
            if (!snapshot1.empty) {
                console.log('📄 Premiers documents:');
                snapshot1.docs.slice(0, 3).forEach(doc => {
                    console.log(`   - ${doc.id}: ${JSON.stringify(doc.data())}`);
                });
            }
        } catch (error) {
            console.error(`❌ Erreur Test 1:`, error.message);
        }

        // Test 2: Query avec orderBy
        console.log('\n🧪 TEST 2: Query avec orderBy');
        console.log('-'.repeat(40));
        try {
            const q2 = query(collection(db, 'users'), orderBy('__name__'), limit(50));
            const snapshot2 = await getDocs(q2);
            console.log(`📋 Résultat: ${snapshot2.size} document(s)`);
        } catch (error) {
            console.error(`❌ Erreur Test 2:`, error.message);
        }

        // Test 3: Query avec where
        console.log('\n🧪 TEST 3: Query avec where');
        console.log('-'.repeat(40));
        try {
            const q3 = query(collection(db, 'users'), where('__name__', '>', ''));
            const snapshot3 = await getDocs(q3);
            console.log(`📋 Résultat: ${snapshot3.size} document(s)`);
        } catch (error) {
            console.error(`❌ Erreur Test 3:`, error.message);
        }

        // Test 4: Vérification des sous-collections
        console.log('\n🧪 TEST 4: Vérification sous-collections potentielles');
        console.log('-'.repeat(40));
        const subCollections = ['messages', 'notifications', 'settings', 'favorites'];

        for (const subCol of subCollections) {
            try {
                const subSnapshot = await getDocs(collection(db, 'users', 'test', subCol));
                console.log(`📁 ${subCol}: ${subSnapshot.size} document(s)`);
            } catch (error) {
                console.log(`📁 ${subCol}: Non accessible ou vide`);
            }
        }

        // Test 5: Liste des collections racine
        console.log('\n🧪 TEST 5: Collections disponibles');
        console.log('-'.repeat(40));
        const collections = ['users', 'products', 'orders', 'messages', 'notifications', 'suppliers'];

        for (const col of collections) {
            try {
                const colSnapshot = await getDocs(collection(db, col));
                console.log(`📂 ${col}: ${colSnapshot.size} document(s)`);
            } catch (error) {
                console.log(`📂 ${col}: Erreur d'accès`);
            }
        }

        console.log('\n🎯 CONCLUSION DEBUG');
        console.log('='.repeat(40));
        console.log('✅ Si tous les tests montrent 0 documents dans users:');
        console.log('   → La collection est réellement vide côté serveur');
        console.log('   → Le problème vient du cache de votre navigateur');
        console.log('');
        console.log('🔄 SOLUTIONS:');
        console.log('1. Actualisez avec Ctrl+F5');
        console.log('2. Videz le cache du navigateur');
        console.log('3. Utilisez un onglet incognito');
        console.log('4. Fermez/rouvrez le navigateur');

    } catch (error) {
        console.error('💥 Erreur critique debug:', error.message);
    }
}

debugUsersCollection();
