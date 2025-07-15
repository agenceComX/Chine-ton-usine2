#!/usr/bin/env node

/**
 * 🔧 ASSISTANT CONFIGURATION FIREBASE
 * 
 * Ce script vous aide à configurer Firebase Admin SDK
 * soit avec un fichier JSON, soit avec des variables d'environnement
 */

import { writeFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';

console.log('🔧 ASSISTANT CONFIGURATION FIREBASE');
console.log('='.repeat(45));
console.log('🎯 Configuration Firebase Admin SDK pour créer les utilisateurs\n');

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function configureFirebase() {
    try {
        console.log('📋 MÉTHODES DE CONFIGURATION DISPONIBLES:');
        console.log('1. 📁 Fichier JSON Service Account (recommandé)');
        console.log('2. 🌍 Variables d\'environnement');
        console.log('3. ❌ Annuler\n');

        const choice = await question('Choisissez une méthode (1-3): ');

        switch (choice) {
            case '1':
                await configureWithFile();
                break;
            case '2':
                await configureWithEnvVars();
                break;
            case '3':
                console.log('❌ Configuration annulée');
                process.exit(0);
                break;
            default:
                console.log('❌ Choix invalide');
                process.exit(1);
        }

    } catch (error) {
        console.error('❌ Erreur lors de la configuration:', error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
}

async function configureWithFile() {
    console.log('\n📁 CONFIGURATION PAR FICHIER JSON');
    console.log('-'.repeat(35));
    console.log('📝 Pour obtenir votre service account:');
    console.log('1. https://console.firebase.google.com/');
    console.log('2. Projet "chine-ton-usine"');
    console.log('3. Paramètres > Comptes de service');
    console.log('4. "Générer une nouvelle clé privée"');
    console.log('5. Télécharger le fichier JSON\n');

    const hasFile = existsSync('./firebase-service-account.json');

    if (hasFile) {
        console.log('✅ Fichier firebase-service-account.json trouvé !');
        console.log('🚀 Vous pouvez maintenant créer les utilisateurs:');
        console.log('   node create-new-production-users.mjs\n');
        return;
    }

    console.log('❌ Fichier firebase-service-account.json non trouvé');
    console.log('\n🔄 OPTIONS:');
    console.log('a) Placer votre fichier téléchargé et le renommer');
    console.log('b) Créer un template à compléter');
    console.log('c) Utiliser des variables d\'environnement\n');

    const option = await question('Choisissez une option (a/b/c): ');

    if (option === 'b') {
        await createTemplate();
    } else if (option === 'c') {
        await configureWithEnvVars();
    } else {
        console.log('\n💡 INSTRUCTIONS:');
        console.log('1. Téléchargez votre service account depuis Firebase');
        console.log('2. Renommez-le en "firebase-service-account.json"');
        console.log('3. Placez-le dans ce dossier');
        console.log('4. Relancez: node test-firebase-config.mjs');
    }
}

async function createTemplate() {
    const template = {
        "type": "service_account",
        "project_id": "chine-ton-usine",
        "private_key_id": "REMPLACER_PAR_VOTRE_PRIVATE_KEY_ID",
        "private_key": "-----BEGIN PRIVATE KEY-----\\nREMPLACER_PAR_VOTRE_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n",
        "client_email": "firebase-adminsdk-xxxxx@chine-ton-usine.iam.gserviceaccount.com",
        "client_id": "REMPLACER_PAR_VOTRE_CLIENT_ID",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40chine-ton-usine.iam.gserviceaccount.com"
    };

    writeFileSync('./firebase-service-account-template.json', JSON.stringify(template, null, 2));
    console.log('\n✅ Template créé: firebase-service-account-template.json');
    console.log('📝 Complétez ce fichier avec vos vraies valeurs');
    console.log('🔄 Puis renommez-le en: firebase-service-account.json');
}

async function configureWithEnvVars() {
    console.log('\n🌍 CONFIGURATION PAR VARIABLES D\'ENVIRONNEMENT');
    console.log('-'.repeat(45));

    console.log('📝 Vous devez définir ces variables:');
    console.log('FIREBASE_PROJECT_ID=chine-ton-usine');
    console.log('FIREBASE_PRIVATE_KEY_ID=...');
    console.log('FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"');
    console.log('FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@chine-ton-usine.iam.gserviceaccount.com');
    console.log('FIREBASE_CLIENT_ID=...\n');

    const createBat = await question('Créer un fichier .bat pour Windows ? (o/n): ');

    if (createBat.toLowerCase() === 'o') {
        const batContent = `@echo off
echo Configuration des variables d'environnement Firebase
echo.

REM Remplacez ces valeurs par vos vraies valeurs Firebase
set FIREBASE_PROJECT_ID=chine-ton-usine
set FIREBASE_PRIVATE_KEY_ID=VOTRE_PRIVATE_KEY_ID
set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nVOTRE_PRIVATE_KEY\\n-----END PRIVATE KEY-----\\n"
set FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@chine-ton-usine.iam.gserviceaccount.com
set FIREBASE_CLIENT_ID=VOTRE_CLIENT_ID

echo Variables configurees !
echo.
echo Pour tester : node test-firebase-config.mjs
echo Pour creer les utilisateurs : node create-new-production-users.mjs
pause`;

        writeFileSync('./configure-env.bat', batContent);
        console.log('✅ Fichier créé: configure-env.bat');
        console.log('📝 Complétez-le avec vos vraies valeurs Firebase');
        console.log('🚀 Puis exécutez-le avant de lancer les scripts Node.js');
    }
}

async function main() {
    console.log('🔍 Vérification de l\'état actuel...\n');

    const hasServiceAccount = existsSync('./firebase-service-account.json');
    const hasTemplate = existsSync('./firebase-service-account-template.json');
    const hasEnvVars = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY;

    console.log(`🔐 Service Account JSON: ${hasServiceAccount ? '✅ Trouvé' : '❌ Manquant'}`);
    console.log(`📝 Template: ${hasTemplate ? '✅ Disponible' : '❌ Manquant'}`);
    console.log(`🌍 Variables d'environnement: ${hasEnvVars ? '✅ Configurées' : '❌ Manquantes'}\n`);

    if (hasServiceAccount) {
        console.log('🎉 SERVICE ACCOUNT CONFIGURÉ !');
        console.log('✅ Vous pouvez créer les utilisateurs:');
        console.log('   node create-new-production-users.mjs\n');

        const test = await question('Tester la configuration maintenant ? (o/n): ');
        if (test.toLowerCase() === 'o') {
            rl.close();
            const { execSync } = await import('child_process');
            execSync('node test-firebase-config.mjs', { stdio: 'inherit' });
            return;
        }
    } else if (hasEnvVars) {
        console.log('🎉 VARIABLES D\'ENVIRONNEMENT CONFIGURÉES !');
        console.log('✅ Vous pouvez créer les utilisateurs:');
        console.log('   node create-new-production-users.mjs\n');
    } else {
        console.log('⚠️  CONFIGURATION REQUISE');
        await configureFirebase();
    }
}

// Exécution
main();
