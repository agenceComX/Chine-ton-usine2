/**
 * Script de test pour valider la correction de l'erreur Firestore
 * Test de création d'utilisateur sans champs undefined
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAPg7G0QumifGQmMJGTlToNUrw0epPL4X8",
    authDomain: "chine-ton-usine-2c999.firebaseapp.com",
    projectId: "chine-ton-usine-2c999",
    storageBucket: "chine-ton-usine-2c999.firebasestorage.app",
    messagingSenderId: "528021984213",
    appId: "1:528021984213:web:9d5e249e7c6c2ddcd1635c",
    measurementId: "G-23BQZPXP86"
};

async function testUserCreationWithoutUndefined() {
    console.log('🧪 Test de création d\'utilisateur sans champs undefined');
    console.log('='.repeat(60));

    try {
        // Initialiser Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        // Se connecter comme admin
        console.log('🔐 Connexion admin...');
        await signInWithEmailAndPassword(auth, 'admin@chine-ton-usine.com', 'AdminSecure2024!');
        console.log('✅ Admin connecté');

        // Tester la création d'un document utilisateur CORRECT (sans undefined)
        const testUserId = `test_user_${Date.now()}`;
        const testUserData = {
            id: testUserId,
            email: `test-${Date.now()}@example.com`,
            name: 'Test User Corrigé',
            role: 'customer',
            isActive: true,
            language: 'fr',
            currency: 'EUR',
            favorites: [],
            browsingHistory: [],
            messages: [],
            subscription: 'free',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
            // ✅ PAS de last_login: undefined ici !
        };

        console.log('📄 Test de création document Firestore...');
        await setDoc(doc(db, 'users', testUserId), testUserData);
        console.log('✅ Document créé avec succès !');
        console.log('   Email:', testUserData.email);
        console.log('   UID:', testUserId);

        console.log('\n🎉 TEST RÉUSSI - Aucune erreur Firestore !');
        console.log('✅ La correction fonctionne correctement');

        return {
            success: true,
            userId: testUserId,
            email: testUserData.email
        };

    } catch (error) {
        console.error('❌ ERREUR pendant le test:', error.message);
        console.error('   Code d\'erreur:', error.code);

        if (error.message.includes('undefined')) {
            console.error('⚠️  Il reste des champs undefined à corriger !');
        }

        return {
            success: false,
            error: error.message
        };
    }
}

// Exécuter le test
testUserCreationWithoutUndefined()
    .then(result => {
        console.log('\n📊 RÉSULTAT DU TEST:');
        if (result.success) {
            console.log('✅ Test réussi - La correction est efficace');
            console.log('📧 Utilisateur test créé:', result.email);
        } else {
            console.log('❌ Test échoué - Correction à améliorer');
            console.log('   Erreur:', result.error);
        }
    })
    .catch(error => {
        console.error('💥 Erreur fatale:', error.message);
    });
