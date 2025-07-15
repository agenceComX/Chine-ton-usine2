#!/usr/bin/env node

/**
 * 🚀 GUIDE RAPIDE - OBTENIR LE SERVICE ACCOUNT
 * 
 * Vous êtes actuellement dans la console Firebase.
 * Suivez ces étapes pour obtenir votre service account.
 */

console.log('🎯 OBTENTION DU SERVICE ACCOUNT FIREBASE');
console.log('='.repeat(45));
console.log('🌐 Vous êtes dans la console Firebase : ✅');
console.log('📊 Projet : chine-ton-usine-2c999\n');

console.log('📋 ÉTAPES À SUIVRE MAINTENANT:');
console.log('1️⃣  Dans votre onglet Firefox ouvert sur Firebase...');
console.log('2️⃣  Cliquez sur l\'onglet "Comptes de service" (à côté de "Général")');
console.log('3️⃣  Descendez jusqu\'à la section "SDK Admin Firebase"');
console.log('4️⃣  Cliquez sur le bouton "Générer une nouvelle clé privée"');
console.log('5️⃣  Une popup apparaîtra, cliquez sur "Générer la clé"');
console.log('6️⃣  Un fichier JSON sera téléchargé automatiquement\n');

console.log('📁 APRÈS TÉLÉCHARGEMENT:');
console.log('• Le fichier se nomme quelque chose comme :');
console.log('  "chine-ton-usine-2c999-firebase-adminsdk-xxxxx.json"');
console.log('• Renommez-le en : "firebase-service-account.json"');
console.log('• Placez-le dans ce dossier :\n');
console.log(`  📂 ${process.cwd()}\n`);

console.log('⚡ UNE FOIS LE FICHIER PLACÉ:');
console.log('npm run test:config     # Tester la configuration');
console.log('npm run create:production  # Créer les 4 utilisateurs\n');

console.log('🔗 LIEN DIRECT VERS LES COMPTES DE SERVICE:');
console.log('https://console.firebase.google.com/project/chine-ton-usine-2c999/settings/serviceaccounts/adminsdk\n');

console.log('💡 ALTERNATIVE RAPIDE:');
console.log('Si vous ne trouvez pas l\'onglet "Comptes de service",');
console.log('utilisez ce lien direct ci-dessus dans votre navigateur.\n');

console.log('🎯 OBJECTIF:');
console.log('Une fois le service account configuré, nous créerons :');
console.log('• admin@chine-ton-usine.com');
console.log('• supplier@chine-ton-usine.com');
console.log('• client@chine-ton-usine.com');
console.log('• influencer@chine-ton-usine.com\n');

console.log('❓ EN CAS DE PROBLÈME:');
console.log('Relancez ce script ou tapez "npm run configure" pour l\'assistant');

// Vérifier périodiquement si le fichier est ajouté
console.log('\n🔄 Ce script va vérifier si vous ajoutez le fichier...');

const { existsSync } = await import('fs');

let checkCount = 0;
const maxChecks = 60; // 2 minutes maximum

const checkForFile = () => {
    checkCount++;

    if (existsSync('./firebase-service-account.json')) {
        console.log('\n🎉 FICHIER SERVICE ACCOUNT DÉTECTÉ !');
        console.log('✅ firebase-service-account.json trouvé');
        console.log('\n🚀 LANCEMENT DU TEST...');

        // Lancer automatiquement le test
        const { execSync } = require('child_process');
        try {
            execSync('node test-firebase-config.mjs', { stdio: 'inherit' });
        } catch (error) {
            console.log('\n⚠️  Test échoué, mais vous pouvez réessayer avec :');
            console.log('npm run test:config');
        }

        return;
    }

    if (checkCount >= maxChecks) {
        console.log('\n⏰ Temps d\'attente écoulé');
        console.log('💡 Relancez quand le fichier sera prêt :');
        console.log('npm run test:config');
        return;
    }

    // Afficher un point toutes les 5 secondes
    if (checkCount % 5 === 0) {
        console.log(`⏳ Attente du fichier... (${checkCount}/60)`);
    }

    setTimeout(checkForFile, 2000); // Vérifier toutes les 2 secondes
};

// Commencer la vérification
setTimeout(checkForFile, 2000);
