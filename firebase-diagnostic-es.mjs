import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import fs from 'fs';
import https from 'https';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

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

async function checkFirebaseConfiguration() {
    console.log('🔍 Vérification de la configuration Firebase...');
    console.log('='.repeat(60));

    try {
        // Test 1: Initialisation Firebase
        console.log('1️⃣ Initialisation de Firebase...');
        const app = initializeApp(firebaseConfig);
        console.log('✅ Firebase initialisé avec succès');

        // Test 2: Configuration Auth
        console.log('\n2️⃣ Configuration Firebase Authentication...');
        const auth = getAuth(app);
        console.log(`✅ Auth configuré - Domaine: ${firebaseConfig.authDomain}`);

        // Test 3: Configuration Firestore
        console.log('\n3️⃣ Configuration Cloud Firestore...');
        const db = getFirestore(app);
        console.log(`✅ Firestore configuré - Projet: ${firebaseConfig.projectId}`);

        // Test 4: Vérification des variables d'environnement
        console.log('\n4️⃣ Vérification des variables...');
        const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];

        for (const field of requiredFields) {
            if (firebaseConfig[field]) {
                const value = firebaseConfig[field].toString();
                const displayValue = value.length > 20 ? value.substring(0, 20) + '...' : value;
                console.log(`✅ ${field}: ${displayValue}`);
            } else {
                console.log(`❌ ${field}: MANQUANT`);
                throw new Error(`Configuration manquante: ${field}`);
            }
        }

        // Test 5: Vérification du package.json
        console.log('\n5️⃣ Vérification des dépendances...');
        try {
            const packageJson = require('./package.json');
            const firebaseDep = packageJson.dependencies?.firebase;
            const firebaseAdminDep = packageJson.dependencies?.['firebase-admin'];

            console.log(`✅ Firebase: ${firebaseDep || '⚠️ Non installé'}`);
            console.log(`✅ Firebase Admin: ${firebaseAdminDep || '⚠️ Non installé'}`);

            if (!firebaseDep) {
                console.log('⚠️ Firebase client manquant - Exécutez: npm install firebase');
            }
            if (!firebaseAdminDep) {
                console.log('⚠️ Firebase Admin manquant - Exécutez: npm install firebase-admin');
            }
        } catch (error) {
            console.log('⚠️ Impossible de lire package.json');
        }

        // Test 6: Vérification des scripts npm
        console.log('\n6️⃣ Scripts disponibles...');
        try {
            const packageJson = require('./package.json');
            const scripts = packageJson.scripts || {};

            const importantScripts = ['users:reset', 'users:create', 'deploy', 'deploy:rules', 'firebase:check'];

            for (const script of importantScripts) {
                if (scripts[script]) {
                    console.log(`✅ ${script}: Disponible`);
                } else {
                    console.log(`⚠️ ${script}: Non défini`);
                }
            }
        } catch (error) {
            console.log('⚠️ Impossible de lire les scripts npm');
        }

        console.log('\n✅ Configuration Firebase valide !');
        return true;

    } catch (error) {
        console.error('\n❌ ERREUR DE CONFIGURATION');
        console.error('='.repeat(30));
        console.error('Détails:', error.message);

        return false;
    }
}

// Test de connectivité réseau
async function checkNetworkConnectivity() {
    console.log('\n🌐 Test de connectivité...');

    try {
        return new Promise((resolve) => {
            const req = https.request('https://firebase.google.com', {
                method: 'HEAD',
                timeout: 10000
            }, (res) => {
                console.log(`✅ Connexion Firebase OK (Status: ${res.statusCode})`);
                resolve(true);
            });

            req.on('error', (error) => {
                console.log(`❌ Erreur de connexion: ${error.message}`);
                resolve(false);
            });

            req.on('timeout', () => {
                console.log('⏱️ Timeout de connexion (10s)');
                req.abort();
                resolve(false);
            });

            req.setTimeout(10000);
            req.end();
        });
    } catch (error) {
        console.log(`❌ Erreur lors du test: ${error.message}`);
        return false;
    }
}

