/**
 * Script de suppression simple avec Firebase Admin
 * Version simplifiée sans fichier de service account
 */

// Alternative: Utilisation du Firebase CLI pour suppression directe
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function deleteWithFirebaseCLI() {
  console.log('🔧 SUPPRESSION VIA FIREBASE CLI');
  console.log('='.repeat(50));
  
  try {
    // Vérifier si Firebase CLI est installé
    console.log('🔍 Vérification de Firebase CLI...');
    await execPromise('firebase --version');
    console.log('✅ Firebase CLI trouvé');
    
    // Commande de suppression Firestore
    console.log('\n🗑️  Exécution de la suppression Firestore...');
    console.log('⚠️  Cette commande supprime TOUS les documents de la collection users');
    
    const deleteCommand = 'firebase firestore:delete users --recursive --force -P chine-ton-usine';
    console.log(`📋 Commande: ${deleteCommand}`);
    
    console.log('\n🚀 Exécution...');
    const { stdout, stderr } = await execPromise(deleteCommand);
    
    if (stdout) {
      console.log('📤 Sortie:', stdout);
    }
    if (stderr) {
      console.log('⚠️  Erreurs:', stderr);
    }
    
    console.log('\n✅ Commande Firebase CLI exécutée');
    
  } catch (error) {
    console.error('❌ Erreur Firebase CLI:', error.message);
    
    if (error.message.includes('firebase')) {
      console.log('\n💡 SOLUTION ALTERNATIVE:');
      console.log('1. Installez Firebase CLI: npm install -g firebase-tools');
      console.log('2. Connectez-vous: firebase login');
      console.log('3. Exécutez manuellement:');
      console.log('   firebase firestore:delete users --recursive --force -P chine-ton-usine');
    }
  }
}

// Instructions pour suppression manuelle console
function showManualInstructions() {
  console.log('\n📋 INSTRUCTIONS SUPPRESSION MANUELLE');
  console.log('='.repeat(50));
  console.log('Si les scripts automatiques ne fonctionnent pas:');
  console.log('');
  console.log('1. 🌐 Ouvrez https://console.firebase.google.com/');
  console.log('2. 📂 Sélectionnez votre projet: chine-ton-usine');
  console.log('3. 🗃️  Allez dans Firestore Database');
  console.log('4. 📁 Cliquez sur la collection "users"');
  console.log('5. ☑️  Sélectionnez tous les documents (Ctrl+A)');
  console.log('6. 🗑️  Cliquez sur "Supprimer" ou appuyez sur Suppr');
  console.log('7. ✅ Confirmez la suppression');
  console.log('');
  console.log('💡 Conseil: Actualisez la page (F5) pour voir les changements');
  console.log('💡 Si trop de documents: Supprimez par petits lots');
}

async function main() {
  console.log('🚀 SCRIPT DE SUPPRESSION ALTERNATIVE');
  console.log('='.repeat(60));
  
  await deleteWithFirebaseCLI();
  showManualInstructions();
}

main();
