#!/usr/bin/env node

/**
 * 🔧 DIAGNOSTIC DES PROBLÈMES DE CONNEXION
 * 
 * Ce script diagnostique les problèmes ERR_BLOCKED_BY_CLIENT
 * et les erreurs de connexion Firestore
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

console.log('🔧 DIAGNOSTIC DES PROBLÈMES DE CONNEXION');
console.log('='.repeat(50));

async function diagnosticProblems() {
    try {
        // Initialiser Firebase Admin
        if (admin.apps.length === 0) {
            const serviceAccount = JSON.parse(readFileSync('./firebase-service-account.json', 'utf8'));
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: serviceAccount.project_id
            });
        }

        const auth = admin.auth();
        const firestore = admin.firestore();

        console.log('📋 DIAGNOSTIC COMPLET...\n');

        // 1. Vérifier les utilisateurs existants
        console.log('1️⃣ VÉRIFICATION DES UTILISATEURS');
        console.log('-'.repeat(35));

        const listResult = await auth.listUsers();
        console.log(`✅ ${listResult.users.length} utilisateurs trouvés`);

        listResult.users.forEach(user => {
            console.log(`   📧 ${user.email} - UID: ${user.uid.substring(0, 8)}...`);
        });

        // 2. Vérifier Firestore
        console.log('\n2️⃣ VÉRIFICATION FIRESTORE');
        console.log('-'.repeat(25));

        const usersCollection = await firestore.collection('users').get();
        console.log(`✅ ${usersCollection.size} documents Firestore trouvés`);

        // 3. Tester la connexion spécifique
        console.log('\n3️⃣ TEST DE CONNEXION SPÉCIFIQUE');
        console.log('-'.repeat(35));

        // Tester l'utilisateur supplier spécifiquement
        try {
            const supplierUser = await auth.getUserByEmail('supplier@chine-ton-usine.com');
            console.log(`✅ Utilisateur supplier trouvé: ${supplierUser.uid}`);

            // Vérifier son document Firestore
            const supplierDoc = await firestore.collection('users').doc(supplierUser.uid).get();
            if (supplierDoc.exists) {
                const data = supplierDoc.data();
                console.log(`✅ Document Firestore supplier: rôle ${data.role}`);
            } else {
                console.log('❌ Document Firestore supplier manquant');
            }

        } catch (error) {
            console.error('❌ Problème avec l\'utilisateur supplier:', error.message);
        }

        // 4. Analyser les problèmes potentiels
        console.log('\n4️⃣ ANALYSE DES PROBLÈMES POTENTIELS');
        console.log('-'.repeat(40));

        console.log('🔍 Problèmes ERR_BLOCKED_BY_CLIENT possibles:');
        console.log('   • Bloqueur de publicité (AdBlock, uBlock Origin)');
        console.log('   • Extension de navigateur bloquant les scripts');
        console.log('   • Politique de sécurité du réseau');
        console.log('   • Configuration CORS Firebase');

        console.log('\n🔍 Problèmes de contexte utilisateur:');
        console.log('   • État de session incohérent');
        console.log('   • Problème de persistence Firebase Auth');
        console.log('   • Règles Firestore trop restrictives');
        console.log('   • Problème de synchronisation Auth/Firestore');

        // 5. Solutions recommandées
        console.log('\n5️⃣ SOLUTIONS RECOMMANDÉES');
        console.log('-'.repeat(25));

        console.log('🔧 Pour ERR_BLOCKED_BY_CLIENT:');
        console.log('   1. Désactiver temporairement les bloqueurs de pub');
        console.log('   2. Tester en navigation privée');
        console.log('   3. Tester avec un autre navigateur');
        console.log('   4. Vérifier les extensions de navigateur');

        console.log('\n🔧 Pour les problèmes de session:');
        console.log('   1. Vider le cache et les cookies');
        console.log('   2. Redémarrer le serveur de développement');
        console.log('   3. Vérifier la persistence Firebase Auth');
        console.log('   4. Synchroniser l\'état Auth avec Firestore');

        // 6. Tests recommandés
        console.log('\n6️⃣ TESTS À EFFECTUER');
        console.log('-'.repeat(20));

        console.log('🧪 Test 1 - Navigation privée:');
        console.log('   • Ouvrir localhost:5173 en navigation privée');
        console.log('   • Tenter une connexion avec supplier@chine-ton-usine.com');

        console.log('\n🧪 Test 2 - Autre navigateur:');
        console.log('   • Tester avec Chrome/Edge si vous êtes sur Firefox');
        console.log('   • Ou inversement');

        console.log('\n🧪 Test 3 - Redémarrage serveur:');
        console.log('   • Arrêter le serveur de dev (Ctrl+C)');
        console.log('   • Relancer: npm run dev');
        console.log('   • Retester la connexion');

        // 7. Commandes utiles
        console.log('\n7️⃣ COMMANDES DE DÉPANNAGE');
        console.log('-'.repeat(30));

        console.log('🔄 Redémarrer le projet:');
        console.log('   npm run dev');

        console.log('\n🧹 Nettoyer et redémarrer:');
        console.log('   npm run build && npm run dev');

        console.log('\n🔍 Vérifier les utilisateurs:');
        console.log('   node verify-final.mjs');

        console.log('\n📱 Tester la configuration Firebase:');
        console.log('   node test-firebase-config.mjs');

    } catch (error) {
        console.error('\n❌ ERREUR LORS DU DIAGNOSTIC:', error.message);
        console.error('Stack:', error.stack);
    }
}

diagnosticProblems();
