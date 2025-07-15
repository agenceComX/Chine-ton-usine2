// Script pour créer un template de service account ou configurer les variables
import { writeFileSync } from 'fs';

console.log('🔧 Configuration Firebase Service Account\n');

// Template de service account
const serviceAccountTemplate = {
    "type": "service_account",
    "project_id": "chine-ton-usine-2c999",
    "private_key_id": "REMPLACER_PAR_VOTRE_PRIVATE_KEY_ID",
    "private_key": "-----BEGIN PRIVATE KEY-----\nREMPLACER_PAR_VOTRE_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-xxxxx@chine-ton-usine-2c999.iam.gserviceaccount.com",
    "client_id": "REMPLACER_PAR_VOTRE_CLIENT_ID",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40chine-ton-usine-2c999.iam.gserviceaccount.com"
};

// Créer le template
try {
    writeFileSync('./firebase-service-account-template.json', JSON.stringify(serviceAccountTemplate, null, 2));
    console.log('✅ Template créé: firebase-service-account-template.json');
    console.log('📝 Complétez ce fichier avec vos vraies valeurs Firebase');
    console.log('🔄 Puis renommez-le en: firebase-service-account.json\n');
} catch (error) {
    console.error('❌ Erreur lors de la création du template:', error.message);
}

// Instructions pour obtenir le service account
console.log('📋 POUR OBTENIR VOTRE SERVICE ACCOUNT:');
console.log('1. Allez sur: https://console.firebase.google.com/');
console.log('2. Sélectionnez votre projet "chine-ton-usine-2c999"');
console.log('3. Allez dans: Paramètres projet > Comptes de service');
console.log('4. Cliquez sur "Générer une nouvelle clé privée"');
console.log('5. Téléchargez le fichier JSON');
console.log('6. Renommez-le en "firebase-service-account.json"');
console.log('7. Placez-le dans ce dossier\n');

console.log('🔀 ALTERNATIVE - VARIABLES D\'ENVIRONNEMENT:');
console.log('Vous pouvez aussi définir ces variables au lieu du fichier:');
console.log('- FIREBASE_PROJECT_ID=chine-ton-usine-2c999');
console.log('- FIREBASE_PRIVATE_KEY_ID=...');
console.log('- FIREBASE_PRIVATE_KEY=...');
console.log('- FIREBASE_CLIENT_EMAIL=...');
console.log('- FIREBASE_CLIENT_ID=...\n');

console.log('✨ Une fois configuré, exécutez:');
console.log('node create-new-production-users.mjs');
