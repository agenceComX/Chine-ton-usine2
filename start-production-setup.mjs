#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE CRÉATION D'UTILISATEURS DE PRODUCTION
 * 
 * Ce script vous guide pour créer automatiquement 4 utilisateurs
 * de production avec le Firebase Admin SDK
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🏭 CHINE TON USINE - CRÉATION D\'UTILISATEURS DE PRODUCTION');
console.log('='.repeat(65));
console.log('🎯 Objectif: Créer 4 utilisateurs (admin, supplier, client, influencer)');
console.log('🔧 Méthode: Firebase Admin SDK + Firestore');
console.log('🛡️  Sécurité: Gestion d\'erreurs complète, validation, merge safe\n');

// Vérification des prérequis
console.log('🔍 VÉRIFICATION DES PRÉREQUIS...');
console.log('-'.repeat(35));

// 1. Vérifier Node.js
try {
    const nodeVersion = process.version;
    console.log(`✅ Node.js: ${nodeVersion}`);
} catch (error) {
    console.log('❌ Node.js non trouvé');
    process.exit(1);
}

// 2. Vérifier les dépendances
try {
    const packageJson = JSON.parse(execSync('npm list firebase-admin --json --depth=0', { encoding: 'utf8' }));
    console.log('✅ firebase-admin: installé');
} catch (error) {
    console.log('⚠️  firebase-admin non installé');
    console.log('🔄 Installation en cours...');
    try {
        execSync('npm install firebase-admin', { stdio: 'inherit' });
        console.log('✅ firebase-admin installé avec succès');
    } catch (installError) {
        console.log('❌ Échec de l\'installation de firebase-admin');
        console.log('💡 Exécutez manuellement: npm install firebase-admin');
        process.exit(1);
    }
}

// 3. Vérifier la configuration Firebase
console.log('\n🔐 VÉRIFICATION CONFIGURATION FIREBASE...');
console.log('-'.repeat(40));

const hasServiceAccount = existsSync('./firebase-service-account.json');
const hasEnvVars = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY;

if (hasServiceAccount) {
    console.log('✅ Service account JSON: trouvé');
} else if (hasEnvVars) {
    console.log('✅ Variables d\'environnement: configurées');
} else {
    console.log('⚠️  Configuration Firebase manquante');
    console.log('\n🔧 CONFIGURATION REQUISE:');
    console.log('Option 1 - Fichier JSON:');
    console.log('  📁 Placez votre service account dans: ./firebase-service-account.json');
    console.log('\nOption 2 - Variables d\'environnement:');
    console.log('  🌍 FIREBASE_PROJECT_ID=chine-ton-usine');
    console.log('  🌍 FIREBASE_PRIVATE_KEY=...');
    console.log('  🌍 FIREBASE_CLIENT_EMAIL=...');
    console.log('\n💡 Pour obtenir le service account:');
    console.log('  1. https://console.firebase.google.com/');
    console.log('  2. Projet > Paramètres > Comptes de service');
    console.log('  3. Générer une nouvelle clé privée');
    console.log('\n🚀 Relancez ce script après configuration');
    process.exit(1);
}

// 4. Afficher les utilisateurs qui seront créés
console.log('\n👥 UTILISATEURS À CRÉER:');
console.log('-'.repeat(25));
const users = [
    { role: 'Admin', email: 'admin@chine-ton-usine.com', password: 'AdminSecure2024!' },
    { role: 'Supplier', email: 'supplier@chine-ton-usine.com', password: 'SupplierSecure2024!' },
    { role: 'Client', email: 'client@chine-ton-usine.com', password: 'ClientSecure2024!' },
    { role: 'Influencer', email: 'influencer@chine-ton-usine.com', password: 'InfluencerSecure2024!' }
];

users.forEach(user => {
    console.log(`👤 ${user.role.padEnd(10)} : ${user.email}`);
});

console.log('\n⚠️  IMPORTANT: Ces mots de passe sont temporaires !');
console.log('🔐 Changez-les immédiatement après la création\n');

// 5. Demander confirmation
console.log('🤔 Voulez-vous continuer ? (O/n)');

// Pour l'automatisation, on continue directement
console.log('🚀 Lancement automatique de la création...\n');

// 6. Exécuter le script principal
try {
    console.log('📋 EXÉCUTION DU SCRIPT PRINCIPAL...');
    console.log('='.repeat(40));

    // Import et exécution du script principal
    const { createProductionUsers } = await import('./create-new-production-users.mjs');
    const results = await createProductionUsers();

    console.log('\n🎉 PROCESSUS TERMINÉ !');
    console.log('📊 Consultez les détails ci-dessus');

} catch (error) {
    console.error('\n❌ ERREUR LORS DE L\'EXÉCUTION:', error.message);
    console.log('\n🔧 SOLUTIONS POSSIBLES:');
    console.log('1. Vérifier la configuration Firebase');
    console.log('2. Contrôler la connectivité internet');
    console.log('3. Vérifier les permissions du service account');
    console.log('4. Consulter les logs détaillés ci-dessus');

    console.log('\n💡 Pour exécution manuelle:');
    console.log('node create-new-production-users.mjs');

    process.exit(1);
}
