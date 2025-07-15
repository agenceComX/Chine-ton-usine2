import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔄 BASCULEMENT VERS LES RÈGLES DE DÉVELOPPEMENT');
console.log('='.repeat(50));

try {
    // Sauvegarde des règles actuelles
    if (fs.existsSync('firestore.rules')) {
        fs.copyFileSync('firestore.rules', 'firestore.rules.backup');
        console.log('✅ Sauvegarde des règles actuelles créée');
    }

    // Copie des règles de développement
    if (fs.existsSync('firestore.rules.dev')) {
        fs.copyFileSync('firestore.rules.dev', 'firestore.rules');
        console.log('✅ Règles de développement activées');
    } else {
        throw new Error('Fichier firestore.rules.dev introuvable');
    }

    // Déploiement des nouvelles règles
    console.log('\n🚀 Déploiement des règles...');
    execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });

    console.log('\n✅ RÈGLES DE DÉVELOPPEMENT ACTIVÉES');
    console.log('⚠️  ATTENTION: Ces règles sont permissives et ne doivent être utilisées qu\'en développement');
    console.log('🔐 Pensez à revenir aux règles de production avec: npm run rules:production');

} catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
}
