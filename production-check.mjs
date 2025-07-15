import { readFileSync, existsSync } from 'fs';

/**
 * Vérifie la configuration Firebase
 */
function checkFirebaseConfig() {
    console.log('🔥 Vérification de la configuration Firebase...');
    
    const checks = {
        serviceAccount: false,
        firebaseJson: false,
        firestoreRules: false,
        projectId: false
    };
    
    // Vérifier le service account
    if (existsSync('./firebase-service-account.json')) {
        try {
            const serviceAccount = JSON.parse(readFileSync('./firebase-service-account.json', 'utf8'));
            if (serviceAccount.project_id === 'chine-ton-usine') {
                checks.serviceAccount = true;
                checks.projectId = true;
                console.log('✅ Service account trouvé et valide');
            } else {
                console.log('⚠️  Service account trouvé mais project_id incorrect');
            }
        } catch (error) {
            console.log('❌ Service account invalide:', error.message);
        }
    } else {
        console.log('⚠️  Service account non trouvé (utilisera les variables d\'environnement)');
    }
    
    // Vérifier firebase.json
    if (existsSync('./firebase.json')) {
        try {
            const firebaseConfig = JSON.parse(readFileSync('./firebase.json', 'utf8'));
            if (firebaseConfig.hosting && firebaseConfig.firestore) {
                checks.firebaseJson = true;
                console.log('✅ firebase.json configuré correctement');
            } else {
                console.log('⚠️  firebase.json incomplet');
            }
        } catch (error) {
            console.log('❌ firebase.json invalide:', error.message);
        }
    } else {
        console.log('❌ firebase.json non trouvé');
    }
    
    // Vérifier firestore.rules
    if (existsSync('./firestore.rules')) {
        checks.firestoreRules = true;
        console.log('✅ firestore.rules trouvé');
    } else {
        console.log('❌ firestore.rules non trouvé');
    }
    
    return checks;
}

/**
 * Vérifie les scripts npm
 */
function checkNpmScripts() {
    console.log('📦 Vérification des scripts npm...');
    
    if (!existsSync('./package.json')) {
        console.log('❌ package.json non trouvé');
        return false;
    }
    
    try {
        const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
        const requiredScripts = [
            'production:setup',
            'production:clean', 
            'production:create',
            'production:verify',
            'verify:users',
            'cleanup:all',
            'create:production'
        ];
        
        const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
        
        if (missingScripts.length === 0) {
            console.log('✅ Tous les scripts npm requis sont présents');
            return true;
        } else {
            console.log('⚠️  Scripts npm manquants:', missingScripts.join(', '));
            return false;
        }
    } catch (error) {
        console.log('❌ Erreur lecture package.json:', error.message);
        return false;
    }
}

/**
 * Vérifie les fichiers de script
 */
function checkScriptFiles() {
    console.log('📜 Vérification des fichiers de script...');
    
    const requiredFiles = [
        'cleanup-all-users-admin.js',
        'create-production-users-admin.js', 
        'verify-users-state.js'
    ];
    
    const missingFiles = requiredFiles.filter(file => !existsSync(`./${file}`));
    
    if (missingFiles.length === 0) {
        console.log('✅ Tous les fichiers de script sont présents');
        return true;
    } else {
        console.log('❌ Fichiers de script manquants:', missingFiles.join(', '));
        return false;
    }
}

/**
 * Vérifie les dépendances npm
 */
function checkDependencies() {
    console.log('📚 Vérification des dépendances...');
    
    try {
        const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
        const requiredDeps = ['firebase', 'firebase-admin'];
        
        const missingDeps = requiredDeps.filter(dep => 
            !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
        );
        
        if (missingDeps.length === 0) {
            console.log('✅ Toutes les dépendances Firebase sont présentes');
            return true;
        } else {
            console.log('❌ Dépendances manquantes:', missingDeps.join(', '));
            return false;
        }
    } catch (error) {
        console.log('❌ Erreur vérification dépendances:', error.message);
        return false;
    }
}

/**
 * Affiche les instructions de setup
 */
