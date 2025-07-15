#!/usr/bin/env node

/**
 * 🎯 MENU PRINCIPAL - GESTION DES UTILISATEURS DE PRODUCTION
 * 
 * Script central pour gérer tous les aspects de la création
 * et gestion des utilisateurs de production
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🏭 CHINE TON USINE - MENU PRINCIPAL');
console.log('='.repeat(50));
console.log('🎯 Gestion complète des utilisateurs de production\n');

function showMenu() {
    console.log('📋 OPTIONS DISPONIBLES:');
    console.log('-'.repeat(25));
    console.log('1️⃣  🚀 Création complète (guidée)');
    console.log('2️⃣  🔧 Configuration Firebase');
    console.log('3️⃣  ⚡ Création directe');
    console.log('4️⃣  🧪 Démonstration');
    console.log('5️⃣  🔍 Vérifier utilisateurs');
    console.log('6️⃣  📚 Documentation');
    console.log('7️⃣  🛠️  Outils avancés');
    console.log('0️⃣  ❌ Quitter\n');
}

function showAdvancedTools() {
    console.log('\n🛠️  OUTILS AVANCÉS:');
    console.log('-'.repeat(20));
    console.log('a) 🧹 Nettoyage complet (ATTENTION!)');
    console.log('b) 📊 État détaillé Firebase');
    console.log('c) 🔄 Reset et recréation');
    console.log('d) 📝 Logs de debug');
    console.log('e) 🔙 Retour au menu principal\n');
}

function showDocumentation() {
    console.log('\n📚 DOCUMENTATION DISPONIBLE:');
    console.log('-'.repeat(30));

    const docs = [
        { file: 'README_PRODUCTION_USERS.md', desc: '📖 Guide complet' },
        { file: 'GUIDE_EXECUTION_PRODUCTION.md', desc: '🚀 Instructions d\'exécution' },
        { file: 'firebase-service-account-template.json', desc: '🔧 Template configuration' }
    ];

    docs.forEach((doc, index) => {
        const exists = existsSync(doc.file);
        const status = exists ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${doc.desc}`);
        console.log(`   📁 ${doc.file}`);
    });

    console.log('\n💡 Ouvrez ces fichiers pour plus de détails\n');
}

function executeScript(script, description) {
    try {
        console.log(`\n🔄 ${description}...`);
        console.log('='.repeat(40));

        const result = execSync(`node ${script}`, {
            stdio: 'inherit',
            cwd: process.cwd()
        });

        console.log(`\n✅ ${description} terminé`);

    } catch (error) {
        console.error(`\n❌ Erreur lors de ${description}:`);
        console.error(error.message);
        console.log('\n💡 Consultez les logs ci-dessus pour plus de détails');
    }
}

function showStatus() {
    console.log('\n📊 ÉTAT ACTUEL:');
    console.log('-'.repeat(15));

    // Vérifier la configuration
    const hasServiceAccount = existsSync('./firebase-service-account.json');
    const hasTemplate = existsSync('./firebase-service-account-template.json');

    console.log(`🔐 Service Account: ${hasServiceAccount ? '✅ Configuré' : '❌ Manquant'}`);
    console.log(`📝 Template: ${hasTemplate ? '✅ Disponible' : '❌ Manquant'}`);

    // Vérifier les scripts
    const scripts = [
        'create-new-production-users.mjs',
        'start-production-setup.mjs',
        'setup-firebase-config.mjs',
        'demo-creation-process.mjs'
    ];

    console.log('\n📋 Scripts disponibles:');
    scripts.forEach(script => {
        const exists = existsSync(script);
        console.log(`  ${exists ? '✅' : '❌'} ${script}`);
    });

    console.log('\n🎯 Recommandation:');
    if (!hasServiceAccount) {
        console.log('  1. Configurez Firebase (option 2)');
        console.log('  2. Puis lancez la création (option 1)');
    } else {
        console.log('  ✅ Prêt pour la création ! (option 1)');
    }
}

// Menu principal
async function mainMenu() {
    showStatus();
    showMenu();

    // Pour l'automatisation, affichons toutes les options
    console.log('🤖 MODE AUTOMATIQUE - AFFICHAGE DES OPTIONS:\n');

    console.log('📝 OPTION 1 - CRÉATION COMPLÈTE (RECOMMANDÉE)');
    console.log('Commande: node start-production-setup.mjs');
    console.log('Description: Script guidé complet avec vérifications\n');

    console.log('📝 OPTION 2 - CONFIGURATION FIREBASE');
    console.log('Commande: node setup-firebase-config.mjs');
    console.log('Description: Créer template de service account\n');

    console.log('📝 OPTION 3 - CRÉATION DIRECTE');
    console.log('Commande: node create-new-production-users.mjs');
    console.log('Description: Création immédiate (requiert config)\n');

    console.log('📝 OPTION 4 - DÉMONSTRATION');
    console.log('Commande: node demo-creation-process.mjs');
    console.log('Description: Simulation du processus complet\n');

    console.log('🎯 COMMANDES NPM DISPONIBLES:');
    console.log('-'.repeat(30));
    console.log('npm run setup:production      # Option 1');
    console.log('npm run setup:firebase        # Option 2');
    console.log('npm run create:production     # Option 3');
    console.log('npm run verify:users          # Vérification');

    console.log('\n🔗 ENCHAÎNEMENT RECOMMANDÉ:');
    console.log('1. npm run setup:firebase     # Si pas de service account');
    console.log('2. npm run setup:production   # Création guidée');
    console.log('3. npm run verify:users       # Vérification');

    console.log('\n📚 POUR PLUS D\'AIDE:');
    console.log('Consultez README_PRODUCTION_USERS.md');
}

// Exécution
console.log('🚀 Initialisation du menu...\n');
mainMenu();
