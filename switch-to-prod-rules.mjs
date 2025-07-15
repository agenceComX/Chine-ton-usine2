import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔐 RETOUR AUX RÈGLES DE PRODUCTION');
console.log('='.repeat(40));

try {
    // Restauration des règles de production
    if (fs.existsSync('firestore.rules.backup')) {
        fs.copyFileSync('firestore.rules.backup', 'firestore.rules');
        console.log('✅ Règles de production restaurées');
    } else {
        throw new Error('Sauvegarde des règles introuvable');
    }

    // Déploiement des règles de production
    console.log('\n🚀 Déploiement des règles de production...');
    execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });

    console.log('\n🔐 RÈGLES DE PRODUCTION ACTIVÉES');
    console.log('✅ Sécurité renforcée activée');
    console.log('✅ Accès contrôlé par rôle');

} catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
}