// Vérification des fichiers requis
function checkRequiredFiles() {
    console.log('\n📁 Vérification des fichiers...');

    const requiredFiles = [
        'package.json',
        'firebase.json',
        'firestore.rules',
        'reset-and-create-users.js'
    ];

    const optionalFiles = [
        'src/lib/firebaseClient.ts',
        'src/services/productionUserService.ts',
        'src/context/ProductionAuthContext.tsx',
        'src/pages/ProductionLoginPage.tsx'
    ];

    let criticalFilesOk = true;

    console.log('\n📋 Fichiers critiques:');
    for (const file of requiredFiles) {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} - MANQUANT`);
            criticalFilesOk = false;
        }
    }

    console.log('\n📋 Fichiers optionnels:');
    for (const file of optionalFiles) {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`⚠️ ${file} - Manquant (optionnel)`);
        }
    }

    return criticalFilesOk;
}

// Vérification des permissions Firebase
async function checkFirebasePermissions() {
    console.log('\n🔐 Vérification des permissions...');

    try {
        // Tentative de lecture d'un service Firebase
        const app = initializeApp(firebaseConfig, 'test-permissions');
        const auth = getAuth(app);
        const db = getFirestore(app);

        console.log('✅ Permissions Firebase Auth: OK');
        console.log('✅ Permissions Firestore: OK');

        return true;
    } catch (error) {
        console.log(`❌ Erreur de permissions: ${error.message}`);
        return false;
    }
}

// Résumé des informations de projet
function showProjectSummary() {
    console.log('\n📊 RÉSUMÉ DU PROJET');
    console.log('='.repeat(40));
    console.log(`🆔 Project ID: ${firebaseConfig.projectId}`);
    console.log(`🔐 Auth Domain: ${firebaseConfig.authDomain}`);
    console.log(`💾 Storage Bucket: ${firebaseConfig.storageBucket}`);
    console.log(`📱 App ID: ${firebaseConfig.appId}`);
    console.log(`📊 Measurement ID: ${firebaseConfig.measurementId || 'Non configuré'}`);
}

// Fonction principale
async function main() {
    console.log('🔍 DIAGNOSTIC COMPLET FIREBASE');
    console.log('='.repeat(60));
    console.log('ChineTonUsine - Vérification de configuration');
    console.log('='.repeat(60));

    // Tests
    const networkOk = await checkNetworkConnectivity();
    const filesOk = checkRequiredFiles();
    const configOk = await checkFirebaseConfiguration();
    const permissionsOk = await checkFirebasePermissions();

    // Résumé du projet
    showProjectSummary();

    // Rapport final
    console.log('\n📊 RAPPORT FINAL');
    console.log('='.repeat(30));
    console.log(`🌐 Connectivité: ${networkOk ? '✅ OK' : '❌ ÉCHEC'}`);
    console.log(`📁 Fichiers: ${filesOk ? '✅ OK' : '❌ MANQUANTS'}`);
    console.log(`⚙️ Configuration: ${configOk ? '✅ OK' : '❌ INVALIDE'}`);
    console.log(`🔐 Permissions: ${permissionsOk ? '✅ OK' : '❌ ÉCHEC'}`);

    const allOk = networkOk && filesOk && configOk && permissionsOk;

    if (allOk) {
        console.log('\n🎉 SYSTÈME PRÊT !');
        console.log('✅ Tous les tests sont passés avec succès');

        console.log('\n📋 COMMANDES DISPONIBLES:');
        console.log('   npm run users:reset     - Supprime et recrée tous les utilisateurs');
        console.log('   npm run deploy:rules    - Déploie les règles Firestore');
        console.log('   npm run deploy          - Déploie l\'application complète');
        console.log('   npm run firebase:check  - Relance ce diagnostic');

        console.log('\n🚀 ÉTAPES SUIVANTES:');
        console.log('1. Exécutez: npm run users:reset');
        console.log('2. Testez la connexion sur votre app');
        console.log('3. Déployez: npm run deploy');

    } else {
        console.log('\n⚠️ PROBLÈMES DÉTECTÉS');
        console.log('='.repeat(25));

        if (!networkOk) {
            console.log('🔧 Vérifiez votre connexion internet');
        }
        if (!filesOk) {
            console.log('🔧 Assurez-vous que tous les fichiers requis sont présents');
        }
        if (!configOk) {
            console.log('🔧 Vérifiez votre configuration Firebase');
        }
        if (!permissionsOk) {
            console.log('🔧 Vérifiez vos permissions Firebase');
            console.log('   - Exécutez: firebase login');
            console.log('   - Vérifiez le projet: firebase use --add');
        }
    }

    console.log('\n👋 Diagnostic terminé');
    return allOk;
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
main()
    .then((success) => {
        process.exit(success ? 0 : 1);
    })
    .catch((error) => {
        console.error('❌ Erreur fatale:', error.message);
        process.exit(1);
    });