function showSetupInstructions(checks) {
    console.log('\n📋 INSTRUCTIONS DE SETUP');
    console.log('='.repeat(50));
    
    if (!checks.firebaseConfig.serviceAccount) {
        console.log('\n🔑 Service Account Firebase:');
        console.log('1. Allez sur https://console.firebase.google.com/');
        console.log('2. Sélectionnez votre projet "chine-ton-usine"');
        console.log('3. Paramètres du projet → Comptes de service');
        console.log('4. Générer une nouvelle clé privée');
        console.log('5. Enregistrez le fichier comme "firebase-service-account.json" à la racine');
    }
    
    if (!checks.firebaseConfig.firebaseJson) {
        console.log('\n🔥 Configuration Firebase:');
        console.log('1. Exécutez: npm run firebase:init');
        console.log('2. Sélectionnez Hosting et Firestore');
        console.log('3. Utilisez le projet "chine-ton-usine"');
    }
    
    if (!checks.dependencies) {
        console.log('\n📦 Installation des dépendances:');
        console.log('npm install firebase firebase-admin');
    }
    
    if (!checks.scripts) {
        console.log('\n📜 Scripts npm:');
        console.log('Les scripts npm semblent manquer, vérifiez package.json');
    }
    
    if (!checks.scriptFiles) {
        console.log('\n📂 Fichiers de script:');
        console.log('Des fichiers de script semblent manquer, vérifiez le workspace');
    }
}

/**
 * Affiche les prochaines étapes
 */
function showNextSteps(allReady) {
    console.log('\n🎯 PROCHAINES ÉTAPES');
    console.log('='.repeat(40));
    
    if (allReady) {
        console.log('\n🚀 Votre environnement est prêt !');
        console.log('\nExécutez dans l\'ordre:');
        console.log('1. npm run production:setup    # Setup automatique complet');
        console.log('2. npm run verify:users        # Vérification finale');
        console.log('3. npm run rules:production    # Règles de sécurité');
        console.log('\nOu manuellement:');
        console.log('1. npm run production:clean    # Nettoyage');
        console.log('2. npm run production:create   # Création');
        console.log('3. npm run production:verify   # Vérification');
    } else {
        console.log('\n⚠️  Complétez la configuration avant de continuer');
        console.log('\nUne fois configuré:');
        console.log('1. Relancez: node production-check.js');
        console.log('2. Puis: npm run production:setup');
    }
}

/**
 * Fonction principale de vérification
 */
function checkProductionReadiness() {
    console.log('🔍 VÉRIFICATION DE LA PRÉPARATION PRODUCTION');
    console.log('='.repeat(60));
    console.log('🏭 Projet: Chine Ton Usine');
    console.log('🎯 Objectif: Système d\'utilisateurs de production');
    console.log('🕒 Date: ' + new Date().toLocaleString('fr-FR'));
    
    console.log('\n🚀 Début des vérifications...');
    
    // Effectuer toutes les vérifications
    const checks = {
        firebaseConfig: checkFirebaseConfig(),
        scripts: checkNpmScripts(),
        scriptFiles: checkScriptFiles(),
        dependencies: checkDependencies()
    };
    
    console.log('\n📊 RÉSUMÉ DES VÉRIFICATIONS');
    console.log('-'.repeat(40));
    console.log(`🔥 Configuration Firebase: ${checks.firebaseConfig.serviceAccount && checks.firebaseConfig.firebaseJson ? '✅' : '⚠️'}`);
    console.log(`📦 Scripts npm: ${checks.scripts ? '✅' : '❌'}`);
    console.log(`📜 Fichiers de script: ${checks.scriptFiles ? '✅' : '❌'}`);
    console.log(`📚 Dépendances: ${checks.dependencies ? '✅' : '❌'}`);
    
    // Déterminer si tout est prêt
    const allReady = 
        (checks.firebaseConfig.serviceAccount || process.env.FIREBASE_PRIVATE_KEY) &&
        checks.firebaseConfig.firebaseJson &&
        checks.scripts &&
        checks.scriptFiles &&
        checks.dependencies;
    
    console.log(`\n🎯 PRÊT POUR LA PRODUCTION: ${allReady ? '✅ OUI' : '❌ NON'}`);
    
    if (!allReady) {
        showSetupInstructions(checks);
    }
    
    showNextSteps(allReady);
    
    // Informations de sécurité
    console.log('\n🛡️  RAPPELS DE SÉCURITÉ');
    console.log('-'.repeat(30));
    console.log('• Changez les mots de passe par défaut en production');
    console.log('• Activez la vérification email si nécessaire');
    console.log('• Configurez les règles Firestore en mode production');
    console.log('• Testez tous les comptes avant le déploiement');
    console.log('• Sauvegardez la configuration avant modifications');
    
    return allReady;
}

// Exécution du script
if (import.meta.url === `file://${process.argv[1]}`) {
    try {
        const isReady = checkProductionReadiness();
        
        console.log('\n🏁 Vérification terminée');
        process.exit(isReady ? 0 : 1);
        
    } catch (error) {
        console.error('\n💥 Erreur lors de la vérification:', error.message);
        process.exit(1);
    }
}

export { checkProductionReadiness };
