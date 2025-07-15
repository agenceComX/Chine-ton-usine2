/**
 * 🔧 TEST DE CONFIGURATION FIREBASE
 * 
 * Ce script teste si Firebase Admin SDK peut se connecter
 * et créer des utilisateurs avec les permissions actuelles
 */

import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

console.log('🔍 TEST DE CONFIGURATION FIREBASE ADMIN SDK');
console.log('='.repeat(50));

async function testFirebaseConnection() {
    try {
        console.log('📋 Vérification des prérequis...\n');

        // 1. Vérifier le fichier service account
        const hasServiceAccount = existsSync('./firebase-service-account.json');
        console.log(`🔐 Service Account JSON: ${hasServiceAccount ? '✅ Trouvé' : '❌ Manquant'}`);

        // 2. Vérifier les variables d'environnement
        const hasEnvVars = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY;
        console.log(`🌍 Variables d'environnement: ${hasEnvVars ? '✅ Configurées' : '❌ Manquantes'}`);

        if (!hasServiceAccount && !hasEnvVars) {
            console.log('\n❌ CONFIGURATION MANQUANTE');
            console.log('\n📝 POUR CONTINUER, VOUS DEVEZ:');
            console.log('1. Aller sur: https://console.firebase.google.com/');
            console.log('2. Sélectionner le projet "chine-ton-usine"');
            console.log('3. Paramètres projet > Comptes de service');
            console.log('4. "Générer une nouvelle clé privée"');
            console.log('5. Télécharger le fichier JSON');
            console.log('6. Le renommer en "firebase-service-account.json"');
            console.log('7. Le placer dans ce dossier\n');

            console.log('💡 ALTERNATIVE - Variables d\'environnement:');
            console.log('Définissez: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL\n');

            console.log('🔄 Puis relancez: node create-new-production-users.mjs');
            return false;
        }

        // 3. Essayer d'initialiser Firebase Admin
        console.log('\n🚀 Test d\'initialisation Firebase Admin...');

        let serviceAccount;

        if (hasServiceAccount) {
            serviceAccount = JSON.parse(readFileSync('./firebase-service-account.json', 'utf8'));
            console.log('✅ Service account chargé depuis le fichier');
        } else {
            serviceAccount = {
                type: "service_account",
                project_id: process.env.FIREBASE_PROJECT_ID || "chine-ton-usine",
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                client_email: process.env.FIREBASE_CLIENT_EMAIL,
                client_id: process.env.FIREBASE_CLIENT_ID,
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
                auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
            };
            console.log('✅ Configuration chargée depuis les variables d\'environnement');
        }

        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: serviceAccount.project_id
            });
        }

        const auth = admin.auth();
        const firestore = admin.firestore();

        // 4. Tester les permissions
        console.log('🔐 Test des permissions...');

        // Test Firebase Auth
        const listUsers = await auth.listUsers(1);
        console.log('✅ Firebase Auth: Accès autorisé');

        // Test Firestore
        const usersCollection = firestore.collection('users');
        await usersCollection.limit(1).get();
        console.log('✅ Firestore: Accès autorisé');

        console.log('\n🎉 CONFIGURATION FIREBASE VALIDÉE !');
        console.log('✅ Vous pouvez maintenant créer les utilisateurs de production');

        console.log('\n🚀 COMMANDES POUR CRÉER LES UTILISATEURS:');
        console.log('node create-new-production-users.mjs');
        console.log('# ou');
        console.log('npm run create:production');

        return true;

    } catch (error) {
        console.error('\n❌ ERREUR DE CONFIGURATION:', error.message);

        if (error.code === 'auth/invalid-credential') {
            console.log('\n🔧 SOLUTION - Problème d\'authentification:');
            console.log('1. Vérifiez que le service account est valide');
            console.log('2. Contrôlez que le projet Firebase est correct');
            console.log('3. Vérifiez les permissions IAM du service account');
        } else if (error.code === 'auth/project-not-found') {
            console.log('\n🔧 SOLUTION - Projet non trouvé:');
            console.log('1. Vérifiez que le projet "chine-ton-usine" existe');
            console.log('2. Contrôlez l\'ID du projet dans la configuration');
        } else {
            console.log('\n🔧 SOLUTIONS POSSIBLES:');
            console.log('1. Vérifiez votre connexion internet');
            console.log('2. Contrôlez la configuration du service account');
            console.log('3. Vérifiez les permissions Firebase');
        }

        return false;
    }
}

// Exécution du test
testFirebaseConnection()
    .then((success) => {
        if (success) {
            console.log('\n✨ Prêt pour la création des utilisateurs !');
            process.exit(0);
        } else {
            console.log('\n⚠️  Configuration requise avant de continuer');
            process.exit(1);
        }
    })
    .catch((error) => {
        console.error('\n💥 Erreur lors du test:', error.message);
        process.exit(1);
    });
